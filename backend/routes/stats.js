import express from 'express';
import User from '../models/User.js';
import Item from '../models/Item.js';
import Auction from '../models/Auction.js';
import Bid from '../models/Bid.js';

const router = express.Router();

// @route   GET /api/stats/global
// @desc    Get global platform statistics
// @access  Public
router.get('/global', async (req, res) => {
  try {
    const [
      totalItems,
      activeAuctions,
      totalUsers,
      successfulSales
    ] = await Promise.all([
      Item.countDocuments(),
      Auction.countDocuments({ status: 'active' }) + Item.countDocuments({ status: 'active' }),
      User.countDocuments(),
      Item.countDocuments({ status: 'sold' }) + Bid.countDocuments({ status: 'won' })
    ]);

    res.json({
      success: true,
      totalItems,
      activeAuctions,
      totalUsers,
      successfulSales
    });
  } catch (error) {
    console.error('Get global stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get global stats'
    });
  }
});

// @route   GET /api/stats/trends
// @desc    Get market trends
// @access  Public
router.get('/trends', async (req, res) => {
  try {
    // Get trending categories based on recent activity
    const categoryTrends = await Item.aggregate([
      { $match: { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: '$category', count: { $sum: 1 }, avgPrice: { $avg: '$currentBid' } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Get price trends over time
    const priceTrends = await Item.aggregate([
      { 
        $match: { 
          status: 'sold',
          soldAt: { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) }
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: '$soldAt' },
            month: { $month: '$soldAt' },
            category: '$category'
          },
          avgPrice: { $avg: '$finalPrice' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      success: true,
      categoryTrends,
      priceTrends
    });
  } catch (error) {
    console.error('Get trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get trends'
    });
  }
});

// @route   GET /api/stats/categories
// @desc    Get top categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const topCategories = await Item.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, totalValue: { $sum: '$currentBid' } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      categories: topCategories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get categories'
    });
  }
});

export default router;