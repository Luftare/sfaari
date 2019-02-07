const fs = require('fs');
const sqlite = require('sqlite');
const bcrypt = require('bcrypt');
const { initTestDatabaseState } = require('./databaseTestUtils');

const isTestEnvironment = process.env.NODE_ENV === 'test';
const databasePath = isTestEnvironment ? ':memory:' : 'database.sqlite';

const encryptionSaltRounds = 10;

module.exports = {
  db: null,
  async init() {
    this.db = await sqlite.open(databasePath);
    await this.setupDatabaseTables();

    if (isTestEnvironment) {
      await initTestDatabaseState(this);
    }
  },

  async setupDatabaseTables() {
    return await this.db.run(
      `CREATE TABLE IF NOT EXISTS users
      (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      )`
    );
  },

  async getAllUsers() {
    try {
      const { db } = this;
      return await db.all('SELECT (username) FROM users');
    } catch (err) {
      throw err;
    }
  },

  async addUser(username, password) {
    try {
      const { db } = this;
      const hashedPassword = await bcrypt.hash(password, encryptionSaltRounds);
      return await db.run(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, hashedPassword]
      );
    } catch (err) {
      throw err;
    }
  },
};
