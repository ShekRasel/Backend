const bcrypt = require('bcryptjs');
const User = require('../models/User');
const path = require('path');
const jwt = require("jsonwebtoken");


// Signup function
exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const profilePhoto = req.file; // Get the profile photo file from multer

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      profilePhoto: profilePhoto ? profilePhoto.path : null,
      role:'user'
    });

    await user.save();
    // console.log('User first name:', user.firstName);
    // Generate token
    const token = jwt.sign({
      email: user.email,
      id: user._id
    }, process.env.JWT_SECRET, { expiresIn: '10h' });
    
    // Respond with user creation success and profile photo URL
    res.status(201).json({
      message: 'User created successfully',
      token,
      profilePhoto: user.profilePhoto
      // firstName: user.firstName,
      // lastName: user.lastName
    });
   
  } catch (error) {
    console.error('Signup error:', error); // Log the detailed error
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Signin function
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    // If user not found or password does not match, respond with error
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign({
      email: user.email,
      id: user._id
    }, process.env.JWT_SECRET, { expiresIn: '10h' });

    // If authentication successful, respond with success message
    res.status(200).json({
      message: 'Signin successful',
      token,
      profilePhoto: user.profilePhoto, 
      email: user.email,
      // userFirstName: user.firstName,
      // userLastName: user.lastName,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
