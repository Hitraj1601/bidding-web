import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
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
  category: {
    type: String,
    required: true,
    enum: ['Ancient', 'Medieval', 'Renaissance', 'Victorian', 'Art Deco', 'Modern', 'Coins', 'Jewelry', 'Furniture', 'Art', 'Books', 'Ceramics', 'Textiles', 'Weapons', 'Tools', 'Other']
  },
  subcategory: {
    type: String,
    trim: true
  },
  
  // Basic item information
  era: {
    type: String,
    required: true
  },
  origin: {
    country: String,
    region: String,
    city: String
  },
  materials: [{
    type: String
  }],
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    weight: Number,
    unit: {
      type: String,
      enum: ['cm', 'in', 'mm'],
      default: 'cm'
    }
  },
  condition: {
    type: String,
    enum: ['Mint', 'Excellent', 'Very Good', 'Good', 'Fair', 'Poor', 'Restoration Required'],
    required: true
  },
  
  // Images and media
  images: [{
    url: String,
    publicId: String,
    caption: String,
    isMain: {
      type: Boolean,
      default: false
    }
  }],
  videos: [{
    url: String,
    publicId: String,
    caption: String
  }],

  
  // Seller information
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  consignor: {
    name: String,
    contact: String,
    verified: {
      type: Boolean,
      default: false
    }
  },
  
  // Pricing and bidding
  startingPrice: {
    type: Number,
    required: true,
    min: 0
  },
  reservePrice: {
    type: Number,
    min: 0
  },
  currentBid: {
    type: Number,
    default: 0
  },
  bidIncrement: {
    type: Number,
    default: 10
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'INR']
  },
  
  // Auction details
  auctionType: {
    type: String,
    enum: ['standard', 'reserve', 'no-reserve', 'mystery', 'timed', 'live'],
    default: 'standard'
  },
  auctionStart: {
    type: Date,
    required: true
  },
  auctionEnd: {
    type: Date,
    required: true
  },
  extendOnBid: {
    type: Boolean,
    default: true
  },
  extensionTime: {
    type: Number,
    default: 300000 // 5 minutes in milliseconds
  },
  
  // Status
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'active', 'ended', 'sold', 'unsold', 'cancelled'],
    default: 'draft'
  },
  isSpotlight: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  // Authentication and provenance
  authenticity: {
    isAuthenticated: {
      type: Boolean,
      default: false
    },
    authenticator: String,
    certificate: {
      url: String,
      publicId: String
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  provenance: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provenance'
  }],
  

  
  // Social features
  views: {
    type: Number,
    default: 0
  },
  favorites: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  shares: {
    type: Number,
    default: 0
  },
  
  // Bidding activity
  totalBids: {
    type: Number,
    default: 0
  },
  uniqueBidders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Winner information
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  finalPrice: Number,
  hammeredAt: Date,
  
  // Shipping and handling
  shipping: {
    included: {
      type: Boolean,
      default: false
    },
    cost: Number,
    international: {
      type: Boolean,
      default: false
    },
    restrictions: [String],
    packaging: String,
    insurance: {
      type: Boolean,
      default: true
    }
  },
  
  // Special features
  mystery: {
    isMysterious: {
      type: Boolean,
      default: false
    },
    revealedAt: Date,
    hints: [String]
  },
  
  // Fraud detection
  fraudFlags: [{
    type: String,
    reason: String,
    flaggedAt: {
      type: Date,
      default: Date.now
    },
    flaggedBy: String
  }],
  
  // Related items
  relatedItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  }],
  
  // Tags and keywords
  tags: [String],
  keywords: [String],
  
  // Admin notes
  adminNotes: [{
    note: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Virtual for time remaining
itemSchema.virtual('timeRemaining').get(function() {
  if (this.status !== 'active') return 0;
  const now = new Date();
  const end = new Date(this.auctionEnd);
  return Math.max(0, end.getTime() - now.getTime());
});

// Virtual for days since created
itemSchema.virtual('daysSinceCreated').get(function() {
  const now = new Date();
  const created = new Date(this.createdAt);
  return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
});

// Virtual for bid count
itemSchema.virtual('bidCount').get(function() {
  return this.totalBids;
});

// Pre-save middleware
itemSchema.pre('save', function(next) {
  // Ensure at least one main image
  if (this.images && this.images.length > 0) {
    const hasMain = this.images.some(img => img.isMain);
    if (!hasMain) {
      this.images[0].isMain = true;
    }
  }
  
  // Auto-generate keywords from title and description
  if (this.isModified('title') || this.isModified('description')) {
    const text = `${this.title} ${this.description}`.toLowerCase();
    const words = text.match(/\b\w{4,}\b/g) || [];
    this.keywords = [...new Set(words)];
  }
  
  next();
});

// Method to increment view count
itemSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to add to favorites
itemSchema.methods.addToFavorites = function(userId) {
  const existingFavorite = this.favorites.find(fav => fav.user.toString() === userId.toString());
  if (!existingFavorite) {
    this.favorites.push({ user: userId });
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to remove from favorites
itemSchema.methods.removeFromFavorites = function(userId) {
  this.favorites = this.favorites.filter(fav => fav.user.toString() !== userId.toString());
  return this.save();
};

// Method to check if auction is active
itemSchema.methods.isAuctionActive = function() {
  const now = new Date();
  return this.status === 'active' && 
         now >= this.auctionStart && 
         now <= this.auctionEnd;
};

// Method to extend auction
itemSchema.methods.extendAuction = function(milliseconds = this.extensionTime) {
  if (this.extendOnBid && this.isAuctionActive()) {
    this.auctionEnd = new Date(this.auctionEnd.getTime() + milliseconds);
    return this.save();
  }
  return Promise.resolve(this);
};

// Static method to find ending soon
itemSchema.statics.findEndingSoon = function(hours = 24) {
  const now = new Date();
  const endTime = new Date(now.getTime() + (hours * 60 * 60 * 1000));
  
  return this.find({
    status: 'active',
    auctionEnd: { $lte: endTime, $gte: now }
  }).sort({ auctionEnd: 1 });
};

// Static method to find by category with filters
itemSchema.statics.findWithFilters = function(filters = {}) {
  const query = {};
  
  if (filters.category) query.category = filters.category;
  if (filters.era) query.era = { $regex: filters.era, $options: 'i' };
  if (filters.origin) query['origin.country'] = { $regex: filters.origin, $options: 'i' };
  if (filters.condition) query.condition = filters.condition;
  if (filters.minPrice) query.currentBid = { $gte: filters.minPrice };
  if (filters.maxPrice) {
    if (!query.currentBid) query.currentBid = {};
    query.currentBid.$lte = filters.maxPrice;
  }
  if (filters.status) query.status = filters.status;
  if (filters.search) {
    query.$text = { $search: filters.search };
  }
  
  return this.find(query);
};

// Indexes for performance
itemSchema.index({ title: 'text', description: 'text', keywords: 'text' });
itemSchema.index({ category: 1, status: 1 });
itemSchema.index({ auctionEnd: 1, status: 1 });
itemSchema.index({ seller: 1 });
itemSchema.index({ currentBid: 1 });
itemSchema.index({ createdAt: -1 });
itemSchema.index({ views: -1 });
itemSchema.index({ 'origin.country': 1 });
itemSchema.index({ era: 1 });
itemSchema.index({ condition: 1 });
itemSchema.index({ tags: 1 });

const Item = mongoose.model('Item', itemSchema);

export default Item;