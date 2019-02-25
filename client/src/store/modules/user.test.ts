import user from './user';

jest.mock('axios', () => {
  return {
    post: jest.fn(() =>
      Promise.resolve({
        data: {
          token: 'mocktoken',
          id: 1
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
    expect(context.commit.mock.calls[0][0]).toEqual('receiveToken');
    expect(context.commit.mock.calls[0][1].token).toEqual('mocktoken');
    expect(context.commit.mock.calls[0][1].id).toBeDefined();
  });

  it('should logout', async () => {
    const context = {
      commit: jest.fn()
    };

    user.actions.logout(context);

    expect(context.commit.mock.calls.length).toEqual(1);
    expect(context.commit.mock.calls[0][0]).toEqual('receiveToken');
    expect(context.commit.mock.calls[0][1].token).toEqual('');
  });
});

describe('user module mutation', () => {
  it('should receive a token', async () => {
    const state = {
      token: ''
    };

    const token = 'mocktoken';

    user.mutations.receiveToken(state, { token });

    expect(state.token).toEqual('mocktoken');
  });
});

describe('user module getter', () => {
  it('should return login status', () => {
    const stateWithEmptyToken = {
      token: ''
    };

    const stateWithToken = {
      token: 'mocktoken'
    };

    const userLoggedIn = user.getters.loggedIn(stateWithEmptyToken);
    const userLoggedInWithToken = user.getters.loggedIn(stateWithToken);

    expect(userLoggedInWithToken).toBeTruthy();
    expect(userLoggedIn).toBeFalsy();
  });
});
