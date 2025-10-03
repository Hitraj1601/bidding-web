import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Workshop', 'Meetup', 'Lecture', 'Webinar', 'Conference', 'Exhibition']
  },
  format: {
    type: String,
    required: true,
    enum: ['Virtual', 'In-Person', 'Hybrid']
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: function() {
      return this.format === 'In-Person' || this.format === 'Hybrid';
    }
  },
  virtualLink: {
    type: String,
    required: function() {
      return this.format === 'Virtual' || this.format === 'Hybrid';
    }
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  maxAttendees: {
    type: Number,
    required: true
  },
  attendees: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    registeredAt: {
      type: Date,
      default: Date.now
    },
    attended: {
      type: Boolean,
      default: false
    }
  }],
  price: {
    type: String,
    required: true,
    default: 'Free'
  },
  category: {
    type: String,
    required: true,
    enum: ['Education', 'Social', 'Professional', 'Cultural', 'Technical']
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels', 'Beginner to Intermediate']
  },
  tags: [{
    type: String,
    trim: true
  }],
  requirements: [{
    type: String
  }],
  whatYouWillLearn: [{
    type: String
  }],
  materials: [{
    type: String
  }],
  image: {
    type: String
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Virtual for attendee count
eventSchema.virtual('attendeeCount').get(function() {
  return this.attendees.length;
});

// Virtual for availability
eventSchema.virtual('spotsAvailable').get(function() {
  return this.maxAttendees - this.attendees.length;
});

// Add indexes for better query performance
eventSchema.index({ date: 1, status: 1 });
eventSchema.index({ type: 1, format: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ featured: 1, status: 1 });

export default mongoose.model('Event', eventSchema);