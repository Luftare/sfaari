const jwt = require('jsonwebtoken');
const atob = require('atob');

function parseJwtPayload(token) {
  return JSON.parse(atob(token.split('.')[1]));
}

function extractTokenFromString(string) {
  if (string.startsWith('Bearer ')) {
    return string.slice(7, token.length);
  }
  return string;
}

function getTokenFromRequest(req) {
  const authHeader =
    req.headers['x-access-token'] || req.headers['authorization'];

  if (!authHeader) {
    return null;
  }

  return extractTokenFromString(authHeader);
}

module.exports = {
  async any(req, res, next) {
    const token = getTokenFromRequest(req);

    if (!token) {
      return res.status(403).json({
        success: false,
        message: 'Auth token is not supplied',
      });
    }

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
  },

  async admin(req, res, next) {
    const token = getTokenFromRequest(req);

    if (!token) {
      return res.status(403).json({
        success: false,
        message: 'Auth token is not supplied',
      });
    }

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: 'Token is not valid',
        });
      }

      const tokenPayload = parseJwtPayload(token);
      const isAdmin = tokenPayload && tokenPayload.isAdmin;

      if (!isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Invalid privileges',
        });
      }
      req.decoded = decoded;
      next();
    });
  },
};
