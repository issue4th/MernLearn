const express = require('express');
const router = express.Router();
const config = require('config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');
const User = require('../../models/User');

// @route   GET api/auth
// @desc    Test route
// @access  Public
router.get('/', auth, async (req, res) => {
  try {
    const existingUser = await User.findById(req.user.id).select('-password');

    res.json(existingUser);
  } catch (error) {
    console.error(err.message);
    return serverErrorResponse(res);
  }
});

// @route   POST api/auth
// @desc    Authenticate user and get auth token
// @access  Public
router.post(
  '/',
  [
    // How do we get these nearer the model?
    check('email', 'Must be a valid email address').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, errors.array());
    }

    // Process request
    const { email, password } = req.body;
    try {
      let existingUser = await User.findOne({ email });
      if (!existingUser) {
        return errorResponse(res, 400, [{ msg: 'Invalid credentials' }]);
      }

      const encryptedPassword = existingUser.password;
      const isMatch = await bcrypt.compare(password, encryptedPassword);
      if (!isMatch) {
        return errorResponse(res, 400, [{ msg: 'Invalid credentials' }]);
      }

      const jwtPayload = {
        user: {
          id: existingUser.id,
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
