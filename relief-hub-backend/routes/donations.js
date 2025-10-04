// routes/donations.js - COMPLETE DONATION PROCESSING
const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const Request = require('../models/Request');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Calculate fees helper function
const calculateFees = (amount) => {
  const processingFee = amount * 0.025; // 2.5%
  const platformFee = Math.floor(amount / 10) * 0.25; // ₱0.25 per ₱10
  const totalFees = processingFee + platformFee;
  const netAmount = amount - totalFees;
  
  return {
    processingFee: parseFloat(processingFee.toFixed(2)),
    platformFee: parseFloat(platformFee.toFixed(2)),
    totalFees: parseFloat(totalFees.toFixed(2)),
    netAmount: parseFloat(netAmount.toFixed(2))
  };
};

// @desc    Create donation with Stripe
// @route   POST /api/donations/stripe
// @access  Private
router.post('/stripe', protect, async (req, res, next) => {
  try {
    const { requestId, amount, paymentMethodId, notes } = req.body;

    // Validate
    if (!requestId || !amount || !paymentMethodId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    if (amount < 10) {
      return res.status(400).json({
        success: false,
        message: 'Minimum donation is ₱10'
      });
    }

    // Check if request exists
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Calculate fees
    const fees = calculateFees(amount);

    // Create Stripe payment intent (you'll need to set up Stripe)
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'php',
      payment_method: paymentMethodId,
      confirm: true,
      metadata: {
        requestId: requestId,
        donorId: req.user.id,
        processingFee: fees.processingFee,
        platformFee: fees.platformFee,
        netAmount: fees.netAmount
      }
    });

    // Create donation record
    const donation = await Donation.create({
      donor: req.user.id,
      request: requestId,
      amount,
      paymentMethod: 'stripe',
      paymentStatus: paymentIntent.status === 'succeeded' ? 'completed' : 'pending',
      transactionId: paymentIntent.id,
      stripePaymentIntentId: paymentIntent.id,
      processingFee: fees.processingFee,
      platformFee: fees.platformFee,
      netAmount: fees.netAmount,
      notes
    });

    // Update request total received
    await Request.findByIdAndUpdate(requestId, {
      $inc: { totalReceived: fees.netAmount }
    });

    // Update user donation stats
    await User.findByIdAndUpdate(req.user.id, {
      $inc: {
        totalDonations: 1,
        totalDonationAmount: amount
      }
    });

    // Check and award badges
    const user = await User.findById(req.user.id);
    const donationAmount = user.totalDonationAmount;

    const badgeThresholds = [
      { amount: 1000, name: 'Bronze Supporter', type: 'bronze' },
      { amount: 5000, name: 'Silver Supporter', type: 'silver' },
      { amount: 10000, name: 'Gold Supporter', type: 'gold' },
      { amount: 50000, name: 'Platinum Supporter', type: 'platinum' }
    ];

    for (const badge of badgeThresholds) {
      if (donationAmount >= badge.amount) {
        const hasBadge = user.badges.some(b => b.type === badge.type);
        if (!hasBadge) {
          user.badges.push({
            name: badge.name,
            earnedAt: Date.now(),
            type: badge.type
          });
        }
      }
    }
    await user.save();

    // Populate and return
    const populatedDonation = await Donation.findById(donation._id)
      .populate('donor', 'name email userType')
      .populate('request', 'name type message');

    res.status(201).json({
      success: true,
      message: 'Donation successful!',
      data: populatedDonation,
      fees: {
        processingFee: fees.processingFee,
        platformFee: fees.platformFee,
        totalFees: fees.totalFees,
        netAmount: fees.netAmount
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Create donation with GCash
// @route   POST /api/donations/gcash
// @access  Private
router.post('/gcash', protect, async (req, res, next) => {
  try {
    const { requestId, amount, gcashReferenceNumber, notes } = req.body;

    // Validate
    if (!requestId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    if (amount < 10) {
      return res.status(400).json({
        success: false,
        message: 'Minimum donation is ₱10'
      });
    }

    // Check if request exists
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    if (!request.gcashNumber) {
      return res.status(400).json({
        success: false,
        message: 'This request does not accept GCash donations'
      });
    }

    // Calculate fees
    const fees = calculateFees(amount);

    // Create donation record (pending until verified)
    const donation = await Donation.create({
      donor: req.user.id,
      request: requestId,
      amount,
      paymentMethod: 'gcash',
      paymentStatus: 'pending',
      gcashReferenceNumber,
      processingFee: fees.processingFee,
      platformFee: fees.platformFee,
      netAmount: fees.netAmount,
      notes
    });

    res.status(201).json({
      success: true,
      message: 'GCash donation created. Please send ₱' + amount + ' to ' + request.gcashNumber,
      data: {
        donationId: donation._id,
        gcashNumber: request.gcashNumber,
        amount: amount,
        fees: fees
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Confirm GCash payment
// @route   POST /api/donations/gcash/confirm
// @access  Private
router.post('/gcash/confirm', protect, async (req, res, next) => {
  try {
    const { donationId, referenceNumber } = req.body;

    const donation = await Donation.findById(donationId);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    if (donation.donor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Update donation
    donation.paymentStatus = 'completed';
    donation.gcashReferenceNumber = referenceNumber;
    donation.transactionId = referenceNumber;
    await donation.save();

    // Update request total
    await Request.findByIdAndUpdate(donation.request, {
      $inc: { totalReceived: donation.netAmount }
    });

    // Update user stats
    await User.findByIdAndUpdate(req.user.id, {
      $inc: {
        totalDonations: 1,
        totalDonationAmount: donation.amount
      }
    });

    res.json({
      success: true,
      message: 'GCash payment confirmed!',
      data: donation
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get my donations
// @route   GET /api/donations/my-donations
// @access  Private
router.get('/my-donations', protect, async (req, res, next) => {
  try {
    const donations = await Donation.find({ donor: req.user.id })
      .populate('request', 'name type message')
      .sort('-createdAt');

    res.json({
      success: true,
      count: donations.length,
      data: donations
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get donations for a request
// @route   GET /api/donations/request/:requestId
// @access  Public
router.get('/request/:requestId', async (req, res, next) => {
  try {
    const donations = await Donation.find({
      request: req.params.requestId,
      paymentStatus: 'completed'
    })
      .populate('donor', 'name userType')
      .sort('-createdAt');

    const total = donations.reduce((sum, d) => sum + d.netAmount, 0);

    res.json({
      success: true,
      count: donations.length,
      total: total,
      data: donations
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;