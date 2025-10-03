import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import MysteryBid from '../models/MysteryBid.js';

const router = express.Router();

// @route   GET /api/mystery-bids
// @desc    Get all mystery bid auctions
// @access  Public
// @route   GET /api/mystery-bids/stats
// @desc    Get mystery bids statistics
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const activeMysteries = await MysteryBid.countDocuments({ status: 'active' });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const revealedToday = await MysteryBid.countDocuments({
      status: 'completed',
      updatedAt: { $gte: today, $lt: tomorrow }
    });

    // Calculate total value from active auctions
    const activeAuctions = await MysteryBid.find({ status: 'active' }, 'totalValue');
    let totalValueSum = 0;
    activeAuctions.forEach(auction => {
      if (auction.totalValue) {
        const value = auction.totalValue.replace(/[^\d]/g, '');
        const numValue = parseInt(value);
        if (!isNaN(numValue)) {
          totalValueSum += numValue;
        }
      }
    });

    const formatValue = (value) => {
      if (value >= 1000000) {
        return `$${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        return `$${(value / 1000).toFixed(0)}K`;
      } else {
        return `$${value}`;
      }
    };

    // Get unique active bidders count
    const activeBidders = await MysteryBid.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: null, totalBidders: { $sum: '$participantCount' } } }
    ]);

    res.json({
      success: true,
      data: {
        activeMysteries,
        revealedToday,
        totalValue: formatValue(totalValueSum),
        activeBidders: activeBidders[0]?.totalBidders || 0
      }
    });
  } catch (error) {
    console.error('Get mystery bids stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get mystery bids statistics'
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const { category, mysteryLevel, status, page = 1, limit = 10, featured } = req.query;
    
    let query = {};
    if (category && category !== 'all') query.category = category;
    if (mysteryLevel) query.mysteryLevel = mysteryLevel;
    if (status) query.status = status;
    if (featured === 'true') query.featured = true;

    const mysteryBids = await MysteryBid.find(query)
      .populate('createdBy', 'firstName lastName username avatar')
      .populate('winner', 'firstName lastName username')
      .sort({ createdAt: -1, featured: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await MysteryBid.countDocuments(query);

    res.json({
      success: true,
      data: mysteryBids,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get mystery bids error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get mystery bid auctions'
    });
  }
});

// @route   GET /api/mystery-bids/categories
// @desc    Get mystery bid categories with counts
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await MysteryBid.aggregate([
      { $match: { status: { $in: ['upcoming', 'active'] } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const categoryMap = {
      celebrity: 'Celebrity Collections',
      historical: 'Historical Artifacts',
      royalty: 'Royal Treasures',
      archaeological: 'Archaeological Finds',
      artistic: 'Artistic Masterpieces',
      scientific: 'Scientific Instruments'
    };

    const formattedCategories = [
      { id: 'all', name: 'All Categories', count: categories.reduce((sum, c) => sum + c.count, 0) },
      ...categories.map(c => ({
        id: c._id,
        name: categoryMap[c._id] || c._id,
        count: c.count
      }))
    ];

    res.json({
      success: true,
      data: formattedCategories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get mystery bid categories'
    });
  }
});

// @route   GET /api/mystery-bids/:id
// @desc    Get specific mystery bid auction
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const mysteryBid = await MysteryBid.findById(req.params.id)
      .populate('createdBy', 'firstName lastName username avatar')
      .populate('winner', 'firstName lastName username');

    if (!mysteryBid) {
      return res.status(404).json({
        success: false,
        message: 'Mystery bid auction not found'
      });
    }

    res.json({
      success: true,
      data: mysteryBid
    });
  } catch (error) {
    console.error('Get mystery bid error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get mystery bid auction'
    });
  }
});

// @route   POST /api/mystery-bids
// @desc    Create new mystery bid auction
// @access  Private (Admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const mysteryBidData = {
      ...req.body,
      createdBy: req.user.id
    };

    const mysteryBid = new MysteryBid(mysteryBidData);
    await mysteryBid.save();

    await mysteryBid.populate('createdBy', 'firstName lastName username avatar');

    res.status(201).json({
      success: true,
      message: 'Mystery bid auction created successfully',
      data: mysteryBid
    });
  } catch (error) {
    console.error('Create mystery bid error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create mystery bid auction'
    });
  }
});

// @route   PUT /api/mystery-bids/:id
// @desc    Update mystery bid auction
// @access  Private (Admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const mysteryBid = await MysteryBid.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'firstName lastName username avatar');

    if (!mysteryBid) {
      return res.status(404).json({
        success: false,
        message: 'Mystery bid auction not found'
      });
    }

    res.json({
      success: true,
      message: 'Mystery bid auction updated successfully',
      data: mysteryBid
    });
  } catch (error) {
    console.error('Update mystery bid error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update mystery bid auction'
    });
  }
});

// @route   DELETE /api/mystery-bids/:id
// @desc    Delete mystery bid auction
// @access  Private (Admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const mysteryBid = await MysteryBid.findByIdAndDelete(req.params.id);

    if (!mysteryBid) {
      return res.status(404).json({
        success: false,
        message: 'Mystery bid auction not found'
      });
    }

    res.json({
      success: true,
      message: 'Mystery bid auction deleted successfully'
    });
  } catch (error) {
    console.error('Delete mystery bid error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete mystery bid auction'
    });
  }
});

// @route   POST /api/mystery-bids/:id/bid
// @desc    Place a mystery bid
// @access  Private
router.post('/:id/bid', authenticateToken, async (req, res) => {
  try {
    const { bidAmount } = req.body;
    const mysteryBid = await MysteryBid.findById(req.params.id);

    if (!mysteryBid) {
      return res.status(404).json({
        success: false,
        message: 'Mystery bid auction not found'
      });
    }

    if (mysteryBid.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'This mystery bid auction is not active'
      });
    }

    if (bidAmount < mysteryBid.minimumBid) {
      return res.status(400).json({
        success: false,
        message: `Bid must be at least $${mysteryBid.minimumBid}`
      });
    }

    // Update mystery bid progress
    mysteryBid.currentBids += 1;
    mysteryBid.participantCount = mysteryBid.currentBids; // Simple implementation
    mysteryBid.revealProgress = Math.min(100, (mysteryBid.currentBids / mysteryBid.bidsNeeded) * 100);
    
    // Update average bid
    mysteryBid.averageBid = ((mysteryBid.averageBid * (mysteryBid.currentBids - 1)) + bidAmount) / mysteryBid.currentBids;

    await mysteryBid.save();

    res.json({
      success: true,
      message: 'Mystery bid placed successfully',
      data: {
        revealProgress: mysteryBid.revealProgress,
        currentBids: mysteryBid.currentBids,
        averageBid: mysteryBid.averageBid
      }
    });
  } catch (error) {
    console.error('Place mystery bid error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to place mystery bid'
    });
  }
});

export default router;