import express from 'express';
import { authenticateToken, authorize } from '../middleware/auth.js';
import User from '../models/User.js';
import Item from '../models/Item.js';
import Bid from '../models/Bid.js';
import { validateProfileUpdate, validatePasswordChange } from '../utils/validation.js';

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password -refreshTokens')
      .populate('followers following', 'username firstName lastName avatar');

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { error } = validateProfileUpdate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const allowedUpdates = [
      'firstName', 'lastName', 'bio', 'phone', 'location', 
      'specializations', 'experienceLevel', 'notifications'
    ];
    
    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password -refreshTokens');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

// @route   POST /api/users/change-password
// @desc    Change user password
// @access  Private
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { error } = validatePasswordChange(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    user.refreshTokens = []; // Invalidate all sessions
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID (public profile)
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('username firstName lastName avatar bio location specializations experienceLevel points level badges createdAt')
      .populate('followers following', 'username firstName lastName avatar');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's public stats
    const stats = await getUserStats(user._id);

    res.json({
      success: true,
      data: { 
        user: {
          ...user.toObject(),
          stats
        }
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user'
    });
  }
});

// @route   POST /api/users/:id/follow
// @desc    Follow/unfollow a user
// @access  Private
router.post('/:id/follow', authenticateToken, async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user._id;

    if (targetUserId === currentUserId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot follow yourself'
      });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const currentUser = await User.findById(currentUserId);
    const isAlreadyFollowing = currentUser.following.includes(targetUserId);

    if (isAlreadyFollowing) {
      // Unfollow
      currentUser.following.pull(targetUserId);
      targetUser.followers.pull(currentUserId);
      
      await Promise.all([currentUser.save(), targetUser.save()]);

      res.json({
        success: true,
        message: `Unfollowed ${targetUser.username}`,
        data: { isFollowing: false }
      });
    } else {
      // Follow
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);
      
      await Promise.all([currentUser.save(), targetUser.save()]);

      // Award social badges
      if (currentUser.following.length === 1) {
        await currentUser.addBadge({
          name: 'First Follow',
          description: 'Followed your first collector',
          icon: 'user-plus'
        });
      }

      if (targetUser.followers.length === 10) {
        await targetUser.addBadge({
          name: 'Popular Collector',
          description: 'Gained 10 followers',
          icon: 'users'
        });
      }

      res.json({
        success: true,
        message: `Now following ${targetUser.username}`,
        data: { isFollowing: true }
      });
    }
  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to follow/unfollow user'
    });
  }
});

// @route   GET /api/users/leaderboard
// @desc    Get users leaderboard
// @access  Public
router.get('/leaderboard', async (req, res) => {
  try {
    const { type = 'points', limit = 20 } = req.query;
    
    let sortField = 'points';
    if (type === 'bids') sortField = 'totalBids';
    if (type === 'spent') sortField = 'totalSpent';
    if (type === 'level') sortField = 'level';

    const users = await User.find({})
      .select('username firstName lastName avatar points level totalBids totalSpent badges')
      .sort({ [sortField]: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: { users, type }
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get leaderboard'
    });
  }
});

// @route   GET /api/users/:id/items
// @desc    Get user's items
// @access  Public
router.get('/:id/items', async (req, res) => {
  try {
    const { status = 'all', page = 1, limit = 20 } = req.query;
    const userId = req.params.id;

    let filter = { seller: userId };
    if (status !== 'all') {
      filter.status = status;
    }

    const items = await Item.find(filter)
      .select('title images currentBid startingPrice status auctionEnd createdAt')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const totalItems = await Item.countDocuments(filter);

    res.json({
      success: true,
      data: {
        items,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalItems,
          pages: Math.ceil(totalItems / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get user items error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user items'
    });
  }
});

// @route   GET /api/users/:id/bids
// @desc    Get user's bidding history
// @access  Private (own bids only) or Public (if user allows)
router.get('/:id/bids', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const userId = req.params.id;

    // Users can only see their own detailed bidding history
    if (userId !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const bids = await Bid.getUserBidHistory(userId, parseInt(limit) * parseInt(page))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const totalBids = await Bid.countDocuments({ bidder: userId });

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
    console.error('Get user bids error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user bids'
    });
  }
});

// @route   DELETE /api/users/account
// @desc    Delete user account
// @access  Private
router.delete('/account', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;

    // Check if user has active auctions
    const activeItems = await Item.countDocuments({ 
      seller: userId, 
      status: { $in: ['active', 'scheduled'] } 
    });

    if (activeItems > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete account while you have active auctions'
      });
    }

    // Remove user from followers/following lists
    await User.updateMany(
      { followers: userId },
      { $pull: { followers: userId } }
    );
    
    await User.updateMany(
      { following: userId },
      { $pull: { following: userId } }
    );

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete account'
    });
  }
});

// Helper function to get user stats
const getUserStats = async (userId) => {
  const [totalBids, activeBids, wonAuctions, totalSpent] = await Promise.all([
    Bid.countDocuments({ bidder: userId }),
    Bid.countDocuments({ bidder: userId, status: 'active' }),
    Bid.countDocuments({ bidder: userId, status: 'won' }),
    Bid.aggregate([
      { $match: { bidder: userId, status: 'won' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ])
  ]);

  return {
    totalBids,
    activeBids,
    wonAuctions,
    totalSpent: totalSpent[0]?.total || 0
  };
};

// @route   GET /api/users/dashboard/stats
// @desc    Get dashboard statistics for authenticated user
// @access  Private
router.get('/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;

    const [
      activeAuctions,
      watchingItems,
      wonAuctions,
      totalBids
    ] = await Promise.all([
      Item.countDocuments({ seller: userId, status: 'active' }),
      User.findById(userId).select('watchlist').then(user => user?.watchlist?.length || 0),
      Bid.countDocuments({ bidder: userId, status: 'won' }),
      Bid.countDocuments({ bidder: userId })
    ]);

    res.json({
      success: true,
      stats: {
        activeAuctions,
        watchingItems,
        wonAuctions,
        totalBids
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard stats'
    });
  }
});

// @route   GET /api/users/dashboard/activity
// @desc    Get recent activity for dashboard
// @access  Private
router.get('/dashboard/activity', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get recent bids, items listed, auctions won
    const [recentBids, recentItems] = await Promise.all([
      Bid.find({ bidder: userId })
        .populate('item', 'title images')
        .sort({ createdAt: -1 })
        .limit(10),
      Item.find({ seller: userId })
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    const activity = [
      ...recentBids.map(bid => ({
        id: bid._id,
        type: bid.status === 'won' ? 'won' : bid.status === 'outbid' ? 'outbid' : 'bid',
        message: `You ${bid.status === 'won' ? 'won' : bid.status === 'outbid' ? 'were outbid on' : 'placed a bid on'} ${bid.item?.title}`,
        time: bid.createdAt,
        icon: 'ArrowTrendingUpIcon',
        color: bid.status === 'won' ? 'text-amber-600' : bid.status === 'outbid' ? 'text-red-600' : 'text-green-600'
      })),
      ...recentItems.map(item => ({
        id: item._id,
        type: 'listing',
        message: `You listed ${item.title}`,
        time: item.createdAt,
        icon: 'PlusIcon',
        color: 'text-blue-600'
      }))
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10);

    res.json({
      success: true,
      activity
    });
  } catch (error) {
    console.error('Get dashboard activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard activity'
    });
  }
});

// @route   GET /api/users/dashboard/watchlist
// @desc    Get user's watchlist items
// @access  Private
router.get('/dashboard/watchlist', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'watchlist',
        populate: {
          path: 'seller',
          select: 'username firstName lastName'
        }
      });

    res.json({
      success: true,
      items: user.watchlist || []
    });
  } catch (error) {
    console.error('Get watchlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get watchlist'
    });
  }
});

// @route   GET /api/users/dashboard/recommendations
// @desc    Get recommended items for user
// @access  Private
router.get('/dashboard/recommendations', authenticateToken, async (req, res) => {
  try {
    // Simple recommendation based on user's bid history
    const userBids = await Bid.find({ bidder: req.user._id })
      .populate('item', 'category era')
      .limit(20);

    const categories = [...new Set(userBids.map(bid => bid.item?.category).filter(Boolean))];
    const eras = [...new Set(userBids.map(bid => bid.item?.era).filter(Boolean))];

    // Find similar items
    const recommendations = await Item.find({
      $or: [
        { category: { $in: categories } },
        { era: { $in: eras } }
      ],
      status: 'active',
      seller: { $ne: req.user._id }
    })
    .populate('seller', 'username firstName lastName')
    .limit(6);

    res.json({
      success: true,
      items: recommendations
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get recommendations'
    });
  }
});

// @route   GET /api/users/:id/stats
// @desc    Get user statistics
// @access  Public
router.get('/:id/stats', async (req, res) => {
  try {
    const userId = req.params.id;

    const [
      totalSales,
      totalPurchases,
      totalEarnings,
      currentListings,
      user
    ] = await Promise.all([
      Item.countDocuments({ seller: userId, status: 'sold' }),
      Bid.countDocuments({ bidder: userId, status: 'won' }),
      Item.aggregate([
        { $match: { seller: userId, status: 'sold' } },
        { $group: { _id: null, total: { $sum: '$finalPrice' } } }
      ]),
      Item.countDocuments({ seller: userId, status: 'active' }),
      User.findById(userId).select('watchlist ratings')
    ]);

    const avgRating = user.ratings?.length > 0 
      ? user.ratings.reduce((sum, rating) => sum + rating.score, 0) / user.ratings.length
      : 0;

    const stats = {
      totalSales,
      totalPurchases,
      successRate: totalSales > 0 ? ((totalSales / (totalSales + 1)) * 100) : 0,
      avgRating: Math.round(avgRating * 10) / 10,
      totalEarnings: totalEarnings[0]?.total || 0,
      itemsSold: totalSales,
      currentListings,
      watchlistItems: user.watchlist?.length || 0
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user stats'
    });
  }
});

export default router;