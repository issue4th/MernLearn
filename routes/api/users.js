const express = require('express');
const router = express.Router();
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
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // Constant for this?
      console.log();
    }
    res.send('User test route');
  }
);

module.exports = router;
