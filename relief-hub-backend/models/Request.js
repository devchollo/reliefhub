const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  type: { 
    type: String, 
    required: true,
    enum: ['food', 'water', 'shelter', 'clothing', 'medical', 'money', 'other']
  },
  message: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }
  },
  address: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'in-progress', 'fulfilled', 'cancelled'], 
    default: 'pending' 
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  gcashNumber: { type: String },
  gcashVerified: { type: Boolean, default: false },
  bankAccount: { type: String },
  donationGoal: { type: Number },
  totalReceived: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  verifiedAt: { type: Date },
  isActive: { type: Boolean, default: true },
  helpers: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    helpedAt: { type: Date, default: Date.now },
    notes: { type: String }
  }]
}, { timestamps: true });

// Geospatial index for location queries
RequestSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Request', RequestSchema);