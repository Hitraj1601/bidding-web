import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  EyeIcon,
  CubeIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  ViewfinderCircleIcon,
  ArrowsPointingOutIcon,
  MagnifyingGlassIcon,
  InformationCircleIcon,
  ShareIcon,
  BookmarkIcon,
  ArrowPathIcon,
  SunIcon,
  AdjustmentsHorizontalIcon,
  CameraIcon,
  VideoCameraIcon,
  QrCodeIcon,
  ChevronLeftIcon,
  SparklesIcon,
  CubeTransparentIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const ARPreview = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('3d'); // '3d', 'ar', 'vr'
  const [isRotating, setIsRotating] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [scale, setScale] = useState(1);
  const [lightIntensity, setLightIntensity] = useState(1);
  const [showQRCode, setShowQRCode] = useState(false);
  const viewerRef = useRef(null);

  useEffect(() => {
    // Mock data - replace with actual API calls
    setTimeout(() => {
      setItem({
        id: parseInt(id),
        title: "Victorian Sterling Silver Tea Set",
        description: "Exquisite 19th century sterling silver tea service with intricate floral engravings",
        period: "1880-1890",
        origin: "London, England",
        maker: "Mappin & Webb",
        currentBid: 15000,
        images: [
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800"
        ],
        arModel: "tea_set_3d.glb",
        vrExperience: "victorian_room.vrscene",
        dimensions: {
          height: "25cm",
          width: "45cm",
          depth: "30cm",
          weight: "2.8kg"
        },
        materials: [
          "Sterling Silver (925)",
          "Mother of Pearl handles",
          "Hand-engraved details",
          "Original hallmarks"
        ],
        condition: {
          overall: "Excellent",
          details: [
            "Minor surface scratches consistent with age",
            "All pieces complete and original",
            "Hallmarks clearly visible",
            "No dents or major damage"
          ]
        },
        provenance: "Private English estate collection",
        authentication: "Verified by Sterling Silver Society",
        arFeatures: [
          "360° rotation view",
          "Zoom to see hallmarks",
          "Interactive hotspots",
          "Material close-ups",
          "Size comparison tool",
          "Lighting adjustment"
        ],
        vrFeatures: [
          "Place in Victorian dining room",
          "Historical context scenes",
          "Manufacturing process demo",
          "Period-appropriate setting",
          "Interactive elements"
        ]
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  const viewModes = [
    { id: '3d', name: '3D Viewer', icon: CubeIcon, description: 'Interactive 3D model' },
    { id: 'ar', name: 'AR Preview', icon: DevicePhoneMobileIcon, description: 'View in your space' },
    { id: 'vr', name: 'VR Experience', icon: ViewfinderCircleIcon, description: 'Historical context' }
  ];

  const handleRotationToggle = () => {
    setIsRotating(!isRotating);
  };

  const handleScaleChange = (newScale) => {
    setScale(newScale);
  };

  const handleShare = () => {
    navigator.share({
      title: item.title,
      text: `Check out this AR preview of ${item.title}`,
      url: window.location.href,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Loading 3D model...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to={`/auctions/${id}`}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold">{item.title}</h1>
                <p className="text-sm text-gray-400">{item.period} • {item.origin}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowQRCode(true)}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
                title="Share QR Code"
              >
                <QrCodeIcon className="w-5 h-5" />
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
                title="Share"
              >
                <ShareIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
                title="Item Information"
              >
                <InformationCircleIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-full">
          
          {/* 3D/AR/VR Viewer */}
          <div className="lg:col-span-3">
            <div className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl h-[600px] lg:h-[700px] relative">
              
              {/* View Mode Selector */}
              <div className="absolute top-4 left-4 z-40">
                <div className="bg-black/80 rounded-lg p-2 backdrop-blur-sm">
                  <div className="flex space-x-2">
                    {viewModes.map((mode) => {
                      const Icon = mode.icon;
                      return (
                        <button
                          key={mode.id}
                          onClick={() => setViewMode(mode.id)}
                          className={`p-3 rounded-lg transition-colors duration-200 ${
                            viewMode === mode.id
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                          title={mode.description}
                        >
                          <Icon className="w-5 h-5" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="absolute bottom-4 left-4 right-4 z-40">
                <div className="bg-black/80 rounded-lg p-4 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={handleRotationToggle}
                        className={`p-2 rounded-lg transition-colors duration-200 ${
                          isRotating ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                        title="Auto Rotate"
                      >
                        <ArrowPathIcon className={`w-5 h-5 ${isRotating ? 'animate-spin' : ''}`} />
                      </button>
                      
                      <div className="flex items-center space-x-2">
                        <SunIcon className="w-4 h-4 text-gray-400" />
                        <input
                          type="range"
                          min="0.3"
                          max="2"
                          step="0.1"
                          value={lightIntensity}
                          onChange={(e) => setLightIntensity(e.target.value)}
                          className="w-20 accent-purple-600"
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />
                        <input
                          type="range"
                          min="0.5"
                          max="3"
                          step="0.1"
                          value={scale}
                          onChange={(e) => handleScaleChange(e.target.value)}
                          className="w-20 accent-purple-600"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="p-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors duration-200">
                        <CameraIcon className="w-5 h-5" />
                      </button>
                      <button className="p-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors duration-200">
                        <VideoCameraIcon className="w-5 h-5" />
                      </button>
                      <button className="p-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors duration-200">
                        <ArrowsPointingOutIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3D Viewer Content */}
              {viewMode === '3d' && (
                <div 
                  ref={viewerRef}
                  className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative"
                  style={{ 
                    transform: `scale(${scale})`,
                    filter: `brightness(${lightIntensity})`
                  }}
                >
                  <motion.div
                    animate={isRotating ? { rotateY: 360 } : {}}
                    transition={isRotating ? { duration: 8, repeat: Infinity, ease: "linear" } : {}}
                    className="relative"
                  >
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-96 h-96 object-contain rounded-lg shadow-2xl"
                    />
                    
                    {/* Interactive Hotspots */}
                    <div className="absolute top-20 right-10">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-4 h-4 bg-purple-500 rounded-full cursor-pointer relative"
                        onClick={() => alert('Hallmark detail: Sterling Silver 925, London 1885')}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                          Hallmark
                        </div>
                      </motion.div>
                    </div>
                    
                    <div className="absolute bottom-32 left-8">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                        className="w-4 h-4 bg-purple-500 rounded-full cursor-pointer relative"
                        onClick={() => alert('Engraving detail: Hand-engraved floral pattern, Victorian style')}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                          Engraving
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                  
                  {/* Loading overlay for demo */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span>3D Model Loaded</span>
                    </div>
                  </div>
                </div>
              )}

              {/* AR Viewer Content */}
              {viewMode === 'ar' && (
                <div className="w-full h-full bg-black flex items-center justify-center relative">
                  <div className="text-center">
                    <DevicePhoneMobileIcon className="w-20 h-20 text-purple-400 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold mb-4">AR Experience</h3>
                    <p className="text-gray-300 mb-6 max-w-md">
                      Use your mobile device to view this item in your own space. 
                      Scan the QR code or open this page on your phone.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors duration-200">
                        Generate QR Code
                      </button>
                      <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors duration-200">
                        Mobile Preview
                      </button>
                    </div>
                  </div>
                  
                  {/* AR Features Preview */}
                  <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-sm rounded-lg p-4">
                    <h4 className="text-sm font-semibold mb-2 text-purple-300">AR Features Available:</h4>
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      {item.arFeatures.slice(0, 6).map((feature, idx) => (
                        <div key={idx} className="text-gray-300 flex items-center space-x-1">
                          <SparklesIcon className="w-3 h-3 text-purple-400" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* VR Viewer Content */}
              {viewMode === 'vr' && (
                <div className="w-full h-full bg-gradient-to-br from-purple-900 to-indigo-900 flex items-center justify-center relative">
                  <div className="text-center">
                    <ViewfinderCircleIcon className="w-20 h-20 text-purple-300 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold mb-4">VR Experience</h3>
                    <p className="text-purple-100 mb-6 max-w-md">
                      Step into a Victorian dining room and experience this tea set in its historical context.
                      Requires VR headset for full experience.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors duration-200">
                        Launch VR
                      </button>
                      <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors duration-200">
                        360° Preview
                      </button>
                    </div>
                  </div>

                  {/* VR Features Preview */}
                  <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-sm rounded-lg p-4">
                    <h4 className="text-sm font-semibold mb-2 text-purple-300">VR Experience Includes:</h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      {item.vrFeatures.map((feature, idx) => (
                        <div key={idx} className="text-gray-300 flex items-center space-x-1">
                          <CubeTransparentIcon className="w-3 h-3 text-purple-400" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              
              {/* Quick Stats */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <CubeIcon className="w-5 h-5 mr-2 text-purple-400" />
                  3D Model Info
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Polygons:</span>
                    <span>47,320</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Textures:</span>
                    <span>4K Resolution</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">File Size:</span>
                    <span>12.4 MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Loading Time:</span>
                    <span>~3 seconds</span>
                  </div>
                </div>
              </div>

              {/* Dimensions */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Dimensions</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Height:</span>
                    <span>{item.dimensions.height}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Width:</span>
                    <span>{item.dimensions.width}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Depth:</span>
                    <span>{item.dimensions.depth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Weight:</span>
                    <span>{item.dimensions.weight}</span>
                  </div>
                </div>
              </div>

              {/* Materials */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Materials</h3>
                <div className="space-y-2">
                  {item.materials.map((material, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-gray-300">{material}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Current Bid */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">Current Bid</h3>
                <div className="text-3xl font-bold mb-4">
                  ${item.currentBid.toLocaleString()}
                </div>
                <Link 
                  to={`/auctions/${id}`}
                  className="w-full bg-white text-purple-600 py-3 px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <span>Place Bid</span>
                  <ArrowsPointingOutIcon className="w-4 h-4" />
                </Link>
              </div>

              {/* Share Options */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Share AR Experience</h3>
                <div className="space-y-3">
                  <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
                    <QrCodeIcon className="w-4 h-4" />
                    <span>Generate QR Code</span>
                  </button>
                  <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
                    <GlobeAltIcon className="w-4 h-4" />
                    <span>Copy Link</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      {showInfo && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="fixed top-0 right-0 w-96 h-full bg-gray-900 shadow-2xl z-60 overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Item Details</h2>
              <button
                onClick={() => setShowInfo(false)}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-300 text-sm">{item.description}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Condition</h3>
                <p className="text-green-400 font-medium mb-2">{item.condition.overall}</p>
                <ul className="space-y-1">
                  {item.condition.details.map((detail, idx) => (
                    <li key={idx} className="text-gray-300 text-sm flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Provenance</h3>
                <p className="text-gray-300 text-sm">{item.provenance}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Authentication</h3>
                <p className="text-gray-300 text-sm">{item.authentication}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ARPreview;