import mongoose from 'mongoose';

const restorationProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Furniture', 'Ceramics', 'Textiles', 'Metalwork', 'Glass', 'Paintings', 'Books & Paper', 'Other'],
    required: true
  },
  condition: {
    type: String,
    enum: ['Excellent', 'Good - Minor Damage', 'Fair - Moderate Damage', 'Poor - Major Damage', 'Critical'],
    required: true
  },
  budget: {
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
  timeline: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  postedBy: {
    type: String,
    required: true
  },
  postedDate: {
    type: Date,
    default: Date.now
  },
  images: [{
    type: String
  }],
  issues: [{
    type: String
  }],
  proposalCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Open'
  },
  urgency: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  materials: {
    type: String
  },
  dimensions: {
    type: String
  },
  age: {
    type: String
  },
  preferredExpert: {
    type: String
  },
  assignedExpert: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RestorationExpert'
  },
  completedDate: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
restorationProjectSchema.index({ category: 1 });
restorationProjectSchema.index({ status: 1 });
restorationProjectSchema.index({ urgency: 1 });
restorationProjectSchema.index({ postedDate: -1 });
restorationProjectSchema.index({ location: 1 });

export default mongoose.model('RestorationProject', restorationProjectSchema);