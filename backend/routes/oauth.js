import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { 
  createPaymentOrder, 
  verifyPaymentSignature, 
  getPaymentDetails,
  createRefund,
  isRazorpayConfigured,
  getRazorpayKeyId
} from '../utils/razorpay.js';

const router = express.Router();

// Google OAuth Routes
router.get('/google', (req, res, next) => {
  console.log('🔵 Starting Google OAuth flow...');
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
  console.log('🔵 Google OAuth callback received');
  passport.authenticate('google', { 
    failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed`,
    failureMessage: true
  })(req, res, next);
}, async (req, res) => {
    try {
      console.log('🔵 Processing OAuth callback for user:', req.user.email);
      
      // Generate JWT tokens
      const accessToken = jwt.sign(
        { userId: req.user._id, email: req.user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      const refreshToken = jwt.sign(
        { userId: req.user._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
      );

      // Store refresh token in user document
      req.user.refreshTokens = req.user.refreshTokens || [];
      req.user.refreshTokens.push({
        token: refreshToken,
        createdAt: new Date()
      });
      req.user.lastLogin = new Date();
      await req.user.save();

      // Encode tokens for URL safety
      const encodedAccessToken = encodeURIComponent(accessToken);
      const encodedRefreshToken = encodeURIComponent(refreshToken);

      // Redirect to frontend with tokens in URL params
      res.redirect(`${process.env.CLIENT_URL}/oauth-callback?accessToken=${encodedAccessToken}&refreshToken=${encodedRefreshToken}`);
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_error`);
    }
  }
);

// PAYMENT ROUTES COMMENTED OUT - NO PAYMENT INTEGRATION

// Create payment order
// router.post('/payment/create-order', async (req, res) => {
//   try {
//     const { amount, currency = 'INR', receipt } = req.body;

//     if (!amount || amount <= 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid amount'
//       });
//     }

//     if (!isRazorpayConfigured()) {
//       return res.status(503).json({
//         success: false,
//         message: 'Payment service not configured. Please contact administrator.'
//       });
//     }

//     const result = await createPaymentOrder(amount, currency, receipt);

//     if (result.success) {
//       res.json({
//         success: true,
//         order: result.order,
//         key_id: getRazorpayKeyId()
//       });
//     } else {
//       res.status(500).json({
//         success: false,
//         message: 'Failed to create payment order',
//         error: result.error
//       });
//     }
//   } catch (error) {
//     console.error('Create order error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error'
//     });
//   }
// });

// Verify payment
// router.post('/payment/verify', async (req, res) => {
//   try {
//     const { 
//       razorpay_order_id, 
//       razorpay_payment_id, 
//       razorpay_signature 
//     } = req.body;

//     const isValid = verifyPaymentSignature(
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature
//     );

//     if (isValid) {
//       // Get payment details for additional verification
//       const paymentDetails = await getPaymentDetails(razorpay_payment_id);

//       if (paymentDetails.success) {
//         // Here you can update your database with payment success
//         // For example, update bid status, transfer ownership, etc.
        
//         res.json({
//           success: true,
//           message: 'Payment verified successfully',
//           payment: paymentDetails.payment
//         });
//       } else {
//         res.status(400).json({
//           success: false,
//           message: 'Payment verification failed',
//           error: paymentDetails.error
//         });
//       }
//     } else {
//       res.status(400).json({
//         success: false,
//         message: 'Invalid payment signature'
//       });
//     }
//   } catch (error) {
//     console.error('Payment verification error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error'
//     });
//   }
// });

// Get payment details
// router.get('/payment/:paymentId', async (req, res) => {
//   try {
//     const { paymentId } = req.params;
//     const result = await getPaymentDetails(paymentId);

//     if (result.success) {
//       res.json({
//         success: true,
//         payment: result.payment
//       });
//     } else {
//       res.status(404).json({
//         success: false,
//         message: 'Payment not found',
//         error: result.error
//       });
//     }
//   } catch (error) {
//     console.error('Get payment details error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error'
//     });
//   }
// });

// Create refund
// router.post('/payment/refund', async (req, res) => {
//   try {
//     const { paymentId, amount } = req.body;

//     const result = await createRefund(paymentId, amount);

//     if (result.success) {
//       res.json({
//         success: true,
//         refund: result.refund
//       });
//     } else {
//       res.status(400).json({
//         success: false,
//         message: 'Refund failed',
//         error: result.error
//       });
//     }
//   } catch (error) {
//     console.error('Refund error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error'
//     });
//   }
// });

export default router;