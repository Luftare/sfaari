const request = require('supertest');
const { app, init } = require('../app');
const parseTokenPayload = require('../utils/parseTokenPayload');
const { mockUsers } = require('../databaseTestUtils');

describe('/api/users', () => {
  it('GET api/users', async done => {
    await init();
    request(app)
      .get('/api/users')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        const { users } = res.body;
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(4);

        mockUsers.forEach(({ username }) => {
          expect(users.some(user => user.username === username)).toBeTruthy();
        });

        users.forEach(user => {
          expect(user.username).toBeDefined();
          expect(user.id).toBeDefined();
        });
        done();
      });
  });

  it('GET /api/users/:userId', async done => {
    await init();
    request(app)
      .get('/api/users/1')
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        const { user } = res.body;
        expect(user.username).toBeDefined();
        expect(user.id).toBeDefined();
        expect(user.roles).toBeInstanceOf(Array);
        done();
      });
  });

  it('POST /api/users', async done => {
    request(app)
      .post('/api/users')
      .set('Accept', 'application/json')
      .send({
        username: 'new_mock_user',
        password: 'some_secret'
      })
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        expect(res.body.user.username).toBe('new_mock_user');
        expect(res.body.user.id).toBeDefined();

        request(app)
          .get('/api/users')
          .set('Accept', 'application/json')
          .expect(200)
          .end((err, res) => {
            if (err) throw err;

            const user = res.body.users.find(user => user.username === 'new_mock_user');
            expect(user.id).toBeDefined();
            expect(user.username).toEqual('new_mock_user');
            done();
          });
      });
  });

  it('PUT /api/users/:userId/username', async done => {
    const { username, password } = mockUsers[0];
    loginUser(username, password, async token => {
      const { id } = parseTokenPayload(token);
      request(app)
        .put(`/api/users/${id}/username`)
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .send({
          username: 'newusername'
        })
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          request(app)
            .get('/api/users')
            .set('Authorization', token)
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
              if (err) throw err;
              const { users } = res.body;
              expect(users.some(user => user.username === 'newusername'));
              done();
            });
        });
    });
  });

  it('PUT /api/users/:userId updating other user username without admin credentials', async done => {
    const { username, password } = mockUsers[0];
    loginUser(username, password, async token => {
      const { id } = parseTokenPayload(token);
      request(app)
        .put(`/api/users/${id + 1}/username`)
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .send({
          username: 'newusername'
        })
        .expect(403, done);
    });
  });

  it('PUT /api/users/:id/password', async done => {
    const { username, password } = mockUsers[0];
    loginUser(username, password, async token => {
      const { id } = parseTokenPayload(token);
      request(app)
        .put(`/api/users/${id}/password`)
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .send({
          password: 'newpassword'
        })
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          request(app)
            .post('/api/login')
            .set('Accept', 'application/json')
            .send({
              username,
              password: 'newpassword'
            })
            .expect(200, done);
        });
    });
  });
});

async function loginUser(username, password, onLoggedIn) {
  await init();
  request(app)
    .post('/api/login')
    .set('Accept', 'application/json')
    .send({
      username,
      password
    })
    .expect(200)
    .end((err, res) => {
      if (err) throw err;
      onLoggedIn(res.body.token);
    });
}
