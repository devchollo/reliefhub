const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth');  // ✅ destructure protect
const router = express.Router();

// Get profile
router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

// Update profile
router.put('/me', protect, async (req, res) => {
  try {
    const { name } = req.body;
    req.user.name = name || req.user.name;
    await req.user.save();
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
