const express = require('express');
const router = express.Router();

const { hasValidToken, hasRoles, ownUserId } = require('./middleware/verifyToken');
const { admin, login, users } = require('./handlers');

router.post('/login', login.post);
router.get('/admin', hasValidToken, hasRoles(['admin']), admin.get);
router.get('/users', users.getAll);
router.post('/users', users.post);
router.get('/users/:userId', users.get);
router.put('/users/:userId/username', hasValidToken, ownUserId, users.putUsername);
router.put('/users/:userId/password', hasValidToken, ownUserId, users.putPassword);

module.exports = router;
