const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const cookieSession= require('cookie-session')

const keys = require('./config/keys');

const app = express();

mongoose.connect(keys.mongoID, { useMongoClient: true });
require('./models/User');
require('./services/passport');

app.use(cookieSession({
  name: 'session',
  keys: [keys.secret],
  maxAge: 24 * 60 * 60 * 1000
}))
app.use(passport.initialize());
app.use(passport.session());

app.get(
  '/auth/google',
  passport.authenticate('google', {scope: ['profile', 'email']})
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google')
);

app.get('/', (req, res) => {
  console.log(req.user);
})

const PORT = process.env.PORT || 3000;
app.listen(PORT);
