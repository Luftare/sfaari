const fs = require('fs');

module.exports.initTestDatabaseState = async databaseAccessObject => {
  try {
    await databaseAccessObject.addUser('someone', 'passworz');
    await databaseAccessObject.addUser('someone_else', 'secretysecret');
    return await databaseAccessObject.addUser('mocker', 'a_p4ssw0rd');
  } catch (err) {
    throw err;
  }
};
