const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String },
  profilePhoto: { type: String }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
