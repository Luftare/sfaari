const request = require('supertest');
const { app, init } = require('../app');
const { initTestDatabaseState } = require('../databaseTestUtils');
const parseTokenPayload = require('../utils/parseTokenPayload');

describe('/users', () => {
  it('GET /users', async done => {
    loginUser(async token => {
      request(app)
        .get('/users')
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) console.log(err);
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

  it('GET /users/:id', async done => {
    loginUser(async token => {
      const { id } = parseTokenPayload(token);
      request(app)
        .get(`/users/${id}`)
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          if (err) console.log(err);
          const { user } = res.body;
          expect(user.username).toBeDefined();
          expect(user.id).toBeDefined();
          expect(user.roles).toBeInstanceOf(Array);
          done();
        });
    });
  });
});

// PUT /users/:id/username
// PUT /users/:id/password

async function loginUser(onLoggedIn) {
  await init();
  request(app)
    .post('/login')
    .set('Accept', 'application/json')
    .send({
      username: 'someone',
      password: 'passwordz',
    })
    .expect(200)
    .end((err, res) => {
      if (err) throw err;
      onLoggedIn(res.body.token);
    });
}
