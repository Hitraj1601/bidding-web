import mongoose from 'mongoose';

const auctionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  
  // Auction type and theme
  type: {
    type: String,
    enum: ['standard', 'themed', 'time_capsule', 'mystery', 'estate', 'institutional'],
    default: 'standard'
  },
  theme: {
    name: String,
    description: String,
    era: String,
    category: String
  },
  
  // Timing
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  previewStart: Date,
  previewEnd: Date,
  
  // Status
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'preview', 'active', 'ended', 'cancelled'],
    default: 'draft'
  },
  
  // Items in auction
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  }],
  featuredItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  }],
  
  // Organizer information
  auctioneer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  auctionHouse: {
    name: String,
    license: String,
    address: String,
    contact: String
  },
  
  // Visual presentation
  banner: {
    url: String,
    publicId: String
  },
  gallery: [{
    url: String,
    publicId: String,
    caption: String
  }],
  
  // Participation settings
  registrationRequired: {
    type: Boolean,
    default: true
  },
  minimumDeposit: {
    type: Number,
    default: 0
  },
  bidderApproval: {
    type: Boolean,
    default: false
  },
  
  // Statistics
  totalItems: {
    type: Number,
    default: 0
  },
  totalValue: {
    type: Number,
    default: 0
  },
  soldItems: {
    type: Number,
    default: 0
  },
  soldValue: {
    type: Number,
    default: 0
  },
  totalBids: {
    type: Number,
    default: 0
  },
  uniqueBidders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Special features for themed auctions
  specialFeatures: {
    timeCapsule: {
      isTimeCapsule: {
        type: Boolean,
        default: false
      },
      era: String,
      theme: String,
      historicalContext: String
    },
    mystery: {
      hasMysteryItems: {
        type: Boolean,
        default: false
      },
      mysteryBoxes: [{
        title: String,
        hints: [String],
        estimatedValue: {
          min: Number,
          max: Number
        },
        revealDate: Date
      }]
    },
    vr: {
      hasVRExperience: {
        type: Boolean,
        default: false
      },
      vrRoomUrl: String,
      arModels: [{
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Item'
        },
        modelUrl: String
      }]
    }
  },
  
  // Social features
  followers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    followedAt: {
      type: Date,
      default: Date.now
    }
  }],
  shares: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  
  // Terms and conditions
  terms: {
    buyerPremium: {
      type: Number,
      default: 10 // percentage
    },
    paymentTerms: String,
    shippingPolicy: String,
    returnPolicy: String,
    disputeResolution: String
  },
  
  // Notifications and reminders
  notifications: {
    reminderSent: {
      type: Boolean,
      default: false
    },
    startNotificationSent: {
      type: Boolean,
      default: false
    },
    endingNotificationSent: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Virtual for auction duration
auctionSchema.virtual('duration').get(function() {
  return this.endDate.getTime() - this.startDate.getTime();
});

// Virtual for time remaining
auctionSchema.virtual('timeRemaining').get(function() {
  if (this.status !== 'active') return 0;
  const now = new Date();
  return Math.max(0, this.endDate.getTime() - now.getTime());
});

// Virtual for success rate
auctionSchema.virtual('successRate').get(function() {
  if (this.totalItems === 0) return 0;
  return Math.round((this.soldItems / this.totalItems) * 100);
});

// Pre-save middleware
auctionSchema.pre('save', function(next) {
  // Update total items count
  if (this.items) {
    this.totalItems = this.items.length;
  }
  next();
});

// Method to add item to auction
auctionSchema.methods.addItem = function(itemId) {
  if (!this.items.includes(itemId)) {
    this.items.push(itemId);
    this.totalItems = this.items.length;
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to remove item from auction
auctionSchema.methods.removeItem = function(itemId) {
  this.items = this.items.filter(item => item.toString() !== itemId.toString());
  this.featuredItems = this.featuredItems.filter(item => item.toString() !== itemId.toString());
  this.totalItems = this.items.length;
  return this.save();
};

// Method to add follower
auctionSchema.methods.addFollower = function(userId) {
  const existingFollower = this.followers.find(f => f.user.toString() === userId.toString());
  if (!existingFollower) {
    this.followers.push({ user: userId });
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to remove follower
auctionSchema.methods.removeFollower = function(userId) {
  this.followers = this.followers.filter(f => f.user.toString() !== userId.toString());
  return this.save();
};

// Method to increment views
auctionSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to update statistics
auctionSchema.methods.updateStatistics = async function() {
  const Item = mongoose.model('Item');
  const items = await Item.find({ _id: { $in: this.items } });
  
  this.totalValue = items.reduce((sum, item) => sum + (item.currentBid || item.startingPrice), 0);
  this.soldItems = items.filter(item => item.status === 'sold').length;
  this.soldValue = items
    .filter(item => item.status === 'sold')
    .reduce((sum, item) => sum + (item.finalPrice || 0), 0);
  
  return this.save();
};

// Static method to find upcoming auctions
auctionSchema.statics.findUpcoming = function(limit = 10) {
  const now = new Date();
  return this.find({
    status: { $in: ['scheduled', 'preview'] },
    startDate: { $gte: now }
  })
  .sort({ startDate: 1 })
  .limit(limit)
  .populate('featuredItems', 'title images startingPrice currentBid');
};

// Static method to find active auctions
auctionSchema.statics.findActive = function() {
  return this.find({ status: 'active' })
    .sort({ endDate: 1 })
    .populate('featuredItems', 'title images startingPrice currentBid timeRemaining');
};

// Static method to find themed auctions
auctionSchema.statics.findByTheme = function(theme) {
  return this.find({
    type: 'themed',
    'theme.name': { $regex: theme, $options: 'i' }
  })
  .sort({ startDate: -1 });
};

// Static method to find time capsule auctions
auctionSchema.statics.findTimeCapsule = function() {
  return this.find({
    type: 'time_capsule',
    'specialFeatures.timeCapsule.isTimeCapsule': true
  })
  .sort({ startDate: -1 });
};

// Indexes
auctionSchema.index({ status: 1, startDate: 1 });
auctionSchema.index({ endDate: 1, status: 1 });
auctionSchema.index({ auctioneer: 1 });
auctionSchema.index({ type: 1, 'theme.name': 1 });
auctionSchema.index({ createdAt: -1 });
auctionSchema.index({ 'specialFeatures.timeCapsule.isTimeCapsule': 1 });

const Auction = mongoose.model('Auction', auctionSchema);

export default Auction;