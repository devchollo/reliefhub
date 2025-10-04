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