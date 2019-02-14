const request = require('supertest');
const path = require('path');
const fs = require('fs');
const { app, init } = require('../app');
const { mockUsers } = require('../databaseTestUtils');

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

describe('/api/songs', async () => {
  describe('GET', async () => {
    let response;
    let httpMock;

    beforeEach(async () => {
      await init();
      httpMock = request(app);
      response = httpMock.get('/api/songs').set('Accept', 'application/json');
    });

    it('should respond with status code 200', done => {
      response.expect(200, done);
    });

    it('should return songs', done => {
      response.end((err, res) => {
        const { songs } = res.body;
        expect(songs.find(song => song.name === 'Mock song name' && song.id === 'mocked-id')).toBeDefined();
        expect(songs.find(song => song.name === 'Another' && song.id === 'other-id')).toBeDefined();
        done();
      });
    });
  });

  describe('POST', async () => {
    let token;
    let httpMock;
    let response;

    beforeEach(async () => {
      return new Promise(res => {
        const pathToMockSong = path.resolve(__dirname, '../testAssets/mock-song.mp3');

        getToken(newToken => {
          token = newToken;
          httpMock = request(app);
          response = httpMock
            .post('/api/songs')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .field('songName', 'Mock song')
            .attach('song', pathToMockSong);
          res();
        });
      });
    });

    it('should respond with status code 200', async done => {
      response.expect(200, done);
    });

    it('should return inserted song', async done => {
      response.end((err, res) => {
        const { song } = res.body;
        expect(song.name).toEqual('Mock song');
        done();
      });
    });

    it('should make the new song availabble at GET /api/songs', done => {
      request(app)
        .get('/api/songs')
        .set('Accept', 'application/json')
        .end((err, res) => {
          const { songs } = res.body;
          const song = songs.find(song => song.name === 'Mock song');
          expect(song).toBeDefined();
          done();
        });
    });

    it('should make the new song file availabble at GET /api/songs/:songId/file', done => {
      response.end((err, res) => {
        const songId = res.body.song.id;

        request(app)
          .get(`/api/songs/${songId}/file`)
          .set('Accept', 'application/json')
          .expect(200, done);
      });
    });
  });
});

function getToken(cb) {
  const { username, password } = mockUsers[0];
  let token;

  request(app)
    .post('/api/login')
    .set('Accept', 'application/json')
    .send({
      username,
      password
    })
    .end((err, res) => {
      cb(res.body.token);
    });
}
