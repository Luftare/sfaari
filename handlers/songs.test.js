const request = require('supertest');
const path = require('path');
const fs = require('fs');
const { app, init } = require('../app');

const testUploadsDirectoryPath = path.resolve(__dirname, '../test-uploads');

function clearDirectory(directory) {
  const testUploadsDirectoryExists = fs.existsSync(directory);

  if (testUploadsDirectoryExists) {
    fs.readdir(directory, (err, files) => {
      if (err) throw err;

      for (const file of files) {
        fs.unlink(path.join(directory, file), err => {
          if (err) throw err;
        });
      }
    });
  }
}

beforeAll(() => {
  clearDirectory(testUploadsDirectoryPath);
});

afterAll(() => {
  clearDirectory(testUploadsDirectoryPath);
});

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
    loginUser(token => {
      request(app)
        .post('/api/songs')
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .field('songName', 'Mock song')
        .attach('song', pathToMockSong)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) throw err;
          const { song } = res.body;
          expect(song).toBeDefined();
          expect(song.id).toBeDefined();
          expect(song.fileName).toBeDefined();
          request(app)
            .get('/api/songs')
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .end((err, res) => {
              if (err) throw err;
              const { songs } = res.body;
              expect(songs).toBeInstanceOf(Array);
              const newSong = songs.find(song => song.name === 'Mock song');
              expect(newSong.id).toEqual(song.id);
              request(app)
                .get(`/api/songs/${newSong.id}`)
                .expect(200, done);
            });
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
