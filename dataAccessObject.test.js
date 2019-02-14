require('dotenv').config({ path: './.test-env' });
const dataAccessObject = require('./dataAccessObject');
const { initTestDatabaseState } = require('./databaseTestUtils');

describe('Data access object', async () => {
  beforeEach(async done => {
    await dataAccessObject.init();
    done();
  });

  it('can add a new user', async done => {
    const user = await dataAccessObject.addUser('newusername', 'somepassword');
    expect(user).toBeDefined();
    done();
  });

  describe('when adding a new user', async () => {
    let addUserResponse;

    beforeEach(async done => {
      addUserResponse = await dataAccessObject.addUser('newusername', 'somepassword');
      done();
    });

    it('received details include user id', () => {
      expect(addUserResponse.id).toBeDefined();
    });

    it('received details include user username', () => {
      expect(addUserResponse.username).toEqual('newusername');
    });

    it('received details include user hashed password', () => {
      expect(addUserResponse.password).toBeDefined();
      expect(addUserResponse.password).not.toEqual('somepassword');
    });

    it('received details include user roles', () => {
      expect(Array.isArray(addUserResponse.roles)).toBeTruthy();
    });

    describe('when song is added to user', async () => {
      let addSongResponse;

      beforeEach(async () => {
        addSongResponse = await dataAccessObject.addSongToUser(
          'Mock song name',
          'some.mp3',
          'some-id',
          addUserResponse.id
        );
      });

      it('should response with song details', () => {
        expect(addSongResponse.id).toBeDefined();
        expect(addSongResponse.name).toBeDefined();
        expect(addSongResponse.fileName).toBeDefined();
        expect(addSongResponse.userId).toBeDefined();
      });

      it('should be present when requesting all songs', async () => {
        const songs = await dataAccessObject.getAllSongs();
        const song = songs.find(song => song.name === 'Mock song name');
        expect(song).toBeDefined();
      });

      it('should be returned when requested by id', async () => {
        const song = await dataAccessObject.getSongById(addSongResponse.id);
        expect(song).toBeDefined();
      });
    });

    describe('when password is changed', async () => {
      let changePasswordResponse;

      beforeEach(async done => {
        changePasswordResponse = await dataAccessObject.updateUserPassword(addUserResponse.id, 'newmockpassword');
        done();
      });

      it('password should be changed and hashed', () => {
        expect(addUserResponse.id).toEqual(changePasswordResponse.id);
        expect(addUserResponse.password).not.toEqual(changePasswordResponse.password);
        expect(changePasswordResponse.password).not.toEqual('newmockpassword');
      });
    });

    describe('when username is changed', async () => {
      let changeUsernameResponse;

      beforeEach(async done => {
        changeUsernameResponse = await dataAccessObject.updateUserUsername(addUserResponse.id, 'newmockedusername');
        done();
      });

      it('username should be changed', () => {
        expect(addUserResponse.id).toEqual(changeUsernameResponse.id);
        expect(changeUsernameResponse.username).toEqual('newmockedusername');
      });
    });

    describe('when requesting user by id', async () => {
      let response;

      beforeEach(async () => {
        response = await dataAccessObject.getUserById(addUserResponse.id);
      });

      it('user details should be included', () => {
        expect(addUserResponse).toEqual(response);
      });
    });

    describe('when adding a new role', async () => {
      let addRoleResponse;

      beforeEach(async () => {
        addRoleResponse = await dataAccessObject.createRoleWithName('mock role');
      });

      it('role details should be received', () => {
        expect(addRoleResponse.name).toEqual('mock role');
      });

      describe('when adding a role to the user', async () => {
        let addRoleToUserResponse;

        beforeEach(async () => {
          addRoleToUserResponse = await dataAccessObject.addRoleToUser('mock role', addUserResponse.id);
        });

        it('response roles should include added role', () => {
          expect(addRoleToUserResponse.roles.includes('mock role')).toBeTruthy();
        });

        describe('when requesting users with the just added role', async () => {
          let usersWithRoleResponse;

          beforeEach(async () => {
            usersWithRoleResponse = await dataAccessObject.getUsersWithRoleName('mock role');
          });

          it('should include the just added user', async () => {
            const user = usersWithRoleResponse.find(user => addUserResponse.id === user.id);
            expect(user).toEqual({
              ...addUserResponse,
              roles: ['mock role']
            });
          });
        });
      });
    });

    describe('when requesting user by username', async () => {
      let response;

      beforeEach(async () => {
        response = await dataAccessObject.getUserByUsername(addUserResponse.username);
      });

      it('user details should be received', () => {
        expect(addUserResponse).toEqual(response);
      });
    });

    describe('when requesting all users', async () => {
      let response;

      beforeEach(async () => {
        response = await dataAccessObject.getAllUsers();
      });

      it('added user is included in the response', () => {
        const recentlyAddedUser = response.find(user => user.username === 'newusername');
        expect(recentlyAddedUser).toEqual(addUserResponse);
      });
    });
  });
});
