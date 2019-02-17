require('dotenv').config({ path: './.test-env' });
const { mockReq, mockRes, mockJson, mockTokenPayload } = require('../utils/mockReq');
const mockDataAccessObject = require('../utils/mockDataAccessObject');
const parseTokenPayload = require('../utils/parseTokenPayload');
const users = require('./users');

jest.mock('../dataAccessObject', () => mockDataAccessObject);

describe('username validator', () => {
  it('should fail too short username', () => {
    const username = 'a';

    const isValid = users.isValidUsername(username);

    expect(isValid).toBeFalsy();
  });

  it('should fail too long username', () => {
    const username = 'aasdasdasddsaaasdasdasddsaaasdasdasddsaaasdasdasddsaaasdasdasddsaaasdasdasddsaaasdasdasddsa';

    const isValid = users.isValidUsername(username);

    expect(isValid).toBeFalsy();
  });

  it('should fail missing username', () => {
    let username;

    const isValid = users.isValidUsername(username);

    expect(isValid).toBeFalsy();
  });

  it('should pass valid usernames', () => {
    const usernames = ['mock', '1234', 'corr4ct name with space', 'BIG LETTERS', '#@4543special'];

    usernames.forEach(username => {
      const isValid = users.isValidUsername(username);

      expect(isValid).toBeTruthy();
    });
  });
});

describe('password validator', () => {
  it('should fail too short password', () => {
    const password = 'abc';

    const isValid = users.isValidPassword(password);

    expect(isValid).toBeFalsy();
  });

  it('should fail too long password', () => {
    const password =
      'abssadaasasdasabssadaasasdasabssadaasasdasabssadaasasdasabssadaasasdasabssadaasasdasabssadaasasdasabssadaasasdasabssadaasasdas';

    const isValid = users.isValidPassword(password);

    expect(isValid).toBeFalsy();
  });

  it('should fail missing password', () => {
    let password;

    const isValid = users.isValidPassword(password);

    expect(isValid).toBeFalsy();
  });

  it('should pass valid passwords', () => {
    const password = ['mockz', '12345', 'corr4ct name with space', 'BIG LETTERS', '#@4543special'];

    password.forEach(password => {
      const isValid = users.isValidPassword(password);

      expect(isValid).toBeTruthy();
    });
  });
});

describe('users.post', async () => {
  let req;
  let res;

  beforeEach(async done => {
    req = mockReq({
      body: {
        username: 'new-mock-username',
        password: 'new-mock-password'
      }
    });

    res = mockRes();

    await users.post(req, res);
    return done();
  });

  it('should respond with status 200', () => {
    expect(res.receivedStatus).toEqual(200);
  });

  it('should respond with user details', () => {
    const { user } = res.receivedBody;

    expect(Array.isArray(user.roles)).toBeTruthy();
    expect(user.id).toBeDefined();
    expect(user.username).toBeDefined();
    expect(user.password).not.toBeDefined();
  });
});

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

describe('users.putUsername with non-existing user id', async () => {
  let req;
  let res;

  beforeEach(async done => {
    req = mockReq({
      params: {
        userId: 123
      },
      body: {
        username: 'mock-user-name'
      }
    });

    res = mockRes();

    await users.putUsername(req, res);
    return done();
  });

  it('should respond with status 404', () => {
    expect(res.receivedStatus).toEqual(404);
  });
});

describe('users.putUsername without providing username', async () => {
  let req;
  let res;

  beforeEach(async done => {
    req = mockReq({
      params: {
        userId: 1
      }
    });

    res = mockRes();

    await users.putUsername(req, res);
    return done();
  });

  it('should respond with status 400', () => {
    expect(res.receivedStatus).toEqual(400);
  });
});

describe('users.putPassword', async () => {
  let req;
  let res;

  beforeEach(async done => {
    req = mockReq({
      params: {
        userId: 1
      },
      body: {
        password: 'test-password'
      }
    });

    res = mockRes();

    await users.putPassword(req, res);
    return done();
  });

  it('should respond with status 200', () => {
    expect(res.receivedStatus).toEqual(200);
  });

  it('should respond with user details', () => {
    const { user } = res.receivedBody;
    expect(user.id).toBeDefined();
    expect(user.username).toBeDefined();
    expect(user.roles).toBeDefined();
  });
});

describe('users.putPassword without providing password', async () => {
  let req;
  let res;

  beforeEach(async done => {
    req = mockReq({
      params: {
        userId: 1
      }
    });

    res = mockRes();

    await users.putPassword(req, res);
    return done();
  });

  it('should respond with status 400', () => {
    expect(res.receivedStatus).toEqual(400);
  });
});

describe('users.putPassword with non-existing user id', async () => {
  let req;
  let res;

  beforeEach(async done => {
    req = mockReq({
      params: {
        userId: 123
      },
      body: {
        password: 'mock-password'
      }
    });

    res = mockRes();

    await users.putPassword(req, res);
    return done();
  });

  it('should respond with status 404', () => {
    expect(res.receivedStatus).toEqual(404);
  });
});

describe('users.delete', async () => {
  let req;
  let res;

  beforeEach(async done => {
    req = mockReq({
      params: {
        userId: 1
      }
    });

    res = mockRes();

    await users.delete(req, res);
    return done();
  });

  it('should respond with status 200', () => {
    expect(res.receivedStatus).toEqual(200);
  });
});

describe('users.delete with non-existing user id', async () => {
  let req;
  let res;

  beforeEach(async done => {
    req = mockReq({
      params: {
        userId: 123
      }
    });

    res = mockRes();

    await users.delete(req, res);
    return done();
  });

  it('should respond with status 404', () => {
    expect(res.receivedStatus).toEqual(404);
  });
});
