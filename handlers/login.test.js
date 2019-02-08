const request = require('supertest');
const { app, init } = require('../app');

describe('/login', () => {
  it('POST /login with invalid credentials', async done => {
    await init();
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

  it('POST /login with missing credentials', async done => {
    await init();
    request(app)
      .post('/login')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400, done);
  });

  it('POST /login with valid credentials', async done => {
    await init();
    request(app)
      .post('/login')
      .set('Accept', 'application/json')
      .send({
        username: 'someone',
        password: 'passwordz',
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        expect(res.body.token).toBeDefined();
        done();
      });
  });

  it('POST /login with valid admin credentials', async done => {
    await init();
    request(app)
      .post('/login')
      .set('Accept', 'application/json')
      .send({
        username: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD,
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        expect(res.body.token).toBeDefined();
        expect(res.body.roles.includes('admin')).toEqual(true);
        done();
      });
  });
});
