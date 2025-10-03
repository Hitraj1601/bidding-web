import express from 'express';
import { sendEmail } from '../utils/email.js';

const router = express.Router();

// Test email sending
router.post('/test-email', async (req, res) => {
  try {
    const { to, subject = 'Test Email from Antique Bidding' } = req.body;
    
    if (!to) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required'
      });
    }

    const result = await sendEmail({
      to: to,
      subject: subject,
      template: 'verification',
      context: {
        firstName: 'Test User',
        verificationUrl: 'http://localhost:5173/verify-test'
      }
    });

    res.json({
      success: true,
      message: 'Test email sent successfully!',
      messageId: result.messageId,
      previewUrl: result.previewUrl
    });

  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test email',
      error: error.message
    });
  }
});

export default router;