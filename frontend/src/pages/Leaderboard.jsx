import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrophyIcon,
  StarIcon,
  FireIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  UserIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  CheckBadgeIcon,
  BoltIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import {
  TrophyIcon as TrophySolid,
  StarIcon as StarSolid,
  FireIcon as FireSolid,
  AcademicCapIcon as CrownSolid
} from '@heroicons/react/24/solid';

const Leaderboard = () => {
  const [activeCategory, setActiveCategory] = useState('overall');
  const [timeframe, setTimeframe] = useState('all-time');

  // Mock leaderboard data
  const leaderboardData = {
    'overall': [
      {
        id: 1,
        rank: 1,
        name: "Lord Pemberton",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        score: 15420,
        badges: ['Crown Elite', 'Master Collector', 'Verified Expert'],
        specialty: "Victorian Antiques",
        totalSales: 342,
        successRate: 98.7,
        joinDate: "Jan 2019",
        level: "Diamond",
        streak: 45
      },
      {
        id: 2,
        rank: 2,
        name: "Lady Catherine",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b2c4e7c8?w=150",
        score: 14850,
        badges: ['Elite Seller', 'Authenticity Expert', 'Community Leader'],
        specialty: "Fine China & Porcelain",
        totalSales: 298,
        successRate: 99.1,
        joinDate: "Mar 2019",
        level: "Diamond",
        streak: 38
      },
      {
        id: 3,
        rank: 3,
        name: "Antique_Master_92",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        score: 13920,
        badges: ['Silver Specialist', 'Top Bidder', 'Restoration Expert'],
        specialty: "Silver & Metalwork",
        totalSales: 267,
        successRate: 97.8,
        joinDate: "Jun 2019",
        level: "Platinum",
        streak: 23
      },
      {
        id: 4,
        rank: 4,
        name: "CollectorPrime",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
        score: 12780,
        badges: ['Furniture Expert', 'High Roller', 'Trusted Seller'],
        specialty: "Antique Furniture",
        totalSales: 234,
        successRate: 96.5,
        joinDate: "Aug 2019",
        level: "Platinum",
        streak: 31
      },
      {
        id: 5,
        rank: 5,
        name: "VintageVault",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        score: 11650,
        badges: ['Art Connoisseur', 'Rising Star', 'Quality Curator'],
        specialty: "Fine Art & Paintings",
        totalSales: 189,
        successRate: 98.2,
        joinDate: "Nov 2019",
        level: "Gold",
        streak: 19
      }
    ],
    'sellers': [
      {
        id: 1,
        rank: 1,
        name: "Lord Pemberton",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        score: 342,
        metric: "Total Sales",
        earnings: 456780,
        avgSaleValue: 1334,
        level: "Diamond",
        streak: 45
      },
      {
        id: 2,
        rank: 2,
        name: "Lady Catherine",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b2c4e7c8?w=150",
        score: 298,
        metric: "Total Sales",
        earnings: 389450,
        avgSaleValue: 1307,
        level: "Diamond",
        streak: 38
      }
    ],
    'buyers': [
      {
        id: 1,
        rank: 1,
        name: "CollectorSupreme",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
        score: 567,
        metric: "Successful Purchases",
        totalSpent: 234500,
        avgPurchaseValue: 414,
        level: "Diamond",
        streak: 52
      }
    ],
    'authenticators': [
      {
        id: 1,
        rank: 1,
        name: "Dr. Harrison",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        score: 1247,
        metric: "Items Authenticated",
        accuracy: 99.8,
        specialty: "Victorian Silver",
        level: "Expert",
        streak: 67
      }
    ]
  };

  const categories = [
    { id: 'overall', label: 'Overall', icon: TrophyIcon },
    { id: 'sellers', label: 'Top Sellers', icon: CurrencyDollarIcon },
    { id: 'buyers', label: 'Top Buyers', icon: ShieldCheckIcon },
    { id: 'authenticators', label: 'Authenticators', icon: CheckBadgeIcon }
  ];

  const timeframes = [
    { id: 'all-time', label: 'All Time' },
    { id: 'year', label: 'This Year' },
    { id: 'month', label: 'This Month' },
    { id: 'week', label: 'This Week' }
  ];

  const getLevelColor = (level) => {
    const colors = {
      'Diamond': 'from-blue-400 to-purple-600',
      'Platinum': 'from-gray-300 to-gray-500',
      'Gold': 'from-yellow-300 to-yellow-600',
      'Silver': 'from-gray-200 to-gray-400',
      'Bronze': 'from-orange-300 to-orange-600',
      'Expert': 'from-green-400 to-emerald-600'
    };
    return colors[level] || 'from-gray-200 to-gray-400';
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <CrownSolid className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <TrophySolid className="w-6 h-6 text-gray-400" />;
      case 3:
        return <TrophySolid className="w-6 h-6 text-orange-500" />;
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const currentData = leaderboardData[activeCategory] || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <TrophySolid className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-gray-900">Leaderboards</h1>
            <SparklesIcon className="w-8 h-8 text-purple-500" />
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Celebrate the most accomplished collectors, sellers, and experts in our antique community
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      activeCategory === category.id
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{category.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex space-x-2">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {timeframes.map((tf) => (
                  <option key={tf.id} value={tf.id}>
                    {tf.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Podium - Top 3 */}
        {currentData.length >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex justify-center items-end space-x-4 mb-8">
              {/* Second Place */}
              <div className="text-center">
                <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-200">
                  <div className="relative mb-4">
                    <img
                      src={currentData[1]?.avatar}
                      alt={currentData[1]?.name}
                      className="w-20 h-20 rounded-full mx-auto border-4 border-gray-300"
                    />
                    <div className="absolute -top-2 -right-2">
                      <TrophySolid className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{currentData[1]?.name}</h3>
                  <div className="text-2xl font-bold text-purple-600 mb-2">
                    {currentData[1]?.score.toLocaleString()}
                  </div>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm text-white bg-gradient-to-r ${getLevelColor(currentData[1]?.level)}`}>
                    {currentData[1]?.level}
                  </div>
                </div>
                <div className="bg-gray-300 h-32 w-24 mx-auto mt-2 rounded-t-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
              </div>

              {/* First Place */}
              <div className="text-center">
                <div className="bg-white rounded-lg shadow-xl p-6 border-2 border-yellow-400">
                  <div className="relative mb-4">
                    <img
                      src={currentData[0]?.avatar}
                      alt={currentData[0]?.name}
                      className="w-24 h-24 rounded-full mx-auto border-4 border-yellow-400"
                    />
                    <div className="absolute -top-3 -right-3">
                      <CrownSolid className="w-10 h-10 text-yellow-500" />
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{currentData[0]?.name}</h3>
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {currentData[0]?.score.toLocaleString()}
                  </div>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm text-white bg-gradient-to-r ${getLevelColor(currentData[0]?.level)}`}>
                    {currentData[0]?.level}
                  </div>
                  {currentData[0]?.streak && (
                    <div className="flex items-center justify-center space-x-1 mt-2">
                      <FireSolid className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-gray-600">{currentData[0].streak} day streak</span>
                    </div>
                  )}
                </div>
                <div className="bg-yellow-400 h-40 w-24 mx-auto mt-2 rounded-t-lg flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">1</span>
                </div>
              </div>

              {/* Third Place */}
              <div className="text-center">
                <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-orange-200">
                  <div className="relative mb-4">
                    <img
                      src={currentData[2]?.avatar}
                      alt={currentData[2]?.name}
                      className="w-20 h-20 rounded-full mx-auto border-4 border-orange-300"
                    />
                    <div className="absolute -top-2 -right-2">
                      <TrophySolid className="w-8 h-8 text-orange-500" />
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{currentData[2]?.name}</h3>
                  <div className="text-2xl font-bold text-purple-600 mb-2">
                    {currentData[2]?.score.toLocaleString()}
                  </div>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm text-white bg-gradient-to-r ${getLevelColor(currentData[2]?.level)}`}>
                    {currentData[2]?.level}
                  </div>
                </div>
                <div className="bg-orange-400 h-24 w-24 mx-auto mt-2 rounded-t-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Full Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {categories.find(c => c.id === activeCategory)?.label} Rankings
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {currentData.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`p-6 hover:bg-gray-50 transition-colors duration-200 ${
                  user.rank <= 3 ? 'bg-gradient-to-r from-purple-50 to-blue-50' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 flex items-center justify-center w-12">
                      {getRankIcon(user.rank)}
                    </div>
                    
                    <div className="relative">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className={`w-12 h-12 rounded-full border-2 ${
                          user.rank === 1 ? 'border-yellow-400' :
                          user.rank === 2 ? 'border-gray-400' :
                          user.rank === 3 ? 'border-orange-400' :
                          'border-gray-300'
                        }`}
                      />
                      {user.streak && user.streak > 10 && (
                        <div className="absolute -top-1 -right-1">
                          <FireSolid className="w-4 h-4 text-orange-500" />
                        </div>
                      )}
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {user.name}
                        </h3>
                        {user.level && (
                          <div className={`px-2 py-1 rounded text-xs text-white bg-gradient-to-r ${getLevelColor(user.level)}`}>
                            {user.level}
                          </div>
                        )}
                      </div>
                      
                      {activeCategory === 'overall' && (
                        <>
                          <p className="text-sm text-gray-600">{user.specialty}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {user.badges.slice(0, 2).map((badge, badgeIndex) => (
                              <span key={badgeIndex} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                                {badge}
                              </span>
                            ))}
                          </div>
                        </>
                      )}

                      {activeCategory === 'sellers' && (
                        <div className="text-sm text-gray-600">
                          <span>${user.earnings?.toLocaleString()} earned</span>
                          <span className="mx-2">•</span>
                          <span>Avg: ${user.avgSaleValue}</span>
                        </div>
                      )}

                      {activeCategory === 'buyers' && (
                        <div className="text-sm text-gray-600">
                          <span>${user.totalSpent?.toLocaleString()} spent</span>
                          <span className="mx-2">•</span>
                          <span>Avg: ${user.avgPurchaseValue}</span>
                        </div>
                      )}

                      {activeCategory === 'authenticators' && (
                        <div className="text-sm text-gray-600">
                          <span>{user.accuracy}% accuracy</span>
                          <span className="mx-2">•</span>
                          <span>{user.specialty}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 text-right">
                    <div className="text-2xl font-bold text-purple-600">
                      {user.score.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {activeCategory === 'overall' ? 'points' :
                       activeCategory === 'sellers' ? 'sales' :
                       activeCategory === 'buyers' ? 'purchases' :
                       'authenticated'}
                    </div>
                    {user.streak && (
                      <div className="flex items-center justify-end space-x-1 mt-1">
                        <FireSolid className="w-3 h-3 text-orange-500" />
                        <span className="text-xs text-gray-600">{user.streak}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Rankings update daily at midnight UTC. Keep collecting to climb higher! 🏆
            </p>
          </div>
        </motion.div>

        {/* Achievement System Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg text-white p-6"
        >
          <div className="text-center">
            <SparklesIcon className="w-8 h-8 mx-auto mb-3" />
            <h3 className="text-xl font-semibold mb-2">Level Up Your Collection Game</h3>
            <p className="text-purple-100 mb-4">
              Earn points through successful sales, authentic purchases, expert authentication, and community engagement
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">+100</div>
                <div className="text-sm text-purple-200">Successful Sale</div>
              </div>
              <div>
                <div className="text-2xl font-bold">+50</div>
                <div className="text-sm text-purple-200">Quality Purchase</div>
              </div>
              <div>
                <div className="text-2xl font-bold">+25</div>
                <div className="text-sm text-purple-200">Expert Review</div>
              </div>
              <div>
                <div className="text-2xl font-bold">+10</div>
                <div className="text-sm text-purple-200">Daily Login</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard;