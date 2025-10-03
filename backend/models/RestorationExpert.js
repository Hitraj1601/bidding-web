import mongoose from 'mongoose';

const restorationExpertSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  specialties: [{
    type: String,
    required: true
  }],
  location: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  hourlyRate: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  avatar: {
    type: String,
    default: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200'
  },
  verified: {
    type: Boolean,
    default: false
  },
  availability: {
    type: String,
    enum: ['Available', 'Busy - 1 week wait', 'Busy - 2 week wait', 'Busy - 1 month wait', 'Unavailable'],
    default: 'Available'
  },
  completedProjects: {
    type: Number,
    default: 0
  },
  responseTime: {
    type: String,
    default: 'Within 24 hours'
  },
  languages: [{
    type: String
  }],
  certifications: [{
    type: String
  }],
  portfolio: [{
    type: String
  }],
  bio: {
    type: String
  },
  recentProjects: [{
    type: String
  }],
  priceRange: {
    type: String,
    enum: ['Budget', 'Medium', 'High', 'Premium'],
    default: 'Medium'
  },
  insurance: {
    type: Boolean,
    default: false
  },
  guarantee: {
    type: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
restorationExpertSchema.index({ specialties: 1 });
restorationExpertSchema.index({ location: 1 });
restorationExpertSchema.index({ rating: -1 });
restorationExpertSchema.index({ verified: 1 });
restorationExpertSchema.index({ status: 1 });

export default mongoose.model('RestorationExpert', restorationExpertSchema);