import mongoose from 'mongoose';
import dotenv from 'dotenv';
import TimeCapsule from '../models/TimeCapsule.js';
import MysteryBid from '../models/MysteryBid.js';
import Group from '../models/Group.js';
import Event from '../models/Event.js';
import User from '../models/User.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Find an admin user or create one
    let adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      adminUser = await User.findOne({ email: 'hiitoyou193@gmail.com' });
      if (adminUser) {
        adminUser.role = 'admin';
        await adminUser.save();
        console.log('✅ Updated existing user to admin role');
      }
    }

    if (!adminUser) {
      // Create a default admin user
      adminUser = new User({
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123', // This will be hashed by the model
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isVerified: true,
        isEmailVerified: true,
        experienceLevel: 'Professional'
      });
      await adminUser.save();
      console.log('✅ Created default admin user (admin@example.com / admin123)');
    }

    // Clear existing data
    await TimeCapsule.deleteMany({});
    await MysteryBid.deleteMany({});
    await Group.deleteMany({});
    await Event.deleteMany({});

    // Seed Time Capsule data
    const timeCapsules = [
      {
        title: "Napoleon's Campaign Map",
        era: "Napoleonic Wars (1803-1815)",
        period: "industrial",
        description: "Original military campaign map used during Napoleon's Russian campaign",
        currentBid: 45000,
        startingBid: 20000,
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400"],
        bidCount: 23,
        significance: "Battle of Borodino preparation",
        provenance: "Russian State Museum",
        rarity: "Museum Quality",
        culturalImpact: 9.5,
        historicalImportance: "Critical military document that shaped European history",
        expert: "Dr. Marie Dubois, Napoleonic Historian",
        authentication: "Multiple expert verifications",
        location: "Moscow, Russia",
        discoveryStory: "Found in the private collection of a Russian noble family, hidden for over 200 years.",
        status: "active",
        createdBy: adminUser._id,
        featured: true
      },
      {
        title: "Viking Silver Thor's Hammer",
        era: "Viking Age (800-1100 AD)",
        period: "medieval",
        description: "Exceptionally preserved silver Mjolnir pendant with runic inscriptions",
        currentBid: 28000,
        startingBid: 15000,
        endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        images: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400"],
        bidCount: 17,
        significance: "Norse religious artifact",
        provenance: "Excavated in Scandinavia",
        rarity: "Extremely Rare",
        culturalImpact: 8.8,
        historicalImportance: "Provides insight into Viking religious practices and craftsmanship",
        expert: "Prof. Erik Nordström, Viking Studies",
        authentication: "Archaeological certificate",
        location: "Bergen, Norway",
        discoveryStory: "Unearthed during a construction project in downtown Bergen, along with other Viking artifacts.",
        status: "active",
        createdBy: adminUser._id
      }
    ];

    const createdTimeCapsules = await TimeCapsule.insertMany(timeCapsules);
    console.log(`✅ Created ${createdTimeCapsules.length} time capsule auctions`);

    // Seed Mystery Bids data
    const mysteryBids = [
      {
        title: "Hollywood Legend's Personal Collection",
        category: "celebrity",
        mysteryLevel: "high",
        hint: "Academy Award winner from the Golden Age of Hollywood",
        clues: [
          "Active from 1940s-1980s",
          "Known for romantic roles",
          "Owned iconic jewelry collection",
          "Lived in Beverly Hills mansion"
        ],
        revealProgress: 15,
        currentBids: 47,
        bidsNeeded: 100,
        minimumBid: 5000,
        totalValue: "250K-500K",
        endTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
        images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400"],
        potentialItems: [
          "Vintage haute couture gowns",
          "Diamond jewelry collection",
          "Personal letters and photographs",
          "Film memorabilia"
        ],
        expertVerification: true,
        suspenseRating: 9.2,
        participantCount: 47,
        averageBid: 12500,
        topBidders: 5,
        reputationRequired: "gold",
        mysteryPoints: 2500,
        status: "active",
        createdBy: adminUser._id,
        featured: true
      },
      {
        title: "World War II Officer's Estate",
        category: "historical",
        mysteryLevel: "extreme",
        hint: "High-ranking Allied officer with classified materials",
        clues: [
          "European theater operations",
          "Intelligence background",
          "Decorated for valor",
          "Post-war diplomatic role"
        ],
        revealProgress: 8,
        currentBids: 23,
        bidsNeeded: 150,
        minimumBid: 10000,
        totalValue: "500K-1M",
        endTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400"],
        potentialItems: [
          "Military decorations and medals",
          "Classified documents (declassified)",
          "Personal war diary",
          "Strategic maps and plans"
        ],
        expertVerification: true,
        suspenseRating: 9.8,
        participantCount: 23,
        averageBid: 18000,
        topBidders: 3,
        reputationRequired: "platinum",
        mysteryPoints: 5000,
        status: "active",
        createdBy: adminUser._id
      }
    ];

    const createdMysteryBids = await MysteryBid.insertMany(mysteryBids);
    console.log(`✅ Created ${createdMysteryBids.length} mystery bid auctions`);

    // Seed Groups data
    const groups = [
      {
        name: "Victorian Era Collectors",
        description: "Dedicated to preserving and discussing Victorian antiques and collectibles",
        category: "Historical Period",
        privacy: "Public",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300",
        members: [{ user: adminUser._id, role: 'admin' }],
        moderators: [adminUser._id],
        tags: ["Victorian", "Jewelry", "Silver", "Furniture"],
        activity: "Very Active",
        createdBy: adminUser._id,
        featured: true,
        posts: [
          {
            title: "Authentication help needed - Victorian mourning jewelry",
            content: "I found this piece at an estate sale and need help authenticating it.",
            author: adminUser._id
          }
        ]
      },
      {
        name: "Asian Art & Antiques",
        description: "Community for collectors of Asian art, ceramics, and cultural artifacts",
        category: "Cultural/Regional",
        privacy: "Public",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300",
        members: [{ user: adminUser._id, role: 'admin' }],
        moderators: [adminUser._id],
        tags: ["Chinese", "Japanese", "Ceramics", "Art"],
        activity: "Active",
        createdBy: adminUser._id,
        posts: [
          {
            title: "Ming dynasty authentication workshop this weekend",
            content: "Join us for an educational workshop on Ming dynasty ceramics.",
            author: adminUser._id
          }
        ]
      }
    ];

    const createdGroups = await Group.insertMany(groups);
    console.log(`✅ Created ${createdGroups.length} collector groups`);

    // Seed Events data
    const events = [
      {
        title: "Victorian Jewelry Authentication Workshop",
        description: "Learn to authenticate Victorian jewelry pieces with expert guidance. Covers hallmarks, materials, and period characteristics.",
        type: "Workshop",
        format: "Virtual",
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        time: "2:00 PM - 4:00 PM EST",
        host: adminUser._id,
        maxAttendees: 50,
        attendees: [],
        price: "Free",
        category: "Education",
        difficulty: "Beginner to Intermediate",
        tags: ["Victorian", "Jewelry", "Authentication"],
        virtualLink: "https://zoom.us/j/example",
        status: "upcoming",
        createdBy: adminUser._id,
        featured: true
      },
      {
        title: "Collector Meetup: Monthly Gathering",
        description: "Monthly collector meetup with show-and-tell, expert discussions, and networking. Bring your favorite recent finds!",
        type: "Meetup",
        format: "Hybrid",
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        time: "1:00 PM - 5:00 PM PST",
        location: "Community Center, Downtown",
        host: adminUser._id,
        maxAttendees: 30,
        attendees: [],
        price: "$15",
        category: "Social",
        difficulty: "All Levels",
        tags: ["Networking", "Show and Tell"],
        virtualLink: "https://zoom.us/j/example2",
        status: "upcoming",
        createdBy: adminUser._id
      }
    ];

    const createdEvents = await Event.insertMany(events);
    console.log(`✅ Created ${createdEvents.length} collector events`);

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

const main = async () => {
  await connectDB();
  await seedData();
  await mongoose.connection.close();
  console.log('👋 Database connection closed');
};

main();