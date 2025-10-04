const express = require('express');
const Donation = require('../models/Donation');
const auth = require('../middleware/auth');
const router = express.Router();

// Create donation
router.post('/', auth, async (req, res) => {
  try {
    const { amount, requestId } = req.body;
    const fee = amount * 0.05;
    const donation = new Donation({ donor: req.user._id, amount, fee, request: requestId });
    await donation.save();
    res.json(donation);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all donations
router.get('/', auth, async (req, res) => {
  const donations = await Donation.find().populate('donor request');
  res.json(donations);
});

module.exports = router;
