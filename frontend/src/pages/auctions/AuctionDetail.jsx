import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HeartIcon,
  EyeIcon,
  ClockIcon,
  UserIcon,
  ArrowLeftIcon,
  StarIcon,
  ShieldCheckIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const AuctionDetail = () => {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [currentBid, setCurrentBid] = useState('');
  const [bidHistory, setBidHistory] = useState([]);
  const [isWatching, setIsWatching] = useState(false);
  const [timeLeft, setTimeLeft] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    setTimeout(() => {
      setAuction({
        id: id,
        title: "Victorian Silver Tea Set",
        description: "A stunning complete Victorian silver tea set from the 1890s. This exquisite set includes a teapot, sugar bowl, cream jug, and matching tray. All pieces feature intricate floral engravings and are hallmarked. Perfect condition with original patina.",
        currentBid: 2450,
        startingBid: 500,
        images: [
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600",
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600",
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600"
        ],
        seller: {
          name: "AntiqueExpert123",
          rating: 4.8,
          verified: true,
          totalSales: 156
        },
        category: "Silver & Metalware",
        condition: "Excellent",
        age: "1890s",
        provenance: "Private collection",
        authentication: "Certified",
        endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        bidCount: 23,
        watchCount: 45,
        shippingInfo: {
          cost: 25,
          locations: ["US", "Canada", "UK"],
          insurance: "Included"
        }
      });

      setBidHistory([
        { id: 1, bidder: "CollectorPro", amount: 2450, time: "2 minutes ago" },
        { id: 2, bidder: "VintageSeeker", amount: 2400, time: "15 minutes ago" },
        { id: 3, bidder: "AntiqueHunter", amount: 2350, time: "1 hour ago" },
        { id: 4, bidder: "TreasureFinder", amount: 2300, time: "2 hours ago" },
        { id: 5, bidder: "ClassicBuyer", amount: 2250, time: "3 hours ago" }
      ]);

      setLoading(false);
    }, 1000);
  }, [id]);

  useEffect(() => {
    if (auction) {
      const timer = setInterval(() => {
        const now = new Date();
        const timeDiff = auction.endTime - now;

        if (timeDiff <= 0) {
          setTimeLeft({ ended: true });
          return;
        }

        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [auction]);

  const handleBidSubmit = (e) => {
    e.preventDefault();
    const bidAmount = parseFloat(currentBid);
    if (bidAmount <= auction.currentBid) {
      alert('Bid must be higher than current bid');
      return;
    }
    // Handle bid submission
    console.log('Placing bid:', bidAmount);
    setCurrentBid('');
  };

  const toggleWatch = () => {
    setIsWatching(!isWatching);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Auction not found</h2>
          <Link to="/dashboard" className="text-amber-600 hover:text-amber-500">
            ← Back to auctions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Link
          to="/dashboard"
          className="inline-flex items-center space-x-2 text-amber-600 hover:text-amber-500 mb-6"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Back to auctions</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Images and details */}
          <div className="lg:col-span-2">
            {/* Image gallery */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="aspect-w-16 aspect-h-12">
                <img
                  src={auction.images[0]}
                  alt={auction.title}
                  className="w-full h-96 object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex space-x-2">
                  {auction.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${auction.title} ${index + 1}`}
                      className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-75"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Item details */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {auction.title}
              </h1>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-medium">{auction.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Condition</p>
                  <p className="font-medium">{auction.condition}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Age</p>
                  <p className="font-medium">{auction.age}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Authentication</p>
                  <div className="flex items-center space-x-1">
                    <ShieldCheckIcon className="w-4 h-4 text-green-600" />
                    <p className="font-medium text-green-600">{auction.authentication}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{auction.description}</p>
              </div>

              <div className="border-t border-gray-200 pt-6 mt-6">
                <h3 className="text-lg font-semibold mb-3">Shipping Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Shipping Cost</p>
                    <p className="font-medium">${auction.shippingInfo.cost}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ships To</p>
                    <p className="font-medium">{auction.shippingInfo.locations.join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Insurance</p>
                    <p className="font-medium">{auction.shippingInfo.insurance}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bid history */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Bid History</h3>
              <div className="space-y-3">
                {bidHistory.map((bid) => (
                  <div key={bid.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{bid.bidder}</p>
                        <p className="text-sm text-gray-500">{bid.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-amber-600">${bid.amount.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column - Bidding interface */}
          <div className="space-y-6">
            {/* Timer */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4 flex items-center justify-center space-x-2">
                  <ClockIcon className="w-5 h-5" />
                  <span>Time Remaining</span>
                </h3>
                {timeLeft.ended ? (
                  <p className="text-2xl font-bold text-red-600">Auction Ended</p>
                ) : (
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div>
                      <div className="bg-gray-900 text-white rounded-lg p-3">
                        <div className="text-2xl font-bold">{timeLeft.days || 0}</div>
                        <div className="text-xs">Days</div>
                      </div>
                    </div>
                    <div>
                      <div className="bg-gray-900 text-white rounded-lg p-3">
                        <div className="text-2xl font-bold">{timeLeft.hours || 0}</div>
                        <div className="text-xs">Hours</div>
                      </div>
                    </div>
                    <div>
                      <div className="bg-gray-900 text-white rounded-lg p-3">
                        <div className="text-2xl font-bold">{timeLeft.minutes || 0}</div>
                        <div className="text-xs">Min</div>
                      </div>
                    </div>
                    <div>
                      <div className="bg-gray-900 text-white rounded-lg p-3">
                        <div className="text-2xl font-bold">{timeLeft.seconds || 0}</div>
                        <div className="text-xs">Sec</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Current bid */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600">Current Bid</p>
                <p className="text-4xl font-bold text-amber-600">
                  ${auction.currentBid.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {auction.bidCount} bids • {auction.watchCount} watching
                </p>
              </div>

              {/* Bid form */}
              <form onSubmit={handleBidSubmit} className="space-y-4">
                <div>
                  <label htmlFor="bid" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Bid (min: ${(auction.currentBid + 10).toLocaleString()})
                  </label>
                  <input
                    type="number"
                    id="bid"
                    value={currentBid}
                    onChange={(e) => setCurrentBid(e.target.value)}
                    min={auction.currentBid + 10}
                    step="10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder={`${auction.currentBid + 50}`}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-md transition-colors duration-200"
                >
                  Place Bid
                </button>
              </form>

              <div className="flex space-x-3 mt-4">
                <button
                  onClick={toggleWatch}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md border transition-colors duration-200 ${
                    isWatching
                      ? 'bg-red-50 border-red-300 text-red-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {isWatching ? (
                    <HeartIconSolid className="w-5 h-5" />
                  ) : (
                    <HeartIcon className="w-5 h-5" />
                  )}
                  <span>{isWatching ? 'Watching' : 'Watch'}</span>
                </button>
                
                <Link
                  to={`/items/${auction.id}`}
                  className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md border border-purple-300 bg-purple-50 text-purple-700 hover:bg-purple-100"
                >
                  <EyeIcon className="w-5 h-5" />
                  <span>AR View</span>
                </Link>
              </div>
            </div>

            {/* Seller info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Seller Information</h3>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium">{auction.seller.name}</p>
                    {auction.seller.verified && (
                      <ShieldCheckIcon className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(auction.seller.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">
                      {auction.seller.rating} • {auction.seller.totalSales} sales
                    </p>
                  </div>
                </div>
              </div>
              <Link
                to={`/provenance/${auction.id}`}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2 px-4 rounded-md text-center block"
              >
                View Provenance
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetail;