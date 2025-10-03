import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import TimeCapsule from '../models/TimeCapsule.js';

const router = express.Router();

// @route   GET /api/time-capsule
// @desc    Get all time capsule auctions
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { period, status, page = 1, limit = 10, featured } = req.query;
    
    let query = {};
    if (period && period !== 'all') query.period = period;
    if (status) query.status = status;
    if (featured === 'true') query.featured = true;

    const timeCapsules = await TimeCapsule.find(query)
      .populate('createdBy', 'firstName lastName username avatar')
      .populate('winner', 'firstName lastName username')
      .sort({ createdAt: -1, featured: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await TimeCapsule.countDocuments(query);

    res.json({
      success: true,
      data: timeCapsules,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get time capsules error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get time capsule auctions'
    });
  }
});

// @route   GET /api/time-capsule/periods
// @desc    Get historical periods with counts
// @access  Public
router.get('/periods', async (req, res) => {
  try {
    const periods = await TimeCapsule.aggregate([
      { $match: { status: { $in: ['upcoming', 'active'] } } },
      { $group: { _id: '$period', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const periodMap = {
      ancient: 'Ancient Era',
      medieval: 'Medieval',
      renaissance: 'Renaissance',
      industrial: 'Industrial Age',
      modern: 'Modern Era'
    };

    const formattedPeriods = [
      { id: 'all', name: 'All Periods', count: periods.reduce((sum, p) => sum + p.count, 0) },
      ...periods.map(p => ({
        id: p._id,
        name: periodMap[p._id] || p._id,
        count: p.count
      }))
    ];

    res.json({
      success: true,
      data: formattedPeriods
    });
  } catch (error) {
    console.error('Get periods error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get historical periods'
    });
  }
});

// @route   GET /api/time-capsule/:id
// @desc    Get specific time capsule auction
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const timeCapsule = await TimeCapsule.findById(req.params.id)
      .populate('createdBy', 'firstName lastName username avatar')
      .populate('winner', 'firstName lastName username');

    if (!timeCapsule) {
      return res.status(404).json({
        success: false,
        message: 'Time capsule auction not found'
      });
    }

    res.json({
      success: true,
      data: timeCapsule
    });
  } catch (error) {
    console.error('Get time capsule error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get time capsule auction'
    });
  }
});

// @route   POST /api/time-capsule
// @desc    Create new time capsule auction
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

    const timeCapsuleData = {
      ...req.body,
      createdBy: req.user.id
    };

    const timeCapsule = new TimeCapsule(timeCapsuleData);
    await timeCapsule.save();

    await timeCapsule.populate('createdBy', 'firstName lastName username avatar');

    res.status(201).json({
      success: true,
      message: 'Time capsule auction created successfully',
      data: timeCapsule
    });
  } catch (error) {
    console.error('Create time capsule error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create time capsule auction'
    });
  }
});

// @route   PUT /api/time-capsule/:id
// @desc    Update time capsule auction
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

    const timeCapsule = await TimeCapsule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'firstName lastName username avatar');

    if (!timeCapsule) {
      return res.status(404).json({
        success: false,
        message: 'Time capsule auction not found'
      });
    }

    res.json({
      success: true,
      message: 'Time capsule auction updated successfully',
      data: timeCapsule
    });
  } catch (error) {
    console.error('Update time capsule error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update time capsule auction'
    });
  }
});

// @route   DELETE /api/time-capsule/:id
// @desc    Delete time capsule auction
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

    const timeCapsule = await TimeCapsule.findByIdAndDelete(req.params.id);

    if (!timeCapsule) {
      return res.status(404).json({
        success: false,
        message: 'Time capsule auction not found'
      });
    }

    res.json({
      success: true,
      message: 'Time capsule auction deleted successfully'
    });
  } catch (error) {
    console.error('Delete time capsule error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete time capsule auction'
    });
  }
});

export default router;