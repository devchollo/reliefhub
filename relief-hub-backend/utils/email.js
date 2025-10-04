// utils/email.js - CORRECTED FOR BREVO
const nodemailer = require('nodemailer');

// Create reusable transporter for Brevo
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp-relay.brevo.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false, // Use TLS (not SSL)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false // Allow self-signed certificates
  }
});

// Verify connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email configuration error:', error);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

exports.sendEmail = async (options) => {
  const mailOptions = {
    from: `${process.env.EMAIL_FROM_NAME || 'ReliefHub'} <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// Helper function to send verification email
exports.sendVerificationEmail = async (to, name, verificationLink) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { color: white; margin: 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏠 ReliefHub</h1>
        </div>
        <div class="content">
          <h2>Welcome, ${name}!</h2>
          <p>Thank you for joining ReliefHub. Please verify your email address to get started.</p>
          <p style="text-align: center;">
            <a href="${verificationLink}" class="button">Verify Email Address</a>
          </p>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #667eea;">${verificationLink}</p>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't create an account, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>© 2025 ReliefHub. All rights reserved.</p>
          <p>Connecting those in need with helpers</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await exports.sendEmail({
    to,
    subject: 'Verify Your Email - ReliefHub',
    html,
    text: `Welcome ${name}! Please verify your email by clicking: ${verificationLink}`
  });
};

// Helper function to send password reset email
exports.sendPasswordResetEmail = async (to, name, resetLink) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { color: white; margin: 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 15px 30px; background: #ef4444; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .warning { background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏠 ReliefHub</h1>
        </div>
        <div class="content">
          <h2>Password Reset Request</h2>
          <p>Hi ${name},</p>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <p style="text-align: center;">
            <a href="${resetLink}" class="button">Reset Password</a>
          </p>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #667eea;">${resetLink}</p>
          <div class="warning">
            <strong>⚠️ Security Notice:</strong><br>
            This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return await exports.sendEmail({
    to,
    subject: 'Reset Your Password - ReliefHub',
    html,
    text: `Hi ${name}, reset your password here: ${resetLink}`
  });
};

// Helper function to send donation receipt
exports.sendDonationReceipt = async (to, name, donationDetails) => {
  const { amount, requestName, date, transactionId, netAmount } = donationDetails;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { color: white; margin: 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .receipt { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .receipt-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .total { font-weight: bold; font-size: 18px; color: #10b981; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💚 Thank You!</h1>
        </div>
        <div class="content">
          <h2>Donation Receipt</h2>
          <p>Dear ${name},</p>
          <p>Thank you for your generous donation to <strong>${requestName}</strong>!</p>
          
          <div class="receipt">
            <div class="receipt-row">
              <span>Donation Amount:</span>
              <span>₱${amount.toLocaleString()}</span>
            </div>
            <div class="receipt-row">
              <span>Net to Recipient:</span>
              <span>₱${netAmount.toLocaleString()}</span>
            </div>
            <div class="receipt-row">
              <span>Date:</span>
              <span>${date}</span>
            </div>
            <div class="receipt-row">
              <span>Transaction ID:</span>
              <span>${transactionId}</span>
            </div>
          </div>
          
          <p>Your kindness makes a real difference in someone's life. 💙</p>
          <p>You can view your donation history anytime in your <a href="${process.env.FRONTEND_URL}/dashboard">Dashboard</a>.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await exports.sendEmail({
    to,
    subject: 'Donation Receipt - ReliefHub',
    html,
    text: `Thank you for your ₱${amount} donation to ${requestName}!`
  });
};