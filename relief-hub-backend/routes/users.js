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

// **New: Dashboard endpoint**
router.get('/dashboard', protect, async (req, res) => {
  try {
    // Fetch user donations
    const donations = await Donation.find({ user: req.user._id })
      .populate('request', 'name type') // include request details
      .sort({ createdAt: -1 });

    // Aggregate donation stats
    const donationStats = {
      totalAmount: donations.reduce((sum, d) => sum + (d.amount || 0), 0),
      totalCount: donations.length
    };

    // Fetch user's requests
    const requests = await Request.find({ createdBy: req.user._id })
      .populate('helpers', 'name email') // include helpers who helped
      .sort({ createdAt: -1 });

    res.json({
      data: {
        donations: {
          list: donations,
          stats: donationStats
        },
        requests: {
          list: requests
        }
      }
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});


module.exports = router;
