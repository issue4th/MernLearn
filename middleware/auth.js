const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  try {
    const jwtSecret = config.get('jwtSecret');
    const decodedToken = jwt.verify(token, jwtSecret);
    req.user = decodedToken.user;
    next(); // Next middleware step
  } catch (error) {
    errorMessage = `Token is not valid: ${error}`;
    res.status(401).json({ msg: errorMessage });
  }
};
