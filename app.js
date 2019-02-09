const isTestEnvironment = process.env.NODE_ENV === 'test';
const envFilePath = isTestEnvironment ? './.test-env' : './.env';

require('dotenv').config({ path: envFilePath });
const express = require('express');
const bodyParser = require('body-parser');

const {
  hasValidToken,
  hasRoles,
  ownUserId
} = require('./middleware/verifyToken');
const { admin, login, users } = require('./handlers');
const dataAccessObject = require('./dataAccessObject');
const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());
app.post('/login', login.post);
app.get('/admin', hasValidToken, hasRoles(['admin']), admin.get);
app.get('/users', users.getAll);
app.post('/users', users.post);
app.get('/users/:userId', users.get);
app.put('/users/:userId/username', hasValidToken, ownUserId, users.putUsername);
app.put('/users/:userId/password', hasValidToken, ownUserId, users.putPassword);
app.use('/', express.static(__dirname + '/client/dist'));

async function init() {
  return await dataAccessObject.init();
}

module.exports = { app, init };
