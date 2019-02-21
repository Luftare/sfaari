import axios from 'axios';
import actions from './actions';
import { Song } from '../interfaces';
import { mockSongs } from '../testUtils/mockData';

jest.mock('axios', () => {
  return {
    get: jest.fn(() =>
      Promise.resolve({
        data: {
          songs: mockSongs
        }
      })
    )
  };
});

describe('requestAllSongs', () => {
  it('receives all songs from api', async () => {
    const context = {
      commit: jest.fn()
    };

    const response: any = await actions.requestAllSongs(context);

    expect(context.commit.mock.calls.length).toEqual(1);
    expect(context.commit.mock.calls[0][0]).toEqual('receiveSongs');
    expect(context.commit.mock.calls[0][1].songs).toEqual(mockSongs);
  });
});
