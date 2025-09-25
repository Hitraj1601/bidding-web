import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ClockIcon,
  StarIcon,
  EyeIcon,
  ArrowRightIcon,
  CalendarDaysIcon,
  MapPinIcon,
  DocumentTextIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

const TimeCapsuleAuctions = () => {
  const [timeCapsuleItems, setTimeCapsuleItems] = useState([]);
  const [historicalPeriods, setHistoricalPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  useEffect(() => {
    // Mock data - replace with actual API calls
    setTimeout(() => {
      setHistoricalPeriods([
        { id: 'all', name: 'All Periods', count: 45 },
        { id: 'ancient', name: 'Ancient Era', count: 8 },
        { id: 'medieval', name: 'Medieval', count: 12 },
        { id: 'renaissance', name: 'Renaissance', count: 15 },
        { id: 'industrial', name: 'Industrial Age', count: 10 }
      ]);

      setTimeCapsuleItems([
        {
          id: 1,
          title: "Napoleon's Campaign Map",
          era: "Napoleonic Wars (1803-1815)",
          period: "industrial",
          description: "Original military campaign map used during Napoleon's Russian campaign",
          currentBid: 45000,
          startingBid: 20000,
          endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
          bidCount: 23,
          significance: "Battle of Borodino preparation",
          provenance: "Russian State Museum",
          rarity: "Museum Quality",
          culturalImpact: 9.5,
          historicalImportance: "Critical military document that shaped European history",
          expert: "Dr. Marie Dubois, Napoleonic Historian",
          authentication: "Multiple expert verifications",
          location: "Moscow, Russia",
          discoveryStory: "Found in the private collection of a Russian noble family, hidden for over 200 years."
        },
        {
          id: 2,
          title: "Viking Silver Thor's Hammer",
          era: "Viking Age (800-1100 AD)",
          period: "medieval",
          description: "Exceptionally preserved silver Mjolnir pendant with runic inscriptions",
          currentBid: 28000,
          startingBid: 15000,
          endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
          bidCount: 17,
          significance: "Norse religious artifact",
          provenance: "Excavated in Scandinavia",
          rarity: "Extremely Rare",
          culturalImpact: 8.8,
          historicalImportance: "Provides insight into Viking religious practices and craftsmanship",
          expert: "Prof. Erik Nordström, Viking Studies",
          authentication: "Archaeological certificate",
          location: "Bergen, Norway",
          discoveryStory: "Unearthed during a construction project in downtown Bergen, along with other Viking artifacts."
        },
        {
          id: 3,
          title: "Leonardo da Vinci Study Sketch",
          era: "Italian Renaissance (1450-1600)",
          period: "renaissance",
          description: "Previously unknown anatomical study sketch attributed to Leonardo da Vinci",
          currentBid: 125000,
          startingBid: 80000,
          endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
          bidCount: 34,
          significance: "Renaissance art masterpiece",
          provenance: "Italian private collection",
          rarity: "Unique",
          culturalImpact: 9.8,
          historicalImportance: "Advances our understanding of Renaissance artistic techniques",
          expert: "Dr. Isabella Romano, Renaissance Art Specialist",
          authentication: "Paper analysis, ink dating, style comparison",
          location: "Florence, Italy",
          discoveryStory: "Discovered in the walls of a Florentine palazzo during restoration work."
        },
        {
          id: 4,
          title: "Roman Gladiator Helmet Fragment",
          era: "Roman Empire (27 BC - 476 AD)",
          period: "ancient",
          description: "Bronze helmet fragment from the Colosseum with gladiator inscriptions",
          currentBid: 35000,
          startingBid: 18000,
          endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
          bidCount: 19,
          significance: "Roman gladiator combat",
          provenance: "Vatican Museums",
          rarity: "Museum Quality",
          culturalImpact: 8.5,
          historicalImportance: "Direct connection to Roman entertainment and society",
          expert: "Dr. Marcus Antonius, Roman History",
          authentication: "Vatican Certificate",
          location: "Rome, Italy",
          discoveryStory: "Excavated from the underground chambers of the Colosseum during archaeological surveys."
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const filteredItems = selectedPeriod === 'all' 
    ? timeCapsuleItems 
    : timeCapsuleItems.filter(item => item.period === selectedPeriod);

  const formatTimeLeft = (endTime) => {
    const now = new Date();
    const timeDiff = endTime - now;
    
    if (timeDiff <= 0) return "Ended";
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex items-center justify-center space-x-3 mb-6">
              <ClockIcon className="w-12 h-12 text-purple-300" />
              <h1 className="text-4xl md:text-6xl font-bold">Time Capsule Auctions</h1>
            </div>
            <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Discover historically significant artifacts with documented cultural impact. 
              Each item tells a story that shaped our world.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur">
                <DocumentTextIcon className="w-8 h-8 text-purple-300 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">Expert Verified</h3>
                <p className="text-purple-200">Every item authenticated by leading historians and experts</p>
              </div>
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur">
                <StarIcon className="w-8 h-8 text-purple-300 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">Cultural Impact</h3>
                <p className="text-purple-200">Rated for historical significance and cultural importance</p>
              </div>
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur">
                <AcademicCapIcon className="w-8 h-8 text-purple-300 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">Educational Value</h3>
                <p className="text-purple-200">Complete historical context and discovery stories included</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Period Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Browse by Historical Period</h2>
          <div className="flex flex-wrap gap-3">
            {historicalPeriods.map((period) => (
              <button
                key={period.id}
                onClick={() => setSelectedPeriod(period.id)}
                className={`px-6 py-3 rounded-full font-medium transition-colors duration-200 ${
                  selectedPeriod === period.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-purple-50 border border-gray-300'
                }`}
              >
                {period.name} ({period.count})
              </button>
            ))}
          </div>
        </motion.div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="md:flex">
                <div className="md:w-1/2">
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-64 md:h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                        <ClockIcon className="w-4 h-4" />
                        <span>Time Capsule</span>
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                      {formatTimeLeft(item.endTime)}
                    </div>
                  </div>
                </div>
                
                <div className="md:w-1/2 p-6">
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <CalendarDaysIcon className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-600">{item.era}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
                  </div>

                  {/* Significance indicators */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-600">Cultural Impact</span>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(item.culturalImpact / 2)
                                ? 'text-purple-500 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-xs text-gray-600 ml-1">{item.culturalImpact}/10</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-600">Rarity:</span>
                        <span className="ml-1 font-medium">{item.rarity}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Location:</span>
                        <span className="ml-1 font-medium">{item.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Current Bid</p>
                        <p className="text-2xl font-bold text-purple-600">
                          ${item.currentBid.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Bids</p>
                        <p className="text-lg font-semibold text-gray-900">{item.bidCount}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Link
                        to={`/auctions/${item.id}`}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                      >
                        <span>View Details</span>
                        <ArrowRightIcon className="w-4 h-4" />
                      </Link>
                      
                      <Link
                        to={`/ar-preview/${item.id}`}
                        className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                      >
                        <EyeIcon className="w-4 h-4" />
                        <span>AR Preview</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expert info */}
              <div className="bg-gray-50 px-6 py-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AcademicCapIcon className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">Expert Verification</span>
                </div>
                <p className="text-sm text-gray-600">{item.expert}</p>
                <p className="text-xs text-gray-500 mt-1">"{item.historicalImportance}"</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Educational Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-8 text-white"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Why Time Capsule Auctions?</h2>
            <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
              These aren't just antiques – they're windows into pivotal moments that shaped human history.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur">
                <h3 className="text-lg font-semibold mb-3">Museum Quality</h3>
                <p className="text-purple-100">
                  Items meet the same standards as world-renowned museums, with complete provenance documentation.
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur">
                <h3 className="text-lg font-semibold mb-3">Historical Impact</h3>
                <p className="text-purple-100">
                  Each piece is rated for its significance in shaping culture, politics, art, or science.
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur">
                <h3 className="text-lg font-semibold mb-3">Expert Stories</h3>
                <p className="text-purple-100">
                  Detailed discovery stories and historical context from leading experts in each field.
                </p>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default TimeCapsuleAuctions;