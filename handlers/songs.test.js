require('dotenv').config({ path: './.test-env' });
const { mockReq, mockRes, mockJson, mockTokenPayload } = require('../utils/mockReq');
const mockDataAccessObject = require('../utils/mockDataAccessObject');
const parseTokenPayload = require('../utils/parseTokenPayload');
const songs = require('./songs');

jest.mock('../dataAccessObject', () => mockDataAccessObject);
jest.mock('fs', () => {
  return {
    unlink: () => {}
  };
});

describe('songs.getAll', async () => {
  let req;
  let res;

  beforeEach(async done => {
    req = mockReq({});

    res = mockRes();

    await songs.getAll(req, res);
    return done();
  });

  it('should respond with status 200', () => {
    expect(res.receivedStatus).toEqual(200);
  });

  it('should respond with list of songs', () => {
    const { songs } = res.receivedBody;
    expect(Array.isArray(songs)).toBeTruthy();
  });
});

describe('songs.get', async () => {
  let req;
  let res;

  beforeEach(async done => {
    req = mockReq({
      params: {
        songId: 1
      }
    });

    res = mockRes();

    await songs.get(req, res);
    return done();
  });

  it('should respond with status 200', () => {
    expect(res.receivedStatus).toEqual(200);
  });

  it('should respond with song details', () => {
    const { song } = res.receivedBody;

    expect(song.id).toBeDefined();
    expect(song.userId).toBeDefined();
    expect(song.name).toBeDefined();
    expect(song.fileName).toBeDefined();
  });
});

describe('songs.get with non-existing song id', async () => {
  let req;
  let res;

  beforeEach(async done => {
    req = mockReq({
      params: {
        songId: 123
      }
    });

    res = mockRes();

    await songs.get(req, res);
    return done();
  });

  it('should respond with status 404', () => {
    expect(res.receivedStatus).toEqual(404);
  });
});

describe('songs.getFile', async () => {
  let req;
  let res;

  beforeEach(async done => {
    req = mockReq({
      params: {
        songId: 1
      }
    });

    res = mockRes();

    res.sendFile = jest.fn();

    await songs.getFile(req, res);
    return done();
  });

  it('should respond with status 200', () => {
    expect(res.receivedStatus).toEqual(200);
  });

  it('should call res.sendFile with file path', () => {
    const pathArgument = res.sendFile.mock.calls[0][0];

    expect(res.sendFile).toHaveBeenCalled();
    expect(pathArgument.includes('mockfile.mp3')).toBeTruthy();
  });
});

describe('songs.getFile with non-existing song id', async () => {
  let req;
  let res;

  beforeEach(async done => {
    req = mockReq({
      params: {
        songId: 123
      }
    });

    res = mockRes();

    await songs.getFile(req, res);
    return done();
  });

  it('should respond with status 404', () => {
    expect(res.receivedStatus).toEqual(404);
  });
});

describe('songs.post', async () => {
  let req;
  let res;

  beforeEach(async done => {
    req = mockReq({
      body: {
        songName: 'Mock song name'
      }
    });

    req.tokenPayload = {
      id: 1
    };

    req.file = {
      fileName: 'mock-file-name.mp3'
    };

    req.uploadedSongId = 1;

    res = mockRes();

    await songs.post(req, res);
    return done();
  });

  it('should respond with status 200', () => {
    expect(res.receivedStatus).toEqual(200);
  });
});

describe('songs.post with missing song name', async () => {
  let req;
  let res;

  beforeEach(async done => {
    req = mockReq({});

    req.tokenPayload = {
      id: 1
    };

    req.file = {
      fileName: 'mock-file-name.mp3'
    };

    req.uploadedSongId = 1;

    res = mockRes();

    await songs.post(req, res);
    return done();
  });

  it('should respond with status 400', () => {
    expect(res.receivedStatus).toEqual(400);
  });
});

describe('songs.delete', async () => {
  let req;
  let res;

  beforeEach(async done => {
    req = mockReq({
      params: {
        songId: 1
      }
    });

    req.tokenPayload = {
      id: 1
    };

    res = mockRes();

    await songs.delete(req, res);
    return done();
  });

  it('should respond with status 200', () => {
    expect(res.receivedStatus).toEqual(200);
  });
});
