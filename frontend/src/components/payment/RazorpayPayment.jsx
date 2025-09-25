import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { CurrencyDollarIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

// PAYMENT FUNCTIONALITY DISABLED
const RazorpayPayment = ({ 
  amount, 
  currency = 'INR', 
  description, 
  onSuccess, 
  onError, 
  disabled = false,
  buttonText = 'Pay Now'
}) => {
  const [isLoading, setIsLoading] = useState(false);

  // Payment functionality is commented out
  // const loadRazorpayScript = () => {
  //   return new Promise((resolve) => {
  //     if (window.Razorpay) {
  //       resolve(true);
  //       return;
  //     }

  //     const script = document.createElement('script');
  //     script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  //     script.async = true;
  //     script.onload = () => resolve(true);
  //     script.onerror = () => resolve(false);
  //     document.body.appendChild(script);
  //   });
  // };

  const handlePayment = async () => {
    // Payment functionality is disabled
    toast.error('Payment functionality is currently disabled');
    
    // setIsLoading(true);

    // try {
    //   // Load Razorpay script
    //   const scriptLoaded = await loadRazorpayScript();
    //   if (!scriptLoaded) {
    //     throw new Error('Failed to load Razorpay script');
    //   }

    //   // Create order
    //   const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/auth/payment/create-order`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     credentials: 'include',
    //     body: JSON.stringify({
    //       amount: amount,
    //       currency: currency,
    //       receipt: `receipt_${Date.now()}`
    //     })
    //   });

    //   const orderData = await response.json();

    //   if (!orderData.success) {
    //     throw new Error(orderData.message || 'Failed to create order');
    //   }

    //   // Razorpay options
    //   const options = {
    //     key: orderData.key_id,
    //     amount: orderData.order.amount,
    //     currency: orderData.order.currency,
    //     name: 'Antique Bidding Platform',
    //     description: description || 'Payment for antique item',
    //     order_id: orderData.order.id,
    //     handler: async (response) => {
    //       try {
    //         // Verify payment
    //         const verifyResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/auth/payment/verify`, {
    //           method: 'POST',
    //           headers: {
    //             'Content-Type': 'application/json',
    //           },
    //           credentials: 'include',
    //           body: JSON.stringify({
    //             razorpay_order_id: response.razorpay_order_id,
    //             razorpay_payment_id: response.razorpay_payment_id,
    //             razorpay_signature: response.razorpay_signature
    //           })
    //         });

    //         const verifyData = await verifyResponse.json();

    //         if (verifyData.success) {
    //           toast.success('Payment successful!');
    //           onSuccess?.(verifyData);
    //         } else {
    //           throw new Error(verifyData.message || 'Payment verification failed');
    //         }
    //       } catch (error) {
    //         console.error('Payment verification error:', error);
    //         toast.error('Payment verification failed');
    //         onError?.(error);
    //       }
    //     },
    //     prefill: {
    //       name: 'Customer Name',
    //       email: 'customer@example.com',
    //     },
    //     theme: {
    //       color: '#667eea'
    //     },
    //     modal: {
    //       ondismiss: () => {
    //         setIsLoading(false);
    //         toast.info('Payment cancelled');
    //       }
    //     }
    //   };

    //   // Create Razorpay instance and open
    //   const razorpay = new window.Razorpay(options);
    //   razorpay.open();

    // } catch (error) {
    //   console.error('Payment error:', error);
    //   toast.error(error.message || 'Payment failed');
    //   onError?.(error);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Payment Details</h3>
        <div className="flex items-center text-sm text-green-600">
          <ShieldCheckIcon className="w-4 h-4 mr-1" />
          Secure Payment
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-red-600 font-medium">Payment Currently Disabled</span>
        </div>
        <p className="text-sm text-red-500 mt-2">Payment functionality has been temporarily disabled</p>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center text-sm text-gray-400">
          <ShieldCheckIcon className="w-4 h-4 mr-2 text-gray-400" />
          256-bit SSL encrypted payment (Disabled)
        </div>
        <div className="flex items-center text-sm text-gray-400">
          <CurrencyDollarIcon className="w-4 h-4 mr-2 text-gray-400" />
          Supports UPI, Cards, Net Banking, Wallets (Disabled)
        </div>
      </div>

      <motion.button
        onClick={handlePayment}
        disabled={true}
        className="w-full bg-gray-400 text-white py-3 px-6 rounded-lg font-medium cursor-not-allowed opacity-50 transition-all duration-200"
      >
        <div className="flex items-center justify-center">
          <CurrencyDollarIcon className="w-5 h-5 mr-2" />
          Payment Disabled
        </div>
      </motion.button>

      <div className="flex items-center justify-center mt-4 space-x-4">
        <img src="https://razorpay.com/assets/razorpay-glyph.svg" alt="Razorpay" className="h-6" />
        <span className="text-sm text-gray-500">Powered by Razorpay</span>
      </div>
    </div>
  );
};

export default RazorpayPayment;