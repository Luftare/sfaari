const isTestEnvironment = process.env.NODE_ENV === 'test';
const envFilePath = isTestEnvironment ? './.test-env' : './.env';

require('dotenv').config({ path: envFilePath });
const bodyParser = require('body-parser');
const express = require('express');
const multer = require('multer');
const app = express();
const router = require('./router');
const dataAccessObject = require('./dataAccessObject');
const { initTestDatabaseState } = require('./databaseTestUtils');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', express.static(__dirname + '/client/dist'));
app.use('/api', router);

async function init() {
  await dataAccessObject.init();

  const adminRole = await dataAccessObject.getRoleByName('admin');

  if (!adminRole) {
    await dataAccessObject.createRoleWithName('admin');
  }
  const adminUsers = await dataAccessObject.getUsersWithRoleName('admin');
  const adminUserExists = adminUsers.length > 0;

  if (!adminUserExists) {
    const adminUser = await dataAccessObject.addUser(process.env.ADMIN_INIT_USERNAME, process.env.ADMIN_INIT_PASSWORD);
    await dataAccessObject.addRoleToUser('admin', adminUser.id);
  }

  // if (isTestEnvironment) {
  //   await initTestDatabaseState(dataAccessObject);
  // }
}

module.exports = { app, init };
