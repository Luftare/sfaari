const request = require('supertest');
const path = require('path');
const { app, init } = require('../app');

describe('/api/songs', () => {
  it('GET api/songs', async done => {
    await init();
    request(app)
      .get('/api/songs')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        const { songs } = res.body;
        expect(songs).toBeInstanceOf(Array);
        done();
      });
  });

  it('POST api/songs', async done => {
    const pathToMockSong = path.resolve(__dirname, '../testAssets/mock-song.mp3');
    await init();
    request(app)
      .post('/api/songs')
      .set('Accept', 'application/json')
      .field('songName', 'mock-song-name')
      .attach('song', pathToMockSong)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) throw err;
        request(app)
          .get('/api/songs')
          .set('Accept', 'application/json')
          .expect(200)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            if (err) throw err;
            const { songs } = res.body;
            expect(songs).toBeInstanceOf(Array);
            expect(songs.some(song => song.name === 'mock-song-name')).toEqual(true);
            done();
          });
      });
  });
});

async function loginUser(onLoggedIn) {
  await init();
  request(app)
    .post('/api/login')
    .set('Accept', 'application/json')
    .send({
      username: 'someone',
      password: 'passwordz'
    })
    .expect(200)
    .end((err, res) => {
      if (err) throw err;
      onLoggedIn(res.body.token);
    });
}
