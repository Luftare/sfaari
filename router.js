const crypto = require('crypto');
const path = require('path');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const mime = require('mime');
const dataAccessObject = require('./dataAccessObject');

const { hasValidToken, hasRoles, ownUserId } = require('./middleware/verifyToken');
const { login, users, songs } = require('./handlers');

const isTestEnvironment = process.env.NODE_ENV === 'test';

function generateRandomHash() {
  return crypto.randomBytes(8).toString('hex');
}

const storageDestination = isTestEnvironment ? './test-uploads' : './uploads';

const storage = multer.diskStorage({
  destination: storageDestination,
  filename(req, file, next) {
    const hash = generateRandomHash();
    const fileExtension = path.extname(file.originalname);
    const fileName = `${hash}${fileExtension}`;
    const songName = req.body.songName;
    const songNameIsValid = songName && songName.length > 0 && songName.length < 100;
    const fileExtensionIsValid = fileExtension === '.mp3';
    const validEntry = songNameIsValid && fileExtensionIsValid;
    req.uploadedSongId = hash;

    next(null, fileName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * (10 ** 6),
    fieldNameSize: 12,
    fields: 1,
    headerPairs: 1
  }
});

const uploadErrorHandler = (error, req, res, next) => {
  if(error instanceof multer.MulterError) {
    res.status(400).json({
      success: false,
      error: 'File not supported.'
    })
  } else {
    next();
  }
};

router.route('/users')
  .get(users.getAll)
  .post(users.post);

router.route('/users/:userId')
  .get(users.get);

router.route('/users/:userId')
  .delete(hasValidToken, ownUserId, users.delete);

router.route('/users/:userId/username')
  .put(hasValidToken, ownUserId, users.putUsername);

router.route('/users/:userId/password')
  .put(hasValidToken, ownUserId, users.putPassword);

router.route('/songs')
  .get(songs.getAll)
  .post(hasValidToken, upload.single('song'), uploadErrorHandler, songs.post);

router.route('/songs/:songId')
  .get(songs.get);

router.route('/songs/:songId/file')
  .get(songs.getFile);

router.route('/login')
  .post(login.post);

module.exports = router;
