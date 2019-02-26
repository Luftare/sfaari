const dataAccessObject = require('../dataAccessObject');
const generateToken = require('../generateToken');

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
    const { token, user } = await generateToken(username);

    return res.json({
      success: true,
      message: 'Authentication successful!',
      user: {
        username: user.username,
        id: user.id,
        roles: user.roles
      },
      token
    });
  } else {
    return res.status(403).json({
      success: false,
      error: 'Incorrect username or password'
    });
  }
};
