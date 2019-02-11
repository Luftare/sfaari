const crypto = require('crypto');
const path = require('path');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const mime = require('mime');

const { hasValidToken, hasRoles, ownUserId } = require('./middleware/verifyToken');
const { admin, login, users, songs } = require('./handlers');

function generateRandomHash() {
  return crypto.randomBytes(8).toString('hex');
}

const storage = multer.diskStorage({
  destination: './uploads',
  filename(req, file, callback) {
    const hash = generateRandomHash();
    const fileExtension = path.extname(file.originalname);
    const fileName = `${hash}${fileExtension}`;
    req.uploadFileName = fileName;
    callback(null, fileName);
  }
});

const upload = multer({ storage });

router.route('/users')
  .get(users.getAll)
  .post(users.post);

router.route('/users/:userId')
  .get(users.get);

router.route('/users/:userId/username')
  .put(hasValidToken, ownUserId, users.putUsername);

router.route('/users/:userId/password')
  .put(hasValidToken, ownUserId, users.putPassword);

router.route('/songs')
  .get(songs.getAll)
  .post(upload.single('song'), songs.post);

router.route('/login')
  .post(login.post);

router.route('/admin')
  .get(hasValidToken, hasRoles(['admin']), admin.get);

module.exports = router;
