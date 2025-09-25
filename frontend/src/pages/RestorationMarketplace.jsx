import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  WrenchScrewdriverIcon,
  UserIcon,
  StarIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
  PhotoIcon,
  HandRaisedIcon,
  CheckCircleIcon,
  AcademicCapIcon,
  TrophyIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  HeartIcon,
  TagIcon,
  BeakerIcon,
  CameraIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  GlobeAltIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const RestorationMarketplace = () => {
  const [experts, setExperts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('experts'); // 'experts', 'projects'
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  useEffect(() => {
    // Mock data - replace with actual API calls
    setTimeout(() => {
      setExperts([
        {
          id: 1,
          name: "Dr. Margaret Harrison",
          title: "Master Furniture Restorer",
          specialties: ["Victorian Furniture", "Antique Wood", "French Polish"],
          location: "London, UK",
          experience: 25,
          rating: 4.9,
          reviewCount: 127,
          hourlyRate: "$85-120",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=200",
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
          bio: "Specialized in Victorian and Edwardian furniture restoration with over 25 years of experience. Graduated from the West Dean College of Arts and Conservation.",
          recentProjects: [
            "Regency Mahogany Dining Table",
            "Victorian Walnut Wardrobe",
            "Georgian Writing Desk"
          ],
          priceRange: "Premium",
          insurance: true,
          guarantee: "2 years"
        },
        {
          id: 2,
          name: "Alessandro Rossi",
          title: "Master Ceramics Restorer",
          specialties: ["Italian Majolica", "Porcelain Repair", "Crack Restoration"],
          location: "Florence, Italy",
          experience: 18,
          rating: 4.8,
          reviewCount: 89,
          hourlyRate: "$75-100",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
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
          bio: "Third-generation ceramics restorer specializing in Italian Renaissance pottery and European porcelain. Trained in traditional Florentine techniques.",
          recentProjects: [
            "16th Century Majolica Vase",
            "Meissen Porcelain Set",
            "Della Robbia Sculpture"
          ],
          priceRange: "High",
          insurance: true,
          guarantee: "18 months"
        },
        {
          id: 3,
          name: "Sarah Chen",
          title: "Textile & Tapestry Specialist",
          specialties: ["Silk Restoration", "Tapestry Repair", "Historic Textiles"],
          location: "New York, NY, USA",
          experience: 12,
          rating: 4.7,
          reviewCount: 64,
          hourlyRate: "$60-90",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
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
          bio: "Specializing in Asian textiles and European tapestries with focus on traditional hand-weaving techniques and natural fiber preservation.",
          recentProjects: [
            "17th Century French Tapestry",
            "Ming Dynasty Silk Scroll",
            "Victorian Needlepoint"
          ],
          priceRange: "Medium",
          insurance: true,
          guarantee: "1 year"
        }
      ]);

      setProjects([
        {
          id: 1,
          title: "Victorian Mahogany Secretary Desk",
          description: "Antique writing desk requiring drawer repair and wood refinishing",
          category: "Furniture",
          condition: "Good - Minor Damage",
          budget: "$800-1200",
          timeline: "4-6 weeks",
          location: "Boston, MA, USA",
          postedBy: "Elizabeth Morgan",
          postedDate: "2024-01-15",
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
          proposals: 7,
          status: "Open",
          urgency: "Medium",
          materials: "Mahogany wood, brass hardware",
          dimensions: "48\" W x 24\" D x 42\" H",
          age: "1890s",
          preferredExpert: "Furniture restoration specialist"
        },
        {
          id: 2,
          title: "Chinese Porcelain Vase - Crack Repair",
          description: "Ming Dynasty-style vase with hairline crack requiring expert restoration",
          category: "Ceramics",
          condition: "Fair - Crack Damage",
          budget: "$500-800",
          timeline: "2-3 weeks",
          location: "San Francisco, CA, USA",
          postedBy: "James Liu",
          postedDate: "2024-01-12",
          images: [
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400"
          ],
          issues: [
            "3-inch hairline crack",
            "Small chip on rim",
            "Discoloration around crack"
          ],
          proposals: 4,
          status: "In Progress",
          urgency: "High",
          materials: "Porcelain",
          dimensions: "12\" H x 6\" diameter",
          age: "19th century",
          preferredExpert: "Ceramics specialist with Asian art experience"
        },
        {
          id: 3,
          title: "Antique Persian Carpet Restoration",
          description: "Hand-woven Persian rug needing edge repair and color restoration",
          category: "Textiles",
          condition: "Fair - Edge Wear",
          budget: "$1500-2500",
          timeline: "6-8 weeks",
          location: "London, UK",
          postedBy: "Raj Patel",
          postedDate: "2024-01-10",
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
          proposals: 5,
          status: "Open",
          urgency: "Low",
          materials: "Wool, silk highlights",
          dimensions: "9' x 12'",
          age: "Early 20th century",
          preferredExpert: "Textile restoration specialist"
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const categories = ['all', 'Furniture', 'Ceramics', 'Textiles', 'Metalwork', 'Glass', 'Paintings', 'Books & Paper'];
  const locations = ['all', 'Local (50 miles)', 'United States', 'Europe', 'Asia', 'Worldwide'];

  const tabs = [
    { id: 'experts', name: 'Find Experts', icon: UserIcon, count: experts.length },
    { id: 'projects', name: 'Browse Projects', icon: WrenchScrewdriverIcon, count: projects.length }
  ];

  const filteredExperts = experts.filter(expert => 
    expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expert.specialties.some(specialty => specialty.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'all' || project.category === selectedCategory)
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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
      <section className="bg-gradient-to-br from-orange-900 via-red-800 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex items-center justify-center space-x-3 mb-6">
              <WrenchScrewdriverIcon className="w-12 h-12 text-orange-300" />
              <h1 className="text-4xl md:text-6xl font-bold">Restoration Marketplace</h1>
            </div>
            <p className="text-xl md:text-2xl text-orange-100 mb-8 max-w-3xl mx-auto">
              Connect with master craftspeople and restoration experts. Preserve history with professional care.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                <UserIcon className="w-6 h-6 text-orange-300 mx-auto mb-2" />
                <div className="text-2xl font-bold">47</div>
                <div className="text-sm text-orange-200">Verified Experts</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                <WrenchScrewdriverIcon className="w-6 h-6 text-orange-300 mx-auto mb-2" />
                <div className="text-2xl font-bold">128</div>
                <div className="text-sm text-orange-200">Active Projects</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                <CheckCircleIcon className="w-6 h-6 text-orange-300 mx-auto mb-2" />
                <div className="text-2xl font-bold">96%</div>
                <div className="text-sm text-orange-200">Success Rate</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                <TrophyIcon className="w-6 h-6 text-orange-300 mx-auto mb-2" />
                <div className="text-2xl font-bold">1,247</div>
                <div className="text-sm text-orange-200">Completed</div>
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
                        ? 'border-orange-500 text-orange-600'
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
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          
          {activeTab === 'projects' && (
            <>
              <div className="flex items-center space-x-2">
                <FunnelIcon className="w-5 h-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <MapPinIcon className="w-5 h-5 text-gray-400" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {locations.map(location => (
                    <option key={location} value={location}>
                      {location === 'all' ? 'All Locations' : location}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>

        {/* Content Display */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          
          {/* Experts Tab */}
          {activeTab === 'experts' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredExperts.map((expert) => (
                <motion.div
                  key={expert.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Expert Header */}
                  <div className="relative">
                    <div className="h-32 bg-gradient-to-br from-orange-400 to-red-500"></div>
                    <div className="absolute -bottom-8 left-6">
                      <img
                        src={expert.avatar}
                        alt={expert.name}
                        className="w-16 h-16 rounded-full border-4 border-white object-cover"
                      />
                    </div>
                    <div className="absolute top-4 right-4 flex space-x-2">
                      {expert.verified && (
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                          <ShieldCheckIcon className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        expert.availability === 'Available' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-yellow-500 text-white'
                      }`}>
                        {expert.availability}
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-10 px-6 pb-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-gray-900">{expert.name}</h3>
                      <p className="text-orange-600 font-medium text-sm">{expert.title}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <MapPinIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{expert.location}</span>
                      </div>
                    </div>

                    {/* Rating and Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                      <div>
                        <div className="flex items-center justify-center space-x-1">
                          <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-semibold">{expert.rating}</span>
                        </div>
                        <div className="text-xs text-gray-500">{expert.reviewCount} reviews</div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{expert.completedProjects}</div>
                        <div className="text-xs text-gray-500">Projects</div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{expert.experience}y</div>
                        <div className="text-xs text-gray-500">Experience</div>
                      </div>
                    </div>

                    {/* Specialties */}
                    <div className="mb-4">
                      <div className="text-xs text-gray-500 mb-2">Specialties:</div>
                      <div className="flex flex-wrap gap-1">
                        {expert.specialties.slice(0, 3).map((specialty, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-medium"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Pricing and Response */}
                    <div className="mb-4 text-sm">
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-600">Hourly Rate:</span>
                        <span className="font-medium text-green-600">{expert.hourlyRate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Response Time:</span>
                        <span className="text-gray-900">{expert.responseTime}</span>
                      </div>
                    </div>

                    {/* Portfolio Preview */}
                    <div className="mb-4">
                      <div className="text-xs text-gray-500 mb-2">Recent Work:</div>
                      <div className="grid grid-cols-3 gap-1">
                        {expert.portfolio.slice(0, 3).map((image, idx) => (
                          <img
                            key={idx}
                            src={image}
                            alt={`${expert.name} work ${idx + 1}`}
                            className="w-full h-16 object-cover rounded cursor-pointer hover:opacity-75 transition-opacity"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200">
                        Contact Expert
                      </button>
                      <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        <EyeIcon className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        <HeartIcon className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="md:flex">
                    {/* Project Images */}
                    <div className="md:w-64 h-48 md:h-auto">
                      <div className="relative h-full">
                        <img
                          src={project.images[0]}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                        {project.images.length > 1 && (
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                            +{project.images.length - 1} more
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Project Details */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                              {project.status}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getUrgencyColor(project.urgency)}`}>
                              {project.urgency} Priority
                            </span>
                          </div>
                          
                          <p className="text-gray-600 mb-4">{project.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
                            <div className="flex items-center space-x-2">
                              <CurrencyDollarIcon className="w-4 h-4 text-green-500" />
                              <div>
                                <div className="text-gray-500">Budget</div>
                                <div className="font-medium">{project.budget}</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <ClockIcon className="w-4 h-4 text-blue-500" />
                              <div>
                                <div className="text-gray-500">Timeline</div>
                                <div className="font-medium">{project.timeline}</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPinIcon className="w-4 h-4 text-purple-500" />
                              <div>
                                <div className="text-gray-500">Location</div>
                                <div className="font-medium">{project.location}</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <HandRaisedIcon className="w-4 h-4 text-orange-500" />
                              <div>
                                <div className="text-gray-500">Proposals</div>
                                <div className="font-medium">{project.proposals}</div>
                              </div>
                            </div>
                          </div>

                          {/* Issues List */}
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">Issues to Address:</h4>
                            <div className="space-y-1">
                              {project.issues.slice(0, 3).map((issue, idx) => (
                                <div key={idx} className="flex items-start space-x-2 text-sm text-gray-600">
                                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                                  <span>{issue}</span>
                                </div>
                              ))}
                              {project.issues.length > 3 && (
                                <div className="text-sm text-gray-500 ml-3.5">
                                  +{project.issues.length - 3} more issues
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Project Details */}
                          <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 mb-4">
                            <div><strong>Category:</strong> {project.category}</div>
                            <div><strong>Age:</strong> {project.age}</div>
                            <div><strong>Materials:</strong> {project.materials}</div>
                            <div><strong>Dimensions:</strong> {project.dimensions}</div>
                          </div>
                        </div>
                        
                        <div className="ml-6 text-right">
                          <div className="text-sm text-gray-500 mb-2">Posted by</div>
                          <div className="font-medium text-gray-900 mb-1">{project.postedBy}</div>
                          <div className="text-xs text-gray-500 mb-4">
                            {new Date(project.postedDate).toLocaleDateString()}
                          </div>
                          
                          <div className="space-y-2">
                            <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200">
                              Submit Proposal
                            </button>
                            <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors duration-200 text-sm">
                              More Details
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-500">
                          Condition: <span className="font-medium">{project.condition}</span>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                            <ChatBubbleLeftRightIcon className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                            <HeartIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 bg-gradient-to-r from-orange-600 to-red-700 rounded-2xl p-8 text-white"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Network</h2>
            <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
              Whether you're a collector needing restoration services or a master craftsperson offering expertise, 
              join our trusted community today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-orange-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200">
                Become an Expert
              </button>
              <button className="bg-orange-800 text-white px-8 py-3 rounded-lg font-medium hover:bg-orange-900 transition-colors duration-200">
                Post a Project
              </button>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default RestorationMarketplace;