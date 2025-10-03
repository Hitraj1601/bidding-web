import express from 'express';

const router = express.Router();

// Test OAuth configuration
router.get('/test-oauth', (req, res) => {
  const config = {
    googleClientId: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Missing',
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Missing',
    serverUrl: process.env.SERVER_URL,
    clientUrl: process.env.CLIENT_URL,
    callbackUrl: `${process.env.SERVER_URL || 'http://localhost:5001'}/api/auth/google/callback`
  };
  
  res.json({
    success: true,
    message: 'OAuth Configuration Test',
    config
  });
});

export default router;