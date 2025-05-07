// models/PostalCode.js
const mongoose = require('mongoose');

const PostalCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Postal code is required'],
    trim: true,
    minlength: [3, 'Postal code must be at least 3 characters'],
    maxlength: [10, 'Postal code must be at most 10 characters'],
    match: [/^[A-Za-z0-9\s\-]+$/, 'Postal code must contain only letters, numbers, spaces, or dashes'],
    index: true
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
    required: true
  }
});

module.exports = mongoose.model('PostalCode', PostalCodeSchema);
