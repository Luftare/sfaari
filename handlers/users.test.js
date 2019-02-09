const request = require('supertest');
const { app, init } = require('../app');
const parseTokenPayload = require('../utils/parseTokenPayload');

describe('/users', () => {
  it('GET /users', async done => {
    loginUser('someone', 'passwordz', async token => {
      request(app)
        .get('/users')
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          const { users } = res.body;
          expect(users).toBeInstanceOf(Array);
          expect(users).toHaveLength(4);

          ['mocker', 'someone', 'someone_else'].forEach(testName => {
            expect(users.some(user => user.username === testName)).toBeTruthy();
          });
          done();
        });
    });
  });

  it('GET /users/:userId', async done => {
    loginUser('someone', 'passwordz', async token => {
      const { id } = parseTokenPayload(token);
      request(app)
        .get(`/users/${id}`)
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          const { user } = res.body;
          expect(user.username).toBeDefined();
          expect(user.id).toBeDefined();
          expect(user.roles).toBeInstanceOf(Array);
          done();
        });
    });
  });

  it('PUT /users/:userId/username', async done => {
    loginUser('someone', 'passwordz', async token => {
      const { id } = parseTokenPayload(token);
      request(app)
        .put(`/users/${id}/username`)
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .send({
          username: 'newusername'
        })
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          request(app)
            .get('/users')
            .set('Authorization', token)
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
              if (err) throw err;
              const { users } = res.body;
              expect(users.some(user => user.username === 'newusername'));
              done();
            });
        });
    });
  });

  it('PUT /users/:userId updating other user username without admin credentials', async done => {
    loginUser('someone', 'passwordz', async token => {
      const { id } = parseTokenPayload(token);
      request(app)
        .put(`/users/${id + 1}/username`)
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .send({
          username: 'newusername'
        })
        .expect(403, done);
    });
  });

  it('PUT /users/:id/password', async done => {
    loginUser('someone', 'passwordz', async token => {
      const { id } = parseTokenPayload(token);
      request(app)
        .put(`/users/${id}/password`)
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .send({
          password: 'newpassword'
        })
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          request(app)
            .post('/login')
            .set('Accept', 'application/json')
            .send({
              username: 'someone',
              password: 'newpassword'
            })
            .expect(200, done);
        });
    });
  });
});

async function loginUser(username, password, onLoggedIn) {
  await init();
  request(app)
    .post('/login')
    .set('Accept', 'application/json')
    .send({
      username,
      password
    })
    .expect(200)
    .end((err, res) => {
      if (err) throw err;
      onLoggedIn(res.body.token);
    });
}
