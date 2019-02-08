const isTestEnvironment = process.env.NODE_ENV === 'test';
const envFilePath = isTestEnvironment ? './.test-env' : './.env';

require('dotenv').config({ path: envFilePath });
const express = require('express');
const bodyParser = require('body-parser');

const verifyToken = require('./middleware/verifyToken');
const handlers = require('./handlers');
const dataAccessObject = require('./dataAccessObject');
const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.post('/login', handlers.login.post);
app.get('/admin', verifyToken.admin, handlers.admin.get);
app.get('/users', verifyToken.any, handlers.users.getAll);
app.get('/users/:id', verifyToken.any, handlers.users.get);
app.use('/', express.static(__dirname + '/client/dist'));

async function init() {
  return await dataAccessObject.init();
}

module.exports = { app, init };
