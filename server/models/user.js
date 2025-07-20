// /server/models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  avatar: {
    type: String, // URL of profile picture
    default: ''
  },
  score: {
    type: Number,
    default: 0
  },
  rank: {
    type: Number,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
