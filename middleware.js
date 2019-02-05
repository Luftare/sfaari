const jwt = require('jsonwebtoken');

function extractToken(string) {
  if (string.startsWith('Bearer ')) {
    return string.slice(7, token.length);
  }
  return string;
}

function verifyToken(req, res, next) {
  const authHeader =
    req.headers['x-access-token'] || req.headers['authorization'];

  if (!authHeader) {
    return res.status(403).json({
      success: false,
      message: 'Auth token is not supplied',
    });
  }

  const token = extractToken(authHeader);

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Token is not valid',
      });
    } else {
      req.decoded = decoded;
      next();
    }
  });
}

module.exports = {
  verifyToken,
};
