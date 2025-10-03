import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { 
  HomeIcon, 
  UserIcon, 
  PlusIcon,
  TrophyIcon,
  UsersIcon,
  DocumentTextIcon,
  CubeIcon,
  ClockIcon,
  QuestionMarkCircleIcon,
  WrenchScrewdriverIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  HeartIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Navigation links
  const publicLinks = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'Items', path: '/items', icon: CubeIcon },
    { name: 'Time Capsule', path: '/time-capsule', icon: ClockIcon },
    { name: 'Mystery Bids', path: '/mystery-bids', icon: QuestionMarkCircleIcon },
    { name: 'Restoration', path: '/restoration', icon: WrenchScrewdriverIcon },
  ];

  const authenticatedLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
    { name: 'Create Listing', path: '/create-listing', icon: PlusIcon },
    { name: 'Collectors', path: '/collectors', icon: UsersIcon },
    { name: 'Profile', path: '/profile', icon: UserIcon },
  ];

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
              <CubeIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">AntiqueBid</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {(isAuthenticated ? authenticatedLinks : publicLinks).map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActivePath(link.path)
                    ? 'text-amber-600 bg-amber-50'
                    : 'text-gray-700 hover:text-amber-600 hover:bg-gray-50'
                }`}
              >
                <link.icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          {/* Right side - Auth buttons or user menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 relative"
                  >
                    <BellIcon className="w-6 h-6" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {notifications.length}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                      >
                        <div className="p-4">
                          <h3 className="text-lg font-medium text-gray-900 mb-3">
                            Notifications
                          </h3>
                          {notifications.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">
                              No new notifications
                            </p>
                          ) : (
                            <div className="space-y-3">
                              {notifications.map((notification, index) => (
                                <div
                                  key={index}
                                  className="p-3 bg-gray-50 rounded-lg text-sm"
                                >
                                  {notification.message}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* User Avatar and Info */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <img
                      src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=f59e0b&color=fff`}
                      alt={user.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="text-sm">
                      <p className="text-gray-900 font-medium">{user.username || user.firstName || 'User'}</p>
                      <p className="text-gray-500 text-xs">
                        Level {user.level || 1} • {user.points || user.prestige || 0} pts
                      </p>
                    </div>
                  </div>
                  
                  {/* Badges */}
                  {user.badges && user.badges.length > 0 && (
                    <div className="flex space-x-1">
                      {user.badges.slice(0, 3).map((badge, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-full"
                          title={badge.name}
                        >
                          {badge.icon || '🏆'}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors duration-200"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-amber-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-amber-600 p-2"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 pt-2 pb-3 space-y-1">
              {(isAuthenticated ? authenticatedLinks : publicLinks).map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                    isActivePath(link.path)
                      ? 'text-amber-600 bg-amber-50'
                      : 'text-gray-700 hover:text-amber-600 hover:bg-gray-50'
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  <span>{link.name}</span>
                </Link>
              ))}

              {/* Mobile Auth Section */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center space-x-3 px-3 py-2">
                      <img
                        src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=f59e0b&color=fff`}
                        alt={user.username}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="text-gray-900 font-medium">{user.username}</p>
                        <p className="text-gray-500 text-sm">
                          Level {user.level} • {user.prestige} pts
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-md"
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 text-gray-700 hover:text-amber-600 rounded-md text-base font-medium"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 bg-amber-600 text-white rounded-md text-base font-medium hover:bg-amber-700"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;