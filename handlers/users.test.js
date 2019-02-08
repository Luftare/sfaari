const request = require('supertest');
const { app, init } = require('../app');
const { initTestDatabaseState } = require('../databaseTestUtils');

describe('/users', () => {
  it('GET', async done => {
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
});

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
