const jwt = require('jsonwebtoken');

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
        error: 'Auth token is not supplied'
      });
    }

    jwt.verify(token, process.env.SECRET, (err, tokenPayload) => {
      if (err) {
        return res.status(403).json({
          success: false,
          error: 'Token is not valid'
        });
      } else {
        req.tokenPayload = tokenPayload;
        next();
      }
    });
  },

  ownUserId(req, res, next) {
    const userId = parseInt(req.params.userId);
    if (userId !== req.tokenPayload.id) {
      return res.status(403).json({
        success: false,
        error: 'No privileges.'
      });
    }

    next();
  },

  async admin(req, res, next) {
    const token = getTokenFromRequest(req);

    if (!token) {
      return res.status(403).json({
        success: false,
        error: 'Auth token is not supplied'
      });
    }

    jwt.verify(token, process.env.SECRET, (err, tokenPayload) => {
      if (err) {
        return res.status(403).json({
          success: false,
          error: 'Token is not valid'
        });
      }

      const isAdmin =
        tokenPayload.roles && tokenPayload.roles.includes('admin');

      if (!isAdmin) {
        return res.status(403).json({
          success: false,
          error: 'Invalid privileges'
        });
      }

      req.tokenPayload = tokenPayload;
      next();
    });
  }
};
