const path = require('path');
const dataAccessObject = require('../dataAccessObject');
const isTestEnvironment = process.env.NODE_ENV === 'test';

module.exports.getFile = async (req, res) => {
  const { songId } = req.params;
  const uploadsDirectory = isTestEnvironment ? '../test-uploads' : '../uploads';
  const song = await dataAccessObject.getSongById(songId);

  if (!song) {
    return res.status(404).json({
      success: false,
      error: 'Song not found.'
    });
  }

  const songFileName = song.fileName;
  const filePath = path.join(__dirname, uploadsDirectory, songFileName);
  res.sendFile(filePath);
};

module.exports.get = async (req, res) => {
  const { songId } = req.params;
  const uploadsDirectory = isTestEnvironment ? '../test-uploads' : '../uploads';
  const song = await dataAccessObject.getSongById(songId);

  if (!song) {
    return res.status(404).json({
      success: false,
      error: 'Song not found.'
    });
  }

  res.json({ song });
};

module.exports.getAll = async (req, res) => {
  const songs = await dataAccessObject.getAllSongs();

  res.json({
    success: true,
    songs
  });
};

module.exports.post = async (req, res) => {
  const userId = req.tokenPayload.id;
  const fileName = req.file.filename;
  const songName = req.body.songName;
  const songId = req.uploadedSongId;

  if (!songName) {
    res.status(400).json({
      success: false,
      error: 'Invalid request.'
    });
  }

  const song = await dataAccessObject.addSongToUser(songName, fileName, songId, userId);

  res.json({
    success: true,
    song
  });
};
