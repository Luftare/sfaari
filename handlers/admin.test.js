const request = require('supertest');
const app = require('../app');

describe('/admin', () => {
  it('GET with invalid token', done => {
    request(app)
      .get('/admin')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(403, done);
  });

  it('GET with valid token', done => {
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

function loginUser(onLoggedIn) {
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
