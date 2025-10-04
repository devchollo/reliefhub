// routes/admin.js - Admin Management Routes
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Request = require('../models/Request');
const Donation = require('../models/Donation');
const { protect, authorize } = require('../middleware/auth');

// All routes require admin authentication
router.use(protect);
router.use(authorize('admin'));

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get('/stats', async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalRequests,
      totalDonations,
      pendingRequests,
      activeUsers,
      recentRequests,
      recentDonations
    ] = await Promise.all([
      User.countDocuments(),
      Request.countDocuments(),
      Donation.countDocuments({ paymentStatus: 'completed' }),
      Request.countDocuments({ status: 'pending' }),
      User.countDocuments({ isActive: true }),
      Request.find().sort('-createdAt').limit(10).populate('user', 'name email'),
      Donation.find({ paymentStatus: 'completed' })
        .sort('-createdAt')
        .limit(10)
        .populate('donor', 'name')
        .populate('request', 'name type')
    ]);

    // Calculate total donation amount
    const donationStats = await Donation.aggregate([
      { $match: { paymentStatus: 'completed' } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalFees: { $sum: { $add: ['$processingFee', '$platformFee'] } },
          totalNet: { $sum: '$netAmount' }
        }
      }
    ]);

    // Requests by type
    const requestsByType = await Request.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    // Requests by status
    const requestsByStatus = await Request.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // User growth (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalRequests,
          totalDonations,
          pendingRequests,
          activeUsers
        },
        donations: donationStats[0] || { totalAmount: 0, totalFees: 0, totalNet: 0 },
        requestsByType,
        requestsByStatus,
        userGrowth,
        recent: {
          requests: recentRequests,
          donations: recentDonations
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get all users with filters
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', async (req, res, next) => {
  try {
    const { page = 1, limit = 20, userType, isActive, search, sortBy = '-createdAt' } = req.query;

    const query = {};
    
    if (userType) query.userType = userType;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort(sortBy)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments(query);

    res.json({
      success: true,
      count: users.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: users
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get user details with activity
// @route   GET /api/admin/users/:id
// @access  Private/Admin
router.get('/users/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const [requests, donations] = await Promise.all([
      Request.find({ user: user._id }).sort('-createdAt'),
      Donation.find({ donor: user._id })
        .populate('request', 'name type message')
        .sort('-createdAt')
    ]);

    res.json({
      success: true,
      data: {
        user,
        requests,
        donations,
        stats: {
          totalRequests: requests.length,
          totalDonations: donations.length,
          totalAmount: user.totalDonationAmount
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
router.put('/users/:id', async (req, res, next) => {
  try {
    const { isAdmin, isActive, userType, isEmailVerified, isPhoneVerified } = req.body;

    const updateFields = {};
    if (isAdmin !== undefined) updateFields.isAdmin = isAdmin;
    if (isActive !== undefined) updateFields.isActive = isActive;
    if (userType) updateFields.userType = userType;
    if (isEmailVerified !== undefined) updateFields.isEmailVerified = isEmailVerified;
    if (isPhoneVerified !== undefined) updateFields.isPhoneVerified = isPhoneVerified;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get all requests with filters
// @route   GET /api/admin/requests
// @access  Private/Admin
router.get('/requests', async (req, res, next) => {
  try {
    const { page = 1, limit = 20, type, status, isVerified, priority, sortBy = '-createdAt' } = req.query;

    const query = {};
    
    if (type) query.type = type;
    if (status) query.status = status;
    if (isVerified !== undefined) query.isVerified = isVerified === 'true';
    if (priority) query.priority = priority;

    const requests = await Request.find(query)
      .populate('user', 'name email phone')
      .populate('verifiedBy', 'name')
      .sort(sortBy)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Request.countDocuments(query);

    res.json({
      success: true,
      count: requests.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: requests
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Verify request
// @route   POST /api/admin/requests/:id/verify
// @access  Private/Admin
router.post('/requests/:id/verify', async (req, res, next) => {
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

// @desc    Delete/deactivate request
// @route   DELETE /api/admin/requests/:id
// @access  Private/Admin
router.delete('/requests/:id', async (req, res, next) => {
  try {
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    res.json({
      success: true,
      message: 'Request deactivated successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get all donations
// @route   GET /api/admin/donations
// @access  Private/Admin
router.get('/donations', async (req, res, next) => {
  try {
    const { page = 1, limit = 20, paymentStatus, paymentMethod, sortBy = '-createdAt' } = req.query;

    const query = {};
    
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (paymentMethod) query.paymentMethod = paymentMethod;

    const donations = await Donation.find(query)
      .populate('donor', 'name email userType')
      .populate('request', 'name type message')
      .sort(sortBy)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Donation.countDocuments(query);

    // Calculate totals
    const totals = await Donation.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalFees: { $sum: { $add: ['$processingFee', '$platformFee'] } },
          totalNet: { $sum: '$netAmount' }
        }
      }
    ]);

    res.json({
      success: true,
      count: donations.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totals: totals[0] || { totalAmount: 0, totalFees: 0, totalNet: 0 },
      data: donations
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Refund donation
// @route   POST /api/admin/donations/:id/refund
// @access  Private/Admin
router.post('/donations/:id/refund', async (req, res, next) => {
  try {
    const { reason } = req.body;

    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    if (donation.paymentStatus === 'refunded') {
      return res.status(400).json({
        success: false,
        message: 'Donation already refunded'
      });
    }

    // Update donation status
    donation.paymentStatus = 'refunded';
    donation.refundReason = reason;
    donation.refundedAt = Date.now();
    donation.refundedBy = req.user.id;
    await donation.save();

    // Update user stats
    await User.findByIdAndUpdate(donation.donor, {
      $inc: {
        totalDonations: -1,
        totalDonationAmount: -donation.amount
      }
    });

    // Update request total
    await Request.findByIdAndUpdate(donation.request, {
      $inc: { totalReceived: -donation.netAmount }
    });

    res.json({
      success: true,
      message: 'Donation refunded successfully',
      data: donation
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Generate platform report
// @route   GET /api/admin/reports
// @access  Private/Admin
router.get('/reports', async (req, res, next) => {
  try {
    const { startDate, endDate, reportType = 'summary' } = req.query;

    const dateQuery = {};
    if (startDate && endDate) {
      dateQuery.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const report = {
      period: {
        start: startDate || 'All time',
        end: endDate || 'Present'
      },
      generated: new Date().toISOString()
    };

    if (reportType === 'summary' || reportType === 'all') {
      // User statistics
      const userStats = await User.aggregate([
        { $match: dateQuery },
        {
          $group: {
            _id: '$userType',
            count: { $sum: 1 }
          }
        }
      ]);

      // Request statistics
      const requestStats = await Request.aggregate([
        { $match: dateQuery },
        {
          $group: {
            _id: {
              type: '$type',
              status: '$status'
            },
            count: { $sum: 1 }
          }
        }
      ]);

      // Donation statistics
      const donationStats = await Donation.aggregate([
        { $match: { ...dateQuery, paymentStatus: 'completed' } },
        {
          $group: {
            _id: null,
            totalDonations: { $sum: 1 },
            totalAmount: { $sum: '$amount' },
            totalProcessingFees: { $sum: '$processingFee' },
            totalPlatformFees: { $sum: '$platformFee' },
            totalNetAmount: { $sum: '$netAmount' },
            avgDonation: { $avg: '$amount' }
          }
        }
      ]);

      report.users = userStats;
      report.requests = requestStats;
      report.donations = donationStats[0] || {};
    }

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Bulk operations
// @route   POST /api/admin/bulk/:action
// @access  Private/Admin
router.post('/bulk/:action', async (req, res, next) => {
  try {
    const { action } = req.params;
    const { ids, updates } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of IDs'
      });
    }

    let result;

    switch (action) {
      case 'verify-requests':
        result = await Request.updateMany(
          { _id: { $in: ids } },
          {
            isVerified: true,
            verifiedBy: req.user.id,
            verifiedAt: Date.now()
          }
        );
        break;

      case 'deactivate-users':
        result = await User.updateMany(
          { _id: { $in: ids } },
          { isActive: false }
        );
        break;

      case 'activate-users':
        result = await User.updateMany(
          { _id: { $in: ids } },
          { isActive: true }
        );
        break;

      case 'update-requests':
        result = await Request.updateMany(
          { _id: { $in: ids } },
          updates
        );
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action'
        });
    }

    res.json({
      success: true,
      message: `Bulk ${action} completed`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;