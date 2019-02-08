const request = require('supertest');
const { app, init } = require('../app');

describe('/admin', () => {
  it('GET /admin with invalid token', async done => {
    await init();
    request(app)
      .get('/admin')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(403, done);
  });

  it('GET /admin with valid token', async done => {
    loginAdminUser(token => {
      request(app)
        .get('/admin')
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  it('GET /admin with valid non-admin token', async done => {
    loginUser(token => {
      request(app)
        .get('/admin')
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(403, done);
    });
  });
});

async function loginAdminUser(onLoggedIn) {
  await init();
  request(app)
    .post('/login')
    .set('Accept', 'application/json')
    .send({
      username: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD,
    })
    .expect(200)
    .end((err, res) => {
      if (err) throw err;
      onLoggedIn(res.body.token);
    });
}

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
