const jwt = require('jsonwebtoken');
const dataAccessObject = require('./dataAccessObject');

module.exports = async username => {
  const user = await dataAccessObject.getUserByUsername(username);
  const roles = user.roles;
  const id = user.id;
  const tokenPayload = { username, id, roles };
  const token = jwt.sign(tokenPayload, process.env.SECRET, {
    expiresIn: '1h'
  });

  return {
    token,
    user
  };
};
