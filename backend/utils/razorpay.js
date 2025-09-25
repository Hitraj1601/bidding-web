// import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay instance
let razorpay = null;

// PAYMENT FUNCTIONALITY COMMENTED OUT
// Only initialize Razorpay if valid credentials are provided
// if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET && 
//     process.env.RAZORPAY_KEY_ID !== 'rzp_test_your_key_id' && 
//     process.env.RAZORPAY_KEY_SECRET !== 'your_razorpay_key_secret') {
//   razorpay = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID,
//     key_secret: process.env.RAZORPAY_KEY_SECRET,
//   });
// } else {
//   console.warn('⚠️  Razorpay not initialized: Please set valid RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env file');
// }

// PAYMENT FUNCTIONS COMMENTED OUT - NO PAYMENT INTEGRATION
// Create order for payment
export const createPaymentOrder = async (amount, currency = 'INR', receipt) => {
  // try {
  //   if (!razorpay) {
  //     return {
  //       success: false,
  //       error: 'Razorpay not initialized. Please configure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET',
  //     };
  //   }

  //   const options = {
  //     amount: amount * 100, // Amount in paisa (multiply by 100)
  //     currency: currency,
  //     receipt: receipt,
  //     payment_capture: 1, // Auto capture payment
  //   };

  //   const order = await razorpay.orders.create(options);
  //   return {
  //     success: true,
  //     order,
  //   };
  // } catch (error) {
  //   console.error('Razorpay Order Creation Error:', error);
  //   return {
  //     success: false,
  //     error: error.message,
  //   };
  // }
  
  // Return mock response for development
  return {
    success: false,
    error: 'Payment functionality is disabled'
  };
};

// Verify payment signature
export const verifyPaymentSignature = (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
  // try {
  //   if (!process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET === 'your_razorpay_key_secret') {
  //     console.error('RAZORPAY_KEY_SECRET not configured');
  //     return false;
  //   }

  //   const body = razorpayOrderId + '|' + razorpayPaymentId;
  //   const expectedSignature = crypto
  //     .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
  //     .update(body.toString())
  //     .digest('hex');

  //   return expectedSignature === razorpaySignature;
  // } catch (error) {
  //   console.error('Payment Verification Error:', error);
  //   return false;
  // }
  
  // Return false for disabled payment functionality
  return false;
};

// Get payment details
export const getPaymentDetails = async (paymentId) => {
  // try {
  //   if (!razorpay) {
  //     return {
  //       success: false,
  //       error: 'Razorpay not initialized. Please configure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET',
  //     };
  //   }

  //   const payment = await razorpay.payments.fetch(paymentId);
  //   return {
  //     success: true,
  //     payment,
  //   };
  // } catch (error) {
  //   console.error('Get Payment Details Error:', error);
  //   return {
  //     success: false,
  //     error: error.message,
  //   };
  // }
  
  // Return mock response for disabled payment functionality
  return {
    success: false,
    error: 'Payment functionality is disabled'
  };
};

// Create refund
export const createRefund = async (paymentId, amount = null) => {
  // try {
  //   if (!razorpay) {
  //     return {
  //       success: false,
  //       error: 'Razorpay not initialized. Please configure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET',
  //     };
  //   }

  //   const refundOptions = {
  //     payment_id: paymentId,
  //   };

  //   if (amount) {
  //     refundOptions.amount = amount * 100; // Amount in paisa
  //   }

  //   const refund = await razorpay.payments.refund(paymentId, refundOptions);
  //   return {
  //     success: true,
  //     refund,
  //   };
  // } catch (error) {
  //   console.error('Refund Creation Error:', error);
  //   return {
  //     success: false,
  //     error: error.message,
  //   };
  // }
  
  // Return mock response for disabled payment functionality
  return {
    success: false,
    error: 'Payment functionality is disabled'
  };
};

// Webhook signature verification
export const verifyWebhookSignature = (payload, signature, secret) => {
  // try {
  //   const expectedSignature = crypto
  //     .createHmac('sha256', secret)
  //     .update(payload)
  //     .digest('hex');

  //   return expectedSignature === signature;
  // } catch (error) {
  //   console.error('Webhook Verification Error:', error);
  //   return false;
  // }
  
  // Return false for disabled payment functionality
  return false;
};

// Check if Razorpay is properly configured
export const isRazorpayConfigured = () => {
  // return razorpay !== null;
  // Always return false as payment is disabled
  return false;
};

// Get Razorpay key for frontend (only key_id, not secret)
export const getRazorpayKeyId = () => {
  // if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID !== 'rzp_test_your_key_id') {
  //   return process.env.RAZORPAY_KEY_ID;
  // }
  // return null;
  
  // Always return null as payment is disabled
  return null;
};

export default razorpay;