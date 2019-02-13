const isTestEnvironment = process.env.NODE_ENV === 'test';
const envFilePath = isTestEnvironment ? './.test-env' : './.env';

require('dotenv').config({ path: envFilePath });
const bodyParser = require('body-parser');
const express = require('express');
const multer = require('multer');
const app = express();
const router = require('./router');
const dataAccessObject = require('./dataAccessObject');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', express.static(__dirname + '/client/dist'));
app.use('/api', router);

async function init() {
  return await dataAccessObject.init();
}

module.exports = { app, init };
