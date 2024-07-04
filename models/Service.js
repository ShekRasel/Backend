// backend/models/Service.js
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Add bookedBy field
  paid: { type: Boolean, default: false }
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
