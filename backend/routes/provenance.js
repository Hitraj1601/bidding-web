import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import Provenance from '../models/Provenance.js';

const router = express.Router();

// @route   GET /api/provenance/:itemId
// @desc    Get provenance for an item
// @access  Public
router.get('/:itemId', async (req, res) => {
  try {
    const provenance = await Provenance.findOne({ item: req.params.itemId })
      .populate('createdBy', 'username firstName lastName')
      .populate('lastUpdatedBy', 'username firstName lastName');
    
    if (!provenance) {
      return res.status(404).json({
        success: false,
        message: 'Provenance not found'
      });
    }
    
    res.json({
      success: true,
      data: { provenance }
    });
  } catch (error) {
    console.error('Get provenance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get provenance'
    });
  }
});

// @route   POST /api/provenance
// @desc    Create provenance record
// @access  Private
router.post('/', authenticateToken, async (req, res) => {
  try {
    const provenance = new Provenance({
      ...req.body,
      createdBy: req.user._id
    });
    
    await provenance.save();
    
    res.status(201).json({
      success: true,
      message: 'Provenance record created successfully',
      data: { provenance }
    });
  } catch (error) {
    console.error('Create provenance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create provenance record'
    });
  }
});

// More provenance routes would be implemented here...
// - Update provenance
// - Add ownership record
// - Add exhibition record
// - Verify certificates
// - Blockchain integration

export default router;