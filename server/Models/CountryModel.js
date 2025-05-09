// models/Country.js
const mongoose = require('mongoose');

const CountrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Country name is required'],
    unique: true,
    trim: true,
    minlength: [2, 'Country name must be at least 2 characters'],
    maxlength: [100, 'Country name must be less than 100 characters']
  }
});

module.exports = mongoose.model('Country', CountrySchema);
