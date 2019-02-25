import user from './user';

jest.mock('axios', () => {
  return {
    post: jest.fn(() =>
      Promise.resolve({
        data: {
          token: 'mocktoken',
          id: 1,
          roles: [],
          username: 'mockname'
        }
      })
    )
  };
});

describe('user module action', () => {
  it('should login', async () => {
    const context = {
      commit: jest.fn()
    };
    const username = 'mockname';
    const password = 'mockpassword';

    await user.actions.login(context, { username, password });

    expect(context.commit.mock.calls.length).toEqual(1);
    expect(context.commit.mock.calls[0][0]).toEqual('receiveUserDetails');
    expect(context.commit.mock.calls[0][1].token).toEqual('mocktoken');
    expect(context.commit.mock.calls[0][1].username).toEqual('mockname');
    expect(context.commit.mock.calls[0][1].id).toBeDefined();
    expect(Array.isArray(context.commit.mock.calls[0][1].roles)).toBeTruthy();
  });

  it('should logout', async () => {
    const context = {
      commit: jest.fn()
    };

    const expectedUserDetails = {
      token: '',
      id: null,
      username: '',
      roles: []
    };

    user.actions.logout(context);

    expect(context.commit.mock.calls.length).toEqual(1);
    expect(context.commit.mock.calls[0][0]).toEqual('receiveUserDetails');
    expect(context.commit.mock.calls[0][1]).toEqual(expectedUserDetails);
  });
});

describe('user module mutation', () => {
  it('should receive user details', async () => {
    const state = {
      token: '',
      id: null,
      username: '',
      roles: []
    };

    const userDetails = {
      token: 'mocktoken',
      username: 'mockuser',
      id: 1,
      roles: []
    };

    user.mutations.receiveUserDetails(state, userDetails);

    expect(state).toEqual(userDetails);
  });
});

describe('user module getter', () => {
  it('should return login status', () => {
    const stateWithEmptyToken = {
      token: '',
      id: null,
      username: '',
      roles: []
    };

    const stateWithToken = {
      token: 'mocktoken',
      id: 1,
      username: 'mock',
      roles: []
    };

    const userLoggedIn = user.getters.loggedIn(stateWithEmptyToken);
    const userLoggedInWithToken = user.getters.loggedIn(stateWithToken);

    expect(userLoggedInWithToken).toBeTruthy();
    expect(userLoggedIn).toBeFalsy();
  });
});
