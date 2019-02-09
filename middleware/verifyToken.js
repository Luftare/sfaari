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
  async hasValidToken(req, res, next) {
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

  hasRoles(requiredRoles) {
    return async (req, res, next) => {
      const { tokenPayload } = req;
      const userRoles = tokenPayload.roles;
      const hasRoles = requiredRoles.every(role => userRoles.includes(role));

      if (hasRoles) {
        next();
      } else {
        return res.status(403).json({
          success: false,
          error: 'Invalid privileges'
        });
      }
    };
  }
};
