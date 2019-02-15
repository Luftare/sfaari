require('dotenv').config({ path: './.test-env' });
const { mockReq, mockRes, mockJson, mockTokenPayload } = require('../utils/mockReq');
const mockDataAccessObject = require('../utils/mockDataAccessObject');
const parseTokenPayload = require('../utils/parseTokenPayload');
const login = require('./login');

jest.mock('../dataAccessObject', () => mockDataAccessObject);

describe('login.post', () => {
  describe('when valid credentials are provided', () => {
    let req;
    let res;

    beforeEach(async done => {
      req = mockReq({
        body: {
          username: 'correct-mock-username',
          password: 'correct-mock-password'
        }
      });

      res = mockRes();

      await login.post(req, res);
      done();
    });

    it('should respond with status 200', () => {
      expect(res.receivedStatus).toEqual(200);
    });

    it('should respond with a token', () => {
      expect(res.receivedBody.token).toBeDefined();
    });

    it('should respond with user details', () => {
      const { user } = res.receivedBody;
      expect(user.username).toBeDefined();
      expect(user.id).toBeDefined();
      expect(Array.isArray(user.roles)).toBeTruthy();
    });

    describe('when token payload is decoded', () => {
      let token;
      let decodedPayload;

      beforeEach(() => {
        token = res.receivedBody.token;
        decodedPayload = parseTokenPayload(token);
      });

      it('should contain user id', () => {
        expect(decodedPayload.id).toBeDefined();
      });

      it('should contain list of user roles', () => {
        expect(Array.isArray(decodedPayload.roles)).toBeTruthy();
      });

      it('should contain user username', () => {
        expect(decodedPayload.username).toBeDefined();
      });
    });
  });

  describe('when invalid credentials are provided', () => {
    let req;
    let res;

    beforeEach(async done => {
      req = mockReq({
        body: {
          username: 'wrong-mock-username',
          password: 'wrong-mock-password'
        }
      });

      res = mockRes();

      await login.post(req, res);
      done();
    });

    it('should respond with status 403', () => {
      expect(res.receivedStatus).toEqual(403);
    });

    it('should not respond with token', () => {
      expect(res.receivedBody.token).not.toBeDefined();
    });
  });

  describe('when no credentials are provided', () => {
    let req;
    let res;

    beforeEach(async done => {
      req = mockReq({});

      res = mockRes();

      await login.post(req, res);
      done();
    });

    it('should respond with status 400', () => {
      expect(res.receivedStatus).toEqual(400);
    });

    it('should not respond with token', () => {
      expect(res.receivedBody.token).not.toBeDefined();
    });
  });
});
