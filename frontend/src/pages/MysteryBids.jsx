import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  EyeSlashIcon,
  QuestionMarkCircleIcon,
  LockClosedIcon,
  StarIcon,
  TrophyIcon,
  ShieldCheckIcon,
  ClockIcon,
  FireIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  BeakerIcon,
  DocumentMagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const MysteryBids = () => {
  const [mysteryAuctions, setMysteryAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    // Mock data - replace with actual API calls
    setTimeout(() => {
      setMysteryAuctions([
        {
          id: 1,
          category: 'celebrity',
          title: "Hollywood Legend's Personal Collection",
          mysteryLevel: 'high',
          hint: "Academy Award winner from the Golden Age of Hollywood",
          clues: [
            "Active from 1940s-1980s",
            "Known for romantic roles",
            "Owned iconic jewelry collection",
            "Lived in Beverly Hills mansion"
          ],
          revealProgress: 15, // 15% of bids needed for reveal
          currentBids: 47,
          bidsNeeded: 100,
          minimumBid: 5000,
          totalValue: "250K-500K",
          endTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
          image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
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
          reputationRequired: 'gold',
          mysteryPoints: 2500
        },
        {
          id: 2,
          category: 'historical',
          title: "World War II Officer's Estate",
          mysteryLevel: 'extreme',
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
          image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
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
          reputationRequired: 'platinum',
          mysteryPoints: 5000
        },
        {
          id: 3,
          category: 'royalty',
          title: "European Noble Family Treasures",
          mysteryLevel: 'medium',
          hint: "Minor European royalty, 18th-19th century",
          clues: [
            "Central European kingdom",
            "Connected to major royal houses",
            "Art patron and collector",
            "Castle included rare library"
          ],
          revealProgress: 32,
          currentBids: 64,
          bidsNeeded: 80,
          minimumBid: 3000,
          totalValue: "100K-300K",
          endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
          image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
          potentialItems: [
            "Royal jewelry and regalia",
            "Illuminated manuscripts",
            "Fine art and sculptures",
            "Antique furniture"
          ],
          expertVerification: true,
          suspenseRating: 8.5,
          participantCount: 64,
          averageBid: 7500,
          topBidders: 8,
          reputationRequired: 'silver',
          mysteryPoints: 1500
        },
        {
          id: 4,
          category: 'artist',
          title: "Mysterious Modern Master's Studio",
          mysteryLevel: 'high',
          hint: "20th century artist, abstract expressionist movement",
          clues: [
            "Exhibited in major galleries",
            "Part of influential art movement",
            "Works in private collections",
            "Taught at prestigious art school"
          ],
          revealProgress: 22,
          currentBids: 35,
          bidsNeeded: 120,
          minimumBid: 8000,
          totalValue: "300K-600K",
          endTime: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
          image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
          potentialItems: [
            "Original paintings and sketches",
            "Artist's tools and materials",
            "Personal photographs",
            "Correspondence with galleries"
          ],
          expertVerification: true,
          suspenseRating: 8.9,
          participantCount: 35,
          averageBid: 15000,
          topBidders: 4,
          reputationRequired: 'gold',
          mysteryPoints: 3000
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const categories = [
    { id: 'all', name: 'All Categories', icon: QuestionMarkCircleIcon },
    { id: 'celebrity', name: 'Celebrity Estates', icon: StarIcon },
    { id: 'historical', name: 'Historical Figures', icon: DocumentMagnifyingGlassIcon },
    { id: 'royalty', name: 'Royal Collections', icon: TrophyIcon },
    { id: 'artist', name: 'Artist Studios', icon: BeakerIcon }
  ];

  const filteredAuctions = selectedCategory === 'all' 
    ? mysteryAuctions 
    : mysteryAuctions.filter(auction => auction.category === selectedCategory);

  const getMysteryLevelColor = (level) => {
    switch (level) {
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'extreme': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getReputationColor = (level) => {
    switch (level) {
      case 'silver': return 'text-gray-600 bg-gray-100';
      case 'gold': return 'text-yellow-600 bg-yellow-100';
      case 'platinum': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTimeLeft = (endTime) => {
    const now = new Date();
    const timeDiff = endTime - now;
    
    if (timeDiff <= 0) return "Ended";
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  const handleBidClick = (item) => {
    setSelectedItem(item);
    setShowBidModal(true);
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
      <section className="bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex items-center justify-center space-x-3 mb-6">
              <EyeSlashIcon className="w-12 h-12 text-purple-400" />
              <h1 className="text-4xl md:text-6xl font-bold">Mystery Bids</h1>
            </div>
            <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
              The ultimate bidding experience. Anonymous collections revealed only when enough bids are placed.
              The mystery makes the victory sweeter.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                <QuestionMarkCircleIcon className="w-6 h-6 text-purple-300 mx-auto mb-2" />
                <div className="text-2xl font-bold">47</div>
                <div className="text-sm text-purple-200">Active Mysteries</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                <LockClosedIcon className="w-6 h-6 text-purple-300 mx-auto mb-2" />
                <div className="text-2xl font-bold">12</div>
                <div className="text-sm text-purple-200">Revealed Today</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                <TrophyIcon className="w-6 h-6 text-purple-300 mx-auto mb-2" />
                <div className="text-2xl font-bold">$2.3M</div>
                <div className="text-sm text-purple-200">Won This Week</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                <UserGroupIcon className="w-6 h-6 text-purple-300 mx-auto mb-2" />
                <div className="text-2xl font-bold">234</div>
                <div className="text-sm text-purple-200">Active Bidders</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Browse Mystery Categories</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-full font-medium transition-colors duration-200 flex items-center space-x-2 ${
                    selectedCategory === category.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-purple-50 border border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Mystery Auctions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredAuctions.map((auction, index) => (
            <motion.div
              key={auction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border-2 border-purple-100"
            >
              {/* Header with mystery level */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <EyeSlashIcon className="w-5 h-5" />
                    <span className="font-medium">Mystery Auction</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getMysteryLevelColor(auction.mysteryLevel)}`}>
                    {auction.mysteryLevel} Mystery
                  </span>
                </div>
                <h3 className="text-xl font-bold">{auction.title}</h3>
                <p className="text-purple-100 text-sm mt-1">{auction.hint}</p>
              </div>

              <div className="p-6">
                {/* Reveal Progress */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Reveal Progress</span>
                    <span className="text-sm text-purple-600">{auction.currentBids}/{auction.bidsNeeded} bids</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${auction.revealProgress}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {auction.revealProgress}% revealed
                  </div>
                </div>

                {/* Clues */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <DocumentMagnifyingGlassIcon className="w-4 h-4 mr-2" />
                    Available Clues
                  </h4>
                  <div className="space-y-2">
                    {auction.clues.map((clue, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-sm">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span className="text-gray-600">{clue}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600">Estimated Value</div>
                    <div className="text-lg font-bold text-green-600">{auction.totalValue}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600">Suspense Rating</div>
                    <div className="flex items-center space-x-1">
                      <FireIcon className="w-4 h-4 text-orange-500" />
                      <span className="text-lg font-bold">{auction.suspenseRating}/10</span>
                    </div>
                  </div>
                </div>

                {/* Requirements */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
                    <ShieldCheckIcon className="w-4 h-4 mr-2" />
                    Participation Requirements
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-yellow-700">Minimum Bid:</span>
                      <span className="font-medium">${auction.minimumBid.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-yellow-700">Reputation Level:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getReputationColor(auction.reputationRequired)}`}>
                        {auction.reputationRequired}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-yellow-700">Mystery Points:</span>
                      <span className="font-medium">{auction.mysteryPoints} pts</span>
                    </div>
                  </div>
                </div>

                {/* Potential Items Preview */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Potential Items Include:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {auction.potentialItems.map((item, idx) => (
                      <div key={idx} className="bg-purple-50 rounded-lg p-2 text-xs text-purple-700 border border-purple-200">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Time and Action */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="w-4 h-4" />
                      <span>{formatTimeLeft(auction.endTime)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <UserGroupIcon className="w-4 h-4" />
                      <span>{auction.participantCount} bidders</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleBidClick(auction)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                  >
                    <CurrencyDollarIcon className="w-4 h-4" />
                    <span>Place Bid</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* How It Works */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-8 text-white"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-8">How Mystery Bids Work</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur">
                <QuestionMarkCircleIcon className="w-8 h-8 text-purple-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-3">1. Mystery Revealed</h3>
                <p className="text-purple-100">
                  Collection details are gradually revealed as more bids are placed. The more interest, the more you learn!
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur">
                <LockClosedIcon className="w-8 h-8 text-purple-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-3">2. Anonymous Bidding</h3>
                <p className="text-purple-100">
                  All bids are anonymous until the reveal threshold is met. No bid sniping, just pure excitement!
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur">
                <TrophyIcon className="w-8 h-8 text-purple-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-3">3. Winner Revealed</h3>
                <p className="text-purple-100">
                  When the mystery is solved, the highest bidder wins the entire collection. The ultimate surprise!
                </p>
              </div>
            </div>
          </div>
        </motion.section>
      </div>

      {/* Bid Modal */}
      {showBidModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-md w-full p-6"
          >
            <h3 className="text-xl font-bold mb-4">Place Mystery Bid</h3>
            <div className="mb-4">
              <p className="text-gray-600 mb-2">{selectedItem.title}</p>
              <p className="text-sm text-purple-600">Minimum Bid: ${selectedItem.minimumBid.toLocaleString()}</p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Bid Amount
              </label>
              <input
                type="number"
                min={selectedItem.minimumBid}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                placeholder={`$${selectedItem.minimumBid.toLocaleString()}`}
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
              <p className="text-xs text-yellow-800">
                <strong>Mystery Bid Rules:</strong> Your bid is anonymous and helps reveal the collection. 
                You can only see other bids once the reveal threshold is reached.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowBidModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
                Place Bid
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MysteryBids;