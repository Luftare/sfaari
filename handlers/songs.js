const fs = require('fs');
const path = require('path');
const dataAccessObject = require('../dataAccessObject');
const isTestEnvironment = process.env.NODE_ENV === 'test';
const uploadsDirectory = isTestEnvironment ? '../test-uploads' : '../uploads';

module.exports.getFile = async (req, res) => {
  const { songId } = req.params;
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

module.exports.delete = async (req, res) => {
  const songId = req.params.songId;

  try {
    const song = await dataAccessObject.getSongById(songId);
    const userId = req.tokenPayload.id;
    const isAuthorOwnedSong = userId === song.userId;

    if (!isAuthorOwnedSong) {
      return res.status(403).json({
        success: false
      });
    }

    if (!song) {
      return res.status(404).json({
        success: false
      });
    }

    const filePath = path.join(__dirname, uploadsDirectory, song.fileName);

    fs.unlink(filePath, async err => {
      if (err) throw err;

      await dataAccessObject.removeSongById(songId);

      res.json({
        success: true
      });
    });
  } catch (error) {
    res.status(500).json({
      success: true
    });
  }
};
