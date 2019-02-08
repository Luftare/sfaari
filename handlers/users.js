const dataAccessObject = require('../dataAccessObject');
const parseTokenPayload = require('../utils/parseTokenPayload');

function isValidUsername(username) {
  return username && username.length > 1;
}

function isValidPassword(password) {
  return password && password.length > 4;
}

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
  const { userId } = req.params;

  try {
    const user = await dataAccessObject.getUserById(userId);
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

module.exports.putUsername = async (req, res) => {
  const { userId } = req.params;
  const { username } = req.body;

  if (!isValidUsername(username)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid username.',
    });
  }

  try {
    await dataAccessObject.updateUserUsername(userId, username);

    return res.json({
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
    });
  }
};

module.exports.putPassword = async (req, res) => {
  const { userId } = req.params;
  const { password } = req.body;

  if (!isValidPassword(password)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid password.',
    });
  }

  try {
    await dataAccessObject.updateUserPassword(userId, password);

    return res.json({
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err,
    });
  }
};
