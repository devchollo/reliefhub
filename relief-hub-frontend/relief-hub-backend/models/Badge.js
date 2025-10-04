const mongoose = require('mongoose');

const BadgeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  pointsRequired: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Badge', BadgeSchema);
