import songModule from './song';
import { mockSongs } from '../../testUtils/mockData';

jest.mock('axios', () => {
  return {
    get: jest.fn(() =>
      Promise.resolve({
        data: {
          songs: mockSongs
        }
      })
    ),
    delete: jest.fn(() =>
      Promise.resolve({
        data: {
          songs: mockSongs.filter(song => song.id !== mockSongs[0].id)
        }
      })
    ),
    post: jest.fn(() =>
      Promise.resolve({
        data: {
          songs: [...mockSongs, { name: 'New mock', id: 4, userId: 1, fileName: 'mok.mp3' }]
        }
      })
    )
  };
});

describe('song module action', () => {
  it('should receive all songs from api', async () => {
    const context = {
      commit: jest.fn()
    };

    await songModule.actions.requestAllSongs(context);

    expect(context.commit.mock.calls.length).toEqual(1);
    expect(context.commit.mock.calls[0][0]).toEqual('receiveSongs');
    expect(context.commit.mock.calls[0][1].songs).toEqual(mockSongs);
  });

  it('should select a song', () => {
    const context = {
      commit: jest.fn()
    };
    const song = mockSongs[1];

    songModule.actions.selectSong(context, { song });

    expect(context.commit.mock.calls.length).toEqual(1);
    expect(context.commit.mock.calls[0][0]).toEqual('selectSong');
    expect(context.commit.mock.calls[0][1]).toEqual(song);
  });

  it('should upload a song', async () => {
    const context = {
      commit: jest.fn(),
      rootState: {
        user: {
          token: 'mocktoken'
        }
      }
    };
    const song = mockSongs[1];
    const expectedSongs = [...mockSongs, { name: 'New mock', id: 4, userId: 1, fileName: 'mok.mp3' }];
    const data = {};

    await songModule.actions.uploadSong(context, { song, data });

    expect(context.commit.mock.calls.length).toEqual(1);
    expect(context.commit.mock.calls[0][0]).toEqual('receiveSongs');
    expect(context.commit.mock.calls[0][1].songs).toEqual(expectedSongs);
  });

  it('should delete a song', async () => {
    const context = {
      commit: jest.fn()
    };
    const song = mockSongs[1];
    const expectedSongs = mockSongs.filter(song => song.id !== mockSongs[0].id);

    await songModule.actions.deleteSong(context, { song });

    expect(context.commit.mock.calls.length).toEqual(1);
    expect(context.commit.mock.calls[0][0]).toEqual('receiveSongs');
    expect(context.commit.mock.calls[0][1].songs).toEqual(expectedSongs);
  });
});

describe('song module mutation', () => {
  it('should receive songs', () => {
    const state: any = {
      songs: []
    };

    songModule.mutations.receiveSongs(state, { songs: mockSongs });

    expect(state.songs).toEqual(mockSongs);
  });

  it('should select a song', () => {
    const state: any = {
      selectedSong: null
    };
    const song = mockSongs[1];

    songModule.mutations.selectSong(state, song);

    expect(state.selectedSong).toEqual(song);
  });
});
