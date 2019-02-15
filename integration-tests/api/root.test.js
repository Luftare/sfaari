const request = require('supertest');
const { app, init } = require('../../app');

describe('/', () => {
  beforeEach(async () => {
    await init();
  });

  describe('GET', () => {
    let getResponse;

    beforeEach(() => {
      getResponse = request(app).get('/');
    });

    it('should respond with status 200', done => {
      getResponse.expect(200, done);
    });

    it('should respond with file with type type/html', done => {
      getResponse.expect('Content-Type', /text\/html/).end(done);
    });
  });
});
