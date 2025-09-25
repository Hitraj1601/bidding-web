import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  EyeIcon,
  HeartIcon,
  ShareIcon,
  MapPinIcon,
  CalendarDaysIcon,
  TagIcon,
  StarIcon,
  ShieldCheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  CameraIcon,
  MagnifyingGlassPlusIcon,
  ArrowLeftIcon,
  HandRaisedIcon,
  GlobeAltIcon,
  UserIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

const ItemDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    // Mock data - replace with actual API calls
    setTimeout(() => {
      setItem({
        id: parseInt(id),
        title: "Victorian Sterling Silver Tea Set",
        description: "Exquisite 19th century sterling silver tea service with intricate floral engravings, comprising teapot, coffee pot, sugar bowl, and cream pitcher. Each piece bears the hallmarks of renowned silversmiths Mappin & Webb.",
        category: "Silver & Metalwork",
        subcategory: "Tea Services",
        period: "Victorian (1837-1901)",
        year: "1888",
        origin: "London, England",
        maker: "Mappin & Webb",
        condition: "Excellent",
        conditionDetails: "Minor surface scratches consistent with age. All pieces complete and original. Hallmarks clearly visible. No dents or major damage.",
        dimensions: {
          teapot: "H: 25cm, W: 30cm, D: 15cm",
          coffeePot: "H: 28cm, W: 32cm, D: 16cm",
          sugarBowl: "H: 15cm, Dia: 12cm",
          creamPitcher: "H: 12cm, W: 15cm, D: 8cm"
        },
        weight: "2.8kg total",
        materials: ["Sterling Silver (925)", "Bone handles", "Original hallmarks"],
        images: [
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=center"
        ],
        currentBid: 15000,
        startingBid: 8000,
        estimatedValue: "$18,000 - $25,000",
        auctionId: "AUC-2024-001",
        auctionEndTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        bidCount: 23,
        watchers: 45,
        seller: {
          name: "Heritage Collections",
          reputation: 4.9,
          location: "London, UK",
          memberSince: "2015",
          totalSales: 247,
          verified: true
        },
        provenance: [
          "Private English estate collection",
          "Inherited from Lady Margaret Whitfield (1962)",
          "Original purchase from Mappin & Webb (1888)"
        ],
        authentication: {
          verified: true,
          expert: "Dr. Margaret Thompson",
          date: "2023-10-15",
          certificate: "AUTH-2023-1547"
        },
        features: [
          "Complete matching set",
          "Original bone handles intact",
          "Clear maker's hallmarks",
          "Museum-quality condition",
          "Full provenance documentation",
          "Expert authentication included"
        ],
        tags: ["Victorian", "Silver", "Tea Service", "Mappin Webb", "English", "Antique"],
        relatedItems: [
          {
            id: 2,
            title: "Victorian Silver Sugar Tongs",
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200",
            currentBid: 450,
            endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
          },
          {
            id: 3,
            title: "Edwardian Silver Cake Stand",
            image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200",
            currentBid: 1200,
            endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
          },
          {
            id: 4,
            title: "Georgian Silver Candlesticks",
            image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200",
            currentBid: 2800,
            endTime: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000)
          }
        ]
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  const tabs = [
    { id: 'details', name: 'Details', icon: DocumentTextIcon },
    { id: 'provenance', name: 'Provenance', icon: ShieldCheckIcon },
    { id: 'condition', name: 'Condition', icon: EyeIcon }
  ];

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-purple-600">Home</Link>
          <span>/</span>
          <Link to="/auctions" className="hover:text-purple-600">Auctions</Link>
          <span>/</span>
          <span className="text-gray-900">{item.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Image Gallery */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              
              {/* Main Image */}
              <div className="relative">
                <img
                  src={item.images[selectedImage]}
                  alt={item.title}
                  className="w-full h-96 object-cover cursor-zoom-in"
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button className="p-2 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors duration-200">
                    <MagnifyingGlassPlusIcon className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors duration-200">
                    <ShareIcon className="w-5 h-5" />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
                  {selectedImage + 1} of {item.images.length}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="p-4">
                <div className="grid grid-cols-4 gap-3">
                  {item.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative rounded-lg overflow-hidden border-2 transition-colors duration-200 ${
                        selectedImage === index ? 'border-purple-500' : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${item.title} ${index + 1}`}
                        className="w-full h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Detailed Information Tabs */}
            <div className="bg-white rounded-lg shadow-lg mt-6 overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                          activeTab === tab.id
                            ? 'border-purple-500 text-purple-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{tab.name}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'details' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Specifications</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Period:</span>
                            <span>{item.period}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Year:</span>
                            <span>{item.year}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Origin:</span>
                            <span>{item.origin}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Maker:</span>
                            <span>{item.maker}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Weight:</span>
                            <span>{item.weight}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Materials</h4>
                        <div className="space-y-1">
                          {item.materials.map((material, idx) => (
                            <div key={idx} className="flex items-center space-x-2 text-sm">
                              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                              <span className="text-gray-600">{material}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Dimensions</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        {Object.entries(item.dimensions).map(([piece, dimension]) => (
                          <div key={piece} className="flex justify-between">
                            <span className="text-gray-600 capitalize">{piece.replace(/([A-Z])/g, ' $1').trim()}:</span>
                            <span>{dimension}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Features</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {item.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center space-x-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                            <span className="text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'provenance' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Ownership History</h3>
                    <div className="space-y-3">
                      {item.provenance.map((record, idx) => (
                        <div key={idx} className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-semibold text-purple-600">{idx + 1}</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-700">{record}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                      <div className="flex items-center space-x-2">
                        <ShieldCheckIcon className="w-5 h-5 text-green-600" />
                        <h4 className="font-medium text-green-800">Authentication Verified</h4>
                      </div>
                      <p className="text-green-700 text-sm mt-2">
                        Authenticated by {item.authentication.expert} on {new Date(item.authentication.date).toLocaleDateString()}
                      </p>
                      <p className="text-green-600 text-xs mt-1">
                        Certificate: {item.authentication.certificate}
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'condition' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Condition Assessment</h3>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        {item.condition}
                      </span>
                    </div>
                    <p className="text-gray-600">{item.conditionDetails}</p>
                    
                    <div className="grid grid-cols-4 gap-4 mt-6">
                      {['Excellent', 'Very Good', 'Good', 'Fair'].map((condition, idx) => (
                        <div key={condition} className="text-center">
                          <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${
                            item.condition === condition ? 'bg-green-500' : 
                            idx === 0 ? 'bg-green-200' : 'bg-gray-200'
                          }`}></div>
                          <div className={`text-xs ${
                            item.condition === condition ? 'text-green-600 font-medium' : 'text-gray-500'
                          }`}>
                            {condition}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              
              {/* Current Bid & Actions */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Current Bid</span>
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-red-600 font-medium">
                        {formatTimeLeft(item.auctionEndTime)}
                      </span>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-purple-600 mb-1">
                    ${item.currentBid.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    {item.bidCount} bids • {item.watchers} watching
                  </div>
                </div>

                <div className="space-y-3">
                  <Link
                    to={`/auctions/${item.auctionId}`}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <HandRaisedIcon className="w-5 h-5" />
                    <span>Place Bid</span>
                  </Link>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 ${
                        isWishlisted
                          ? 'bg-red-100 text-red-600 hover:bg-red-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {isWishlisted ? (
                        <HeartSolid className="w-4 h-4" />
                      ) : (
                        <HeartIcon className="w-4 h-4" />
                      )}
                      <span>Watch</span>
                    </button>
                    <button className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                      <ShareIcon className="w-4 h-4" />
                    </button>
                  </div>

                  <Link
                    to={`/ar-preview/${item.id}`}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <EyeIcon className="w-4 h-4" />
                    <span>AR Preview</span>
                  </Link>
                </div>
              </div>

              {/* Seller Information */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <UserIcon className="w-5 h-5 mr-2" />
                  Seller Information
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Name:</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{item.seller.name}</span>
                      {item.seller.verified && (
                        <ShieldCheckIcon className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Rating:</span>
                    <div className="flex items-center space-x-1">
                      <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{item.seller.reputation}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span>{item.seller.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Member Since:</span>
                    <span>{item.seller.memberSince}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Sales:</span>
                    <span>{item.seller.totalSales}</span>
                  </div>
                </div>
              </div>

              {/* Estimated Value */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Estimated Value</h3>
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {item.estimatedValue}
                </div>
                <p className="text-sm text-gray-600">
                  Based on recent sales of similar items and expert appraisal.
                </p>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium cursor-pointer hover:bg-purple-200 transition-colors duration-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Items */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {item.relatedItems.map((relatedItem) => (
              <Link
                key={relatedItem.id}
                to={`/items/${relatedItem.id}`}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={relatedItem.image}
                  alt={relatedItem.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{relatedItem.title}</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600">Current Bid</div>
                      <div className="text-lg font-bold text-purple-600">
                        ${relatedItem.currentBid.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Ends in</div>
                      <div className="text-sm font-medium text-red-600">
                        {formatTimeLeft(relatedItem.endTime)}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ItemDetail;