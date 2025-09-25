import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UserGroupIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
  TrophyIcon,
  HeartIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  MapPinIcon,
  TagIcon,
  ClockIcon,
  FireIcon,
  HandRaisedIcon,
  EyeIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  GlobeAltIcon,
  CalendarDaysIcon,
  BellIcon,
  EnvelopeIcon,
  CameraIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const CollectorNetwork = () => {
  const [collectors, setCollectors] = useState([]);
  const [groups, setGroups] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('collectors'); // 'collectors', 'groups', 'events'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // Mock data - replace with actual API calls
    setTimeout(() => {
      setCollectors([
        {
          id: 1,
          name: "Eleanor Whitmore",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100",
          location: "London, UK",
          specialization: "Victorian Jewelry",
          level: "Master Collector",
          levelColor: "text-purple-600",
          reputation: 4.9,
          yearsCollecting: 15,
          itemsOwned: 247,
          totalValue: "$1.2M",
          followers: 1250,
          following: 380,
          isFollowing: false,
          recentActivity: [
            "Won Victorian Diamond Tiara",
            "Listed Edwardian Brooch Collection",
            "Shared expertise on Georgian Rings"
          ],
          expertise: ["Authentication", "Historical Context", "Market Valuation"],
          achievements: [
            "Top Bidder 2023",
            "Authentication Expert",
            "Community Leader",
            "Rare Find Master"
          ],
          bio: "Passionate Victorian jewelry collector with expertise in authentication and historical provenance. Love sharing knowledge with fellow collectors.",
          joinDate: "2019-03-15",
          verifiedExpert: true
        },
        {
          id: 2,
          name: "Marcus Chen",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
          location: "San Francisco, CA",
          specialization: "Chinese Antiquities",
          level: "Expert Collector",
          levelColor: "text-gold-600",
          reputation: 4.8,
          yearsCollecting: 12,
          itemsOwned: 189,
          totalValue: "$850K",
          followers: 980,
          following: 250,
          isFollowing: true,
          recentActivity: [
            "Acquired Ming Dynasty Vase",
            "Hosted Authentication Workshop",
            "Mentored 3 new collectors"
          ],
          expertise: ["Ming Dynasty", "Porcelain", "Calligraphy"],
          achievements: [
            "Cultural Preservation Award",
            "Expert Mentor",
            "Rare Collections Master"
          ],
          bio: "Dedicated to preserving Chinese cultural heritage through collecting. Always happy to help authenticate pieces and share historical knowledge.",
          joinDate: "2020-01-20",
          verifiedExpert: true
        },
        {
          id: 3,
          name: "Isabella Rodriguez",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
          location: "Madrid, Spain",
          specialization: "Art Nouveau",
          level: "Rising Star",
          levelColor: "text-green-600",
          reputation: 4.6,
          yearsCollecting: 5,
          itemsOwned: 78,
          totalValue: "$320K",
          followers: 450,
          following: 180,
          isFollowing: false,
          recentActivity: [
            "Discovered hidden Lalique piece",
            "Won Tiffany Lamp auction",
            "Started Art Nouveau study group"
          ],
          expertise: ["Glass Art", "Decorative Arts", "Period Research"],
          achievements: [
            "Rising Collector 2023",
            "Discovery Expert",
            "Community Builder"
          ],
          bio: "Art Nouveau enthusiast with a keen eye for undiscovered gems. Love the artistic movement's fusion of nature and craftsmanship.",
          joinDate: "2021-06-10",
          verifiedExpert: false
        }
      ]);

      setGroups([
        {
          id: 1,
          name: "Victorian Era Collectors",
          description: "Dedicated to preserving and discussing Victorian antiques and collectibles",
          memberCount: 1247,
          category: "Historical Period",
          privacy: "Public",
          image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300",
          activity: "Very Active",
          recentPosts: [
            "Authentication help needed - Victorian mourning jewelry",
            "Amazing find at estate sale - Whitby jet collection",
            "Discussion: Victorian silver hallmarks identification"
          ],
          moderators: ["Eleanor Whitmore", "James Patterson"],
          tags: ["Victorian", "Jewelry", "Silver", "Furniture"],
          joined: false
        },
        {
          id: 2,
          name: "Asian Art & Antiques",
          description: "Community for collectors of Asian art, ceramics, and cultural artifacts",
          memberCount: 892,
          category: "Cultural/Regional",
          privacy: "Public",
          image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300",
          activity: "Active",
          recentPosts: [
            "Ming dynasty authentication workshop this weekend",
            "Rare Satsuma vase up for discussion",
            "Japanese woodblock print identification guide"
          ],
          moderators: ["Marcus Chen", "Yuki Tanaka"],
          tags: ["Chinese", "Japanese", "Ceramics", "Art"],
          joined: true
        },
        {
          id: 3,
          name: "Art Nouveau & Art Deco",
          description: "Celebrating the artistic movements that shaped decorative arts",
          memberCount: 634,
          category: "Art Movement",
          privacy: "Public",
          image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300",
          activity: "Growing",
          recentPosts: [
            "Tiffany Studios lamp authentication tips",
            "Lalique vs. Daum: Identifying Art Nouveau glass",
            "Art Deco furniture market trends discussion"
          ],
          moderators: ["Isabella Rodriguez", "Pierre Dubois"],
          tags: ["Art Nouveau", "Art Deco", "Glass", "Furniture"],
          joined: false
        }
      ]);

      setEvents([
        {
          id: 1,
          title: "Victorian Jewelry Authentication Workshop",
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          time: "2:00 PM - 4:00 PM EST",
          type: "Workshop",
          format: "Virtual",
          host: "Eleanor Whitmore",
          hostAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=50",
          attendees: 45,
          maxAttendees: 50,
          price: "Free",
          description: "Learn to authenticate Victorian jewelry pieces with expert Eleanor Whitmore. Covers hallmarks, materials, and period characteristics.",
          category: "Education",
          difficulty: "Beginner to Intermediate",
          isRegistered: false
        },
        {
          id: 2,
          title: "Collector Meetup: San Francisco Bay Area",
          date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          time: "1:00 PM - 5:00 PM PST",
          type: "Meetup",
          format: "In-Person",
          location: "San Francisco, CA",
          host: "Marcus Chen",
          hostAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50",
          attendees: 23,
          maxAttendees: 30,
          price: "$15",
          description: "Monthly collector meetup with show-and-tell, expert discussions, and networking. Bring your favorite recent finds!",
          category: "Social",
          difficulty: "All Levels",
          isRegistered: true
        },
        {
          id: 3,
          title: "Art Nouveau Glass: History & Identification",
          date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
          time: "7:00 PM - 8:30 PM CET",
          type: "Lecture",
          format: "Virtual",
          host: "Isabella Rodriguez",
          hostAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50",
          attendees: 67,
          maxAttendees: 100,
          price: "$25",
          description: "Comprehensive overview of Art Nouveau glass makers including Tiffany, Lalique, and Daum. Includes identification techniques.",
          category: "Education",
          difficulty: "Intermediate",
          isRegistered: false
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const categories = [
    'all', 'Historical Period', 'Cultural/Regional', 'Art Movement', 
    'Material Type', 'Price Range', 'Authentication'
  ];

  const tabs = [
    { id: 'collectors', name: 'Collectors', icon: UserGroupIcon, count: collectors.length },
    { id: 'groups', name: 'Groups', icon: ChatBubbleLeftRightIcon, count: groups.length },
    { id: 'events', name: 'Events', icon: CalendarDaysIcon, count: events.length }
  ];

  const handleFollow = (collectorId) => {
    setCollectors(collectors.map(collector => 
      collector.id === collectorId 
        ? { ...collector, isFollowing: !collector.isFollowing }
        : collector
    ));
  };

  const handleJoinGroup = (groupId) => {
    setGroups(groups.map(group => 
      group.id === groupId 
        ? { ...group, joined: !group.joined }
        : group
    ));
  };

  const handleRegisterEvent = (eventId) => {
    setEvents(events.map(event => 
      event.id === eventId 
        ? { ...event, isRegistered: !event.isRegistered }
        : event
    ));
  };

  const filteredContent = () => {
    switch (activeTab) {
      case 'collectors':
        return collectors.filter(collector => 
          collector.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          collector.specialization.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 'groups':
        return groups.filter(group => 
          group.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (selectedCategory === 'all' || group.category === selectedCategory)
        );
      case 'events':
        return events.filter(event => 
          event.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      default:
        return [];
    }
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
      <section className="bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex items-center justify-center space-x-3 mb-6">
              <UserGroupIcon className="w-12 h-12 text-purple-300" />
              <h1 className="text-4xl md:text-6xl font-bold">Collector Network</h1>
            </div>
            <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Connect with fellow collectors, share expertise, and build lasting relationships 
              in the antique collecting community.
            </p>
            
            {/* Network Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                <UserGroupIcon className="w-6 h-6 text-purple-300 mx-auto mb-2" />
                <div className="text-2xl font-bold">12,547</div>
                <div className="text-sm text-purple-200">Active Collectors</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-purple-300 mx-auto mb-2" />
                <div className="text-2xl font-bold">89</div>
                <div className="text-sm text-purple-200">Collector Groups</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                <TrophyIcon className="w-6 h-6 text-purple-300 mx-auto mb-2" />
                <div className="text-2xl font-bold">156</div>
                <div className="text-sm text-purple-200">Expert Mentors</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                <CalendarDaysIcon className="w-6 h-6 text-purple-300 mx-auto mb-2" />
                <div className="text-2xl font-bold">23</div>
                <div className="text-sm text-purple-200">This Month's Events</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8">
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
                    <Icon className="w-5 h-5" />
                    <span>{tab.name}</span>
                    <span className="bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          {activeTab === 'groups' && (
            <div className="flex items-center space-x-2">
              <FunnelIcon className="w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Content Display */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Collectors Tab */}
          {activeTab === 'collectors' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContent().map((collector) => (
                <motion.div
                  key={collector.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative">
                    <div className="h-32 bg-gradient-to-br from-purple-400 to-indigo-600"></div>
                    <div className="absolute -bottom-8 left-6">
                      <img
                        src={collector.avatar}
                        alt={collector.name}
                        className="w-16 h-16 rounded-full border-4 border-white object-cover"
                      />
                    </div>
                    {collector.verifiedExpert && (
                      <div className="absolute top-4 right-4">
                        <ShieldCheckIcon className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-10 px-6 pb-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-gray-900">{collector.name}</h3>
                      <div className="flex items-center space-x-2 mb-1">
                        <MapPinIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{collector.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TagIcon className="w-4 h-4 text-purple-500" />
                        <span className="text-sm font-medium text-purple-600">{collector.specialization}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${collector.levelColor} bg-gray-100`}>
                        {collector.level}
                      </span>
                      <div className="flex items-center space-x-1">
                        <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{collector.reputation}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{collector.itemsOwned}</div>
                        <div className="text-xs text-gray-500">Items</div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{collector.followers}</div>
                        <div className="text-xs text-gray-500">Followers</div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{collector.yearsCollecting}y</div>
                        <div className="text-xs text-gray-500">Experience</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-xs text-gray-500 mb-1">Recent Activity:</div>
                      <div className="space-y-1">
                        {collector.recentActivity.slice(0, 2).map((activity, idx) => (
                          <div key={idx} className="text-xs text-gray-600 flex items-start space-x-1">
                            <div className="w-1 h-1 bg-purple-400 rounded-full mt-1.5 flex-shrink-0"></div>
                            <span className="line-clamp-1">{activity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleFollow(collector.id)}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
                          collector.isFollowing
                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            : 'bg-purple-600 text-white hover:bg-purple-700'
                        }`}
                      >
                        {collector.isFollowing ? 'Following' : 'Follow'}
                      </button>
                      <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        <EnvelopeIcon className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Groups Tab */}
          {activeTab === 'groups' && (
            <div className="space-y-6">
              {filteredContent().map((group) => (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="md:flex">
                    <div className="md:w-48 h-48 md:h-auto">
                      <img
                        src={group.image}
                        alt={group.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{group.name}</h3>
                          <p className="text-gray-600 mb-3">{group.description}</p>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <UserGroupIcon className="w-4 h-4" />
                              <span>{group.memberCount.toLocaleString()} members</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <TagIcon className="w-4 h-4" />
                              <span>{group.category}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <FireIcon className="w-4 h-4" />
                              <span>{group.activity}</span>
                            </div>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleJoinGroup(group.id)}
                          className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                            group.joined
                              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              : 'bg-purple-600 text-white hover:bg-purple-700'
                          }`}
                        >
                          {group.joined ? 'Joined' : 'Join Group'}
                        </button>
                      </div>
                      
                      <div className="mb-4">
                        <div className="text-sm font-medium text-gray-900 mb-2">Recent Discussions:</div>
                        <div className="space-y-1">
                          {group.recentPosts.slice(0, 3).map((post, idx) => (
                            <div key={idx} className="text-sm text-gray-600 flex items-start space-x-1">
                              <div className="w-1 h-1 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="line-clamp-1">{post}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {group.tags.slice(0, 4).map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          Moderated by {group.moderators.join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div className="space-y-6">
              {filteredContent().map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            event.type === 'Workshop' ? 'bg-blue-100 text-blue-600' :
                            event.type === 'Meetup' ? 'bg-green-100 text-green-600' :
                            'bg-purple-100 text-purple-600'
                          }`}>
                            {event.type}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            event.format === 'Virtual' ? 'bg-gray-100 text-gray-600' :
                            'bg-orange-100 text-orange-600'
                          }`}>
                            {event.format}
                          </span>
                          <span className="text-xs text-gray-500">{event.difficulty}</span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                        <p className="text-gray-600 mb-4">{event.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <CalendarDaysIcon className="w-4 h-4" />
                              <span>{event.date.toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <ClockIcon className="w-4 h-4" />
                              <span>{event.time}</span>
                            </div>
                            {event.location && (
                              <div className="flex items-center space-x-2">
                                <MapPinIcon className="w-4 h-4" />
                                <span>{event.location}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <UserGroupIcon className="w-4 h-4" />
                              <span>{event.attendees}/{event.maxAttendees} attendees</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">Price: {event.price}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <img
                                src={event.hostAvatar}
                                alt={event.host}
                                className="w-6 h-6 rounded-full"
                              />
                              <span>Hosted by {event.host}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-6">
                        <button
                          onClick={() => handleRegisterEvent(event.id)}
                          className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                            event.isRegistered
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-purple-600 text-white hover:bg-purple-700'
                          }`}
                        >
                          {event.isRegistered ? 'Registered' : 'Register'}
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-500">
                        Category: {event.category}
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                          <BellIcon className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                          <EnvelopeIcon className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                          <EyeIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CollectorNetwork;