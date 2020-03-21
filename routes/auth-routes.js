const express = require('express');
const authRoutes = express.Router();

const passport = require('passport');
const bcrypt = require('bcryptjs');

// require the user modell !!!
const User = require('../models/user-model');

authRoutes.post('/signup', (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: 'Provide username and password' });
    return;
  }

  if (password.length < 7) {
    res.status(400).json({ message: 'Please make your password at least 8 characters long for security purposes.' });
    return;
  }

  User.findOne({ username })
    .then(foundUser => {
      if (foundUser) {
        res.status(400).json({ message: 'Username taken. Choose another one.' });
        return;
      }

      const salt = bcrypt.genSaltSync(10);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({
        username,
        password: hashPass
      })
      .then(newUser => {
        // Automatically log in user after sign up
        req.login(newUser, err => {
          if (err) {
            res.status(500).json({ message: 'Login after signup went bad.' });
            return;
          }
          // Send the user's information to the frontend
          res.status(200).json(newUser);
        });
      })
      .catch(() => res.status(400).json({ message: 'Saving user to database went wrong' }));

    })
    .catch(() => res.status(500).json({ message: "Username check went bad." }));
});

authRoutes.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, theUser, failureDetails) => {
    if (err) {
      res.status(500).json({ message: 'Something went wrong authenticating user' });
      return;
    }

    if (!theUser) {
      // "failureDetails" contains the error messages
      // from our logic in "LocalStrategy".
      res.status(401).json(failureDetails);
      return;
    }

    // save user in session
    req.login(theUser, err => {
      if (err) {
        res.status(500).json({ message: 'Session save went bad.' });
        return;
      }

      // Send the user's information to the frontend
      res.status(200).json(theUser);
    });

  })(req, res, next);
});

module.exports = authRoutes;