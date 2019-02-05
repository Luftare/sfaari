const request = require('supertest');
const app = require('../app');

describe('/login', () => {
  it('POST with invalid credentials', done => {
    request(app)
      .post('/login')
      .set('Accept', 'application/json')
      .send({
        username: 'wrongusername',
        password: 'wrongpassword',
      })
      .expect('Content-Type', /json/)
      .expect(403, done);
  });

  it('POST with missing credentials', done => {
    request(app)
      .post('/login')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400, done);
  });

  it('POST with valid credentials', done => {
    request(app)
      .post('/login')
      .set('Accept', 'application/json')
      .send({
        username: 'mock_username',
        password: 'mock_password',
      })
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});
