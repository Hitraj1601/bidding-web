import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import User from '../models/User.js';

const configurePassport = () => {
  // Check if Google OAuth is configured
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET ||
      process.env.GOOGLE_CLIENT_ID.includes('your_google_client_id') ||
      process.env.GOOGLE_CLIENT_SECRET.includes('your_google_client_secret')) {
    console.warn('⚠️  Google OAuth not configured: Please set valid GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env file');
    return;
  }

  // Serialize user for session
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // Google OAuth Strategy
  passport.use(new GoogleStrategy.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists with Google ID
      let user = await User.findOne({ googleId: profile.id });

      if (user) {
        // User exists, return user
        return done(null, user);
      }

      // Check if user exists with same email
      user = await User.findOne({ email: profile.emails[0].value });

      if (user) {
        // Link Google account to existing user
        user.googleId = profile.id;
        user.profilePicture = profile.photos[0]?.value;
        await user.save();
        return done(null, user);
      }

      // Create new user
      user = new User({
        googleId: profile.id,
        username: profile.emails[0].value.split('@')[0] + '_' + Date.now(),
        email: profile.emails[0].value,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        profilePicture: profile.photos[0]?.value,
        isEmailVerified: true, // Google emails are verified
        authProvider: 'google'
      });

      await user.save();
      done(null, user);

    } catch (error) {
      console.error('Google OAuth Error:', error);
      done(error, null);
    }
  }));
};

export default configurePassport;