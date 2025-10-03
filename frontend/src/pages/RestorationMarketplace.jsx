import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { restorationAPI } from '../services/api';
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
  const [stats, setStats] = useState({
    verifiedExperts: 0,
    activeProjects: 0,
    successRate: 0,
    completedProjects: 0
  });
  const [activeTab, setActiveTab] = useState('experts'); // 'experts', 'projects'
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [showExpertModal, setShowExpertModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [expertForm, setExpertForm] = useState({
    name: '',
    title: '',
    specialties: '',
    location: '',
    experience: '',
    bio: ''
  });
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    category: 'Furniture',
    condition: 'Good - Minor Damage',
    budget: { min: '', max: '', currency: 'USD' },
    timeline: '',
    location: '',
    materials: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats, experts, and projects in parallel
      const [statsResponse, expertsResponse, projectsResponse] = await Promise.all([
        restorationAPI.getStats(),
        restorationAPI.getExperts({ limit: 50 }),
        restorationAPI.getProjects({ limit: 50 })
      ]);

      if (statsResponse.data.success) {
        setStats(statsResponse.data.data);
      }

      if (expertsResponse.data.success) {
        setExperts(expertsResponse.data.data);
      }

      if (projectsResponse.data.success) {
        setProjects(projectsResponse.data.data);
      }
    } catch (error) {
      console.error('Error fetching restoration data:', error);
      // Keep empty arrays if API fails
      setExperts([]);
      setProjects([]);
      setStats({
        verifiedExperts: 0,
        activeProjects: 0,
        successRate: 0,
        completedProjects: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const categories = ['all', 'Furniture', 'Ceramics', 'Textiles', 'Metalwork', 'Glass', 'Paintings', 'Books & Paper'];
  const locations = ['all', 'Local (50 miles)', 'United States', 'Europe', 'Asia', 'Worldwide'];

  const tabs = [
    { id: 'experts', name: 'Find Experts', icon: UserIcon, count: experts.length },
    { id: 'projects', name: 'Browse Projects', icon: WrenchScrewdriverIcon, count: projects.length }
  ];

  const filteredExperts = experts.filter(expert => 
    expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (expert.specialties && Array.isArray(expert.specialties) && 
     expert.specialties.some(specialty => specialty.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'all' || project.category === selectedCategory)
  );

  const handleExpertSubmit = async (e) => {
    e.preventDefault();
    try {
      const expertData = {
        ...expertForm,
        specialties: expertForm.specialties.split(',').map(s => s.trim()),
        experience: parseInt(expertForm.experience),
        hourlyRate: { min: 50, max: 100, currency: 'USD' }, // Default values
        verified: false,
        availability: 'Available',
        completedProjects: 0,
        responseTime: 'Within 24 hours',
        rating: 0,
        reviewCount: 0
      };

      await restorationAPI.createExpert(expertData);
      alert('Expert application submitted successfully! We will review and contact you soon.');
      setShowExpertModal(false);
      setExpertForm({
        name: '',
        title: '',
        specialties: '',
        location: '',
        experience: '',
        bio: ''
      });
      fetchData(); // Refresh the data
    } catch (error) {
      console.error('Error submitting expert application:', error);
      alert('Failed to submit application. Please try again.');
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      const projectData = {
        ...projectForm,
        budget: {
          min: parseInt(projectForm.budget.min),
          max: parseInt(projectForm.budget.max),
          currency: projectForm.budget.currency
        },
        postedBy: 'Anonymous User', // Default value
        proposalCount: 0,
        status: 'Open',
        urgency: 'Medium',
        issues: []
      };

      await restorationAPI.createProject(projectData);
      alert('Project posted successfully! Experts will start submitting proposals soon.');
      setShowProjectModal(false);
      setProjectForm({
        title: '',
        description: '',
        category: 'Furniture',
        condition: 'Good - Minor Damage',
        budget: { min: '', max: '', currency: 'USD' },
        timeline: '',
        location: '',
        materials: ''
      });
      fetchData(); // Refresh the data
    } catch (error) {
      console.error('Error posting project:', error);
      alert('Failed to post project. Please try again.');
    }
  };

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
                <div className="text-2xl font-bold">{stats.verifiedExperts}</div>
                <div className="text-sm text-orange-200">Verified Experts</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                <WrenchScrewdriverIcon className="w-6 h-6 text-orange-300 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.activeProjects}</div>
                <div className="text-sm text-orange-200">Active Projects</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                <CheckCircleIcon className="w-6 h-6 text-orange-300 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.successRate}%</div>
                <div className="text-sm text-orange-200">Success Rate</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                <TrophyIcon className="w-6 h-6 text-orange-300 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.completedProjects}</div>
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
              {loading ? (
                // Loading skeleton
                [...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
                    <div className="h-32 bg-gray-300"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded mb-4 w-2/3"></div>
                      <div className="flex space-x-2 mb-4">
                        <div className="h-6 bg-gray-300 rounded w-16"></div>
                        <div className="h-6 bg-gray-300 rounded w-20"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : filteredExperts.length === 0 ? (
                // Empty state
                <div className="col-span-full text-center py-12">
                  <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No restoration experts found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {experts.length === 0 
                      ? "No experts available at the moment. Check back later!"
                      : "Try adjusting your search filters to find experts."}
                  </p>
                </div>
              ) : (
                filteredExperts.map((expert) => (
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
                        {expert.specialties && Array.isArray(expert.specialties) && expert.specialties.slice(0, 3).map((specialty, idx) => (
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
                        <span className="font-medium text-green-600">
                          {typeof expert.hourlyRate === 'object' 
                            ? `$${expert.hourlyRate.min}-${expert.hourlyRate.max}/${expert.hourlyRate.currency || 'USD'}` 
                            : expert.hourlyRate}
                        </span>
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
                        {expert.portfolio && Array.isArray(expert.portfolio) && expert.portfolio.slice(0, 3).map((image, idx) => (
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
                ))
              )}
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              {loading ? (
                // Loading skeleton
                [...Array(5)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="h-6 bg-gray-300 rounded mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                      </div>
                      <div className="h-8 w-16 bg-gray-300 rounded"></div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="h-4 bg-gray-300 rounded"></div>
                      <div className="h-4 bg-gray-300 rounded"></div>
                      <div className="h-4 bg-gray-300 rounded"></div>
                      <div className="h-4 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                ))
              ) : filteredProjects.length === 0 ? (
                // Empty state
                <div className="text-center py-12">
                  <WrenchScrewdriverIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No restoration projects found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {projects.length === 0 
                      ? "No projects available at the moment. Check back later!"
                      : "Try adjusting your search filters to find projects."}
                  </p>
                </div>
              ) : (
                filteredProjects.map((project) => (
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
                                <div className="font-medium">
                                  {typeof project.budget === 'object' 
                                    ? `$${project.budget.min}-${project.budget.max} ${project.budget.currency || 'USD'}` 
                                    : project.budget}
                                </div>
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
                ))
              )}
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
              <button 
                onClick={() => setShowExpertModal(true)}
                className="bg-white text-orange-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200"
              >
                Become an Expert
              </button>
              <button 
                onClick={() => setShowProjectModal(true)}
                className="bg-orange-800 text-white px-8 py-3 rounded-lg font-medium hover:bg-orange-900 transition-colors duration-200"
              >
                Post a Project
              </button>
            </div>
          </div>
        </motion.section>

        {/* Admin Management Section */}
        <section className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Admin Management</h2>
              <p className="text-xl text-gray-600 mb-8">
                Manage Time Capsules, Mystery Bids, and all platform content
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/admin"
                  className="bg-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200 inline-flex items-center space-x-2"
                >
                  <WrenchScrewdriverIcon className="w-5 h-5" />
                  <span>Admin Panel</span>
                </Link>
                <button 
                  onClick={() => {
                    if (experts.length === 0 && projects.length === 0) {
                      alert('No items to display. Please add some experts or projects from the Admin Panel first.');
                    }
                  }}
                  className="bg-gray-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200"
                >
                  Check Status
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Expert Registration Modal */}
        {showExpertModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Become a Restoration Expert</h2>
                  <button 
                    onClick={() => setShowExpertModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleExpertSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={expertForm.name}
                        onChange={(e) => setExpertForm({...expertForm, name: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Professional Title *</label>
                      <input
                        type="text"
                        required
                        value={expertForm.title}
                        onChange={(e) => setExpertForm({...expertForm, title: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="e.g., Master Furniture Restorer"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specialties * (comma-separated)</label>
                    <input
                      type="text"
                      required
                      value={expertForm.specialties}
                      onChange={(e) => setExpertForm({...expertForm, specialties: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="e.g., Victorian Furniture, Antique Wood, French Polish"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                      <input
                        type="text"
                        required
                        value={expertForm.location}
                        onChange={(e) => setExpertForm({...expertForm, location: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="City, Country"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience *</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={expertForm.experience}
                        onChange={(e) => setExpertForm({...expertForm, experience: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Years"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Professional Bio *</label>
                    <textarea
                      required
                      rows={4}
                      value={expertForm.bio}
                      onChange={(e) => setExpertForm({...expertForm, bio: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Tell us about your experience, training, and expertise..."
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors duration-200"
                    >
                      Submit Application
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowExpertModal(false)}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Project Posting Modal */}
        {showProjectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Post a Restoration Project</h2>
                  <button 
                    onClick={() => setShowProjectModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleProjectSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Title *</label>
                    <input
                      type="text"
                      required
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Brief description of your item"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Description *</label>
                    <textarea
                      required
                      rows={4}
                      value={projectForm.description}
                      onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Describe the item, its history, and restoration needs..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                      <select
                        value={projectForm.category}
                        onChange={(e) => setProjectForm({...projectForm, category: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="Furniture">Furniture</option>
                        <option value="Ceramics">Ceramics</option>
                        <option value="Textiles">Textiles</option>
                        <option value="Metalwork">Metalwork</option>
                        <option value="Glass">Glass</option>
                        <option value="Paintings">Paintings</option>
                        <option value="Books & Paper">Books & Paper</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Condition *</label>
                      <select
                        value={projectForm.condition}
                        onChange={(e) => setProjectForm({...projectForm, condition: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="Excellent">Excellent</option>
                        <option value="Good - Minor Damage">Good - Minor Damage</option>
                        <option value="Fair - Moderate Damage">Fair - Moderate Damage</option>
                        <option value="Poor - Major Damage">Poor - Major Damage</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Budget Range *</label>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="number"
                        required
                        min="1"
                        placeholder="Min ($)"
                        value={projectForm.budget.min}
                        onChange={(e) => setProjectForm({...projectForm, budget: {...projectForm.budget, min: e.target.value}})}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <input
                        type="number"
                        required
                        min="1" 
                        placeholder="Max ($)"
                        value={projectForm.budget.max}
                        onChange={(e) => setProjectForm({...projectForm, budget: {...projectForm.budget, max: e.target.value}})}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <select
                        value={projectForm.budget.currency}
                        onChange={(e) => setProjectForm({...projectForm, budget: {...projectForm.budget, currency: e.target.value}})}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Timeline *</label>
                      <input
                        type="text"
                        required
                        value={projectForm.timeline}
                        onChange={(e) => setProjectForm({...projectForm, timeline: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="e.g., 4-6 weeks"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                      <input
                        type="text"
                        required
                        value={projectForm.location}
                        onChange={(e) => setProjectForm({...projectForm, location: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="City, Country"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Materials (Optional)</label>
                    <input
                      type="text"
                      value={projectForm.materials}
                      onChange={(e) => setProjectForm({...projectForm, materials: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="e.g., Mahogany wood, brass hardware"
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors duration-200"
                    >
                      Post Project
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowProjectModal(false)}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestorationMarketplace;