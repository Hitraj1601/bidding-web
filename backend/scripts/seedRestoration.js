import mongoose from 'mongoose';
import RestorationExpert from '../models/RestorationExpert.js';
import RestorationProject from '../models/RestorationProject.js';
import dotenv from 'dotenv';

dotenv.config();

const seedRestorationData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await RestorationExpert.deleteMany({});
    await RestorationProject.deleteMany({});
    console.log('Cleared existing restoration data');

    // Sample experts data
    const expertsData = [
      {
        name: "Dr. Margaret Harrison",
        title: "Master Furniture Restorer",
        bio: "Specialized in Victorian and Edwardian furniture restoration with over 25 years of experience. Graduated from the West Dean College of Arts and Conservation.",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=200",
        specialties: ["Victorian Furniture", "Antique Wood", "French Polish", "Mahogany Restoration"],
        location: "London, UK",
        experience: 25,
        rating: 4.9,
        reviewCount: 127,
        hourlyRate: {
          min: 85,
          max: 120,
          currency: "USD"
        },
        verified: true,
        availability: "Available",
        completedProjects: 340,
        responseTime: "Within 2 hours",
        languages: ["English", "French"],
        certifications: [
          "Master Craftsperson Certification",
          "Historic Preservation Society Member",
          "British Antique Furniture Restorers Association"
        ],
        portfolio: [
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300",
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300",
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300"
        ],
        insurance: true,
        guaranteePeriod: "2 years",
        priceRange: "Premium",
        status: "active"
      },
      {
        name: "Alessandro Rossi",
        title: "Master Ceramics Restorer",
        bio: "Third-generation ceramics restorer specializing in Italian Renaissance pottery and European porcelain. Trained in traditional Florentine techniques.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
        specialties: ["Italian Majolica", "Porcelain Repair", "Crack Restoration", "Renaissance Pottery"],
        location: "Florence, Italy",
        experience: 18,
        rating: 4.8,
        reviewCount: 89,
        hourlyRate: {
          min: 75,
          max: 100,
          currency: "USD"
        },
        verified: true,
        availability: "Available",
        completedProjects: 256,
        responseTime: "Within 4 hours",
        languages: ["Italian", "English", "German"],
        certifications: [
          "Italian Heritage Restoration License",
          "European Ceramics Association",
          "Master Artisan Qualification"
        ],
        portfolio: [
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300",
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300"
        ],
        insurance: true,
        guaranteePeriod: "18 months",
        priceRange: "High",
        status: "active"
      },
      {
        name: "Sarah Chen",
        title: "Textile & Tapestry Specialist",
        bio: "Specializing in Asian textiles and European tapestries with focus on traditional hand-weaving techniques and natural fiber preservation.",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
        specialties: ["Silk Restoration", "Tapestry Repair", "Historic Textiles", "Asian Fabrics"],
        location: "New York, NY, USA",
        experience: 12,
        rating: 4.7,
        reviewCount: 64,
        hourlyRate: {
          min: 60,
          max: 90,
          currency: "USD"
        },
        verified: true,
        availability: "Busy - 2 week wait",
        completedProjects: 145,
        responseTime: "Within 6 hours",
        languages: ["English", "Mandarin"],
        certifications: [
          "Textile Conservation Certificate",
          "Historic Preservation Specialist",
          "Asian Art Conservation Training"
        ],
        portfolio: [
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300",
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300"
        ],
        insurance: true,
        guaranteePeriod: "1 year",
        priceRange: "Medium",
        status: "active"
      },
      {
        name: "David Kim",
        title: "Metalwork & Jewelry Restorer",
        bio: "Expert in antique jewelry, silverware, and metalwork restoration with specialization in Art Deco and Victorian pieces.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
        specialties: ["Jewelry Restoration", "Silverware", "Art Deco", "Vintage Watches"],
        location: "Los Angeles, CA, USA",
        experience: 15,
        rating: 4.8,
        reviewCount: 103,
        hourlyRate: {
          min: 70,
          max: 110,
          currency: "USD"
        },
        verified: true,
        availability: "Available",
        completedProjects: 198,
        responseTime: "Within 3 hours",
        languages: ["English", "Korean"],
        certifications: [
          "Certified Jewelry Restoration Specialist",
          "American Society of Appraisers",
          "Metalwork Conservation Certificate"
        ],
        portfolio: [
          "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300",
          "https://images.unsplash.com/photo-1544966503-7cc5ac882d5b?w=300"
        ],
        insurance: true,
        guaranteePeriod: "2 years",
        priceRange: "High",
        status: "active"
      },
      {
        name: "Elena Petrova",
        title: "Painting & Frame Conservator",
        bio: "Specialized in oil painting conservation and antique frame restoration with focus on European masters and Russian icons.",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200",
        specialties: ["Oil Painting Conservation", "Frame Restoration", "Russian Icons", "Canvas Repair"],
        location: "Paris, France",
        experience: 20,
        rating: 4.9,
        reviewCount: 85,
        hourlyRate: {
          min: 90,
          max: 150,
          currency: "USD"
        },
        verified: true,
        availability: "Available",
        completedProjects: 287,
        responseTime: "Within 24 hours",
        languages: ["French", "Russian", "English"],
        certifications: [
          "Fine Arts Conservation Diploma",
          "European Heritage Restoration License",
          "ICOM-CC Painting Working Group"
        ],
        portfolio: [
          "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300",
          "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=300"
        ],
        insurance: true,
        guaranteePeriod: "3 years",
        priceRange: "Premium",
        status: "active"
      }
    ];

    // Sample projects data
    const projectsData = [
      {
        title: "Victorian Mahogany Secretary Desk",
        description: "Antique writing desk requiring drawer repair and wood refinishing. The piece dates from the 1890s and has significant historical value.",
        category: "Furniture",
        condition: "Good - Minor Damage",
        budget: {
          min: 800,
          max: 1200,
          currency: "USD"
        },
        timeline: "4-6 weeks",
        location: "Boston, MA, USA",
        postedBy: "Elizabeth Morgan",
        postedDate: new Date('2024-01-15'),
        images: [
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400"
        ],
        issues: [
          "Scratched wooden surface",
          "Loose drawer slides",
          "Missing brass handle",
          "Water stain on top"
        ],
        status: "Open",
        urgency: "Medium",
        materials: "Mahogany wood, brass hardware",
        dimensions: "48\" W x 24\" D x 42\" H",
        age: "1890s",
        proposalCount: 7
      },
      {
        title: "Chinese Porcelain Vase - Crack Repair",
        description: "Ming Dynasty-style vase with hairline crack requiring expert restoration. The piece is a family heirloom with sentimental value.",
        category: "Ceramics",
        condition: "Fair - Moderate Damage",
        budget: {
          min: 500,
          max: 800,
          currency: "USD"
        },
        timeline: "2-3 weeks",
        location: "San Francisco, CA, USA",
        postedBy: "James Liu",
        postedDate: new Date('2024-01-12'),
        images: [
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400"
        ],
        issues: [
          "3-inch hairline crack",
          "Small chip on rim",
          "Discoloration around crack"
        ],
        status: "In Progress",
        urgency: "High",
        materials: "Porcelain, ceramic adhesive",
        dimensions: "12\" H x 6\" D",
        age: "Ming Dynasty style (reproduction)",
        proposalCount: 12
      },
      {
        title: "Antique Persian Carpet Restoration",
        description: "Beautiful hand-woven Persian carpet with edge wear and some moth damage. Requires expert textile restoration to preserve its value.",
        category: "Textiles",
        condition: "Fair - Moderate Damage",
        budget: {
          min: 1500,
          max: 2500,
          currency: "USD"
        },
        timeline: "6-8 weeks",
        location: "London, UK",
        postedBy: "Raj Patel",
        postedDate: new Date('2024-01-10'),
        images: [
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400"
        ],
        issues: [
          "Frayed edges on two sides",
          "Fading in high-traffic areas",
          "Small moth holes",
          "Loose knots in corner"
        ],
        status: "Open",
        urgency: "Low",
        materials: "Wool, silk highlights",
        dimensions: "9' x 12'",
        age: "Early 20th century",
        proposalCount: 5
      },
      {
        title: "Art Deco Silver Tea Set",
        description: "1920s Art Deco silver tea set requiring tarnish removal and minor dent repair. Part of an estate collection.",
        category: "Metalwork",
        condition: "Good - Minor Damage",
        budget: {
          min: 600,
          max: 900,
          currency: "USD"
        },
        timeline: "3-4 weeks",
        location: "Chicago, IL, USA",
        postedBy: "Robert Wilson",
        postedDate: new Date('2024-01-08'),
        images: [
          "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400"
        ],
        issues: [
          "Heavy tarnishing",
          "Small dent in teapot",
          "Loose handle on sugar bowl",
          "Missing original patina"
        ],
        status: "Open",
        urgency: "Medium",
        materials: "Sterling silver, ebony handles",
        dimensions: "Various pieces",
        age: "1920s",
        proposalCount: 9
      },
      {
        title: "Oil Painting Canvas Repair",
        description: "19th century oil painting with tear in canvas and some paint loss. Requires professional conservation work.",
        category: "Paintings",
        condition: "Poor - Major Damage",
        budget: {
          min: 1200,
          max: 1800,
          currency: "USD"
        },
        timeline: "8-10 weeks",
        location: "New York, NY, USA",
        postedBy: "Maria Gonzalez",
        postedDate: new Date('2024-01-05'),
        images: [
          "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400"
        ],
        issues: [
          "4-inch tear in canvas",
          "Paint loss in sky area",
          "Yellowed varnish",
          "Frame damage"
        ],
        status: "Open",
        urgency: "High",
        materials: "Oil on canvas, period frame",
        dimensions: "24\" x 36\"",
        age: "19th century",
        proposalCount: 3
      }
    ];

    // Insert experts
    const createdExperts = await RestorationExpert.insertMany(expertsData);
    console.log(`Created ${createdExperts.length} restoration experts`);

    // Insert projects
    const createdProjects = await RestorationProject.insertMany(projectsData);
    console.log(`Created ${createdProjects.length} restoration projects`);

    // Assign some experts to projects
    const assignedProjects = await RestorationProject.findOne({ title: "Chinese Porcelain Vase - Crack Repair" });
    if (assignedProjects) {
      const ceramicsExpert = await RestorationExpert.findOne({ name: "Alessandro Rossi" });
      if (ceramicsExpert) {
        assignedProjects.assignedExpert = ceramicsExpert._id;
        await assignedProjects.save();
        console.log('Assigned ceramics expert to porcelain vase project');
      }
    }

    console.log('Restoration data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding restoration data:', error);
    process.exit(1);
  }
};

seedRestorationData();