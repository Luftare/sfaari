const request = require('supertest');
const { app, init } = require('../../app');

describe('/', () => {
  it('GET /', async done => {
    await init();
    request(app)
      .get('/')
      .expect('Content-Type', /text\/html/)
      .expect(200, done);
  });
});
