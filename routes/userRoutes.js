const express = require('express');
const router = express.Router();
const passport = require('passport');
const { registerUser, loginUser } = require('../controllers/userController');
const generateToken = require('../utils/generateToken');

// --- Standard Email/Password Routes ---
router.post('/register', registerUser);
router.post('/login', loginUser);

// --- Google OAuth Routes ---

// Route to initiate Google authentication
// The frontend will link to this URL
// CORRECTED: "scthope" is now "scope"
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Route that Google redirects to after successful login
// Passport middleware handles the user lookup/creation
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/' }),
  (req, res) => {
    // If authentication is successful, req.user is populated by Passport.
    // We generate our own JWT and send it back to a frontend page to be handled.
    const token = generateToken(req.user._id);
    const user = req.user;
    // Redirect to the correct frontend port with user data
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`);
  }
);

module.exports = router;