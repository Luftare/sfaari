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
    try {
      await this.setupDatabaseTables();
    } catch (err) {
      console.log(err);
    }

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
    await this.db.run(
      `CREATE TABLE IF NOT EXISTS User
      (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      )`
    );

    await this.db.run(
      `CREATE TABLE IF NOT EXISTS Role
      (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
      )`
    );

    await this.db.run(
      `CREATE TABLE IF NOT EXISTS UserRole
      (
        userId INTEGER,
        roleId INTEGER,
        FOREIGN KEY(userId) REFERENCES User(id),
        FOREIGN KEY(roleId) REFERENCES Role(id)
      )`
    );

    await this.db.run(`
      INSERT INTO Role (name)
      SELECT 'admin'
      WHERE NOT EXISTS(SELECT 1 FROM Role WHERE name = 'admin')
    `);
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

  async getRole(name) {
    const role = await this.db.get(`SELECT * FROM Role WHERE name = (?)`, [
      name,
    ]);

    return role;
  },

  async getUser(username) {
    const user = await this.db.get(`SELECT * FROM User WHERE username = (?)`, [
      username,
    ]);

    const userNotFound = !user;

    if (userNotFound) {
      return null;
    }

    const roleObjects = await this.db.all(
      `SELECT name FROM Role INNER JOIN UserRole ON Role.id = UserRole.roleId WHERE UserRole.userId = (?)`,
      [user.id]
    );

    const roles = roleObjects.map(({ name }) => name);

    return {
      ...user,
      roles,
    };
  },

  async getAllUsers() {
    try {
      const { db } = this;
      return await db.all('SELECT (username) FROM User');
    } catch (err) {
      throw err;
    }
  },

  async userWithUsernameExists(username) {
    const existingUser = await this.db.get(
      `SELECT * FROM User WHERE username = (?)
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

      await db.run('INSERT INTO User (username, password) VALUES (?, ?)', [
        username,
        hashedPassword,
      ]);

      const adminCredentialsProvided =
        username === process.env.ADMIN_USERNAME &&
        password === process.env.ADMIN_PASSWORD;

      if (adminCredentialsProvided) {
        const user = await this.getUser(username);
        const role = await this.getRole('admin');

        return await db.run(
          'INSERT INTO UserRole (userId, roleId) VALUES (?, ?)',
          [user.id, role.id]
        );
      } else {
        return;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  },
};