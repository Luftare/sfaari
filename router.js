const crypto = require('crypto');
const path = require('path');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const mime = require('mime');
const dataAccessObject = require('./dataAccessObject');

const { hasValidToken, hasRoles, ownUserId } = require('./middleware/verifyToken');
const { admin, login, users, songs } = require('./handlers');

const isTestEnvironment = process.env.NODE_ENV === 'test';

function generateRandomHash() {
  return crypto.randomBytes(8).toString('hex');
}

const storageDestination = isTestEnvironment ? './test-uploads' : './uploads';

const storage = multer.diskStorage({
  destination: storageDestination,
  filename(req, file, callback) {
    const hash = generateRandomHash();
    const fileExtension = path.extname(file.originalname);
    const fileName = `${hash}${fileExtension}`;
    const songName = req.body.songName;
    const songNameIsValid = songName && songName.length > 0 && songName.length < 100;
    const fileExtensionIsValid = fileExtension === '.mp3';
    const validEntry = songNameIsValid && fileExtensionIsValid;
    req.uploadedSongId = hash;

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
  .post(hasValidToken, upload.single('song'), songs.post);

router.route('/songs/:songId/file')
  .get(songs.getFile);

router.route('/login')
  .post(login.post);

router.route('/admin')
  .get(hasValidToken, hasRoles(['admin']), admin.get);

module.exports = router;
