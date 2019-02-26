const request = require('supertest');
const path = require('path');
const fs = require('fs');
const { app, init } = require('../../app');
const { mockUsers, initTestDatabaseState } = require('../../databaseTestUtils');
const dataAccessObject = require('../../dataAccessObject');

const testUploadsDirectoryPath = path.resolve(__dirname, '../../test-uploads');

function clearDirectory(directory) {
  const testUploadsDirectoryExists = fs.existsSync(directory);

  if (testUploadsDirectoryExists) {
    const files = fs.readdirSync(directory);

    for (const file of files) {
      fs.unlinkSync(path.join(directory, file));
    }
  }
}

beforeAll(done => {
  clearDirectory(testUploadsDirectoryPath);
  done();
});

afterAll(done => {
  clearDirectory(testUploadsDirectoryPath);
  done();
});

describe('/api/songs', async () => {
  describe('GET', async () => {
    let response;
    let httpMock;

    beforeEach(async () => {
      await init();
      await initTestDatabaseState(dataAccessObject);
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
        const pathToMockSong = path.resolve(__dirname, '../../testAssets/mock-song.mp3');

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
        .expect(200)
        .end((err, res) => {
          const { songs } = res.body;
          const song = songs.find(song => song.name === 'Mock song');
          expect(song).toBeDefined();
          response.end(done);
        });
    });

    it('should make the new song available at GET /api/songs/:songId', async done => {
      response.end((err, res) => {
        const { song } = res.body;

        request(app)
          .get(`/api/songs/${song.id}`)
          .set('Accept', 'application/json')
          .expect(200)
          .end((err, res) => {
            const { song } = res.body;
            expect(song).toBeDefined();
            done();
          });
      });
    });

    it('should make the new song file available at GET /api/songs/:songId/file', async done => {
      response.end((err, res) => {
        const songId = res.body.song.id;

        request(app)
          .get(`/api/songs/${songId}/file`)
          .set('Accept', 'application/json')
          .expect(200, done);
      });
    });

    describe('DELETE', async () => {
      let token;
      let httpMock;
      let deleteResponse;

      beforeEach(async () => {
        return new Promise(promiseRes => {
          response.end((err, res) => {
            const { song } = res.body;

            getToken(newToken => {
              token = newToken;
              httpMock = request(app);
              deleteResponse = httpMock
                .delete(`/api/songs/${song.id}`)
                .set('Accept', 'application/json')
                .set('Authorization', token);
              promiseRes();
            });
          });
        });
      });

      it('should respond with status 200', done => {
        deleteResponse.expect(200, done);
      });
    });
  });
});

function getToken(cb) {
  const { username, password } = mockUsers[0];

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
