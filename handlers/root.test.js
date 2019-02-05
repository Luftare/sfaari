const request = require('supertest');
const app = require('../app');

describe('/', () => {
  it('GET', done => {
    request(app)
      .get('/')
      .expect('Content-Type', /text\/html/)
      .expect(200, done);
  });
});