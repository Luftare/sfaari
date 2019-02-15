const request = require('supertest');
const { app, init } = require('../../app');
const { mockUsers } = require('../../databaseTestUtils');

describe('/api/login', () => {
  it('POST api/login with invalid credentials', async done => {
    await init();
    request(app)
      .post('/api/login')
      .set('Accept', 'application/json')
      .send({
        username: 'wrongusername',
        password: 'wrongpassword'
      })
      .expect('Content-Type', /json/)
      .expect(403, done);
  });

  it('POST api/login with missing credentials', async done => {
    await init();
    request(app)
      .post('/api/login')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400, done);
  });

  it('POST api/login with valid credentials', async done => {
    const { username, password } = mockUsers[0];
    await init();
    request(app)
      .post('/api/login')
      .set('Accept', 'application/json')
      .send({
        username,
        password
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        expect(res.body.token).toBeDefined();
        done();
      });
  });

  it('POST api/login with valid admin credentials', async done => {
    await init();
    request(app)
      .post('/api/login')
      .set('Accept', 'application/json')
      .send({
        username: process.env.ADMIN_INIT_USERNAME,
        password: process.env.ADMIN_INIT_PASSWORD
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
