const { mockUsers } = require('../databaseTestUtils');

module.exports = {
  async init() {
    return null;
  },

  async setupDatabaseTables() {
    return null;
  },

  async createRoleWithName(roleName) {
    return {
      name: roleName,
      id: 1
    };
  },

  async getUsersWithRoleName(roleName) {
    return mockUsers.map((user, i) => ({
      username: user.username,
      password: user.password + user.password,
      id: i,
      roles: [roleName]
    }));
  },

  async checkUserCredentialValidity(username, password) {
    return username === 'correct-mock-username', password === 'correct-mock-password';
  },

  async getRoleByName(name) {
    return {
      name: 'mock role',
      id: 1
    };
  },

  async getUserRolesByUserId(id) {
    return ['mock role', 'another role'];
  },

  async getEnrichedUser(user) {
    return {
      ...user,
      roles: []
    };
  },

  async getUserById(id) {
    if (id !== 1) return null;
    return {
      username: 'mock user',
      password: 'mock password',
      id: 1,
      roles: []
    };
  },

  async getUserByUsername(username) {
    return {
      username,
      password: 'mock password',
      id: 1,
      roles: []
    };
  },

  async updateUserUsername(id, username) {
    if (id !== 1) return null;
    return {
      username,
      password: 'mock password',
      id,
      roles: []
    };
  },

  async updateUserPassword(id, password) {
    if (id !== 1) return null;
    return {
      username: 'mock user',
      password: 'mock password',
      id: 1,
      roles: []
    };
  },

  async getAllUsers() {
    return mockUsers.map((user, i) => ({
      username: user.username,
      password: user.password + user.password,
      id: i,
      roles: ['some_role']
    }));
  },

  async userWithUsernameExists(username) {
    return true;
  },

  async addRoleToUser(roleName, userId) {
    return {
      username: 'mock user',
      password: 'mock password',
      id: 1,
      roles: [roleName]
    };
  },

  async removeRoleFromUser(roleId, userId) {
    return {
      username: 'mock user',
      password: 'mock password',
      id: userId,
      roles: []
    };
  },

  async addUser(username, password) {
    return {
      username: 'mock user',
      password: 'mock password',
      id: 1,
      roles: []
    };
  },

  async removeUserById(userId) {
    if (userId !== 1) return false;
    return {};
  },

  async addSongToUser(songName, fileName, songId, userId) {
    return {
      fileName: 'mockfilename',
      name: 'Mock name',
      userId: 1,
      fileName: 'mockfile.mp3'
    };
  },

  async removeSongById(songId) {
    return {};
  },

  async getAllSongs() {
    return [
      {
        fileName: 'mockfilename',
        name: 'Mock name',
        userId: 1,
        fileName: 'mockfile.mp3'
      }
    ];
  },

  async getSongById(id) {
    return {
      fileName: 'mockfilename',
      name: 'Mock name',
      userId: 1,
      fileName: 'mockfile.mp3'
    };
  }
};
