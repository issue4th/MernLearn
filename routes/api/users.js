const express = require('express');
const router = express.Router();
// JSON validation - see https://express-validator.github.io/docs/
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

// @route   POST api/users
// @desc    Register User
// @access  Public
router.post(
  '/',
  [
    // How do we get these nearer the model?
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Must be a valid email address').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // Constant for this?
      console.log();
    }

    const { name, email, password } = req.body;
    try {
      // Check pre-existing user
      // Get user Gravatar
      // Encrypt password
      // Return JSON WebToken [login]
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }

    res.send('User registered');
  }
);

module.exports = router;
