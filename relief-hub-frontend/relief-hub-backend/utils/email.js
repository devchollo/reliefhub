// utils/email.js
const nodemailer = require('nodemailer');

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT === '465',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

exports.sendEmail = async (options) => {
  const mailOptions = {
    from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email error:', error);
    throw new Error('Failed to send email');
  }
};

// utils/sms.js
const axios = require('axios');

// Using Semaphore SMS API (popular in Philippines)
exports.sendSMS = async (options) => {
  const { to, message } = options;

  try {
    const response = await axios.post('https://api.semaphore.co/api/v4/messages', {
      apikey: process.env.SEMAPHORE_API_KEY,
      number: to,
      message: message,
      sendername: process.env.SMS_SENDER_NAME || 'ReliefHub'
    });

    console.log('SMS sent:', response.data);
    return response.data;
  } catch (error) {
    console.error('SMS error:', error);
    throw new Error('Failed to send SMS');
  }
};

// Alternative: Using Twilio (if you prefer)
// const twilio = require('twilio');
// const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
//
// exports.sendSMS = async (options) => {
//   try {
//     const message = await client.messages.create({
//       body: options.message,
//       from: process.env.TWILIO_PHONE_NUMBER,
//       to: options.to
//     });
//     return message;
//   } catch (error) {
//     console.error('SMS error:', error);
//     throw new Error('Failed to send SMS');
//   }
// };

// utils/validators.js
// Input validation helpers to prevent XSS and injection

exports.sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove potential XSS patterns
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/on\w+\s*=\s*'[^']*'/gi, '')
    .replace(/javascript:/gi, '')
    .trim();
};

exports.validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

exports.validatePhone = (phone) => {
  // Philippine phone format: +639XXXXXXXXX
  const re = /^\+63\d{10}$/;
  return re.test(phone);
};

exports.validateCoordinates = (lat, lng) => {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  
  return (
    !isNaN(latitude) &&
    !isNaN(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
};