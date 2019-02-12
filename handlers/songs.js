const dataAccessObject = require('../dataAccessObject');

module.exports.getAll = async (req, res) => {
  const songs = await dataAccessObject.getAllSongs();
  res.json({
    songs
  });
};

module.exports.post = async (req, res) => {
  const userId = req.tokenPayload.id;
  const fileName = req.file.filename;
  const songName = req.body.songName;

  const song = await dataAccessObject.addSongToUser(songName, fileName, userId);

  res.json({
    success: true,
    song
  });
};
