const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  fee: { type: Number, default: 0 },
  request: { type: mongoose.Schema.Types.ObjectId, ref: 'Request' }
}, { timestamps: true });

module.exports = mongoose.model('Donation', DonationSchema);
