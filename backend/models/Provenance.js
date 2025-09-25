import mongoose from 'mongoose';

const provenanceSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  
  // Ownership history
  ownershipHistory: [{
    owner: {
      name: {
        type: String,
        required: true
      },
      type: {
        type: String,
        enum: ['private', 'institution', 'museum', 'gallery', 'estate', 'auction_house', 'dealer'],
        required: true
      },
      contact: String,
      location: {
        country: String,
        region: String,
        city: String
      }
    },
    period: {
      from: Date,
      to: Date,
      estimated: {
        type: Boolean,
        default: false
      }
    },
    acquisitionMethod: {
      type: String,
      enum: ['purchase', 'inheritance', 'gift', 'commission', 'discovery', 'auction', 'trade', 'unknown'],
      required: true
    },
    acquisitionPrice: {
      amount: Number,
      currency: String,
      inflationAdjusted: Number
    },
    documentation: [{
      type: {
        type: String,
        enum: ['receipt', 'certificate', 'insurance', 'photo', 'letter', 'catalog', 'exhibition', 'publication', 'restoration_record']
      },
      title: String,
      description: String,
      date: Date,
      url: String,
      publicId: String,
      verified: {
        type: Boolean,
        default: false
      }
    }],
    notes: String,
    significance: String // Why this ownership period is important
  }],
  
  // Creation and origin
  creation: {
    artist: {
      name: String,
      biography: String,
      nationality: String,
      lifespan: {
        birth: Date,
        death: Date
      }
    },
    maker: {
      name: String,
      workshop: String,
      location: {
        country: String,
        region: String,
        city: String
      }
    },
    dateCreated: {
      exact: Date,
      circa: Date,
      period: String,
      century: String,
      estimated: {
        type: Boolean,
        default: true
      }
    },
    location: {
      country: String,
      region: String,
      city: String,
      coordinates: [Number] // [longitude, latitude]
    },
    technique: String,
    purpose: String // Original purpose or function
  },
  
  // Historical significance
  historicalContext: {
    period: String,
    events: [String], // Related historical events
    significance: String,
    culturalImportance: String
  },
  
  // Exhibition history
  exhibitions: [{
    institution: String,
    title: String,
    location: {
      country: String,
      city: String,
      venue: String
    },
    dates: {
      start: Date,
      end: Date
    },
    catalog: {
      title: String,
      isbn: String,
      pageNumber: String,
      url: String
    },
    significance: String
  }],
  
  // Publications and references
  publications: [{
    type: {
      type: String,
      enum: ['book', 'article', 'catalog', 'journal', 'newspaper', 'online', 'thesis']
    },
    title: String,
    author: String,
    publication: String,
    date: Date,
    pageNumbers: String,
    isbn: String,
    url: String,
    description: String,
    importance: {
      type: String,
      enum: ['primary', 'secondary', 'reference']
    }
  }],
  
  // Restoration and conservation history
  conservationHistory: [{
    restorer: {
      name: String,
      credentials: String,
      institution: String,
      contact: String
    },
    date: Date,
    type: {
      type: String,
      enum: ['cleaning', 'repair', 'restoration', 'conservation', 'analysis', 'documentation']
    },
    description: String,
    materials: [String],
    techniques: [String],
    beforeCondition: String,
    afterCondition: String,
    documentation: [{
      type: {
        type: String,
        enum: ['report', 'photos', 'xray', 'uv', 'microscopy', 'analysis']
      },
      url: String,
      publicId: String,
      description: String
    }],
    cost: {
      amount: Number,
      currency: String
    },
    notes: String
  }],
  
  // Authentication and certificates
  authentication: {
    certificates: [{
      issuer: String,
      type: {
        type: String,
        enum: ['authenticity', 'age', 'origin', 'condition', 'insurance', 'export']
      },
      number: String,
      issueDate: Date,
      expiryDate: Date,
      url: String,
      publicId: String,
      verified: {
        type: Boolean,
        default: false
      },
      verifiedBy: String,
      verifiedAt: Date
    }],
    scientificAnalysis: [{
      type: {
        type: String,
        enum: ['carbon_dating', 'thermoluminescence', 'xrf', 'xrd', 'microscopy', 'uv', 'infrared', 'raman']
      },
      laboratory: String,
      date: Date,
      results: String,
      confidence: {
        type: Number,
        min: 0,
        max: 100
      },
      documentation: [{
        url: String,
        publicId: String,
        description: String
      }]
    }]
  },
  
  // Legal and ethical considerations
  legalStatus: {
    isLegal: {
      type: Boolean,
      default: true
    },
    exportPermits: [{
      country: String,
      permitNumber: String,
      issueDate: Date,
      expiryDate: Date,
      url: String,
      publicId: String
    }],
    importDocuments: [{
      country: String,
      documentType: String,
      number: String,
      date: Date,
      url: String,
      publicId: String
    }],
    culturalProperty: {
      isProtected: {
        type: Boolean,
        default: false
      },
      jurisdiction: String,
      protectionLevel: String,
      restrictions: [String]
    },
    restitution: {
      hasClaims: {
        type: Boolean,
        default: false
      },
      claims: [{
        claimant: String,
        basis: String,
        status: String,
        notes: String
      }]
    }
  },
  
  // Digital provenance (blockchain integration)
  blockchain: {
    enabled: {
      type: Boolean,
      default: false
    },
    network: String, // e.g., 'ethereum', 'polygon'
    tokenId: String,
    contractAddress: String,
    transactions: [{
      hash: String,
      type: {
        type: String,
        enum: ['mint', 'transfer', 'update', 'burn']
      },
      from: String,
      to: String,
      timestamp: Date,
      blockNumber: Number
    }]
  },
  
  // Verification and trust scores
  verification: {
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    documentationScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    ownershipScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    authenticityScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    lastVerified: Date,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verificationNotes: String
  },
  
  // Research and investigations
  research: {
    gaps: [String], // Known gaps in provenance
    investigations: [{
      researcher: String,
      institution: String,
      startDate: Date,
      endDate: Date,
      objective: String,
      findings: String,
      documentation: [{
        url: String,
        publicId: String,
        description: String
      }]
    }],
    mysteries: [String], // Unresolved questions
    leads: [String] // Potential research leads
  },
  
  // Administrative
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  confidentialNotes: String, // Only visible to admin and owner
  
  // Access control
  accessLevel: {
    type: String,
    enum: ['public', 'registered', 'verified', 'institutional', 'private'],
    default: 'public'
  },
  viewers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    accessLevel: String,
    grantedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    grantedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Virtual for completeness percentage
provenanceSchema.virtual('completeness').get(function() {
  let score = 0;
  let maxScore = 0;
  
  // Check ownership history
  maxScore += 30;
  if (this.ownershipHistory && this.ownershipHistory.length > 0) {
    score += Math.min(30, this.ownershipHistory.length * 5);
  }
  
  // Check creation info
  maxScore += 20;
  if (this.creation) {
    if (this.creation.artist && this.creation.artist.name) score += 5;
    if (this.creation.dateCreated) score += 5;
    if (this.creation.location) score += 5;
    if (this.creation.technique) score += 5;
  }
  
  // Check exhibitions
  maxScore += 15;
  if (this.exhibitions && this.exhibitions.length > 0) {
    score += Math.min(15, this.exhibitions.length * 3);
  }
  
  // Check publications
  maxScore += 15;
  if (this.publications && this.publications.length > 0) {
    score += Math.min(15, this.publications.length * 3);
  }
  
  // Check authentication
  maxScore += 20;
  if (this.authentication && this.authentication.certificates && this.authentication.certificates.length > 0) {
    score += Math.min(20, this.authentication.certificates.length * 5);
  }
  
  return Math.round((score / maxScore) * 100);
});

// Virtual for trust level
provenanceSchema.virtual('trustLevel').get(function() {
  const score = this.verification.overallScore;
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Very Good';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Poor';
});

// Pre-save middleware to calculate verification scores
provenanceSchema.pre('save', function(next) {
  this.calculateVerificationScores();
  next();
});

// Method to calculate verification scores
provenanceSchema.methods.calculateVerificationScores = function() {
  let docScore = 0;
  let ownerScore = 0;
  let authScore = 0;
  
  // Documentation score
  const totalDocs = this.ownershipHistory.reduce((count, owner) => 
    count + (owner.documentation ? owner.documentation.length : 0), 0);
  docScore = Math.min(100, totalDocs * 5);
  
  // Ownership score
  if (this.ownershipHistory && this.ownershipHistory.length > 0) {
    const verifiedOwners = this.ownershipHistory.filter(owner => 
      owner.documentation && owner.documentation.some(doc => doc.verified));
    ownerScore = Math.min(100, (verifiedOwners.length / this.ownershipHistory.length) * 100);
  }
  
  // Authenticity score
  if (this.authentication && this.authentication.certificates) {
    const verifiedCerts = this.authentication.certificates.filter(cert => cert.verified);
    if (this.authentication.certificates.length > 0) {
      authScore = Math.min(100, (verifiedCerts.length / this.authentication.certificates.length) * 100);
    }
  }
  
  // Scientific analysis bonus
  if (this.authentication && this.authentication.scientificAnalysis && this.authentication.scientificAnalysis.length > 0) {
    authScore += Math.min(20, this.authentication.scientificAnalysis.length * 5);
  }
  
  this.verification.documentationScore = Math.round(docScore);
  this.verification.ownershipScore = Math.round(ownerScore);
  this.verification.authenticityScore = Math.round(Math.min(100, authScore));
  
  // Overall score (weighted average)
  this.verification.overallScore = Math.round(
    (docScore * 0.3 + ownerScore * 0.4 + authScore * 0.3)
  );
  
  this.verification.lastVerified = new Date();
};

// Method to add ownership record
provenanceSchema.methods.addOwnershipRecord = function(ownershipData) {
  this.ownershipHistory.push(ownershipData);
  this.ownershipHistory.sort((a, b) => {
    const aDate = a.period.from || new Date(0);
    const bDate = b.period.from || new Date(0);
    return aDate - bDate;
  });
  return this.save();
};

// Method to add exhibition record
provenanceSchema.methods.addExhibition = function(exhibitionData) {
  this.exhibitions.push(exhibitionData);
  return this.save();
};

// Method to add publication
provenanceSchema.methods.addPublication = function(publicationData) {
  this.publications.push(publicationData);
  return this.save();
};

// Method to verify certificate
provenanceSchema.methods.verifyCertificate = function(certificateId, verifier) {
  const certificate = this.authentication.certificates.id(certificateId);
  if (certificate) {
    certificate.verified = true;
    certificate.verifiedBy = verifier;
    certificate.verifiedAt = new Date();
    return this.save();
  }
  return Promise.reject(new Error('Certificate not found'));
};

// Method to add blockchain record
provenanceSchema.methods.addBlockchainTransaction = function(transactionData) {
  if (!this.blockchain) {
    this.blockchain = {
      enabled: true,
      transactions: []
    };
  }
  this.blockchain.transactions.push(transactionData);
  return this.save();
};

// Static method to find items with gaps in provenance
provenanceSchema.statics.findProvenanceGaps = function() {
  return this.aggregate([
    {
      $match: {
        'verification.overallScore': { $lt: 60 }
      }
    },
    {
      $lookup: {
        from: 'items',
        localField: 'item',
        foreignField: '_id',
        as: 'item'
      }
    },
    {
      $unwind: '$item'
    },
    {
      $project: {
        'item.title': 1,
        'item.category': 1,
        'verification.overallScore': 1,
        'research.gaps': 1
      }
    },
    { $sort: { 'verification.overallScore': 1 } }
  ]);
};

// Static method to get provenance statistics
provenanceSchema.statics.getStatistics = function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        avgCompleteness: { $avg: '$verification.overallScore' },
        totalItems: { $sum: 1 },
        excellentProvenance: {
          $sum: { $cond: [{ $gte: ['$verification.overallScore', 90] }, 1, 0] }
        },
        goodProvenance: {
          $sum: { $cond: [{ $gte: ['$verification.overallScore', 60] }, 1, 0] }
        },
        poorProvenance: {
          $sum: { $cond: [{ $lt: ['$verification.overallScore', 40] }, 1, 0] }
        }
      }
    }
  ]);
};

// Indexes
provenanceSchema.index({ item: 1 });
provenanceSchema.index({ 'verification.overallScore': -1 });
provenanceSchema.index({ 'ownershipHistory.owner.name': 1 });
provenanceSchema.index({ 'creation.artist.name': 1 });
provenanceSchema.index({ 'blockchain.enabled': 1, 'blockchain.tokenId': 1 });
provenanceSchema.index({ createdBy: 1 });
provenanceSchema.index({ accessLevel: 1 });

const Provenance = mongoose.model('Provenance', provenanceSchema);

export default Provenance;