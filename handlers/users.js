const dataAccessObject = require('../dataAccessObject');

module.exports.getAll = async (req, res) => {
  try {
    const users = await dataAccessObject.getAllUsers();

    return res.json({
      success: true,
      users,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
    });
  }
};

module.exports.get = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await dataAccessObject.getUserById(id);
    return res.json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
    });
  }
};
