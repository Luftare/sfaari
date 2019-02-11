const dataAccessObject = require('../dataAccessObject');

module.exports.getAll = (req, res) => {
  res.json({
    songs: []
  });
};

module.exports.post = (req, res) => {
  console.log('req:', req.file, req.body, req.uploadFileName);
  res.json({});
};
