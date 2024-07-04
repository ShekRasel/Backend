const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware'); // Correct import
const User = require('../models/User');

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '10h' });
    res.redirect(`http://localhost:5173?token=${token}`);
  }
);

// Fetch user profile details after Google sign-in
router.get('/user/profile', requireAuth, async (req, res) => {
  try {
    // Log the user information from the token
    console.log('Authenticated user:', req.user);

    // Log statement to ensure the route is being hit
    console.log('Fetching user profile');

    // Get authenticated user's profile details
    const user = await User.findById(req.user.id).select('profilePhoto email googleId'); // Adjust fields as per your user schema

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    // Prepare the response data
    const responseData = {
      profilePhoto: user.profilePhoto,
      email: user.email,
      googleId:user.googleId,
    };

    // Log the response data
    console.log('User profile data:', responseData);

    // Respond with user profile details
    res.json(responseData);
  } catch (error) {
    // Log the error
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
