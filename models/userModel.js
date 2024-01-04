// Import Mongoose
const mongoose = require('mongoose');

// Define User Schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  pwd: {
    type: String,
    required: true,
  },
  cpwd:{
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },
});

// Create User model
const User = mongoose.model('User', userSchema);

// Export the User model
module.exports = User;
