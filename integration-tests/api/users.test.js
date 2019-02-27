const request = require('supertest');
const { app, init } = require('../../app');
const parseTokenPayload = require('../../utils/parseTokenPayload');
const dataAccessObject = require('../../dataAccessObject');
const { mockUsers, initTestDatabaseState } = require('../../databaseTestUtils');

describe('/api/users', async () => {
  beforeEach(async done => {
    await init();
    done();
  });

  describe('GET', async () => {
    let getResponse;

    beforeEach(async () => {
      await initTestDatabaseState(dataAccessObject);
      getResponse = request(app)
        .get('/api/users')
        .set('Accept', 'application/json');
    });

    it('should respond with status code 200', done => {
      getResponse.expect(200, done);
    });

    it('should respond with list of users', done => {
      getResponse.end((err, res) => {
        if (err) throw err;
        const { users } = res.body;

        mockUsers.forEach(mockUser => {
          expect(users.find(user => user.username === mockUser.username));
        });
        done();
      });
    });
  });

  describe('POST', async () => {
    let postResponse;

    beforeEach(async () => {
      postResponse = request(app)
        .post('/api/users')
        .set('Accept', 'application/json')
        .send({
          username: 'new_mock_user',
          password: 'some_password'
        });
    });

    it('should respond with status 200', done => {
      postResponse.expect(200, done);
    });

    it('should respond with user details', done => {
      postResponse.end((err, res) => {
        if (err) throw err;
        const { user } = res.body;
        expect(user.username).toEqual('new_mock_user');
        expect(user.id).toBeDefined();
        expect(Array.isArray(user.roles)).toBeTruthy();
        expect(user.password).not.toBeDefined();
        done();
      });
    });

    describe('GET /api/users', async () => {
      let getRequest;

      beforeEach(() => {
        getRequest = request(app)
          .get('/api/users')
          .set('Accept', 'application/json');
      });

      it('should contain added user', async done => {
        postResponse.end((err, res) => {
          getRequest.end((err, res) => {
            if (err) throw err;
            const { users } = res.body;
            const user = users.find(user => user.username === 'new_mock_user');
            expect(user).toBeDefined();
            done();
          });
        });
      });
    });

    describe('GET /api/users/x', async () => {
      let getRequest;
      let postResponseUser;

      beforeEach(async done => {
        postResponse.end((err, res) => {
          if (err) throw err;
          postResponseUser = res.body.user;
          getRequest = request(app)
            .get(`/api/users/${postResponseUser.id}`)
            .set('Accept', 'application/json');
          done();
        });
      });

      it('should respond with user details', async done => {
        getRequest.end((err, res) => {
          if (err) throw err;
          const { user } = res.body;
          expect(user).toEqual(postResponseUser);
          done();
        });
      });
    });

    describe('PUT /api/users/x/username', async () => {
      let putUsernameRequest;
      let postResponseUser;

      beforeEach(async done => {
        postResponse.end((err, res) => {
          if (err) throw err;
          postResponseUser = res.body.user;

          login('new_mock_user', 'some_password', receivedToken => {
            putUsernameRequest = request(app)
              .put(`/api/users/${postResponseUser.id}/username`)
              .set('Authorization', receivedToken)
              .set('Accept', 'application/json')
              .send({
                username: 'newmockusername'
              });
            done();
          });
        });
      });

      it('should respond with user details with updated username', async done => {
        putUsernameRequest.expect(200).end((err, res) => {
          if (err) throw err;
          const { user } = res.body;
          expect(user.id).toEqual(postResponseUser.id);
          expect(user.username).toEqual('newmockusername');
          done();
        });
      });
    });

    describe('PUT /api/users/x/password', async () => {
      let putPasswordRequest;
      let postResponseUser;

      beforeEach(async done => {
        postResponse.end(async (err, res) => {
          postResponseUser = res.body.user;
          login('new_mock_user', 'some_password', token => {
            putPasswordRequest = request(app)
              .put(`/api/users/${postResponseUser.id}/password`)
              .set('Authorization', token)
              .set('Accept', 'application/json')
              .send({
                password: 'new-mock-password'
              });
            done();
          });
        });
      });

      it('should respond with user details', async done => {
        putPasswordRequest.expect(200).end((err, res) => {
          if (err) throw err;
          const { user } = res.body;
          expect(user.id).toEqual(postResponseUser.id);
          done();
        });
      });
    });

    describe('DELETE /api/users/x without token', async () => {
      let deleteUserResponse;

      beforeEach(async done => {
        postResponse.end(async (err, res) => {
          postResponseUser = res.body.user;

          deleteUserResponse = request(app)
            .delete(`/api/users/${postResponseUser.id}`)
            .set('Accept', 'application/json');
          done();
        });
      });

      it('should respond with status 403', async done => {
        deleteUserResponse.expect(403, done);
      });
    });

    describe('DELETE /api/users/x other user', async () => {
      let deleteUserResponse;

      beforeEach(async done => {
        postResponse.end(async (err, res) => {
          postResponseUser = res.body.user;

          login('new_mock_user', 'some_password', token => {
            deleteUserResponse = request(app)
              .delete(`/api/users/${postResponseUser.id + 1}`)
              .set('Authorization', token)
              .set('Accept', 'application/json');
            done();
          });
        });
      });

      it('should respond with status 403', done => {
        deleteUserResponse.expect(403, done);
      });
    });

    describe('DELETE /api/users/x', async () => {
      let deleteUserResponse;

      beforeEach(async done => {
        postResponse.end(async (err, res) => {
          postResponseUser = res.body.user;

          login(process.env.ADMIN_INIT_USERNAME, process.env.ADMIN_INIT_PASSWORD, token => {
            deleteUserResponse = request(app)
              .delete(`/api/users/${postResponseUser.id}`)
              .set('Authorization', token)
              .set('Accept', 'application/json');
            done();
          });
        });
      });

      it('should respond with status 200', done => {
        deleteUserResponse.expect(200, done);
      });

      describe('GET /api/users/x', async () => {
        let getUserRequest;

        beforeEach(async done => {
          deleteUserResponse.end((err, res) => {
            if (err) throw err;
            getUserRequest = request(app)
              .get(`/api/users/${postResponseUser.id}`)
              .set('Accept', 'application/json');
            done();
          });
        });

        it('should response with status 404', done => {
          getUserRequest.expect(404).end((err, res) => {
            if (err) throw err;
            done();
          });
        });
      });
    });
  });
});

function login(username, password, cb) {
  request(app)
    .post('/api/login')
    .set('Accept', 'application/json')
    .send({
      username,
      password
    })
    .expect(200)
    .end((err, res) => {
      if (err) throw err;
      cb(res.body.token);
    });
}
