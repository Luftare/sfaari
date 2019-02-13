const path = require('path');

const dataAccessObject = require('../dataAccessObject');

const isTestEnvironment = process.env.NODE_ENV === 'test';

module.exports.getFile = async (req, res) => {
  const { songId } = req.params;
  const uploadsDirectory = isTestEnvironment ? '../test-uploads' : '../uploads';
  const song = await dataAccessObject.getSongById(songId);
  const songFileName = song.fileName;
  const filePath = path.join(__dirname, uploadsDirectory, songFileName);
  res.sendFile(filePath);
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
  const song = await dataAccessObject.addSongToUser(songName, fileName, songId, userId);

  res.json({
    success: true,
    song
  });
};
