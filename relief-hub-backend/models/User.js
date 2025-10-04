const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  userType: { 
    type: String, 
    enum: ['individual', 'organization', 'company', 'government'],
    default: 'individual'
  },
  isAdmin: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  isEmailVerified: { type: Boolean, default: false },
  isPhoneVerified: { type: Boolean, default: false },
  totalDonations: { type: Number, default: 0 },
  totalDonationAmount: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
  badges: [{
    name: { type: String },
    earnedAt: { type: Date },
    type: { type: String }
  }]
}, { timestamps: true });


module.exports = mongoose.model('User', UserSchema); 