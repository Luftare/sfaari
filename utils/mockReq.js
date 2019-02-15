function mockReq({ headers = {}, params = {}, body = {} }) {
  return {
    headers,
    params,
    body
  };
}

const mockJson = () => null;

function mockRes() {
  const res = {
    receivedStatus: 200,
    receivedBody: {},
    status: statusNum => {
      res.receivedStatus = statusNum;
      return {
        json: body => {
          res.receivedBody = body;
        }
      };
    },
    json: body => {
      res.receivedBody = body;
    }
  };

  return res;
}

function mockNext() {}

function mockTokenPayload() {
  return {
    roles: [],
    id: 5
  };
}

module.exports = {
  mockReq,
  mockRes,
  mockJson,
  mockNext,
  mockTokenPayload
};
