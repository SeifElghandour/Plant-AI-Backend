const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  imageUrl: {
    type: String,
    required: true,
  },
  result: {
    type: String,
    required: true,
  },
  confidence: {
    type: Number,
    required: true,
  },
  
  treatment: {
    type: String,
  
  },
  symptoms: {
    type: String,
  }

}, {
  timestamps: true,
});

module.exports = mongoose.model('Scan', scanSchema);