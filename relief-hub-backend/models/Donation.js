const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  request: { type: mongoose.Schema.Types.ObjectId, ref: 'Request' },
  amount: { type: Number, required: true },
  paymentMethod: { 
    type: String, 
    enum: ['gcash', 'stripe', 'in-kind'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  transactionId: { type: String },
  stripePaymentIntentId: { type: String },
  gcashReferenceNumber: { type: String },
  processingFee: { type: Number, default: 0 },
  platformFee: { type: Number, default: 0 },
  netAmount: { type: Number, required: true },
  isRecurring: { type: Boolean, default: false },
  notes: { type: String },
  refundReason: { type: String },
  refundedAt: { type: Date },
  refundedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Donation', DonationSchema);