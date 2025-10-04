const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Leaderboard by points
router.get('/', async (req, res) => {
  try {
    const users = await User.find().sort({ points: -1 }).limit(10).select('name points');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
