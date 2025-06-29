const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel'); // ✅ lowercase, matching your file

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/users/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      const newUser = {
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        image: profile.photos[0].value,
      };

      try {
        // 1. Check if user with this Google ID exists
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        } else {
          // 2. If no googleId match, check if someone signed up with the same email
          user = await User.findOne({ email: newUser.email });

          if (user) {
            // optional: update user.googleId = profile.id if you want to link accounts
            return done(null, user);
          } else {
            // 3. Create new user
            user = await User.create(newUser);
            return done(null, user);
          }
        }
      } catch (err) {
        console.error(err);
        return done(err, null);
      }
    }
  )
);
