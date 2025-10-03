import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  DocumentTextIcon,
  UserIcon,
  CalendarDaysIcon,
  MapPinIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  EyeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  GlobeAltIcon,
  BuildingLibraryIcon,
  CameraIcon,
  DocumentDuplicateIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  HandRaisedIcon,
  StarIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

const ProvenanceTracker = () => {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [provenanceChain, setProvenanceChain] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedEntry, setExpandedEntry] = useState(null);
  const [verificationMode, setVerificationMode] = useState(false);

  useEffect(() => {
    // Mock data - replace with actual API calls
    setTimeout(() => {
      setItem({
        id: parseInt(itemId),
        title: "Victorian Sterling Silver Tea Set",
        description: "Exquisite 19th century sterling silver tea service with intricate floral engravings",
        currentOwner: "Jane Smith",
        images: [
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800"
        ],
        authentication: {
          verified: true,
          expert: "Dr. Margaret Thompson",
          date: "2023-10-15",
          certificate: "AUTH-2023-1547"
        },
        insurance: {
          insured: true,
          value: "$25,000",
          provider: "Antique Assurance LLC",
          policy: "AA-2023-8901"
        }
      });

      setProvenanceChain([
        {
          id: 1,
          date: "2023-11-15",
          event: "Current Ownership",
          eventType: "current",
          owner: {
            name: "Jane Smith",
            type: "Private Collector",
            location: "New York, NY, USA",
            verified: true,
            reputation: 4.8
          },
          method: "Auction Purchase",
          price: "$18,500",
          auctionHouse: "Heritage Auctions",
          lotNumber: "65847",
          documentation: [
            "Purchase Receipt",
            "Transfer Certificate",
            "Insurance Appraisal"
          ],
          notes: "Purchased at Heritage Auctions' Fine Silver & Objects of Vertu Auction. Item was well-documented with complete provenance.",
          verified: true,
          verificationDate: "2023-11-16",
          verifiedBy: "Heritage Auctions Authentication Team"
        },
        {
          id: 2,
          date: "2018-03-20",
          event: "Estate Sale",
          eventType: "sale",
          owner: {
            name: "Estate of Margaret Whitfield",
            type: "Estate",
            location: "Boston, MA, USA",
            verified: true,
            reputation: null
          },
          previousOwner: {
            name: "Margaret Whitfield",
            lifespan: "1925-2018",
            occupation: "Art Collector & Philanthropist"
          },
          method: "Estate Liquidation",
          price: "$14,200",
          auctionHouse: "Skinner Auctioneers",
          lotNumber: "234",
          documentation: [
            "Estate Inventory",
            "Probate Documents",
            "Authentication Certificate"
          ],
          notes: "Part of comprehensive estate liquidation. Mrs. Whitfield was a noted collector of Victorian silver and ceramics.",
          verified: true,
          verificationDate: "2018-03-15",
          verifiedBy: "Skinner Auctioneers"
        },
        {
          id: 3,
          date: "1987-06-12",
          event: "Private Purchase",
          eventType: "private",
          owner: {
            name: "Margaret Whitfield",
            type: "Private Collector",
            location: "Boston, MA, USA",
            verified: true,
            reputation: null
          },
          seller: {
            name: "Whitmore & Associates Fine Arts",
            type: "Gallery",
            location: "London, UK"
          },
          method: "Gallery Purchase",
          price: "£3,200 (approx. $5,100)",
          documentation: [
            "Gallery Invoice",
            "Export Permit",
            "Shipping Records"
          ],
          notes: "Purchased during American collecting tour. Gallery specialized in Victorian decorative arts.",
          verified: true,
          verificationDate: "1987-06-15",
          verifiedBy: "Whitmore & Associates"
        },
        {
          id: 4,
          date: "1962-11-30",
          event: "Family Inheritance",
          eventType: "inheritance",
          owner: {
            name: "James Whitmore III",
            type: "Private Owner",
            location: "London, UK",
            verified: true,
            reputation: null
          },
          previousOwner: {
            name: "Lady Elizabeth Whitmore",
            lifespan: "1895-1962",
            relationship: "Grandmother"
          },
          method: "Inheritance",
          documentation: [
            "Will & Testament",
            "Probate Records",
            "Family Inventory"
          ],
          notes: "Inherited as part of family silver collection. Lady Elizabeth was known for her exquisite taste in Victorian silver.",
          verified: true,
          verificationDate: "1962-12-15",
          verifiedBy: "Whitmore Family Estate"
        },
        {
          id: 5,
          date: "1925-04-18",
          event: "Wedding Gift",
          eventType: "gift",
          owner: {
            name: "Lady Elizabeth Whitmore",
            type: "Private Owner",
            location: "London, UK",
            verified: true,
            reputation: null
          },
          giver: {
            name: "The Earl of Devonshire",
            relationship: "Uncle",
            occasion: "Wedding Gift"
          },
          method: "Personal Gift",
          documentation: [
            "Wedding Registry",
            "Personal Letter",
            "Family Records"
          ],
          notes: "Wedding gift upon marriage to Lord Charles Whitmore. The Earl was known for his generous and tasteful gifts.",
          verified: true,
          verificationDate: "1925-04-20",
          verifiedBy: "Whitmore Family Records"
        },
        {
          id: 6,
          date: "1888-12-15",
          event: "Original Commission",
          eventType: "creation",
          owner: {
            name: "The Earl of Devonshire",
            type: "Original Commissioner",
            location: "London, UK",
            verified: true,
            reputation: null
          },
          creator: {
            name: "Mappin & Webb",
            type: "Silversmith",
            location: "London, UK",
            period: "Victorian Era"
          },
          method: "Special Commission",
          price: "£125 (original cost)",
          documentation: [
            "Commission Record",
            "Silversmith's Mark",
            "Hallmarks Certificate"
          ],
          notes: "Originally commissioned as a special order tea service. Mappin & Webb were renowned silversmiths to the British aristocracy.",
          verified: true,
          verificationDate: "1888-12-20",
          verifiedBy: "Mappin & Webb Records",
          hallmarks: {
            maker: "M&W",
            city: "London",
            year: "1888",
            standard: "Sterling Silver 925"
          }
        }
      ]);

      setLoading(false);
    }, 1000);
  }, [itemId]);

  const getEventIcon = (eventType) => {
    switch (eventType) {
      case 'current': return UserIcon;
      case 'sale': return HandRaisedIcon;
      case 'private': return UserIcon;
      case 'inheritance': return GlobeAltIcon;
      case 'gift': return StarIcon;
      case 'creation': return BuildingLibraryIcon;
      default: return DocumentTextIcon;
    }
  };

  const getEventColor = (eventType) => {
    switch (eventType) {
      case 'current': return 'bg-green-500 border-green-300';
      case 'sale': return 'bg-blue-500 border-blue-300';
      case 'private': return 'bg-purple-500 border-purple-300';
      case 'inheritance': return 'bg-yellow-500 border-yellow-300';
      case 'gift': return 'bg-pink-500 border-pink-300';
      case 'creation': return 'bg-orange-500 border-orange-300';
      default: return 'bg-gray-500 border-gray-300';
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
      {/* Header Section */}
      <section className="bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <DocumentTextIcon className="w-12 h-12 text-purple-300" />
              <div>
                <h1 className="text-4xl md:text-5xl font-bold">Provenance Tracker</h1>
                <p className="text-lg text-purple-200">Complete ownership history and authentication</p>
              </div>
            </div>
            
            {item && (
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm mt-8">
                <h2 className="text-2xl font-bold mb-2">{item.title}</h2>
                <p className="text-purple-100 mb-4">{item.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <UserIcon className="w-5 h-5 text-purple-300" />
                    <div>
                      <div className="text-sm text-purple-200">Current Owner</div>
                      <div className="font-medium">{item.currentOwner}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ShieldCheckIcon className="w-5 h-5 text-green-300" />
                    <div>
                      <div className="text-sm text-purple-200">Authentication</div>
                      <div className="font-medium text-green-300">Verified</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <LockClosedIcon className="w-5 h-5 text-blue-300" />
                    <div>
                      <div className="text-sm text-purple-200">Insurance</div>
                      <div className="font-medium text-blue-300">{item.insurance.value}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Provenance Timeline */}
          <div className="lg:col-span-2">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Ownership History</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setVerificationMode(!verificationMode)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    verificationMode 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {verificationMode ? 'Exit Verification' : 'Verification Mode'}
                </button>
              </div>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>
              
              <div className="space-y-8">
                {provenanceChain.map((entry, index) => {
                  const EventIcon = getEventIcon(entry.eventType);
                  const isExpanded = expandedEntry === entry.id;
                  
                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="relative"
                    >
                      {/* Timeline dot */}
                      <div className={`absolute left-6 w-4 h-4 rounded-full border-2 ${getEventColor(entry.eventType)}`}>
                        <EventIcon className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
                      </div>
                      
                      <div className="ml-16">
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                          
                          {/* Entry Header */}
                          <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h3 className="text-lg font-bold text-gray-900">{entry.event}</h3>
                                  {entry.verified && (
                                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                  )}
                                  {verificationMode && (
                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                      ID: {entry.verificationDate}
                                    </span>
                                  )}
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                  <div className="flex items-center space-x-2">
                                    <CalendarDaysIcon className="w-4 h-4" />
                                    <span>{new Date(entry.date).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <UserIcon className="w-4 h-4" />
                                    <span>{entry.owner.name}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <MapPinIcon className="w-4 h-4" />
                                    <span>{entry.owner.location}</span>
                                  </div>
                                </div>
                                
                                {entry.method && (
                                  <div className="mt-2 text-sm">
                                    <span className="font-medium">Method: </span>
                                    <span className="text-gray-600">{entry.method}</span>
                                    {entry.price && (
                                      <span className="text-green-600 font-medium ml-2">• {entry.price}</span>
                                    )}
                                  </div>
                                )}
                              </div>
                              
                              <button
                                onClick={() => setExpandedEntry(isExpanded ? null : entry.id)}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                              >
                                {isExpanded ? (
                                  <ChevronUpIcon className="w-5 h-5 text-gray-600" />
                                ) : (
                                  <ChevronDownIcon className="w-5 h-5 text-gray-600" />
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Expanded Details */}
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="p-6 bg-gray-50"
                            >
                              <div className="space-y-4">
                                
                                {/* Notes */}
                                {entry.notes && (
                                  <div>
                                    <h4 className="font-medium text-gray-900 mb-2">Historical Notes</h4>
                                    <p className="text-gray-600 text-sm">{entry.notes}</p>
                                  </div>
                                )}

                                {/* Documentation */}
                                <div>
                                  <h4 className="font-medium text-gray-900 mb-2">Supporting Documentation</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {entry.documentation.map((doc, idx) => (
                                      <div key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                                        <DocumentDuplicateIcon className="w-4 h-4" />
                                        <span>{doc}</span>
                                        <button className="text-purple-600 hover:text-purple-700">
                                          <EyeIcon className="w-4 h-4" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Additional Details */}
                                {entry.auctionHouse && (
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="font-medium text-gray-900">Auction House: </span>
                                      <span className="text-gray-600">{entry.auctionHouse}</span>
                                    </div>
                                    <div>
                                      <span className="font-medium text-gray-900">Lot Number: </span>
                                      <span className="text-gray-600">{entry.lotNumber}</span>
                                    </div>
                                  </div>
                                )}

                                {entry.seller && (
                                  <div>
                                    <span className="font-medium text-gray-900">Seller: </span>
                                    <span className="text-gray-600">{entry.seller.name}, {entry.seller.location}</span>
                                  </div>
                                )}

                                {/* Hallmarks for creation entry */}
                                {entry.hallmarks && (
                                  <div>
                                    <h4 className="font-medium text-gray-900 mb-2">Hallmarks</h4>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                      <div><span className="font-medium">Maker:</span> {entry.hallmarks.maker}</div>
                                      <div><span className="font-medium">City:</span> {entry.hallmarks.city}</div>
                                      <div><span className="font-medium">Year:</span> {entry.hallmarks.year}</div>
                                      <div><span className="font-medium">Standard:</span> {entry.hallmarks.standard}</div>
                                    </div>
                                  </div>
                                )}

                                {/* Verification Info */}
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <ShieldCheckIcon className="w-4 h-4 text-green-600" />
                                    <span className="text-sm font-medium text-green-800">Verified Entry</span>
                                  </div>
                                  <div className="text-xs text-green-700">
                                    Verified by {entry.verifiedBy} on {new Date(entry.verificationDate).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
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
              
              {/* Item Images */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-4 bg-gray-50 border-b">
                  <h3 className="font-semibold text-gray-900">Item Documentation</h3>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    {item.images.map((image, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={image}
                          alt={`${item.title} - Image ${idx + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <div className="absolute top-2 right-2">
                          <button className="p-2 bg-black/50 text-white rounded-lg hover:bg-black/70">
                            <EyeIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Authentication Details */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-4 bg-green-50 border-b">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    <ShieldCheckIcon className="w-5 h-5 text-green-600 mr-2" />
                    Authentication Status
                  </h3>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span className="flex items-center text-green-600 font-medium">
                        <CheckCircleIcon className="w-4 h-4 mr-1" />
                        Verified
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Expert:</span>
                      <span className="text-sm font-medium">{item.authentication.expert}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Date:</span>
                      <span className="text-sm">{new Date(item.authentication.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Certificate:</span>
                      <span className="text-sm font-mono">{item.authentication.certificate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Insurance Information */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-4 bg-blue-50 border-b">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    <LockClosedIcon className="w-5 h-5 text-blue-600 mr-2" />
                    Insurance Coverage
                  </h3>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Coverage:</span>
                      <span className="text-blue-600 font-medium">{item.insurance.value}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Provider:</span>
                      <span className="text-sm">{item.insurance.provider}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Policy:</span>
                      <span className="text-sm font-mono">{item.insurance.policy}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
                  <div className="space-y-3">
                    <Link
                      to={`/auctions/${itemId}`}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <HandRaisedIcon className="w-4 h-4" />
                      <span>View Auction</span>
                    </Link>
                    <Link
                      to={`/items/${itemId}`}
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <EyeIcon className="w-4 h-4" />
                      <span>View Details</span>
                    </Link>
                    <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2">
                      <DocumentDuplicateIcon className="w-4 h-4" />
                      <span>Download Report</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Provenance Summary */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-4 bg-gray-50 border-b">
                  <h3 className="font-semibold text-gray-900">Provenance Summary</h3>
                </div>
                <div className="p-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Owners:</span>
                      <span className="font-medium">{provenanceChain.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Years Tracked:</span>
                      <span className="font-medium">135 years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completeness:</span>
                      <span className="text-green-600 font-medium">100%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Verified Entries:</span>
                      <span className="text-green-600 font-medium">6/6</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProvenanceTracker;