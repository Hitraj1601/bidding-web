import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { usersAPI } from '../services/api';
import {
  UserCircleIcon,
  CameraIcon,
  PencilIcon,
  TrophyIcon,
  ShoppingBagIcon,
  HeartIcon,
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
  MapPinIcon,
  CalendarDaysIcon,
  StarIcon,
  ChartBarIcon,
  CheckBadgeIcon,
  ClockIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { 
  StarIcon as StarSolid,
  CheckBadgeIcon as CheckBadgeSolid 
} from '@heroicons/react/24/solid';

const Profile = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    bio: "",
    location: "",
    joinDate: "",
    verified: false,
    specialties: [],
    languages: []
  });
  const [stats, setStats] = useState({
    totalSales: 0,
    totalPurchases: 0,
    successRate: 0,
    avgRating: 0,
    totalEarnings: 0,
    itemsSold: 0,
    currentListings: 0,
    watchlistItems: 0
  });
  const [badges, setBadges] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      
      const [profileRes, statsRes, activityRes] = await Promise.all([
        usersAPI.getProfile(user.id).catch(() => ({ data: { user: user } })),
        usersAPI.getStats(user.id).catch(() => ({ data: { stats: {} } })),
        usersAPI.getActivity(user.id).catch(() => ({ data: { activity: [] } }))
      ]);

      // Set profile data
      const profile = profileRes.data?.user || user;
      setProfileData({
        bio: profile.bio || "Welcome to my antique collection profile!",
        location: profile.location || "Location not specified",
        joinDate: profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : "Recently joined",
        verified: profile.isVerified || false,
        specialties: profile.specializations || [],
        languages: profile.languages || ["English"]
      });

      // Set stats
      const userStats = statsRes.data?.stats || {};
      setStats({
        totalSales: userStats.totalSales || 0,
        totalPurchases: userStats.totalPurchases || 0,
        successRate: userStats.successRate || 0,
        avgRating: userStats.avgRating || 0,
        totalEarnings: userStats.totalEarnings || 0,
        itemsSold: userStats.itemsSold || 0,
        currentListings: userStats.currentListings || 0,
        watchlistItems: userStats.watchlistItems || 0
      });

      // Set badges based on user achievements
      setBadges([
        { id: 1, name: "Verified Seller", icon: CheckBadgeSolid, color: "text-blue-500", earned: profile.isVerified },
        { id: 2, name: "Expert Authenticator", icon: ShieldCheckIcon, color: "text-green-500", earned: userStats.totalSales > 10 },
        { id: 3, name: "Top Collector", icon: TrophyIcon, color: "text-yellow-500", earned: userStats.totalPurchases > 20 },
        { id: 4, name: "Century Club", icon: StarSolid, color: "text-purple-500", earned: userStats.totalSales + userStats.totalPurchases >= 100 },
        { id: 5, name: "Restoration Master", icon: CogIcon, color: "text-orange-500", earned: profile.specializations?.includes('Restoration') },
        { id: 6, name: "Community Leader", icon: HeartIcon, color: "text-pink-500", earned: userStats.avgRating >= 4.8 }
      ]);

      // Set recent activity
      setRecentActivity(activityRes.data?.activity || []);
      
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      toast.error('Failed to load profile data');
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

  const handleSaveProfile = async () => {
    try {
      await usersAPI.updateProfile(user.id, profileData);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: UserCircleIcon },
    { id: 'activity', label: 'Activity', icon: ChartBarIcon },
    { id: 'listings', label: 'My Listings', icon: ShoppingBagIcon },
    { id: 'reviews', label: 'Reviews', icon: StarIcon },
    { id: 'badges', label: 'Achievements', icon: TrophyIcon },
    { id: 'settings', label: 'Settings', icon: CogIcon }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden mb-8"
        >
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-32"></div>
          <div className="relative px-6 pb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="relative -mt-16">
                  <img
                    src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"}
                    alt={user?.name}
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                  <button className="absolute bottom-0 right-0 bg-purple-600 text-white rounded-full p-2 shadow-lg hover:bg-purple-700 transition-colors duration-200">
                    <CameraIcon className="w-5 h-5" />
                  </button>
                </div>
                <div className="pt-4">
                  <div className="flex items-center space-x-2">
                    <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                    {profileData.verified && (
                      <CheckBadgeSolid className="w-6 h-6 text-blue-500" />
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-gray-600 mt-2">
                    <span className="flex items-center space-x-1">
                      <MapPinIcon className="w-4 h-4" />
                      <span>{profileData.location}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <CalendarDaysIcon className="w-4 h-4" />
                      <span>Joined {profileData.joinDate}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <StarSolid className="w-4 h-4 text-yellow-400" />
                      <span>{stats.avgRating}</span>
                    </span>
                  </div>
                  {!isEditing ? (
                    <p className="text-gray-600 mt-3 max-w-2xl">{profileData.bio}</p>
                  ) : (
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      className="mt-3 w-full max-w-2xl px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows={3}
                    />
                  )}
                </div>
              </div>
              <div className="pt-4">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    <PencilIcon className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <div className="space-x-2">
                    <button
                      onClick={handleSaveProfile}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.totalSales}</div>
                <div className="text-sm text-gray-600">Total Sales</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">${stats.totalEarnings.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Earnings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.successRate}%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.currentListings}</div>
                <div className="text-sm text-gray-600">Active Listings</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Specialties */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {profileData.specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {profileData.languages.map((language, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Activity Preview */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {recentActivity.slice(0, 3).map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${
                            activity.type === 'sale' ? 'bg-green-100 text-green-600' :
                            activity.type === 'purchase' ? 'bg-blue-100 text-blue-600' :
                            'bg-purple-100 text-purple-600'
                          }`}>
                            {activity.type === 'sale' ? <CurrencyDollarIcon className="w-4 h-4" /> :
                             activity.type === 'purchase' ? <ShoppingBagIcon className="w-4 h-4" /> :
                             <ClockIcon className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{activity.title}</div>
                            <div className="text-sm text-gray-600">
                              {activity.type === 'listing' ? 'Listed for' : 
                               activity.type === 'sale' ? 'Sold for' : 'Purchased for'} ${activity.amount}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">{activity.date}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-full ${
                          activity.type === 'sale' ? 'bg-green-100 text-green-600' :
                          activity.type === 'purchase' ? 'bg-blue-100 text-blue-600' :
                          'bg-purple-100 text-purple-600'
                        }`}>
                          {activity.type === 'sale' ? <CurrencyDollarIcon className="w-5 h-5" /> :
                           activity.type === 'purchase' ? <ShoppingBagIcon className="w-5 h-5" /> :
                           <ClockIcon className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{activity.title}</div>
                          <div className="text-sm text-gray-600">
                            {activity.type === 'listing' ? 'Listed for' : 
                             activity.type === 'sale' ? 'Sold for' : 'Purchased for'} ${activity.amount}
                          </div>
                          <div className="text-xs text-gray-500">{activity.date}</div>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm ${
                        activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                        activity.status === 'active' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {activity.status}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* My Listings Tab */}
            {activeTab === 'listings' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentListings.map((listing) => (
                    <div key={listing.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
                      <img
                        src={listing.image}
                        alt={listing.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">{listing.title}</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>Current Bid:</span>
                            <span className="font-semibold text-green-600">${listing.currentBid}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Bids:</span>
                            <span>{listing.bids}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Time Left:</span>
                            <span className="text-orange-600">{listing.timeLeft}</span>
                          </div>
                        </div>
                        <button className="w-full mt-3 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium transition-colors duration-200">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{stats.avgRating}</div>
                      <div className="text-sm text-gray-600">Average Rating</div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarSolid
                          key={star}
                          className={`w-6 h-6 ${
                            star <= Math.floor(stats.avgRating) ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-medium text-gray-900">{review.reviewer}</div>
                          <div className="text-sm text-gray-600">{review.item}</div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarSolid
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-2">{review.comment}</p>
                      <div className="text-sm text-gray-500">{review.date}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Achievements Tab */}
            {activeTab === 'badges' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {badges.map((badge) => {
                    const Icon = badge.icon;
                    return (
                      <div
                        key={badge.id}
                        className={`p-6 rounded-lg border-2 text-center ${
                          badge.earned
                            ? 'border-purple-200 bg-purple-50'
                            : 'border-gray-200 bg-gray-50 opacity-60'
                        }`}
                      >
                        <Icon className={`w-12 h-12 mx-auto mb-3 ${badge.color}`} />
                        <h3 className="font-semibold text-gray-900 mb-2">{badge.name}</h3>
                        <div className={`text-sm ${
                          badge.earned ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          {badge.earned ? 'Earned' : 'Not Earned'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span className="text-gray-700">Bid notifications</span>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-gray-700">Auction ending alerts</span>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-gray-700">New message alerts</span>
                        <input type="checkbox" className="rounded" />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-gray-700">Weekly digest</span>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span className="text-gray-700">Show profile to public</span>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-gray-700">Show bid history</span>
                        <input type="checkbox" className="rounded" />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-gray-700">Allow messages from anyone</span>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
                    <div className="space-y-3">
                      <button className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                        Change Password
                      </button>
                      <button className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                        Export Data
                      </button>
                      <button className="w-full text-left px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors duration-200">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;