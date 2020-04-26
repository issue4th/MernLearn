const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');

// JSON validation - see https://express-validator.github.io/docs/
const { check, validationResult } = require('express-validator');
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
    }

    const { name, email, password } = req.body;
    try {
      console.log('Check pre-existing user');
      let existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      console.log('Get user Gravatar');
      const avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' });

      console.log('Encrypt password');
      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash(password, salt);

      console.log('Save user');
      let user = new User({
        name,
        email,
        avatar,
        password: passwordHash,
      });

      await user.save();

      return res.status(200).send('User registered');
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server error');
    }
  }
);

module.exports = router;
