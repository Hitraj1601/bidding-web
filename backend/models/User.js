import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      return this.authProvider === 'local';
    },
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: function() {
      return this.authProvider === 'local';
    },
    trim: true
  },
  avatar: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'collector', 'restorer', 'admin'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  
  // OAuth fields
  googleId: {
    type: String,
    unique: true,
    sparse: true // Allow null values to be non-unique
  },
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },
  profilePicture: {
    type: String
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  
  // Profile information
  bio: {
    type: String,
    maxlength: 500
  },
  location: {
    country: String,
    city: String,
    address: String
  },
  phone: {
    type: String,
    trim: true
  },
  
  // Collector-specific fields
  specializations: [{
    type: String,
    enum: ['Ancient', 'Medieval', 'Renaissance', 'Victorian', 'Art Deco', 'Modern', 'Coins', 'Jewelry', 'Furniture', 'Art', 'Books', 'Ceramics', 'Other']
  }],
  experienceLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Expert', 'Professional'],
    default: 'Beginner'
  },
  
  // Gamification
  badges: [{
    name: String,
    description: String,
    icon: String,
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }],
  points: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  
  // Bidding history
  totalBids: {
    type: Number,
    default: 0
  },
  successfulBids: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0
  },
  
  // Social features
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Preferences
  notifications: {
    email: {
      type: Boolean,
      default: true
    },
    push: {
      type: Boolean,
      default: true
    },
    bidUpdates: {
      type: Boolean,
      default: true
    },
    auctionReminders: {
      type: Boolean,
      default: true
    }
  },
  
  // Security
  refreshTokens: [{
    token: String,
    createdAt: {
      type: Date,
      default: Date.now,
      expires: '7d'
    }
  }],
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  
  // Payment information
  stripeCustomerId: String,
  paymentMethods: [{
    id: String,
    type: String,
    last4: String,
    brand: String,
    isDefault: Boolean
  }]
}, {
  timestamps: true
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for account lock status
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to increment login attempts
userSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: {
        lockUntil: 1
      },
      $set: {
        loginAttempts: 1
      }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = {
      lockUntil: Date.now() + 2 * 60 * 60 * 1000 // 2 hours
    };
  }
  
  return this.updateOne(updates);
};

// Method to add badge
userSchema.methods.addBadge = function(badgeData) {
  const existingBadge = this.badges.find(badge => badge.name === badgeData.name);
  if (!existingBadge) {
    this.badges.push(badgeData);
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to calculate level based on points
userSchema.methods.updateLevel = function() {
  const newLevel = Math.floor(this.points / 1000) + 1;
  if (newLevel > this.level) {
    this.level = newLevel;
    return this.save();
  }
  return Promise.resolve(this);
};

// Indexes (email and username already have unique indexes)
userSchema.index({ 'location.country': 1, 'location.city': 1 });
userSchema.index({ specializations: 1 });
userSchema.index({ points: -1 });
userSchema.index({ level: -1 });

const User = mongoose.model('User', userSchema);

export default User;