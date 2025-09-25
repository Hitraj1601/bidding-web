import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema({
  bidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  maxBid: {
    type: Number, // For proxy bidding
    min: 0
  },
  type: {
    type: String,
    enum: ['standard', 'proxy', 'reserve', 'mystery'],
    default: 'standard'
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'INR']
  },
  
  // Bidding context
  bidMethod: {
    type: String,
    enum: ['web', 'mobile', 'phone', 'absentee'],
    default: 'web'
  },
  isAutoBid: {
    type: Boolean,
    default: false
  },
  isProxyBid: {
    type: Boolean,
    default: false
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'outbid', 'winning', 'won', 'lost', 'cancelled', 'invalid'],
    default: 'active'
  },
  isWinning: {
    type: Boolean,
    default: false
  },
  
  // Timing
  placedAt: {
    type: Date,
    default: Date.now
  },
  validUntil: Date,
  
  // IP and device tracking for fraud detection
  ipAddress: String,
  userAgent: String,
  deviceFingerprint: String,
  location: {
    country: String,
    region: String,
    city: String,
    coordinates: [Number] // [longitude, latitude]
  },
  
  // Fraud detection flags
  fraudScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  fraudFlags: [{
    type: String,
    reason: String,
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical']
    },
    flaggedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Bidding behavior analysis
  bidPattern: {
    timeBetweenBids: [Number], // Array of milliseconds between bids
    avgBidTime: Number, // Average time to place bid
    quickBids: Number, // Number of bids placed within 10 seconds
    lastMinuteBids: Number, // Number of bids in last minute
    bidIncreasePattern: [Number] // Pattern of bid increases
  },
  
  // Related bids (for detecting shill bidding)
  relatedBids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bid'
  }],
  
  // Administrative
  notes: [{
    note: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Verification
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: Date
}, {
  timestamps: true
});

// Virtual for bid age in minutes
bidSchema.virtual('ageInMinutes').get(function() {
  const now = new Date();
  const placed = new Date(this.placedAt);
  return Math.floor((now.getTime() - placed.getTime()) / (1000 * 60));
});

// Virtual for time until expiry
bidSchema.virtual('timeUntilExpiry').get(function() {
  if (!this.validUntil) return null;
  const now = new Date();
  const expiry = new Date(this.validUntil);
  return Math.max(0, expiry.getTime() - now.getTime());
});

// Pre-save middleware
bidSchema.pre('save', function(next) {
  // Set validUntil if not set (24 hours from now)
  if (!this.validUntil) {
    this.validUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);
  }
  
  // Calculate fraud score based on various factors
  this.calculateFraudScore();
  
  next();
});

// Method to calculate fraud score
bidSchema.methods.calculateFraudScore = function() {
  let score = 0;
  
  // Quick succession of bids
  if (this.bidPattern && this.bidPattern.quickBids > 3) {
    score += 15;
  }
  
  // Unusual bid amounts (exactly rounded numbers)
  if (this.amount % 100 === 0 && this.amount > 500) {
    score += 10;
  }
  
  // Last minute bidding pattern
  if (this.bidPattern && this.bidPattern.lastMinuteBids > 5) {
    score += 20;
  }
  
  // Multiple bids from same IP
  // This would need to be calculated at the application level
  
  this.fraudScore = Math.min(100, score);
};

// Method to add fraud flag
bidSchema.methods.addFraudFlag = function(type, reason, severity = 'medium') {
  this.fraudFlags.push({
    type,
    reason,
    severity
  });
  
  // Increase fraud score based on severity
  const severityScores = { low: 5, medium: 15, high: 25, critical: 50 };
  this.fraudScore = Math.min(100, this.fraudScore + severityScores[severity]);
  
  return this.save();
};

// Method to check if bid is still valid
bidSchema.methods.isValid = function() {
  if (this.status === 'cancelled' || this.status === 'invalid') return false;
  if (this.validUntil && new Date() > this.validUntil) return false;
  return true;
};

// Method to update bid pattern
bidSchema.methods.updateBidPattern = function(timeBetweenBids, isQuick, isLastMinute, bidIncrease) {
  if (!this.bidPattern) {
    this.bidPattern = {
      timeBetweenBids: [],
      avgBidTime: 0,
      quickBids: 0,
      lastMinuteBids: 0,
      bidIncreasePattern: []
    };
  }
  
  if (timeBetweenBids !== undefined) {
    this.bidPattern.timeBetweenBids.push(timeBetweenBids);
    // Keep only last 10 entries
    if (this.bidPattern.timeBetweenBids.length > 10) {
      this.bidPattern.timeBetweenBids.shift();
    }
    // Recalculate average
    this.bidPattern.avgBidTime = this.bidPattern.timeBetweenBids.reduce((a, b) => a + b, 0) / this.bidPattern.timeBetweenBids.length;
  }
  
  if (isQuick) this.bidPattern.quickBids += 1;
  if (isLastMinute) this.bidPattern.lastMinuteBids += 1;
  
  if (bidIncrease !== undefined) {
    this.bidPattern.bidIncreasePattern.push(bidIncrease);
    // Keep only last 10 entries
    if (this.bidPattern.bidIncreasePattern.length > 10) {
      this.bidPattern.bidIncreasePattern.shift();
    }
  }
  
  return this.save();
};

// Static method to find suspicious bidding patterns
bidSchema.statics.findSuspiciousBids = function(threshold = 50) {
  return this.find({
    fraudScore: { $gte: threshold },
    status: { $in: ['active', 'winning'] }
  }).populate('bidder item');
};

// Static method to get bidding history for an item
bidSchema.statics.getItemBidHistory = function(itemId, limit = 50) {
  return this.find({ item: itemId })
    .sort({ placedAt: -1 })
    .limit(limit)
    .populate('bidder', 'username firstName lastName avatar')
    .select('amount placedAt status type bidMethod isWinning');
};

// Static method to get user's bidding history
bidSchema.statics.getUserBidHistory = function(userId, limit = 50) {
  return this.find({ bidder: userId })
    .sort({ placedAt: -1 })
    .limit(limit)
    .populate('item', 'title images currentBid status auctionEnd')
    .select('amount placedAt status type isWinning item');
};

// Static method to find potential shill bidders
bidSchema.statics.findPotentialShillBidders = function(itemId) {
  return this.aggregate([
    { $match: { item: mongoose.Types.ObjectId(itemId) } },
    {
      $group: {
        _id: '$bidder',
        bidCount: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        avgFraudScore: { $avg: '$fraudScore' },
        bids: { $push: '$$ROOT' }
      }
    },
    {
      $match: {
        $or: [
          { bidCount: { $gte: 10 } }, // Many bids on same item
          { avgFraudScore: { $gte: 30 } } // High average fraud score
        ]
      }
    },
    { $sort: { avgFraudScore: -1 } }
  ]);
};

// Indexes for performance and queries
bidSchema.index({ item: 1, placedAt: -1 });
bidSchema.index({ bidder: 1, placedAt: -1 });
bidSchema.index({ amount: -1 });
bidSchema.index({ status: 1, placedAt: -1 });
bidSchema.index({ fraudScore: -1 });
bidSchema.index({ isWinning: 1, status: 1 });
bidSchema.index({ placedAt: -1 });
bidSchema.index({ 'location.coordinates': '2dsphere' });

const Bid = mongoose.model('Bid', bidSchema);

export default Bid;