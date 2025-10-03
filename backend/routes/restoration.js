import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import RestorationExpert from '../models/RestorationExpert.js';
import RestorationProject from '../models/RestorationProject.js';

const router = express.Router();

// @route   GET /api/restoration/stats
// @desc    Get restoration marketplace statistics
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const verifiedExperts = await RestorationExpert.countDocuments({ 
      verified: true, 
      status: 'active' 
    });
    
    const activeProjects = await RestorationProject.countDocuments({ 
      status: { $in: ['Open', 'In Progress'] } 
    });
    
    const completedProjects = await RestorationProject.countDocuments({ 
      status: 'Completed' 
    });

    // Calculate success rate (completed vs total projects)
    const totalProjects = await RestorationProject.countDocuments();
    const successRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

    res.json({
      success: true,
      data: {
        verifiedExperts: verifiedExperts || 0,
        activeProjects: activeProjects || 0,
        successRate: successRate || 0,
        completedProjects: completedProjects || 0
      }
    });
  } catch (error) {
    console.error('Get restoration stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get restoration statistics'
    });
  }
});

// @route   GET /api/restoration/experts
// @desc    Get all restoration experts
// @access  Public
router.get('/experts', async (req, res) => {
  try {
    const { search, specialty, location, page = 1, limit = 10 } = req.query;
    
    let query = { status: 'active' };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialties: { $in: [new RegExp(search, 'i')] } },
        { title: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (specialty && specialty !== 'all') {
      query.specialties = { $in: [specialty] };
    }
    
    if (location && location !== 'all') {
      query.location = { $regex: location, $options: 'i' };
    }

    const experts = await RestorationExpert.find(query)
      .sort({ rating: -1, verified: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await RestorationExpert.countDocuments(query);

    res.json({
      success: true,
      data: experts,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get restoration experts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get restoration experts'
    });
  }
});

// @route   GET /api/restoration/projects
// @desc    Get all restoration projects
// @access  Public
router.get('/projects', async (req, res) => {
  try {
    const { search, category, status, urgency, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (urgency && urgency !== 'all') {
      query.urgency = urgency;
    }

    const projects = await RestorationProject.find(query)
      .populate('assignedExpert', 'name title rating')
      .sort({ postedDate: -1, urgency: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await RestorationProject.countDocuments(query);

    res.json({
      success: true,
      data: projects,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get restoration projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get restoration projects'
    });
  }
});

// @route   GET /api/restoration/experts/:id
// @desc    Get specific restoration expert
// @access  Public
router.get('/experts/:id', async (req, res) => {
  try {
    const expert = await RestorationExpert.findById(req.params.id);

    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Restoration expert not found'
      });
    }

    res.json({
      success: true,
      data: expert
    });
  } catch (error) {
    console.error('Get restoration expert error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get restoration expert'
    });
  }
});

// @route   GET /api/restoration/projects/:id
// @desc    Get specific restoration project
// @access  Public
router.get('/projects/:id', async (req, res) => {
  try {
    const project = await RestorationProject.findById(req.params.id)
      .populate('assignedExpert', 'name title rating avatar');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Restoration project not found'
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Get restoration project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get restoration project'
    });
  }
});

// @route   POST /api/restoration/experts
// @desc    Create new restoration expert
// @access  Private (Admin only)
router.post('/experts', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const expertData = {
      ...req.body,
      createdBy: req.user.id
    };

    const expert = new RestorationExpert(expertData);
    await expert.save();

    res.status(201).json({
      success: true,
      data: expert,
      message: 'Restoration expert created successfully'
    });
  } catch (error) {
    console.error('Create restoration expert error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create restoration expert'
    });
  }
});

// @route   POST /api/restoration/projects
// @desc    Create new restoration project
// @access  Private (Admin only)
router.post('/projects', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const projectData = {
      ...req.body,
      createdBy: req.user.id
    };

    const project = new RestorationProject(projectData);
    await project.save();

    res.status(201).json({
      success: true,
      data: project,
      message: 'Restoration project created successfully'
    });
  } catch (error) {
    console.error('Create restoration project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create restoration project'
    });
  }
});

// @route   PUT /api/restoration/experts/:id
// @desc    Update restoration expert
// @access  Private (Admin only)
router.put('/experts/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const expert = await RestorationExpert.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Restoration expert not found'
      });
    }

    res.json({
      success: true,
      data: expert,
      message: 'Restoration expert updated successfully'
    });
  } catch (error) {
    console.error('Update restoration expert error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update restoration expert'
    });
  }
});

// @route   PUT /api/restoration/projects/:id
// @desc    Update restoration project
// @access  Private (Admin only)
router.put('/projects/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const project = await RestorationProject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('assignedExpert', 'name title rating avatar');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Restoration project not found'
      });
    }

    res.json({
      success: true,
      data: project,
      message: 'Restoration project updated successfully'
    });
  } catch (error) {
    console.error('Update restoration project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update restoration project'
    });
  }
});

// @route   DELETE /api/restoration/experts/:id
// @desc    Delete restoration expert
// @access  Private (Admin only)
router.delete('/experts/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const expert = await RestorationExpert.findByIdAndDelete(req.params.id);

    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Restoration expert not found'
      });
    }

    res.json({
      success: true,
      message: 'Restoration expert deleted successfully'
    });
  } catch (error) {
    console.error('Delete restoration expert error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete restoration expert'
    });
  }
});

// @route   DELETE /api/restoration/projects/:id
// @desc    Delete restoration project
// @access  Private (Admin only)
router.delete('/projects/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const project = await RestorationProject.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Restoration project not found'
      });
    }

    res.json({
      success: true,
      message: 'Restoration project deleted successfully'
    });
  } catch (error) {
    console.error('Delete restoration project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete restoration project'
    });
  }
});

export default router;