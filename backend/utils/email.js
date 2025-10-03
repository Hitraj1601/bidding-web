import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create transporter
const createTransporter = () => {
  // Use Gmail for both development and production
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ Email credentials not found in environment variables');
    throw new Error('Email credentials not configured');
  }
  
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Email templates - using string concatenation approach
const emailTemplates = {
  verification: {
    subject: 'Verify Your Account - Antique Bidding',
    getHtml: (context) => `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Account</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
          .content { background: white; padding: 30px; }
          .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏺 Antique Bidding</h1>
            <h2>Welcome to Our Community!</h2>
          </div>
          <div class="content">
            <p>Hello ${context.firstName || 'User'},</p>
            <p>Thank you for joining our antique bidding community! To complete your registration and start bidding on amazing antiques, please verify your email address.</p>
            <p style="text-align: center;">
              <a href="${context.verificationUrl || '#'}" class="button">Verify Email Address</a>
            </p>
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; color: #666;">${context.verificationUrl || '#'}</p>
            <p>This link will expire in 24 hours for security purposes.</p>
            <p>If you didn't create this account, you can safely ignore this email.</p>
            <p>Welcome aboard!<br>The Antique Bidding Team</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Antique Bidding Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>`
  },
  
  'password-reset': {
    subject: 'Password Reset - Antique Bidding',
    getHtml: (context) => `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
          .content { background: white; padding: 30px; }
          .button { display: inline-block; padding: 12px 24px; background: #dc3545; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏺 Antique Bidding</h1>
            <h2>Password Reset Request</h2>
          </div>
          <div class="content">
            <p>Hello ${context.firstName || 'User'},</p>
            <p>We received a request to reset your password for your Antique Bidding account.</p>
            <div class="warning">
              <strong>⚠️ Security Notice:</strong> If you didn't request this password reset, please ignore this email. Your account is still secure.
            </div>
            <p style="text-align: center;">
              <a href="${context.resetUrl || '#'}" class="button">Reset Password</a>
            </p>
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; color: #666;">${context.resetUrl || '#'}</p>
            <p><strong>This link will expire in 1 hour</strong> for security purposes.</p>
            <p>If you're having trouble with the button above, copy and paste the URL into your web browser.</p>
            <p>Best regards,<br>The Antique Bidding Team</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Antique Bidding Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>`
  },
  
  'bid-notification': {
    subject: (context) => `New Bid on Your Item - ${context.itemTitle || 'Your Item'}`,
    getHtml: (context) => `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Bid Notification</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; }
          .content { background: white; padding: 30px; }
          .bid-info { background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .button { display: inline-block; padding: 12px 24px; background: #28a745; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 New Bid Alert!</h1>
          </div>
          <div class="content">
            <p>Hello ${context.sellerName || 'Seller'},</p>
            <p>Great news! Someone just placed a bid on your item.</p>
            <div class="bid-info">
              <h3>${context.itemTitle || 'Your Item'}</h3>
              <p><strong>New Bid:</strong> $${context.bidAmount || '0'}</p>
              <p><strong>Bidder:</strong> ${context.bidderName || 'Anonymous'}</p>
              <p><strong>Time Remaining:</strong> ${context.timeRemaining || 'N/A'}</p>
            </div>
            <p style="text-align: center;">
              <a href="${context.itemUrl || '#'}" class="button">View Item</a>
            </p>
            <p>Keep an eye on your auction as it heats up!</p>
            <p>Best regards,<br>The Antique Bidding Team</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Antique Bidding Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>`
  },
  
  'auction-ending': {
    subject: (context) => `Auction Ending Soon - ${context.itemTitle || 'Your Item'}`,
    getHtml: (context) => `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Auction Ending Soon</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%); color: white; padding: 30px; text-align: center; }
          .content { background: white; padding: 30px; }
          .urgent-info { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .button { display: inline-block; padding: 12px 24px; background: #ffc107; color: #333; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⏰ Last Chance!</h1>
          </div>
          <div class="content">
            <p>Hello ${context.bidderName || 'Bidder'},</p>
            <p>The auction for an item you're interested in is ending soon!</p>
            <div class="urgent-info">
              <h3>${context.itemTitle || 'Item'}</h3>
              <p><strong>Current Bid:</strong> $${context.currentBid || '0'}</p>
              <p><strong>Time Remaining:</strong> ${context.timeRemaining || 'N/A'}</p>
              <p><strong>Your Status:</strong> ${context.bidStatus || 'N/A'}</p>
            </div>
            <p style="text-align: center;">
              <a href="${context.itemUrl || '#'}" class="button">Place Your Bid Now!</a>
            </p>
            <p>Don't miss out on this amazing antique. Place your bid before it's too late!</p>
            <p>Happy bidding!<br>The Antique Bidding Team</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Antique Bidding Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>`
  },
  
  'auction-won': {
    subject: (context) => `Congratulations! You Won - ${context.itemTitle || 'Your Item'}`,
    getHtml: (context) => `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Auction Won!</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; }
          .content { background: white; padding: 30px; }
          .winner-info { background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .button { display: inline-block; padding: 12px 24px; background: #28a745; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Congratulations!</h1>
            <h2>You Won the Auction!</h2>
          </div>
          <div class="content">
            <p>Hello ${context.winnerName || 'Winner'},</p>
            <p>Fantastic news! You have successfully won the auction for:</p>
            <div class="winner-info">
              <h3>${context.itemTitle || 'Item'}</h3>
              <p><strong>Winning Bid:</strong> $${context.winningBid || '0'}</p>
              <p><strong>Seller:</strong> ${context.sellerName || 'Seller'}</p>
            </div>
            <p>Next steps:</p>
            <ol>
              <li>Complete payment within 48 hours</li>
              <li>Coordinate shipping with the seller</li>
              <li>Leave feedback once you receive your item</li>
            </ol>
            <p style="text-align: center;">
              <a href="${context.paymentUrl || '#'}" class="button">Complete Payment</a>
            </p>
            <p>Thank you for being part of our community!</p>
            <p>Best regards,<br>The Antique Bidding Team</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Antique Bidding Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>`
  }
};

// Function to replace template variables - now returns the template function result
const replaceTemplateVariables = (template, context) => {
  // Template is now a function or object with functions
  return template;
};

// Main send email function
export const sendEmail = async ({ to, subject, template, context, attachments = [] }) => {
  try {
    const transporter = createTransporter();
    
    let emailContent = '';
    let emailSubject = subject;
    
    if (template && emailTemplates[template]) {
      const templateObj = emailTemplates[template];
      emailContent = templateObj.getHtml(context || {});
      emailSubject = typeof templateObj.subject === 'function' 
        ? templateObj.subject(context || {}) 
        : templateObj.subject;
    }
    
    const mailOptions = {
      from: `"Antique Bidding Platform" <${process.env.EMAIL_USER}>`,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject: emailSubject,
      html: emailContent,
      attachments: attachments
    };
    
    const info = await transporter.sendMail(mailOptions);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 Email sent successfully!');
      console.log('Message ID:', info.messageId);
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    
    return {
      success: true,
      messageId: info.messageId,
      previewUrl: process.env.NODE_ENV === 'development' ? nodemailer.getTestMessageUrl(info) : null
    };
    
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// Bulk email function
export const sendBulkEmail = async (emails) => {
  try {
    const transporter = createTransporter();
    const results = [];
    
    for (const emailData of emails) {
      try {
        const result = await sendEmail(emailData);
        results.push({ ...emailData, success: true, result });
      } catch (error) {
        results.push({ ...emailData, success: false, error: error.message });
      }
    }
    
    return {
      success: true,
      results,
      sent: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length
    };
    
  } catch (error) {
    console.error('❌ Bulk email sending failed:', error);
    throw new Error(`Failed to send bulk emails: ${error.message}`);
  }
};

// Email verification check
export const verifyEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email configuration is valid');
    return true;
  } catch (error) {
    console.error('❌ Email configuration error:', error);
    return false;
  }
};

// Schedule email (for future implementation with queue)
export const scheduleEmail = async (emailData, sendAt) => {
  // This would integrate with a job queue like Bull or Agenda
  // For now, we'll just log it
  console.log('📅 Email scheduled for:', sendAt, emailData);
  return { success: true, scheduledAt: sendAt };
};

export default {
  sendEmail,
  sendBulkEmail,
  verifyEmailConfig,
  scheduleEmail
};