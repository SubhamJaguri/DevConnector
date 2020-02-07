const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
  //Get token from header

  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'No Token , Autharization denied' });
  }

  //Check if token is valid or not
  //Get secret key
  jwtSecret = config.get('jwtSecret');
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
