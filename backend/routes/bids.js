import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import Bid from '../models/Bid.js';
import Item from '../models/Item.js';
import User from '../models/User.js';
import { validateBid } from '../utils/validation.js';

const router = express.Router();

// @route   POST /api/bids/:itemId
// @desc    Place a bid on an item
// @access  Private
router.post('/:itemId', authenticateToken, async (req, res) => {
  try {
    const { error } = validateBid(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { amount, maxBid, type = 'standard' } = req.body;
    const itemId = req.params.itemId;
    const bidderId = req.user._id;

    // Get the item
    const item = await Item.findById(itemId).populate('seller');
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check if auction is active
    if (!item.isAuctionActive()) {
      return res.status(400).json({
        success: false,
        message: 'Auction is not currently active'
      });
    }

    // Check if user is trying to bid on their own item
    if (item.seller._id.toString() === bidderId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot bid on your own item'
      });
    }

    // Check if bid meets minimum requirements
    const minimumBid = Math.max(
      item.currentBid + item.bidIncrement,
      item.startingPrice
    );

    if (amount < minimumBid) {
      return res.status(400).json({
        success: false,
        message: `Minimum bid is $${minimumBid}`
      });
    }

    // Get current highest bid
    const currentHighestBid = await Bid.findOne({
      item: itemId,
      status: { $in: ['active', 'winning'] }
    }).sort({ amount: -1 });

    // Update previous bids status
    if (currentHighestBid) {
      await Bid.updateMany(
        { item: itemId, status: 'winning' },
        { status: 'outbid' }
      );
    }

    // Create new bid
    const bidData = {
      bidder: bidderId,
      item: itemId,
      amount,
      type,
      status: 'winning',
      isWinning: true,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    };

    if (maxBid && type === 'proxy') {
      bidData.maxBid = maxBid;
      bidData.isProxyBid = true;
    }

    const bid = new Bid(bidData);
    
    // Calculate bid timing patterns for fraud detection
    const userLastBid = await Bid.findOne({
      bidder: bidderId,
      item: itemId
    }).sort({ placedAt: -1 });

    if (userLastBid) {
      const timeBetweenBids = Date.now() - userLastBid.placedAt.getTime();
      const isQuick = timeBetweenBids < 10000; // Less than 10 seconds
      const auctionTimeRemaining = item.auctionEnd.getTime() - Date.now();
      const isLastMinute = auctionTimeRemaining < 60000; // Last minute
      
      await bid.updateBidPattern(timeBetweenBids, isQuick, isLastMinute, amount - (currentHighestBid?.amount || 0));
    }

    await bid.save();

    // Update item
    item.currentBid = amount;
    item.totalBids += 1;
    
    // Add bidder to unique bidders if not already there
    if (!item.uniqueBidders.includes(bidderId)) {
      item.uniqueBidders.push(bidderId);
    }

    // Extend auction if enabled and close to ending
    const timeRemaining = item.auctionEnd.getTime() - Date.now();
    if (item.extendOnBid && timeRemaining < item.extensionTime) {
      await item.extendAuction();
    }

    await item.save();

    // Update user stats
    await User.findByIdAndUpdate(bidderId, {
      $inc: { totalBids: 1, points: 10 }
    });

    // Award badges
    if (req.user.totalBids === 0) {
      await req.user.addBadge({
        name: 'First Bid',
        description: 'Placed your first bid',
        icon: 'gavel'
      });
    }

    // Real-time update via socket
    if (req.io) {
      req.io.broadcastBidUpdate(itemId, {
        amount,
        bidder: {
          id: req.user._id,
          username: req.user.username,
          avatar: req.user.avatar
        },
        totalBids: item.totalBids,
        timeRemaining: item.timeRemaining
      });

      // Send notification to seller
      req.io.sendUserNotification(item.seller._id, {
        type: 'new_bid',
        title: 'New Bid on Your Item!',
        message: `${req.user.username} bid $${amount} on "${item.title}"`,
        itemId,
        amount
      });

      // Send notification to previous highest bidder
      if (currentHighestBid && currentHighestBid.bidder.toString() !== bidderId.toString()) {
        req.io.sendUserNotification(currentHighestBid.bidder, {
          type: 'outbid',
          title: 'You\'ve Been Outbid!',
          message: `Someone bid $${amount} on "${item.title}"`,
          itemId,
          amount
        });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Bid placed successfully',
      data: {
        bid: {
          id: bid._id,
          amount,
          placedAt: bid.placedAt,
          isWinning: true,
          timeRemaining: item.timeRemaining
        },
        item: {
          currentBid: item.currentBid,
          totalBids: item.totalBids,
          auctionEnd: item.auctionEnd
        }
      }
    });

  } catch (error) {
    console.error('Place bid error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to place bid'
    });
  }
});

// @route   GET /api/bids/my-bids
// @desc    Get user's bids
// @access  Private
router.get('/my-bids', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, status = 'all' } = req.query;

    let filter = { bidder: req.user._id };
    if (status !== 'all') {
      filter.status = status;
    }

    const bids = await Bid.find(filter)
      .populate('item', 'title images currentBid auctionEnd status')
      .sort({ placedAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const totalBids = await Bid.countDocuments(filter);

    res.json({
      success: true,
      data: {
        bids,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalBids,
          pages: Math.ceil(totalBids / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get my bids error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get your bids'
    });
  }
});

// @route   GET /api/bids/winning
// @desc    Get user's winning bids
// @access  Private
router.get('/winning', authenticateToken, async (req, res) => {
  try {
    const winningBids = await Bid.find({
      bidder: req.user._id,
      status: 'winning'
    })
    .populate('item', 'title images currentBid auctionEnd timeRemaining')
    .sort({ placedAt: -1 });

    res.json({
      success: true,
      data: { bids: winningBids }
    });
  } catch (error) {
    console.error('Get winning bids error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get winning bids'
    });
  }
});

// @route   DELETE /api/bids/:bidId
// @desc    Cancel a bid (if allowed)
// @access  Private
router.delete('/:bidId', authenticateToken, async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.bidId);
    
    if (!bid) {
      return res.status(404).json({
        success: false,
        message: 'Bid not found'
      });
    }

    // Check ownership
    if (bid.bidder.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own bids'
      });
    }

    // Check if bid can be cancelled (usually only for proxy bids or within first few minutes)
    const timeSinceBid = Date.now() - bid.placedAt.getTime();
    const canCancel = bid.type === 'proxy' || timeSinceBid < 300000; // 5 minutes

    if (!canCancel) {
      return res.status(400).json({
        success: false,
        message: 'Bid cannot be cancelled at this time'
      });
    }

    // Get the item
    const item = await Item.findById(bid.item);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Associated item not found'
      });
    }

    // Check if this is the current highest bid
    if (bid.isWinning) {
      // Find the next highest bid
      const nextHighestBid = await Bid.findOne({
        item: bid.item,
        _id: { $ne: bid._id },
        status: { $in: ['active', 'outbid'] }
      }).sort({ amount: -1 });

      if (nextHighestBid) {
        // Update next highest bid to winning
        nextHighestBid.status = 'winning';
        nextHighestBid.isWinning = true;
        await nextHighestBid.save();

        // Update item current bid
        item.currentBid = nextHighestBid.amount;
      } else {
        // No other bids, reset to starting price
        item.currentBid = item.startingPrice;
      }

      item.totalBids -= 1;
      await item.save();
    }

    // Cancel the bid
    bid.status = 'cancelled';
    bid.isWinning = false;
    await bid.save();

    // Real-time update
    if (req.io) {
      req.io.broadcastBidUpdate(item._id, {
        amount: item.currentBid,
        totalBids: item.totalBids,
        timeRemaining: item.timeRemaining,
        bidCancelled: true
      });
    }

    res.json({
      success: true,
      message: 'Bid cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel bid error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel bid'
    });
  }
});

// @route   GET /api/bids/stats
// @desc    Get user's bidding statistics
// @access  Private
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const stats = await Bid.aggregate([
      { $match: { bidder: req.user._id } },
      {
        $group: {
          _id: null,
          totalBids: { $sum: 1 },
          totalSpent: {
            $sum: {
              $cond: [{ $eq: ['$status', 'won'] }, '$amount', 0]
            }
          },
          activeBids: {
            $sum: {
              $cond: [{ $eq: ['$status', 'winning'] }, 1, 0]
            }
          },
          wonAuctions: {
            $sum: {
              $cond: [{ $eq: ['$status', 'won'] }, 1, 0]
            }
          },
          avgBidAmount: { $avg: '$amount' },
          maxBid: { $max: '$amount' }
        }
      }
    ]);

    const userStats = stats[0] || {
      totalBids: 0,
      totalSpent: 0,
      activeBids: 0,
      wonAuctions: 0,
      avgBidAmount: 0,
      maxBid: 0
    };

    // Calculate success rate
    userStats.successRate = userStats.totalBids > 0 
      ? Math.round((userStats.wonAuctions / userStats.totalBids) * 100)
      : 0;

    res.json({
      success: true,
      data: { stats: userStats }
    });
  } catch (error) {
    console.error('Get bid stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get bidding statistics'
    });
  }
});

// @route   POST /api/bids/auto-bid/:itemId
// @desc    Set up automatic bidding (proxy bidding)
// @access  Private
router.post('/auto-bid/:itemId', authenticateToken, async (req, res) => {
  try {
    const { maxAmount, increment } = req.body;
    const itemId = req.params.itemId;

    if (!maxAmount || maxAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Maximum bid amount is required'
      });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    if (!item.isAuctionActive()) {
      return res.status(400).json({
        success: false,
        message: 'Auction is not currently active'
      });
    }

    // Check if user already has an active proxy bid
    const existingProxyBid = await Bid.findOne({
      bidder: req.user._id,
      item: itemId,
      type: 'proxy',
      status: { $in: ['active', 'winning'] }
    });

    if (existingProxyBid) {
      // Update existing proxy bid
      existingProxyBid.maxBid = maxAmount;
      await existingProxyBid.save();

      res.json({
        success: true,
        message: 'Auto-bid updated successfully',
        data: { maxBid: maxAmount }
      });
    } else {
      // Create new proxy bid at current minimum bid level
      const currentBid = Math.max(
        item.currentBid + item.bidIncrement,
        item.startingPrice
      );

      const bid = new Bid({
        bidder: req.user._id,
        item: itemId,
        amount: currentBid,
        maxBid: maxAmount,
        type: 'proxy',
        isProxyBid: true,
        isAutoBid: true,
        status: 'winning',
        isWinning: true
      });

      await bid.save();

      // Update item
      item.currentBid = currentBid;
      item.totalBids += 1;
      await item.save();

      res.json({
        success: true,
        message: 'Auto-bid set up successfully',
        data: {
          currentBid,
          maxBid: maxAmount
        }
      });
    }
  } catch (error) {
    console.error('Set auto-bid error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to set up auto-bid'
    });
  }
});

export default router;