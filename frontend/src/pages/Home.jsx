import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { auctionsAPI, itemsAPI, statsAPI } from '../services/api';
import {
  CubeIcon,
  EyeIcon,
  DocumentTextIcon,
  ClockIcon,
  QuestionMarkCircleIcon,
  WrenchScrewdriverIcon,
  UsersIcon,
  StarIcon,
  TrophyIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const [featuredAuctions, setFeaturedAuctions] = useState([]);
  const [stats, setStats] = useState({
    totalItems: 0,
    activeAuctions: 0,
    totalUsers: 0,
    successfulSales: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch featured auctions and stats
    fetchFeaturedContent();
  }, []);

  const fetchFeaturedContent = async () => {
    try {
      setLoading(true);
      
      // Fetch featured auctions and global stats with error handling
      const [auctionsRes, itemsRes, statsRes] = await Promise.allSettled([
        auctionsAPI.getFeatured(),
        itemsAPI.getFeatured(),
        statsAPI.getGlobalStats()
      ]);

      // Process auctions
      let auctions = [];
      if (auctionsRes.status === 'fulfilled') {
        auctions = auctionsRes.value.data?.data?.auctions || [];
      }

      // Process items
      let items = [];
      if (itemsRes.status === 'fulfilled') {
        items = itemsRes.value.data?.data?.items || [];
      }
      
      // Transform data for the frontend format
      const featuredContent = [
        ...auctions.map(auction => ({
          id: auction._id,
          title: auction.title,
          currentBid: auction.currentBid || auction.startingBid,
          endTime: new Date(auction.endDate),
          image: auction.featuredImage || auction.images?.[0] || '/placeholder-auction.jpg',
          bidCount: auction.totalBids || 0,
          isTimeCapsule: auction.type === 'time-capsule'
        })),
        ...items.slice(0, 3).map(item => ({
          id: item._id,
          title: item.title,
          currentBid: item.currentBid || item.startingPrice,
          endTime: new Date(item.auctionEndDate || Date.now() + 24 * 60 * 60 * 1000),
          image: item.images?.[0] || '/placeholder-item.jpg',
          bidCount: item.totalBids || 0,
          isTimeCapsule: false
        }))
      ].slice(0, 6);

      setFeaturedAuctions(featuredContent);

      // Set global stats
      if (statsRes.status === 'fulfilled') {
        const globalStats = statsRes.value.data;
        setStats({
          totalItems: globalStats.totalItems || 0,
          activeAuctions: globalStats.activeAuctions || 0,
          totalUsers: globalStats.totalUsers || 0,
          successfulSales: globalStats.successfulSales || 0
        });
      }
      
    } catch (error) {
      console.error('Failed to fetch featured content:', error);
      // Don't show error toast for failed API calls on home page
      
      // Set fallback data to prevent white page
      setFeaturedAuctions([]);
      setStats({
        totalItems: 0,
        activeAuctions: 0,
        totalUsers: 0,
        successfulSales: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const uniqueFeatures = [
    {
      icon: DocumentTextIcon,
      name: "Provenance Tracker",
      description: "Complete ownership history and authenticity verification",
      color: "from-blue-500 to-blue-600"
    },

    {
      icon: ClockIcon,
      name: "Time Capsule Auctions",
      description: "Special auctions for historically significant items",
      color: "from-amber-500 to-amber-600"
    },
    {
      icon: QuestionMarkCircleIcon,
      name: "Mystery Bids",
      description: "Anonymous bidding for high-value collectibles",
      color: "from-red-500 to-red-600"
    },
    {
      icon: WrenchScrewdriverIcon,
      name: "Restoration Hub",
      description: "Connect with certified restoration experts",
      color: "from-indigo-500 to-indigo-600"
    }
  ];

  const formatTimeLeft = (endTime) => {
    const now = new Date();
    const timeDiff = endTime - now;
    
    if (timeDiff <= 0) return "Ended";
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920')] bg-cover bg-center opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
                Discover
                <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                  {" "}Authentic{" "}
                </span>
                Antiques
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                The world's most advanced marketplace for antiques and collectibles. 
                Experience detailed provenance tracking, expert verification, and connect with a global community of collectors.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                to="/register"
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-xl"
              >
                Start Bidding
              </Link>
              <Link
                to="/time-capsule"
                className="bg-white/10 backdrop-blur border border-white/20 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-medium text-lg transition-all duration-200 flex items-center space-x-2"
              >
                <ClockIcon className="w-5 h-5" />
                <span>Explore Time Capsule</span>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
            >
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-amber-400">
                  {stats.totalItems.toLocaleString()}+
                </div>
                <div className="text-gray-300 mt-1">Items Listed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-amber-400">
                  {stats.activeAuctions}
                </div>
                <div className="text-gray-300 mt-1">Live Auctions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-amber-400">
                  {stats.totalUsers.toLocaleString()}+
                </div>
                <div className="text-gray-300 mt-1">Collectors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-amber-400">
                  {stats.successfulSales.toLocaleString()}+
                </div>
                <div className="text-gray-300 mt-1">Successful Sales</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Auctions */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Auctions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover exceptional antiques and collectibles from around the world
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredAuctions.map((auction, index) => (
              <motion.div
                key={auction.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative">
                  <img
                    src={auction.image}
                    alt={auction.title}
                    className="w-full h-64 object-cover"
                  />
                  {auction.isTimeCapsule && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                        <ClockIcon className="w-4 h-4" />
                        <span>Time Capsule</span>
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    {formatTimeLeft(auction.endTime)}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {auction.title}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Current Bid</p>
                      <p className="text-2xl font-bold text-amber-600">
                        ${auction.currentBid.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Bids</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {auction.bidCount}
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/auctions/${auction.id}`}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <span>View Auction</span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/dashboard"
              className="inline-flex items-center space-x-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              <span>View All Auctions</span>
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Unique Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Revolutionary Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of antique collecting with our innovative technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {uniqueFeatures.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-6`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.name}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Security */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trust & Security
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your peace of mind is our priority with advanced fraud detection and authentication
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheckIcon className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Verified Authenticity
              </h3>
              <p className="text-gray-600">
                Every item is authenticated by our expert team and AI-powered verification system.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <UsersIcon className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Expert Network
              </h3>
              <p className="text-gray-600">
                Connect with certified appraisers, restorers, and collectors worldwide.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrophyIcon className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Gamified Experience
              </h3>
              <p className="text-gray-600">
                Earn badges, climb leaderboards, and unlock exclusive collecting privileges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-amber-600 to-orange-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Collection?
            </h2>
            <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
              Join thousands of collectors who trust AntiqueBid for their most precious finds.
            </p>
            <Link
              to="/register"
              className="bg-white text-amber-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-bold text-lg transition-colors duration-200 inline-flex items-center space-x-2"
            >
              <span>Get Started Today</span>
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;