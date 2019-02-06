const jwt = require('jsonwebtoken');
const isTestEnvironment = process.env.NODE_ENV === 'test';

function isValidCredentials(username, password) {
  return username === process.env.USERNAME && password === process.env.PASSWORD;
}

module.exports.post = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Authentication failed! Please check the request',
    });
  }

  if (isValidCredentials(username, password)) {
    const token = jwt.sign({ username }, process.env.SECRET, {
      expiresIn: '1h',
    });

    return res.json({
      success: true,
      message: 'Authentication successful!',
      token,
    });
  } else {
    return res.status(403).json({
      success: false,
      message: 'Incorrect username or password',
    });
  }
};
