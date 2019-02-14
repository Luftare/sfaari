const fs = require('fs');
const sqlite = require('sqlite');
const bcrypt = require('bcrypt');
const { asyncMap } = require('./utils/async');
const { initTestDatabaseState } = require('./databaseTestUtils');

const isTestEnvironment = process.env.NODE_ENV === 'test';
const databasePath = isTestEnvironment ? ':memory:' : 'database.sqlite';

const encryptionSaltRounds = 10;

module.exports = {
  db: null,
  async init() {
    this.db = await sqlite.open(databasePath);

    await this.setupDatabaseTables();
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
  },

  async createRoleWithName(roleName) {
    await this.db.run(
      `INSERT INTO Role (name)
      SELECT (?)
      WHERE NOT EXISTS(SELECT 1 FROM Role WHERE name = (?))`,
      [roleName, roleName]
    );
    return await this.getRoleByName(roleName);
  },

  async getUsersWithRoleName(roleName) {
    const users = await this.db.all(
      `SELECT * 
      FROM User
      WHERE EXISTS (
        SELECT *
        FROM UserRole
        INNER JOIN Role
          ON Role.id = UserRole.roleId
          AND Role.name = (?)
      )`,
      [roleName]
    );

    return await asyncMap(users, async user => await this.getEnrichedUser(user));
  },

  async checkUserCredentialValidity(username, password) {
    const user = await this.getUserByUsername(username);
    const userExists = user && user.username;
    if (!userExists) return false;

    const correctPasswordProvided = await bcrypt.compare(password, user.password);

    return correctPasswordProvided;
  },

  async getRoleByName(name) {
    const role = await this.db.get(`SELECT * FROM Role WHERE name = (?)`, [name]);

    return role;
  },

  async getUserRolesByUserId(id) {
    const rolesObject = await this.db.all(
      `SELECT name FROM Role INNER JOIN UserRole ON Role.id = UserRole.roleId WHERE UserRole.userId = (?)`,
      [id]
    );

    return rolesObject.map(({ name }) => name);
  },

  async getEnrichedUser(user) {
    if (!user) return null;
    const roles = await this.getUserRolesByUserId(user.id);

    return {
      ...user,
      roles
    };
  },

  async getUserById(id) {
    const user = await this.db.get(`SELECT * FROM User WHERE id = (?)`, [id]);
    return await this.getEnrichedUser(user);
  },

  async getUserByUsername(username) {
    const user = await this.db.get(`SELECT * FROM User WHERE username = (?)`, [username]);
    return await this.getEnrichedUser(user);
  },

  async updateUserUsername(id, username) {
    const user = await this.getUserById(id);
    await this.db.run('UPDATE User SET username = (?) WHERE id = (?)', [username, id]);
    return this.getUserById(id);
  },

  async updateUserPassword(id, password) {
    const user = await this.getUserById(id);
    const hashedPassword = await bcrypt.hash(password, encryptionSaltRounds);
    await this.db.run('UPDATE User SET password = (?) WHERE id = (?)', [hashedPassword, id]);
    return this.getUserById(id);
  },

  async getAllUsers() {
    const { db } = this;
    const users = await db.all('SELECT * FROM User');
    return await asyncMap(users, async user => await this.getEnrichedUser(user));
  },

  async userWithUsernameExists(username) {
    const existingUser = await this.db.get('SELECT * FROM User WHERE username = (?)', [username]);
    return existingUser && existingUser.username;
  },

  async addRoleToUser(roleName, userId) {
    await this.db.run(
      `INSERT INTO UserRole (userId, roleId)
      VALUES (
        ?,
        (SELECT id FROM Role WHERE name = (?))
      )`,
      [userId, roleName]
    );
    return await this.getUserById(userId);
  },

  async removeRoleFromUser(roleId, userId) {
    await this.db.run('DELETE FROM UserRole WHERE roleId = (?) AND userId = (?)', [roleId, userId]);
    return await this.getUserById(userId);
  },

  async addUser(username, password) {
    const { db } = this;
    const hashedPassword = await bcrypt.hash(password, encryptionSaltRounds);
    await db.run('INSERT INTO User (username, password) VALUES (?, ?)', [username, hashedPassword]);
    return await this.getUserByUsername(username);
  },

  async removeUserById(userId) {
    return await this.db.run('DELETE FROM User WHERE id = (?)', [userId]);
  },

  async addSongToUser(songName, fileName, songId, userId) {
    await this.db.run('INSERT INTO Song (name, fileName, id, userId) VALUES (?, ?, ?, ?)', [
      songName,
      fileName,
      songId,
      userId
    ]);
    return await this.db.get('SELECT * FROM Song WHERE fileName = (?)', [fileName]);
  },

  async removeSongById(songId) {
    return await this.db.run('DELETE FROM Song WHERE id = (?)', [songId]);
  },

  async getAllSongs() {
    return await this.db.all('SELECT * FROM Song');
  },

  async getSongById(id) {
    return await this.db.get('SELECT * FROM Song WHERE id = (?)', [id]);
  }
};
