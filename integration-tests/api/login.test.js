const request = require('supertest');
const { app, init } = require('../../app');
const { mockUsers, initTestDatabaseState } = require('../../databaseTestUtils');
const dataAccessObject = require('../../dataAccessObject');

describe('/api/login', async () => {
  beforeEach(async () => {
    await init();
    await initTestDatabaseState(dataAccessObject);
  });

  describe('POST without credentials', () => {
    let postWithoutCredentialsRequest;

    beforeEach(async () => {
      postWithoutCredentialsRequest = request(app)
        .post('/api/login')
        .set('Accept', 'application/json');
    });

    it('should respond with status 400', done => {
      postWithoutCredentialsRequest.expect(400, done);
    });
  });

  describe('POST with wrong credentials', () => {
    let postWithWrongCredentialsRequest;

    beforeEach(async () => {
      postWithWrongCredentialsRequest = request(app)
        .post('/api/login')
        .set('Accept', 'application/json')
        .send({
          username: 'wrongusername',
          password: 'falsy-password'
        });
    });

    it('should respond with status 403', done => {
      postWithWrongCredentialsRequest.expect(403, done);
    });
  });

  describe('POST with valid credentials', () => {
    let postWithValidCredentialsRequest;

    beforeEach(async () => {
      const { username, password } = mockUsers[0];
      postWithValidCredentialsRequest = request(app)
        .post('/api/login')
        .set('Accept', 'application/json')
        .send({
          username,
          password
        });
    });

    it('should respond with status 200', done => {
      postWithValidCredentialsRequest.expect(200, done);
    });

    it('should respond with token', done => {
      postWithValidCredentialsRequest.end((err, res) => {
        if (err) throw err;
        const { token } = res.body;
        expect(token).toBeDefined();
        done();
      });
    });

    it('should respond with user details', done => {
      postWithValidCredentialsRequest.end((err, res) => {
        if (err) throw err;
        const { user } = res.body;
        expect(user.id).toBeDefined();
        expect(user.username).toEqual(mockUsers[0].username);
        expect(user.password).not.toBeDefined();
        expect(Array.isArray(user.roles)).toBeTruthy();
        done();
      });
    });
  });
});
