import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { dashboardAPI, auctionsAPI, itemsAPI } from '../services/api';
import {
  HomeIcon,
  TrophyIcon,
  HeartIcon,
  EyeIcon,
  ClockIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
  BellIcon,
  StarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [dashboardData, setDashboardData] = useState({
    stats: {
      activeAuctions: 0,
      watchingItems: 0,
      wonAuctions: 0,
      totalBids: 0
    },
    recentActivity: [],
    liveAuctions: [],
    watchingItems: [],
    recommendations: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Fetch dashboard stats with proper error handling
      const [statsRes, activityRes, liveAuctionsRes, watchlistRes, recommendationsRes] = await Promise.allSettled([
        dashboardAPI.getStats(),
        dashboardAPI.getActivity(),
        auctionsAPI.getLive(),
        dashboardAPI.getWatchlist(),
        dashboardAPI.getRecommendations()
      ]);

      // Process stats
      let stats = {
        activeAuctions: 0,
        watchingItems: 0,
        wonAuctions: 0,
        totalBids: 0
      };
      if (statsRes.status === 'fulfilled') {
        stats = statsRes.value.data?.stats || stats;
      }

      // Process activity
      let activity = [];
      if (activityRes.status === 'fulfilled') {
        activity = activityRes.value.data?.activity || [];
      }

      // Process live auctions
      let liveAuctions = [];
      if (liveAuctionsRes.status === 'fulfilled') {
        liveAuctions = liveAuctionsRes.value.data?.data?.auctions || [];
      }

      // Process watchlist
      let watchingItems = [];
      if (watchlistRes.status === 'fulfilled') {
        watchingItems = watchlistRes.value.data?.items || [];
      }

      // Process recommendations
      let recommendations = [];
      if (recommendationsRes.status === 'fulfilled') {
        recommendations = recommendationsRes.value.data?.items || [];
      }

      setDashboardData({
        stats,
        recentActivity: activity,
        liveAuctions,
        watchingItems,
        recommendations
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Don't show error toast for failed API calls
      
      // Fallback to empty data structure
      setDashboardData({
        stats: {
          activeAuctions: 0,
          watchingItems: 0,
          wonAuctions: 0,
          totalBids: 0
        },
        recentActivity: [],
        liveAuctions: [],
        watchingItems: [],
        recommendations: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.username}! 
            </h1>
            <p className="text-gray-600">
              Here's what's happening in your collection world
            </p>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <HomeIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Auctions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.stats.activeAuctions || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-amber-100 rounded-lg">
                <EyeIcon className="w-6 h-6 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Watching</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.stats.watchingItems || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrophyIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Won Auctions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.stats.wonAuctions || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ChartBarIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bids</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.stats.totalBids || 0}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-lg shadow"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                <BellIcon className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {dashboardData.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`p-1 rounded-full ${activity.color.replace('text-', 'bg-').replace('600', '100')}`}>
                      <activity.icon className={`w-4 h-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Link
                  to="/notifications"
                  className="text-sm font-medium text-amber-600 hover:text-amber-500"
                >
                  View all activity →
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Live Auctions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2 bg-white rounded-lg shadow"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Live Auctions</h2>
                <Link
                  to="/create-listing"
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Create Listing</span>
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dashboardData.liveAuctions.map((auction) => (
                  <div key={auction.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
                    <div className="relative">
                      <img
                        src={auction.image}
                        alt={auction.title}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                        {auction.timeLeft}
                      </div>
                      {auction.isWatching && (
                        <div className="absolute top-2 left-2">
                          <HeartIcon className="w-5 h-5 text-red-500 fill-current" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-2">{auction.title}</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500">Current Bid</p>
                          <p className="text-lg font-bold text-amber-600">
                            ${auction.currentBid}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Bids</p>
                          <p className="text-sm font-semibold">{auction.bidCount}</p>
                        </div>
                      </div>
                      <Link
                        to={`/auctions/${auction.id}`}
                        className="mt-3 w-full bg-gray-900 hover:bg-gray-800 text-white py-2 px-4 rounded text-sm font-medium transition-colors duration-200 block text-center"
                      >
                        Place Bid
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link
                  to="/auctions"
                  className="text-sm font-medium text-amber-600 hover:text-amber-500"
                >
                  View all auctions →
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg p-8 text-white"
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold mb-2">Ready to discover more treasures?</h3>
              <p className="text-amber-100">
                Explore our unique features and find your next collectible
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/time-capsule"
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                <ClockIcon className="w-4 h-4" />
                <span>Time Capsule</span>
              </Link>
              <Link
                to="/mystery-bids"
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Mystery Bids
              </Link>
              <Link
                to="/collectors"
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Join Network
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Personalized Recommendations */}
        {dashboardData.recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 bg-white rounded-lg shadow"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <StarIcon className="w-5 h-5 text-amber-500" />
                <span>Recommended for You</span>
              </h2>
            </div>
            <div className="p-6">
              {dashboardData.recommendations.map((rec) => (
                <div key={rec.id} className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">{rec.title}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {rec.items.map((item, index) => (
                      <div key={index} className="text-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-24 object-cover rounded-lg mb-2"
                        />
                        <p className="text-xs font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-amber-600">${item.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;