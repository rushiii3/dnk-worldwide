// models/State.js
const mongoose = require('mongoose');

const StateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'State name is required'],
    trim: true,
    minlength: [2, 'State name must be at least 2 characters'],
    maxlength: [100, 'State name must be less than 100 characters']
  },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
    required: true
  }
});

module.exports = mongoose.model('State', StateSchema);
