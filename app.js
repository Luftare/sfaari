const isTestEnvironment = process.env.NODE_ENV === 'test';
const envFilePath = isTestEnvironment ? './.test-env' : './.env';

require('dotenv').config({ path: envFilePath });
const express = require('express');
const bodyParser = require('body-parser');

const { verifyToken } = require('./middleware');
const handlers = require('./handlers');
const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.post('/login', handlers.login.post);
app.get('/admin', verifyToken, handlers.admin.get);

module.exports = app;
