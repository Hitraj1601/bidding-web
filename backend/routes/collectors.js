import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import User from '../models/User.js';
import Group from '../models/Group.js';
import Event from '../models/Event.js';

const router = express.Router();

// @route   GET /api/collectors
// @desc    Get collector profiles and network
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Get users with collector role or high experience levels
    const collectors = await User.find({
      $or: [
        { role: 'collector' },
        { experienceLevel: { $in: ['Expert', 'Professional'] } },
        { level: { $gte: 5 } }
      ]
    })
    .select('-password -resetPasswordToken -verificationToken -googleId')
    .populate('followers', 'username firstName lastName avatar')
    .populate('following', 'username firstName lastName avatar')
    .sort({ level: -1, points: -1 })
    .limit(20);

    // Transform data to match frontend expectations
    const transformedCollectors = collectors.map(user => ({
      id: user._id,
      name: `${user.firstName} ${user.lastName || ''}`.trim(),
      avatar: user.avatar || user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.firstName)}&background=random`,
      location: user.location?.city && user.location?.country 
        ? `${user.location.city}, ${user.location.country}` 
        : 'Location not specified',
      specialization: user.specializations?.length > 0 
        ? user.specializations[0] 
        : 'General Collector',
      level: user.experienceLevel || 'Beginner',
      levelColor: getLevelColor(user.experienceLevel, user.level),
      reputation: Math.min(5, Math.max(1, (user.level * 0.5) + 3.5)), // Calculate reputation based on level
      yearsCollecting: Math.max(1, Math.floor((Date.now() - user.createdAt) / (365 * 24 * 60 * 60 * 1000))),
      itemsOwned: user.totalBids || 0,
      totalValue: `$${(user.totalSpent || 0).toLocaleString()}`,
      followers: user.followers?.length || 0,
      following: user.following?.length || 0,
      isFollowing: false, // This would need to be checked against current user
      recentActivity: generateRecentActivity(user),
      expertise: user.specializations || ['General Collecting'],
      achievements: generateAchievements(user),
      bio: user.bio || 'Passionate collector sharing knowledge with the community.',
      joinDate: user.createdAt,
      verifiedExpert: user.role === 'collector' || user.experienceLevel === 'Professional'
    }));

    res.json({
      success: true,
      data: transformedCollectors
    });
  } catch (error) {
    console.error('Get collectors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get collectors'
    });
  }
});

// Helper functions
function getLevelColor(experienceLevel, level) {
  if (experienceLevel === 'Professional') return 'text-purple-600';
  if (experienceLevel === 'Expert') return 'text-gold-600';
  if (experienceLevel === 'Intermediate') return 'text-blue-600';
  if (level >= 10) return 'text-purple-600';
  if (level >= 5) return 'text-gold-600';
  return 'text-green-600';
}

function generateRecentActivity(user) {
  const activities = [];
  if (user.successfulBids > 0) {
    activities.push(`Won ${user.successfulBids} auction${user.successfulBids !== 1 ? 's' : ''}`);
  }
  if (user.specializations?.length > 0) {
    activities.push(`Shared expertise on ${user.specializations[0]}`);
  }
  activities.push('Active in community discussions');
  return activities.slice(0, 3);
}

function generateAchievements(user) {
  const achievements = [];
  if (user.level >= 10) achievements.push('Master Collector');
  if (user.successfulBids >= 10) achievements.push('Top Bidder');
  if (user.role === 'collector') achievements.push('Verified Collector');
  if (user.experienceLevel === 'Expert') achievements.push('Authentication Expert');
  if (user.followers?.length >= 50) achievements.push('Community Leader');
  if (achievements.length === 0) achievements.push('Rising Collector');
  return achievements;
}

// @route   GET /api/collectors/groups
// @desc    Get collector groups/communities
// @access  Public
router.get('/groups', async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (category && category !== 'all') query.category = category;

    const groups = await Group.find(query)
      .populate('moderators', 'firstName lastName username avatar')
      .populate('createdBy', 'firstName lastName username avatar')
      .sort({ featured: -1, memberCount: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Transform data to match frontend expectations
    const transformedGroups = groups.map(group => ({
      id: group._id,
      name: group.name,
      description: group.description,
      memberCount: group.memberCount,
      category: group.category,
      privacy: group.privacy,
      image: group.image,
      activity: group.activity,
      recentPosts: group.recentPosts,
      moderators: group.moderators.map(mod => `${mod.firstName} ${mod.lastName || ''}`.trim()),
      tags: group.tags,
      joined: false // This would need to be checked against current user
    }));

    const total = await Group.countDocuments(query);

    res.json({
      success: true,
      data: transformedGroups,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get groups error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get collector groups'
    });
  }
});

// @route   GET /api/collectors/events
// @desc    Get collector events
// @access  Public
router.get('/events', async (req, res) => {
  try {
    const { category, type, format, status = 'upcoming', page = 1, limit = 10 } = req.query;
    
    let query = { status };
    if (category && category !== 'all') query.category = category;
    if (type) query.type = type;
    if (format) query.format = format;

    const events = await Event.find(query)
      .populate('host', 'firstName lastName username avatar')
      .populate('createdBy', 'firstName lastName username avatar')
      .sort({ featured: -1, date: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Transform data to match frontend expectations
    const transformedEvents = events.map(event => ({
      id: event._id,
      title: event.title,
      date: event.date,
      time: event.time,
      type: event.type,
      format: event.format,
      location: event.location,
      host: `${event.host.firstName} ${event.host.lastName || ''}`.trim(),
      hostAvatar: event.host.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(event.host.firstName)}&background=random`,
      attendees: event.attendeeCount,
      maxAttendees: event.maxAttendees,
      price: event.price,
      description: event.description,
      category: event.category,
      difficulty: event.difficulty,
      isRegistered: false // This would need to be checked against current user
    }));

    const total = await Event.countDocuments(query);

    res.json({
      success: true,
      data: transformedEvents,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get collector events'
    });
  }
});

// @route   POST /api/collectors/follow/:id
// @desc    Follow/unfollow a collector
// @access  Private
router.post('/follow/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user.id;

    if (id === currentUserId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot follow yourself'
      });
    }

    const targetUser = await User.findById(id);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      // Unfollow
      currentUser.following.pull(id);
      targetUser.followers.pull(currentUserId);
    } else {
      // Follow
      currentUser.following.push(id);
      targetUser.followers.push(currentUserId);
    }

    await currentUser.save();
    await targetUser.save();

    res.json({
      success: true,
      message: isFollowing ? 'Unfollowed successfully' : 'Followed successfully',
      isFollowing: !isFollowing
    });
  } catch (error) {
    console.error('Follow/unfollow error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update follow status'
    });
  }
});

// @route   POST /api/collectors/groups
// @desc    Create new collector group
// @access  Private
router.post('/groups', authenticateToken, async (req, res) => {
  try {
    const groupData = {
      ...req.body,
      createdBy: req.user.id,
      moderators: [req.user.id],
      members: [{
        user: req.user.id,
        role: 'admin'
      }]
    };

    const group = new Group(groupData);
    await group.save();

    await group.populate([
      { path: 'moderators', select: 'firstName lastName username avatar' },
      { path: 'createdBy', select: 'firstName lastName username avatar' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Group created successfully',
      data: group
    });
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create group'
    });
  }
});

// @route   POST /api/collectors/groups/:id/join
// @desc    Join/leave a collector group
// @access  Private
router.post('/groups/:id/join', authenticateToken, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    const userId = req.user.id;

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    const isMember = group.members.some(member => member.user.toString() === userId);

    if (isMember) {
      // Leave group
      group.members = group.members.filter(member => member.user.toString() !== userId);
    } else {
      // Join group
      group.members.push({ user: userId });
    }

    await group.save();

    res.json({
      success: true,
      message: isMember ? 'Left group successfully' : 'Joined group successfully',
      joined: !isMember
    });
  } catch (error) {
    console.error('Join/leave group error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update group membership'
    });
  }
});

// @route   POST /api/collectors/events
// @desc    Create new collector event
// @access  Private
router.post('/events', authenticateToken, async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      host: req.user.id,
      createdBy: req.user.id
    };

    const event = new Event(eventData);
    await event.save();

    await event.populate([
      { path: 'host', select: 'firstName lastName username avatar' },
      { path: 'createdBy', select: 'firstName lastName username avatar' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create event'
    });
  }
});

// @route   POST /api/collectors/events/:id/register
// @desc    Register/unregister for an event
// @access  Private
router.post('/events/:id/register', authenticateToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    const userId = req.user.id;

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (event.status !== 'upcoming') {
      return res.status(400).json({
        success: false,
        message: 'Cannot register for this event'
      });
    }

    const isRegistered = event.attendees.some(attendee => attendee.user.toString() === userId);

    if (isRegistered) {
      // Unregister
      event.attendees = event.attendees.filter(attendee => attendee.user.toString() !== userId);
    } else {
      // Register
      if (event.attendees.length >= event.maxAttendees) {
        return res.status(400).json({
          success: false,
          message: 'Event is fully booked'
        });
      }
      event.attendees.push({ user: userId });
    }

    await event.save();

    res.json({
      success: true,
      message: isRegistered ? 'Unregistered successfully' : 'Registered successfully',
      isRegistered: !isRegistered
    });
  } catch (error) {
    console.error('Register/unregister event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update event registration'
    });
  }
});

// @route   DELETE /api/collectors/groups/:id
// @desc    Delete collector group
// @access  Private (Admin or Group Creator only)
router.delete('/groups/:id', authenticateToken, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    // Check if user is admin or group creator
    if (req.user.role !== 'admin' && group.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await Group.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Group deleted successfully'
    });
  } catch (error) {
    console.error('Delete group error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete group'
    });
  }
});

// @route   DELETE /api/collectors/events/:id
// @desc    Delete collector event
// @access  Private (Admin or Event Creator only)
router.delete('/events/:id', authenticateToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is admin or event creator
    if (req.user.role !== 'admin' && event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete event'
    });
  }
});

export default router;