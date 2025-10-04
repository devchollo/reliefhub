const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, userType } = req.body;
    
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    // Create new user
    user = new User({ 
      name, 
      email, 
      password,
      phone,
      userType: userType || 'individual'
    });
    await user.save();

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    // Return complete user data
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      userType: user.userType,
      isAdmin: user.isAdmin,
      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified,
      totalDonations: user.totalDonations,
      totalDonationAmount: user.totalDonationAmount,
      badges: user.badges
    };

    res.json({ token, user: userResponse });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    // Return complete user data
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      userType: user.userType,
      isAdmin: user.isAdmin,
      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified,
      totalDonations: user.totalDonations,
      totalDonationAmount: user.totalDonationAmount,
      badges: user.badges
    };

    res.json({ token, user: userResponse });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/test-email', async (req, res) => {
  const { sendEmail } = require('../utils/email');
  
  try {
    await sendEmail({
      to: 'devchollo@gmail.com', // Change this
      subject: 'Test Email from ReliefHub',
      html: '<h1>Success! ✅</h1><p>Brevo is working correctly.</p>',
      text: 'Success! Brevo is working correctly.'
    });
    
    res.json({ success: true, message: 'Test email sent! Check your inbox.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;