import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { itemsAPI, auctionsAPI } from '../services/api';
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  EyeIcon,
  HeartIcon,
  ClockIcon,
  CurrencyDollarIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

const ItemsListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    era: searchParams.get('era') || '',
    condition: searchParams.get('condition') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: searchParams.get('sortOrder') || 'desc'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    fetchItems();
  }, [searchParams]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      
      const params = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
        status: 'active'
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });

      const response = await itemsAPI.getAll(params);
      
      if (response.data?.success) {
        setItems(response.data.data?.items || []);
        setPagination(response.data.data?.pagination || pagination);
      }
    } catch (error) {
      console.error('Failed to fetch items:', error);
      toast.error('Failed to load items');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL params
    const newParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) newParams.set(k, v);
    });
    setSearchParams(newParams);
  };

  const handleSearch = () => {
    fetchItems();
  };

  const toggleWatchlist = async (itemId) => {
    try {
      // Add to watchlist API call would go here
      toast.success('Added to watchlist!');
    } catch (error) {
      toast.error('Failed to add to watchlist');
    }
  };

  const formatTimeRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return 'Auction ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  const categories = [
    'Furniture', 'Jewelry', 'Artwork', 'Ceramics', 'Silver', 'Books',
    'Clocks', 'Textiles', 'Glass', 'Collectibles'
  ];

  const eras = [
    'Ancient', 'Medieval', 'Renaissance', 'Baroque', 'Georgian', 'Victorian',
    'Edwardian', 'Art Nouveau', 'Art Deco', 'Mid Century', 'Contemporary'
  ];

  const conditions = ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Antique Items</h1>
          <p className="text-gray-600">
            Discover unique antiques and collectibles from verified sellers worldwide
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search items..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Era Filter */}
            <div>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                value={filters.era}
                onChange={(e) => handleFilterChange('era', e.target.value)}
              >
                <option value="">All Eras</option>
                {eras.map(era => (
                  <option key={era} value={era}>{era}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Price Range */}
            <div>
              <input
                type="number"
                placeholder="Min Price"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Max Price"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </div>

            {/* Condition */}
            <div>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                value={filters.condition}
                onChange={(e) => handleFilterChange('condition', e.target.value)}
              >
                <option value="">Any Condition</option>
                {conditions.map(condition => (
                  <option key={condition} value={condition}>{condition}</option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <option value="createdAt">Newest</option>
                <option value="currentBid">Price</option>
                <option value="endDate">Ending Soon</option>
                <option value="title">Name</option>
              </select>
            </div>

            {/* Search Button */}
            <div>
              <button
                onClick={handleSearch}
                className="w-full bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-gray-600">
            Showing {items.length} of {pagination.total} items
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-amber-100 text-amber-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Squares2X2Icon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-amber-100 text-amber-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <ListBulletIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Items Grid/List */}
        {items.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏺</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria</p>
            <button
              onClick={() => {
                setFilters({
                  search: '', category: '', era: '', condition: '',
                  minPrice: '', maxPrice: '', sortBy: 'createdAt', sortOrder: 'desc'
                });
                setSearchParams(new URLSearchParams());
              }}
              className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
          }>
            {items.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={viewMode === 'grid' 
                  ? "bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                  : "bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4 flex"
                }
              >
                {viewMode === 'grid' ? (
                  <>
                    {/* Grid View */}
                    <div className="relative">
                      <img
                        src={item.images?.[0] || '/placeholder-item.jpg'}
                        alt={item.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <button
                        onClick={() => toggleWatchlist(item._id)}
                        className="absolute top-2 right-2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                      >
                        <HeartIcon className="h-5 w-5 text-gray-600 hover:text-red-500" />
                      </button>
                      {item.featured && (
                        <div className="absolute top-2 left-2 bg-amber-500 text-white px-2 py-1 rounded text-xs font-semibold">
                          Featured
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 truncate">{item.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{item.category} • {item.era}</p>
                      
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <div className="text-sm text-gray-600">Current Bid</div>
                          <div className="font-bold text-amber-600">
                            ${(item.currentBid || item.startingPrice || 0).toLocaleString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Time Left</div>
                          <div className="font-medium text-gray-900">
                            {formatTimeRemaining(item.auctionEndDate)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                        <span>{item.totalBids || 0} bids</span>
                        <span>{item.totalViews || 0} views</span>
                      </div>
                      
                      <Link
                        to={`/items/${item._id}`}
                        className="w-full bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors text-center block"
                      >
                        View Details
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    {/* List View */}
                    <img
                      src={item.images?.[0] || '/placeholder-item.jpg'}
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded-lg mr-4"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                        <button
                          onClick={() => toggleWatchlist(item._id)}
                          className="p-1"
                        >
                          <HeartIcon className="h-5 w-5 text-gray-400 hover:text-red-500" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{item.category} • {item.era} • {item.condition}</p>
                      <p className="text-sm text-gray-700 mb-3 line-clamp-2">{item.description}</p>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          <div>
                            <span className="text-sm text-gray-600">Current Bid: </span>
                            <span className="font-bold text-amber-600">
                              ${(item.currentBid || item.startingPrice || 0).toLocaleString()}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {item.totalBids || 0} bids • {formatTimeRemaining(item.auctionEndDate)}
                          </div>
                        </div>
                        <Link
                          to={`/items/${item._id}`}
                          className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <button
              onClick={() => setPagination({...pagination, page: pagination.page - 1})}
              disabled={pagination.page === 1}
              className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            {[...Array(pagination.pages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setPagination({...pagination, page: i + 1})}
                className={`px-3 py-2 rounded-lg ${
                  pagination.page === i + 1
                    ? 'bg-amber-600 text-white'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPagination({...pagination, page: pagination.page + 1})}
              disabled={pagination.page === pagination.pages}
              className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemsListing;