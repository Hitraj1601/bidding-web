import mongoose from 'mongoose';

const mysteryBidSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['celebrity', 'historical', 'royalty', 'archaeological', 'artistic', 'scientific']
  },
  mysteryLevel: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'extreme']
  },
  hint: {
    type: String,
    required: true
  },
  clues: [{
    type: String,
    required: true
  }],
  revealProgress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  currentBids: {
    type: Number,
    default: 0
  },
  bidsNeeded: {
    type: Number,
    required: true
  },
  minimumBid: {
    type: Number,
    required: true
  },
  totalValue: {
    type: String,
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
  potentialItems: [{
    type: String,
    required: true
  }],
  expertVerification: {
    type: Boolean,
    default: false
  },
  suspenseRating: {
    type: Number,
    min: 1,
    max: 10,
    required: true
  },
  participantCount: {
    type: Number,
    default: 0
  },
  averageBid: {
    type: Number,
    default: 0
  },
  topBidders: {
    type: Number,
    default: 0
  },
  reputationRequired: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum'],
    default: 'bronze'
  },
  mysteryPoints: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'active', 'revealed', 'ended'],
    default: 'upcoming'
  },
  revealedItems: [{
    name: String,
    description: String,
    estimatedValue: Number,
    image: String
  }],
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
mysteryBidSchema.index({ category: 1, status: 1 });
mysteryBidSchema.index({ mysteryLevel: 1 });
mysteryBidSchema.index({ endTime: 1 });
mysteryBidSchema.index({ featured: 1, status: 1 });

export default mongoose.model('MysteryBid', mysteryBidSchema);