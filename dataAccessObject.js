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

    const adminUserExists = await this.userWithUsernameExists(
      process.env.ADMIN_USERNAME
    );

    if (!adminUserExists) {
      await this.addUser(
        process.env.ADMIN_USERNAME,
        process.env.ADMIN_PASSWORD
      );
    }

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
        password TEXT NOT NULL,
        isAdmin INTEGER
      )`
    );
  },

  async checkUserCredentialValidity(username, password) {
    try {
      const user = await this.getUser(username);
      const userExists = user && user.username;
      if (!userExists) return false;

      const correctPasswordProvided = await bcrypt.compare(
        password,
        user.password
      );

      return correctPasswordProvided;
    } catch (err) {
      console.log(err);
      return false;
    }
  },

  async getUser(username) {
    const user = await this.db.get(`SELECT * FROM users WHERE username = (?)`, [
      username,
    ]);

    return user;
  },

  async getAllUsers() {
    try {
      const { db } = this;
      return await db.all('SELECT (username) FROM users WHERE isAdmin = 0');
    } catch (err) {
      throw err;
    }
  },

  async userWithUsernameExists(username) {
    const existingUser = await this.db.get(
      `SELECT * FROM users WHERE username = (?)
      `,
      [username]
    );

    return existingUser && existingUser.username;
  },

  async addUser(username, password) {
    try {
      const { db } = this;
      const userExists = await this.userWithUsernameExists(username);

      if (userExists) {
        throw new Error(`User with username of "${username}" already exists!`);
      }

      const hashedPassword = await bcrypt.hash(password, encryptionSaltRounds);
      const adminCredentialsProvided =
        username === process.env.ADMIN_USERNAME &&
        password === process.env.ADMIN_PASSWORD;
      const isAdmin = adminCredentialsProvided ? 1 : 0;
      return await db.run(
        'INSERT INTO users (username, password, isAdmin) VALUES (?, ?, ?)',
        [username, hashedPassword, isAdmin]
      );
    } catch (err) {
      console.log(err);
      return false;
    }
  },
};
