const request = require('supertest');
const { app, init } = require('../app');
const { initTestDatabaseState } = require('../databaseTestUtils');

describe('/users', () => {
  it('GET', async done => {
    await init();
    request(app)
      .get('/users')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) console.log(err);
        const { users } = res.body;
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(3);

        ['mocker', 'someone', 'someone_else'].forEach(testName => {
          expect(users.some(user => user.username === testName)).toBeTruthy();
        });
        done();
      });
  });
});
