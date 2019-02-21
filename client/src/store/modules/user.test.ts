import user from './user';

jest.mock('axios', () => {
  return {
    post: jest.fn(() =>
      Promise.resolve({
        data: {
          token: 'mocktoken'
        }
      })
    )
  };
});

describe('user module actions', () => {
  it('should receive token', async () => {
    const context = {
      commit: jest.fn()
    };
    const username = 'mockname';
    const password = 'mockpassword';

    await user.actions.requestToken(context, { username, password });

    expect(context.commit.mock.calls.length).toEqual(1);
    expect(context.commit.mock.calls[0][0]).toEqual('receiveToken');
    expect(context.commit.mock.calls[0][1].token).toEqual('mocktoken');
  });
});
