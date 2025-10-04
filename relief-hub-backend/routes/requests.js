// routes/requests.js
const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// @desc    Create new relief request
// @route   POST /api/requests
// @access  Public
router.post('/', async (req, res, next) => {
  try {
    const { name, phone, email, type, message, lat, lng, address, gcashNumber, bankAccount, donationGoal } = req.body;

    // Validate required fields
    if (!name || !phone || !type || !message || !lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Create request
    const request = await Request.create({
      name,
      phone,
      email,
      type,
      message,
      location: {
        type: 'Point',
        coordinates: [lng, lat] // MongoDB expects [longitude, latitude]
      },
      address,
      gcashNumber: type === 'money' ? gcashNumber : undefined,
      bankAccount: type === 'money' ? bankAccount : undefined,
      donationGoal: type === 'money' ? donationGoal : undefined,
      user: req.user ? req.user.id : undefined
    });

    res.status(201).json({
      success: true,
      data: request
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get all requests (with filters)
// @route   GET /api/requests
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const { type, status, lat, lng, radius, search } = req.query;

    // Build query
    let query = { isActive: true };

    // Filter by type
    if (type && type !== 'all') {
      query.type = type;
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Search by name or message
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    // Geospatial query - find requests within radius
    if (lat && lng && radius) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius) * 1000 // Convert km to meters
        }
      };
    }

    const requests = await Request.find(query)
      .populate('user', 'name userType')
      .populate('verifiedBy', 'name')
      .sort('-createdAt')
      .limit(100);

    res.json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single request
// @route   GET /api/requests/:id
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('user', 'name email phone userType')
      .populate('verifiedBy', 'name')
      .populate('helpers.user', 'name userType');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    res.json({
      success: true,
      data: request
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update request
// @route   PUT /api/requests/:id
// @access  Private (Own requests or Admin)
router.put('/:id', protect, async (req, res, next) => {
  try {
    let request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check ownership or admin
    if (request.user && request.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this request'
      });
    }

    request = await Request.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: request
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete request
// @route   DELETE /api/requests/:id
// @access  Private (Own requests or Admin)
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check ownership or admin
    if (request.user && request.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this request'
      });
    }

    // Soft delete
    request.isActive = false;
    await request.save();

    res.json({
      success: true,
      message: 'Request deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Mark request as helped
// @route   POST /api/requests/:id/help
// @access  Private
router.post('/:id/help', protect, async (req, res, next) => {
  try {
    const { notes } = req.body;

    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check if user already helped
    const alreadyHelped = request.helpers.some(
      helper => helper.user.toString() === req.user.id
    );

    if (alreadyHelped) {
      return res.status(400).json({
        success: false,
        message: 'You have already marked this request as helped'
      });
    }

    // Add to helpers
    request.helpers.push({
      user: req.user.id,
      helpedAt: Date.now(),
      notes
    });

    // Update status if needed
    if (request.status === 'pending') {
      request.status = 'in-progress';
    }

    await request.save();

    // Update user's donation count
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { totalDonations: 1 }
    });

    // Check and award badges
    const user = await User.findById(req.user.id);
    const donationCount = user.totalDonations;

    const badgeThresholds = [
      { count: 10, name: 'Helper', type: 'helper' },
      { count: 50, name: 'Champion', type: 'champion' },
      { count: 100, name: 'Hero', type: 'hero' },
      { count: 500, name: 'Legend', type: 'legend' }
    ];

    for (const badge of badgeThresholds) {
      if (donationCount === badge.count) {
        const hasBadge = user.badges.some(b => b.type === badge.type);
        if (!hasBadge) {
          user.badges.push({
            name: badge.name,
            earnedAt: Date.now(),
            type: badge.type
          });
          await user.save();
        }
      }
    }

    res.json({
      success: true,
      message: 'Thank you for helping!',
      data: request
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Verify request (Admin only)
// @route   POST /api/requests/:id/verify
// @access  Private/Admin
router.post('/:id/verify', protect, authorize('admin'), async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    request.isVerified = true;
    request.verifiedBy = req.user.id;
    request.verifiedAt = Date.now();
    await request.save();

    res.json({
      success: true,
      message: 'Request verified successfully',
      data: request
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update request status
// @route   PATCH /api/requests/:id/status
// @access  Private
router.patch('/:id/status', protect, async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['pending', 'in-progress', 'fulfilled', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check authorization
    if (request.user && request.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this request'
      });
    }

    request.status = status;
    await request.save();

    res.json({
      success: true,
      data: request
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;