const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('User');

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  User.findById(id)
  .then(user => done(null, user))
  .catch(err => done(err, false));
})

passport.use(new GoogleStrategy({
    clientID: keys.googleID,
    clientSecret: keys.googleSecret,
    callbackURL: '/auth/google/callback'
  },
  (accessToken, refreshToken, profile, done) => {
    User.findOne({'googleId': profile.id})
      .then((existingUser) => {
        if(existingUser) return done(null, existingUser);

        const user = new User({"googleId" : profile.id});
        user.save().then((newUser) => {
          return done(null, newUser)
        })

      })
      .catch(err => done(err, false));
  }
));
