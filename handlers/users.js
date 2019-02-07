const dataAccessObject = require('../dataAccessObject');

module.exports.get = async (req, res) => {
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
