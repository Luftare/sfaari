require('dotenv').config({ path: './.test-env' });
const verifyToken = require('./verifyToken');
const jwt = require('jsonwebtoken');

const { mockReq, mockRes, mockJson, mockNext, mockTokenPayload } = require('../utils/mockReq');

function getToken(payload = { mock: 'mock' }) {
  return jwt.sign(payload, process.env.SECRET, {
    expiresIn: '1h'
  });
}

describe('Verify token', () => {
  describe('when valid token is provided', () => {
    let req;
    let res;
    let next;
    let tokenPayload;

    beforeEach(() => {
      tokenPayload = { mock: 'mock payload' };
      req = mockReq({
        headers: {
          authorization: getToken(tokenPayload)
        }
      });
      res = mockRes();
      next = jest.fn();

      verifyToken.hasValidToken(req, res, next);
    });

    it('should not set status', () => {
      expect(res.receivedStatus).not.toBeDefined();
    });

    it('should call next', () => {
      expect(next.mock.calls.length).toEqual(1);
    });

    it('should add token payload to the request object', () => {
      expect(req.tokenPayload.mock).toEqual(tokenPayload.mock);
    });
  });

  describe('when invalid token is provided', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
      req = mockReq({
        headers: {
          authorization: 'falsytoken'
        }
      });
      res = mockRes();
      next = jest.fn();

      verifyToken.hasValidToken(req, res, next);
    });

    it('should respond with status 403', () => {
      expect(res.receivedStatus).toEqual(403);
    });

    it('should not call next', () => {
      expect(next.mock.calls.length).toEqual(0);
    });
  });

  describe('when no token is provided', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
      req = mockReq({});
      res = mockRes();
      next = jest.fn();

      verifyToken.hasValidToken(req, res, next);
    });

    it('should respond with status 403', () => {
      expect(res.receivedStatus).toEqual(403);
    });

    it('should not call next', () => {
      expect(next.mock.calls.length).toEqual(0);
    });
  });
});

describe('Own user id', () => {
  describe('when requesting with own user id', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
      req = mockReq({
        params: {
          userId: '55'
        }
      });

      req.tokenPayload = {
        id: 55
      };

      res = mockRes();
      next = jest.fn();

      verifyToken.ownUserId(req, res, next);
    });

    it('should call next', () => {
      expect(next.mock.calls.length).toEqual(1);
    });
  });

  describe('when requesting with other user id', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
      req = mockReq({
        params: {
          userId: '55'
        }
      });

      req.tokenPayload = {
        id: 56
      };

      res = mockRes();
      next = jest.fn();

      verifyToken.ownUserId(req, res, next);
    });

    it('should not call next', () => {
      expect(next.mock.calls.length).toEqual(0);
    });

    it('should respond with status 403', () => {
      expect(res.receivedStatus).toEqual(403);
    });
  });
});

describe('Has roles', () => {
  describe('when required roles are provided', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
      req = mockReq({});

      req.tokenPayload = {
        roles: ['mock role']
      };

      res = mockRes();
      next = jest.fn();

      verifyToken.hasRoles(['mock role'])(req, res, next);
    });

    it('should call next', () => {
      expect(next.mock.calls.length).toEqual(1);
    });
  });

  describe('when a required role is missing', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
      req = mockReq({});

      req.tokenPayload = {
        roles: ['mock role', 'another role']
      };

      res = mockRes();
      next = jest.fn();

      verifyToken.hasRoles(['mock role', 'another mock role'])(req, res, next);
    });

    it('should not call next', () => {
      expect(next.mock.calls.length).toEqual(0);
    });

    it('should respond with status 403', () => {
      expect(res.receivedStatus).toEqual(403);
    });
  });
});
