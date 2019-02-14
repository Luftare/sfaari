const { asyncForEach } = require('./utils/async');

const mockUsers = [
  {
    username: 'someone',
    password: 'password'
  },
  {
    username: 'mocker',
    password: 'mock_pass'
  },
  {
    username: 'someone_else',
    password: 'p455wordz'
  }
];

async function initTestDatabaseState(databaseAccessObject) {
  let lastAddedUser;

  await asyncForEach(mockUsers, async ({ username, password }) => {
    lastAddedUser = await databaseAccessObject.addUser(username, password);
  });

  await databaseAccessObject.addSongToUser('Mock song name', 'mock-song.mp3', 'mocked-id', lastAddedUser.id);
  await databaseAccessObject.addSongToUser('Another', 'song-2.mp3', 'other-id', lastAddedUser.id);
}

module.exports = {
  initTestDatabaseState,
  mockUsers
};
