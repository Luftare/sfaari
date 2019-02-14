const jwt = require('jsonwebtoken');
const dataAccessObject = require('../dataAccessObject');
const isTestEnvironment = process.env.NODE_ENV === 'test';

module.exports.post = async (req, res) => {
  const { username, password } = req.body;
  const requiredCredentialsProvided = username && password;

  if (!requiredCredentialsProvided) {
    return res.status(400).json({
      success: false,
      error: 'Authentication failed! Please check the request'
    });
  }

  const validCredentialsProvided = await dataAccessObject.checkUserCredentialValidity(username, password);

  if (validCredentialsProvided) {
    const user = await dataAccessObject.getUserByUsername(username);
    const roles = user.roles;
    const id = user.id;
    const tokenPayload = { username, id, roles };
    const token = jwt.sign(tokenPayload, process.env.SECRET, {
      expiresIn: '1h'
    });

    return res.json({
      success: true,
      message: 'Authentication successful!',
      roles,
      token
    });
  } else {
    return res.status(403).json({
      success: false,
      error: 'Incorrect username or password'
    });
  }
};
