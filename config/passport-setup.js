const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel');

passport.use(new GoogleStrategy({
    // Options for the Google strategy
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/users/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    // This function is called after the user successfully logs in with Google.
    
    // 1. Get user info from Google profile
    const newUser = {
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
    };

    try {
      // 2. Check if a user already exists with this Google ID
      let user = await User.findOne({ googleId: profile.id });

      if (user) {
        // If they exist, we're done. Pass them to the next step.
        return done(null, user);
      } else {
        // 3. If no user with that Google ID, check if an account exists with that email
        user = await User.findOne({ email: newUser.email });

        if (user) {
          // If a user with that email exists (e.g., they signed up with email/password first),
          // simply pass that existing user along. You could also link the accounts by
          // adding the googleId to this user document if you wanted.
          return done(null, user);
        } else {
          // 4. If no user exists at all, create a new one in the database.
          user = await User.create(newUser);
          return done(null, user);
        }
      }
    } catch (err) {
      console.error(err);
      return done(err, null);
    }
  }
));
