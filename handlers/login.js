const jwt = require('jsonwebtoken');
const dataAccessObject = require('../dataAccessObject');
const isTestEnvironment = process.env.NODE_ENV === 'test';

module.exports.post = async (req, res) => {
  const { username, password } = req.body;
  const requiredCredentialsProvided = username && password;

  if (!requiredCredentialsProvided) {
    return res.status(400).json({
      success: false,
      message: 'Authentication failed! Please check the request',
    });
  }

  const validCredentialsProvided = await dataAccessObject.checkUserCredentialValidity(
    username,
    password
  );

  if (validCredentialsProvided) {
    const user = await dataAccessObject.getUserByName(username);
    const isAdmin = user.roles.includes('admin');
    const roles = isAdmin ? ['admin'] : [];
    const id = user.id;
    const token = jwt.sign({ username, id, roles }, process.env.SECRET, {
      expiresIn: '1h',
    });

    return res.json({
      success: true,
      message: 'Authentication successful!',
      roles,
      token,
    });
  } else {
    return res.status(403).json({
      success: false,
      message: 'Incorrect username or password',
    });
  }
};
