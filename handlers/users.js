const dataAccessObject = require('../dataAccessObject');
const generateToken = require('../generateToken');

function isValidUsername(username) {
  return !!(username && username.length > 1 && username.length < 35);
}

function isValidPassword(password) {
  return !!(password && password.length > 4 && password.length < 125);
}

module.exports.getAll = async (req, res) => {
  try {
    const users = await dataAccessObject.getAllUsers();

    return res.json({
      success: true,
      users: users.map(user => ({
        username: user.username,
        id: user.id
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error
    });
  }
};

module.exports.get = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await dataAccessObject.getUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found.'
      });
    }

    return res.json({
      success: true,
      user: {
        username: user.username,
        id: user.id,
        roles: user.roles
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error
    });
  }
};

module.exports.putUsername = async (req, res) => {
  const { userId } = req.params;
  const { username } = req.body;

  if (!isValidUsername(username)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid username.'
    });
  }

  try {
    const user = await dataAccessObject.updateUserUsername(userId, username);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found.'
      });
    }

    return res.json({
      success: true,
      user: {
        username: user.username,
        id: user.id,
        roles: user.roles
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error
    });
  }
};

module.exports.putPassword = async (req, res) => {
  const { userId } = req.params;
  const { password } = req.body;

  if (!isValidPassword(password)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid password.'
    });
  }

  try {
    const user = await dataAccessObject.updateUserPassword(userId, password);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found.'
      });
    }

    return res.json({
      success: true,
      user: {
        username: user.username,
        id: user.id,
        roles: user.roles
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error
    });
  }
};

module.exports.post = async (req, res) => {
  const { username, password } = req.body;

  try {
    await dataAccessObject.addUser(username, password);
    const user = await dataAccessObject.getUserByUsername(username);
    const { token } = await generateToken(username);

    res.json({
      success: true,
      token,
      user: {
        username: user.username,
        id: user.id,
        roles: user.roles
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error
    });
  }
};

module.exports.delete = async (req, res) => {
  const { userId } = req.params;
  const requesterUserId = req.tokenPayload.id;
  const deletingOwnAccount = userId === requesterUserId;
  const isAdmin = req.tokenPayload.roles.includes('admin');

  if (!deletingOwnAccount && !isAdmin) {
    return res.status(403).json({
      success: false
    });
  }

  try {
    const success = await dataAccessObject.removeUserById(userId);

    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'User not found.'
      });
    }

    return res.json({
      success: true
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error
    });
  }
};

module.exports.isValidUsername = isValidUsername;
module.exports.isValidPassword = isValidPassword;
