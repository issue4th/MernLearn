const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
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
      return errorResponse(res, 400, errors.array());
    }

    // Process request
    const { name, email, password } = req.body;
    try {
      let existingUser = await User.findOne({ email });
      if (existingUser) {
        return errorResponse(res, 400, [{ msg: 'User already exists' }]);
      }

      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash(password, salt);

      const avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' });
      let user = new User({
        name,
        email,
        avatar,
        password: passwordHash,
      });

      await user.save();

      const jwtPayload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        jwtPayload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (error, token) => {
          if (error) throw error;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      return serverErrorResponse(res);
    }
  }
);

function successResponse(res, message) {
  return res.status(200).send(message);
}

function errorResponse(res, httpStatus, errorList) {
  res.status(httpStatus).json({ errors: errorList });
}

function serverErrorResponse(res) {
  return errorResponse(res, 500, [{ msg: 'Server error' }]);
}

module.exports = router;
