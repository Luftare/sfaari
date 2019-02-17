require('dotenv').config({ path: './.test-env' });
const { mockReq, mockRes, mockJson, mockTokenPayload } = require('../utils/mockReq');
const mockDataAccessObject = require('../utils/mockDataAccessObject');
const parseTokenPayload = require('../utils/parseTokenPayload');
const users = require('./users');

jest.mock('../dataAccessObject', () => mockDataAccessObject);

describe('users.getAll', async () => {
  let req;
  let res;

  beforeEach(async done => {
    req = mockReq({});

    res = mockRes();

    await users.getAll(req, res);
    return done();
  });

  it('should respond with status 200', () => {
    expect(res.receivedStatus).toEqual(200);
  });

  it('should respond with list of users', () => {
    const { users } = res.receivedBody;
    expect(Array.isArray(users)).toBeTruthy();
    expect(users.length).toEqual(3);
    users.forEach(user => {
      expect(user.id).toBeDefined();
      expect(user.username).toBeDefined();
      expect(user.password).not.toBeDefined();
    });
  });
});

describe('users.get', async () => {
  let req;
  let res;

  beforeEach(async done => {
    req = mockReq({
      params: {
        userId: 1
      }
    });

    res = mockRes();

    await users.get(req, res);
    return done();
  });

  it('should respond with status 200', () => {
    expect(res.receivedStatus).toEqual(200);
  });

  it('should respond with user details', () => {
    const { user } = res.receivedBody;

    expect(user.id).toBeDefined();
    expect(user.roles).toBeDefined();
    expect(user.username).toBeDefined();
    expect(user.password).not.toBeDefined();
  });
});

describe('users.get with non-existing user id', async () => {
  let req;
  let res;

  beforeEach(async done => {
    req = mockReq({
      params: {
        userId: 123
      }
    });

    res = mockRes();

    await users.get(req, res);
    return done();
  });

  it('should respond with status 404', () => {
    expect(res.receivedStatus).toEqual(404);
  });
});

describe('users.putUsername', async () => {
  let req;
  let res;

  beforeEach(async done => {
    req = mockReq({
      params: {
        userId: 1
      },
      body: {
        username: 'new_mock_username'
      }
    });

    res = mockRes();

    await users.putUsername(req, res);
    return done();
  });

  it('should respond with status 200', () => {
    expect(res.receivedStatus).toEqual(200);
  });

  it('should respond with user details including updated username', () => {
    const { user } = res.receivedBody;

    expect(user.id).toBeDefined();
    expect(user.roles).toBeDefined();
    expect(user.username).toEqual('new_mock_username');
    expect(user.password).not.toBeDefined();
  });
});
