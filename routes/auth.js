const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '10h' });
    res.redirect(`http://localhost:5173/?token=${token}`);
  }
);

module.exports = router;
