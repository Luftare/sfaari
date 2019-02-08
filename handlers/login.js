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
    const user = await dataAccessObject.getUser(username);
    const isAdmin = user.isAdmin === 1;

    const token = jwt.sign({ username, isAdmin }, process.env.SECRET, {
      expiresIn: '1h',
    });

    return res.json({
      success: true,
      message: 'Authentication successful!',
      isAdmin,
      token,
    });
  } else {
    return res.status(403).json({
      success: false,
      message: 'Incorrect username or password',
    });
  }
};
