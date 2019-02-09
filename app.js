const isTestEnvironment = process.env.NODE_ENV === 'test';
const envFilePath = isTestEnvironment ? './.test-env' : './.env';

require('dotenv').config({ path: envFilePath });
const express = require('express');
const bodyParser = require('body-parser');

const { any, admin, ownUserId } = require('./middleware/verifyToken');
const handlers = require('./handlers');
const dataAccessObject = require('./dataAccessObject');
const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());
app.post('/login', handlers.login.post);
app.get('/admin', admin, handlers.admin.get);
app.get('/users', handlers.users.getAll);
app.post('/users', handlers.users.post);
app.get('/users/:userId', handlers.users.get);
app.put('/users/:userId/username', any, ownUserId, handlers.users.putUsername);
app.put('/users/:userId/password', any, ownUserId, handlers.users.putPassword);
app.use('/', express.static(__dirname + '/client/dist'));

async function init() {
  return await dataAccessObject.init();
}

module.exports = { app, init };
