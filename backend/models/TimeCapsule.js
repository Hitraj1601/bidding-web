import mongoose from 'mongoose';

const timeCapsuleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  era: {
    type: String,
    required: true
  },
  period: {
    type: String,
    required: true,
    enum: ['ancient', 'medieval', 'renaissance', 'industrial', 'modern']
  },
  description: {
    type: String,
    required: true
  },
  currentBid: {
    type: Number,
    default: 0
  },
  startingBid: {
    type: Number,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  images: [{
    type: String,
    required: true
  }],
  bidCount: {
    type: Number,
    default: 0
  },
  significance: {
    type: String,
    required: true
  },
  provenance: {
    type: String,
    required: true
  },
  rarity: {
    type: String,
    enum: ['Common', 'Uncommon', 'Rare', 'Very Rare', 'Extremely Rare', 'Unique', 'Museum Quality'],
    required: true
  },
  culturalImpact: {
    type: Number,
    min: 1,
    max: 10,
    required: true
  },
  historicalImportance: {
    type: String,
    required: true
  },
  expert: {
    type: String,
    required: true
  },
  authentication: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  discoveryStory: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'active', 'ended', 'sold'],
    default: 'upcoming'
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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

// Add indexes for better query performance
timeCapsuleSchema.index({ period: 1, status: 1 });
timeCapsuleSchema.index({ endTime: 1 });
timeCapsuleSchema.index({ featured: 1, status: 1 });

export default mongoose.model('TimeCapsule', timeCapsuleSchema);