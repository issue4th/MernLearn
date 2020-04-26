const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth');
const User = require('../../models/User');

// @route   GET api/auth
// @desc    Test route
// @access  Public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(err.message);
    return serverErrorResponse(res);
  }
});

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
