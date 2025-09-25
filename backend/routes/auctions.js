import express from 'express';
import { authenticateToken, authorize } from '../middleware/auth.js';
import Auction from '../models/Auction.js';
import { validateAuction } from '../utils/validation.js';

const router = express.Router();

// @route   GET /api/auctions
// @desc    Get all auctions
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { status = 'all', type, page = 1, limit = 20 } = req.query;
    
    let filter = {};
    if (status !== 'all') filter.status = status;
    if (type) filter.type = type;
    
    const auctions = await Auction.find(filter)
      .populate('auctioneer', 'username firstName lastName avatar')
      .populate('featuredItems', 'title images currentBid startingPrice')
      .sort({ startDate: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const totalAuctions = await Auction.countDocuments(filter);
    
    res.json({
      success: true,
      data: {
        auctions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalAuctions,
          pages: Math.ceil(totalAuctions / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get auctions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get auctions'
    });
  }
});

// @route   GET /api/auctions/:id
// @desc    Get auction by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id)
      .populate('auctioneer', 'username firstName lastName avatar bio')
      .populate('items', 'title images currentBid startingPrice condition era')
      .populate('featuredItems', 'title images currentBid startingPrice condition era');
    
    if (!auction) {
      return res.status(404).json({
        success: false,
        message: 'Auction not found'
      });
    }
    
    // Increment views
    await auction.incrementViews();
    
    res.json({
      success: true,
      data: { auction }
    });
  } catch (error) {
    console.error('Get auction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get auction'
    });
  }
});

// @route   POST /api/auctions
// @desc    Create new auction
// @access  Private (Admin/Auctioneer)
router.post('/', authenticateToken, authorize('admin', 'auctioneer'), async (req, res) => {
  try {
    const { error } = validateAuction(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }
    
    const auction = new Auction({
      ...req.body,
      auctioneer: req.user._id
    });
    
    await auction.save();
    await auction.populate('auctioneer', 'username firstName lastName avatar');
    
    res.status(201).json({
      success: true,
      message: 'Auction created successfully',
      data: { auction }
    });
  } catch (error) {
    console.error('Create auction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create auction'
    });
  }
});

// More routes would be implemented here...
// - Update auction
// - Delete auction
// - Add items to auction
// - Follow/unfollow auction
// - Get auction statistics
// - Time capsule specific routes
// - Mystery box routes

export default router;