const express = require('express');
const router = express.Router();

const { hasValidToken, hasRoles, ownUserId } = require('./middleware/verifyToken');
const { admin, login, users } = require('./handlers');

router.route('/users')
  .get(users.getAll)
  .post(users.post);

router.route('/users/:userId')
  .get(users.get);

router.route('/users/:userId/username')
  .put(hasValidToken, ownUserId, users.putUsername);

router.route('/users/:userId/password')
  .put(hasValidToken, ownUserId, users.putPassword);

router.route('/login')
  .post(login.post);

router.route('/admin')
  .get(hasValidToken, hasRoles(['admin']), admin.get);

module.exports = router;
