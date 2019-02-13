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
      return;
    }

    const adminUserExists = await this.userWithUsernameExists(process.env.ADMIN_INIT_USERNAME);

    if (!adminUserExists) {
      await this.addUser(process.env.ADMIN_INIT_USERNAME, process.env.ADMIN_INIT_PASSWORD);
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
      `CREATE TABLE IF NOT EXISTS Song
      (
        id TEXT PRIMARY KEY NOT NULL UNIQUE,
        name TEXT NOT NULL,
        fileName TEXT NOT NULL UNIQUE,
        userId INTEGER NOT NULL,
        FOREIGN KEY (userId) REFERENCES User(id)
      )`
    );

    await this.db.run(
      `CREATE TABLE IF NOT EXISTS UserRole
      (
        userId INTEGER,
        roleId INTEGER,
        FOREIGN KEY (userId) REFERENCES User (id) ON DELETE CASCADE,
        FOREIGN KEY (roleId) REFERENCES Role (id) ON DELETE CASCADE
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
      const user = await this.getUserByName(username);
      const userExists = user && user.username;
      if (!userExists) return false;

      const correctPasswordProvided = await bcrypt.compare(password, user.password);

      return correctPasswordProvided;
    } catch (err) {
      console.log(err);
      return false;
    }
  },

  async getRoleByName(name) {
    const role = await this.db.get(`SELECT * FROM Role WHERE name = (?)`, [name]);

    return role;
  },

  async getUserRolesById(id) {
    const rolesObject = await this.db.all(
      `SELECT name FROM Role INNER JOIN UserRole ON Role.id = UserRole.roleId WHERE UserRole.userId = (?)`,
      [id]
    );

    return rolesObject.map(({ name }) => name);
  },

  async getEnrichedUser(user) {
    if (!user) {
      return new Error('User not found.');
    }
    const roles = await this.getUserRolesById(user.id);

    return {
      ...user,
      roles
    };
  },

  async getUserById(id) {
    const user = await this.db.get(`SELECT * FROM User WHERE id = (?)`, [id]);
    return await this.getEnrichedUser(user);
  },

  async getUserByName(username) {
    const user = await this.db.get(`SELECT * FROM User WHERE username = (?)`, [username]);
    return await this.getEnrichedUser(user);
  },

  async updateUserUsername(id, username) {
    const user = await this.getUserById(id);

    if (!user) {
      return new Error('User not found.');
    }

    return await this.db.run('UPDATE User SET username = (?) WHERE id = (?)', [username, id]);
  },

  async updateUserPassword(id, password) {
    const user = await this.getUserById(id);

    if (!user) {
      return new Error('User not found.');
    }

    const hashedPassword = await bcrypt.hash(password, encryptionSaltRounds);
    return await this.db.run('UPDATE User SET password = (?) WHERE id = (?)', [hashedPassword, id]);
  },

  async getAllUsers() {
    try {
      const { db } = this;
      return await db.all('SELECT * FROM User');
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
        return new Error(`User with username of "${username}" already exists!`);
      }

      const hashedPassword = await bcrypt.hash(password, encryptionSaltRounds);

      await db.run('INSERT INTO User (username, password) VALUES (?, ?)', [username, hashedPassword]);

      const adminCredentialsProvided =
        username === process.env.ADMIN_INIT_USERNAME && password === process.env.ADMIN_INIT_PASSWORD;

      if (adminCredentialsProvided) {
        const user = await this.getUserByName(username);
        const role = await this.getRoleByName('admin');

        return await db.run('INSERT INTO UserRole (userId, roleId) VALUES (?, ?)', [user.id, role.id]);
      } else {
        return;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  },

  async addSongToUser(songName, fileName, songId, userId) {
    await this.db.run('INSERT INTO Song (name, fileName, id, userId) VALUES (?, ?, ?, ?)', [songName, fileName, songId, userId]);
    return await this.db.get('SELECT * FROM Song WHERE fileName = (?)', [fileName]);
  },

  async getAllSongs() {
    return await this.db.all('SELECT * FROM Song');
  },

  async getSongById(id) {
    return await this.db.get('SELECT * FROM Song WHERE id = (?)', [id]);
  }
};
