import express from 'express';
import { authenticateToken, optionalAuth, authorize } from '../middleware/auth.js';
import Item from '../models/Item.js';
import Bid from '../models/Bid.js';
import Provenance from '../models/Provenance.js';
import { validateItem, validateSearchFilters } from '../utils/validation.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

const router = express.Router();

// @route   GET /api/items
// @desc    Get all items with filtering and pagination
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { error, value } = validateSearchFilters(req.query);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const {
      search,
      category,
      era,
      origin,
      condition,
      minPrice,
      maxPrice,
      status = 'active',
      sortBy,
      sortOrder,
      page,
      limit
    } = value;

    // Build filter object
    const filter = {};
    
    if (search) {
      filter.$text = { $search: search };
    }
    
    if (category) filter.category = category;
    if (era) filter.era = { $regex: era, $options: 'i' };
    if (origin) filter['origin.country'] = { $regex: origin, $options: 'i' };
    if (condition) filter.condition = condition;
    if (status !== 'all') filter.status = status;
    
    // Price filtering
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.currentBid = {};
      if (minPrice !== undefined) filter.currentBid.$gte = minPrice;
      if (maxPrice !== undefined) filter.currentBid.$lte = maxPrice;
    }

    // Build sort object
    const sortOptions = {};
    switch (sortBy) {
      case 'price':
        sortOptions.currentBid = sortOrder === 'asc' ? 1 : -1;
        break;
      case 'time':
        sortOptions.auctionEnd = sortOrder === 'asc' ? 1 : -1;
        break;
      case 'popular':
        sortOptions.views = -1;
        break;
      default:
        sortOptions.createdAt = -1;
    }

    const items = await Item.find(filter)
      .populate('seller', 'username firstName lastName avatar')
      .populate('provenance', 'verification.overallScore')
      .select('-adminNotes -fraudFlags')
      .sort(sortOptions)
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    // Add user-specific data if authenticated
    if (req.user) {
      for (const item of items) {
        item.isFavorited = item.favorites?.some(fav => 
          fav.user.toString() === req.user._id.toString()
        ) || false;
        
        item.userBid = await Bid.findOne({
          bidder: req.user._id,
          item: item._id,
          status: { $in: ['active', 'winning'] }
        }).select('amount isWinning');
      }
    }

    const totalItems = await Item.countDocuments(filter);

    res.json({
      success: true,
      data: {
        items,
        pagination: {
          page,
          limit,
          total: totalItems,
          pages: Math.ceil(totalItems / limit)
        },
        filters: {
          search,
          category,
          era,
          origin,
          condition,
          minPrice,
          maxPrice,
          status,
          sortBy,
          sortOrder
        }
      }
    });
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get items'
    });
  }
});

// @route   GET /api/items/featured
// @desc    Get featured items
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const featuredItems = await Item.find({
      isFeatured: true,
      status: { $in: ['active', 'scheduled'] }
    })
    .populate('seller', 'username firstName lastName avatar')
    .select('-adminNotes -fraudFlags')
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

    res.json({
      success: true,
      data: { items: featuredItems }
    });
  } catch (error) {
    console.error('Get featured items error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get featured items'
    });
  }
});

// @route   GET /api/items/ending-soon
// @desc    Get items ending soon
// @access  Public
router.get('/ending-soon', async (req, res) => {
  try {
    const items = await Item.findEndingSoon(24) // Next 24 hours
      .populate('seller', 'username firstName lastName avatar')
      .select('-adminNotes -fraudFlags')
      .limit(20)
      .lean();

    res.json({
      success: true,
      data: { items }
    });
  } catch (error) {
    console.error('Get ending soon items error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get ending soon items'
    });
  }
});

// @route   GET /api/items/:id
// @desc    Get single item by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('seller', 'username firstName lastName avatar bio specializations')
      .populate('provenance')
      .populate('winner', 'username firstName lastName avatar')
      .select(req.user?.role === 'admin' ? '' : '-adminNotes -fraudFlags')
      .lean();

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Increment view count (but not for the owner)
    if (!req.user || req.user._id.toString() !== item.seller._id.toString()) {
      await Item.findByIdAndUpdate(item._id, { $inc: { views: 1 } });
    }

    // Get bidding history
    const bids = await Bid.getItemBidHistory(item._id, 10);
    
    // Get related items
    const relatedItems = await Item.find({
      _id: { $ne: item._id },
      $or: [
        { category: item.category },
        { era: item.era },
        { 'origin.country': item.origin?.country }
      ],
      status: 'active'
    })
    .select('title images currentBid startingPrice auctionEnd')
    .limit(4)
    .lean();

    // Add user-specific data
    let userBid = null;
    let isFavorited = false;
    let isWatching = false;

    if (req.user) {
      userBid = await Bid.findOne({
        bidder: req.user._id,
        item: item._id,
        status: { $in: ['active', 'winning'] }
      }).select('amount isWinning maxBid');

      isFavorited = item.favorites?.some(fav => 
        fav.user.toString() === req.user._id.toString()
      ) || false;

      // Check if user is watching (you'd implement a watching system)
      // isWatching = await Watch.exists({ user: req.user._id, item: item._id });
    }

    res.json({
      success: true,
      data: {
        item: {
          ...item,
          isFavorited,
          isWatching,
          userBid
        },
        bids,
        relatedItems
      }
    });
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get item'
    });
  }
});

// @route   POST /api/items
// @desc    Create new item
// @access  Private
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { error } = validateItem(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const itemData = {
      ...req.body,
      seller: req.user._id
    };

    // Create the item
    const item = new Item(itemData);
    await item.save();

    // Populate seller info
    await item.populate('seller', 'username firstName lastName avatar');

    // Award badges for first listing
    if (req.user.totalBids === 0) {
      await req.user.addBadge({
        name: 'First Listing',
        description: 'Created your first auction listing',
        icon: 'gavel'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: { item }
    });
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create item'
    });
  }
});

// @route   PUT /api/items/:id
// @desc    Update item
// @access  Private (Owner or Admin)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check ownership
    if (item.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own items'
      });
    }

    // Don't allow editing of active auctions (except admin)
    if (item.status === 'active' && req.user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot edit active auctions'
      });
    }

    const { error } = validateItem(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const allowedUpdates = [
      'title', 'description', 'category', 'era', 'origin', 'materials',
      'dimensions', 'condition', 'startingPrice', 'reservePrice',
      'auctionStart', 'auctionEnd', 'shipping', 'tags'
    ];

    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('seller', 'username firstName lastName avatar');

    res.json({
      success: true,
      message: 'Item updated successfully',
      data: { item: updatedItem }
    });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update item'
    });
  }
});

// @route   DELETE /api/items/:id
// @desc    Delete item
// @access  Private (Owner or Admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check ownership
    if (item.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own items'
      });
    }

    // Don't allow deletion of items with bids (except admin)
    if (item.totalBids > 0 && req.user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete items that have received bids'
      });
    }

    await Item.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete item'
    });
  }
});

// @route   POST /api/items/:id/favorite
// @desc    Add/remove item from favorites
// @access  Private
router.post('/:id/favorite', authenticateToken, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    const userId = req.user._id;
    const existingFavorite = item.favorites.find(fav => 
      fav.user.toString() === userId.toString()
    );

    if (existingFavorite) {
      // Remove from favorites
      await item.removeFromFavorites(userId);
      
      res.json({
        success: true,
        message: 'Item removed from favorites',
        data: { isFavorited: false }
      });
    } else {
      // Add to favorites
      await item.addToFavorites(userId);
      
      res.json({
        success: true,
        message: 'Item added to favorites',
        data: { isFavorited: true }
      });
    }
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle favorite'
    });
  }
});

// @route   POST /api/items/:id/images
// @desc    Upload images for item
// @access  Private (Owner or Admin)
router.post('/:id/images', authenticateToken, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check ownership
    if (item.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only upload images for your own items'
      });
    }

    // Handle file upload (you'll need to implement Cloudinary utility)
    // For now, just return success
    res.json({
      success: true,
      message: 'Image upload functionality to be implemented',
      data: { item }
    });
  } catch (error) {
    console.error('Upload images error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload images'
    });
  }
});

// @route   GET /api/items/:id/bids
// @desc    Get item's bid history
// @access  Public
router.get('/:id/bids', async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    const bids = await Bid.getItemBidHistory(req.params.id, parseInt(limit));

    res.json({
      success: true,
      data: { bids }
    });
  } catch (error) {
    console.error('Get item bids error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get item bids'
    });
  }
});

// @route   POST /api/items/:id/report
// @desc    Report item for review
// @access  Private
router.post('/:id/report', authenticateToken, async (req, res) => {
  try {
    const { reason, description } = req.body;
    
    if (!reason || !description) {
      return res.status(400).json({
        success: false,
        message: 'Reason and description are required'
      });
    }

    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Add admin note
    item.adminNotes.push({
      note: `REPORT: ${reason} - ${description}`,
      author: req.user._id
    });

    await item.save();

    // You could also send notification to admins here

    res.json({
      success: true,
      message: 'Item reported successfully'
    });
  } catch (error) {
    console.error('Report item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to report item'
    });
  }
});

export default router;