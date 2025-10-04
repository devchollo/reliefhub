const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'fulfilled'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Request', RequestSchema);
