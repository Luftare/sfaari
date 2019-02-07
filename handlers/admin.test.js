const request = require('supertest');
const { app, init } = require('../app');

describe('/admin', () => {
  it('GET with invalid token', async done => {
    await init();
    request(app)
      .get('/admin')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(403, done);
  });

  it('GET with valid token', async done => {
    loginUser(token => {
      request(app)
        .get('/admin')
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });
});

async function loginUser(onLoggedIn) {
  await init();
  request(app)
    .post('/login')
    .set('Accept', 'application/json')
    .send({
      username: 'mock_username',
      password: 'mock_password',
    })
    .expect(200)
    .end((err, res) => {
      if (err) throw err;
      onLoggedIn(res.body.token);
    });
}
