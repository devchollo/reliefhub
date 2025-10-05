// routes/leaderboard.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Badge = require('../models/Badge');
const fs = require('fs');
const path = require('path');

// GET /api/leaderboard?type=all
router.get('/', async (req, res) => {
  try {
    const type = req.query.type || 'all';
    const filter = type !== 'all' ? { userType: type } : {};

    // Fetch all users matching filter
    const users = await User.find(filter).lean();

    // Sort by totalDonationAmount descending
    users.sort((a, b) => (b.totalDonationAmount || 0) - (a.totalDonationAmount || 0));
    const totalUsers = users.length;

    const leaderboard = users.map((user, idx) => {
      let tier = 'bronze';
      if (idx === 0) tier = 'platinum';
      else if (idx < totalUsers * 0.1) tier = 'gold';
      else if (idx < totalUsers * 0.3) tier = 'silver';

      return {
        id: user._id.toString(),
        name: user.name,
        userType: user.userType,
        totalAmount: user.totalDonationAmount || 0,
        totalDonations: user.totalDonations || 0,
        badges: user.badges || [],
        rank: idx + 1,
        tier,
        percentile: Math.round(((totalUsers - idx) / totalUsers) * 100)
      };
    });

    res.json(leaderboard);
  } catch (err) {
    console.error('Leaderboard error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/leaderboard/my-rank
router.get('/my-rank', protect, async (req, res) => {
  try {
    const allUsers = await User.find().lean();

    // Sort by totalDonationAmount descending
    allUsers.sort((a, b) => (b.totalDonationAmount || 0) - (a.totalDonationAmount || 0));
    const totalUsers = allUsers.length;

    const myIndex = allUsers.findIndex(u => u._id.toString() === req.user._id.toString());
    const myData = allUsers[myIndex];

    if (!myData) return res.status(404).json({ message: 'User not found' });

    res.json({
      rank: myIndex + 1,
      totalAmount: myData.totalDonationAmount || 0,
      totalDonations: myData.totalDonations || 0,
      percentile: Math.round(((totalUsers - myIndex) / totalUsers) * 100)
    });
  } catch (err) {
    console.error('My rank error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/leaderboard/badges
router.get('/badges', async (req, res) => {
  try {
    const badges = await Badge.find().lean();
    res.json(badges);
  } catch (err) {
    console.error('Badges error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/leaderboard/badges/:badgeId/certificate
router.get('/badges/:badgeId/certificate', protect, async (req, res) => {
  try {
    const badgeId = req.params.badgeId;
    const filePath = path.join(__dirname, '../certificates', `${badgeId}.pdf`);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'Certificate not found' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=certificate-${badgeId}.pdf`);
    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    console.error('Certificate download error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
