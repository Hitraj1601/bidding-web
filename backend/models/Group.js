import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Historical Period', 'Cultural/Regional', 'Art Movement', 'Material Type', 'Price Range', 'Authentication']
  },
  privacy: {
    type: String,
    enum: ['Public', 'Private', 'Invite Only'],
    default: 'Public'
  },
  image: {
    type: String,
    required: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    role: {
      type: String,
      enum: ['member', 'moderator', 'admin'],
      default: 'member'
    }
  }],
  moderators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  tags: [{
    type: String,
    trim: true
  }],
  posts: [{
    title: String,
    content: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    replies: [{
      content: String,
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
  }],
  activity: {
    type: String,
    enum: ['Very Active', 'Active', 'Growing', 'Quiet'],
    default: 'Growing'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Virtual for member count
groupSchema.virtual('memberCount').get(function() {
  return this.members.length;
});

// Virtual for recent posts
groupSchema.virtual('recentPosts').get(function() {
  return this.posts
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 3)
    .map(post => post.title || post.content.substring(0, 50) + '...');
});

// Add indexes for better query performance
groupSchema.index({ category: 1, privacy: 1 });
groupSchema.index({ tags: 1 });
groupSchema.index({ featured: 1 });

export default mongoose.model('Group', groupSchema);