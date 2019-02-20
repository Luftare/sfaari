import mutations from './mutations';
import { mockSongs } from '../testUtils/mockData';
import { Song, State } from '../interfaces';

describe('mutations', () => {
  it('can receive songs', () => {
    const state: State = {
      songs: []
    };

    mutations.receiveSongs(state, { songs: mockSongs });

    expect(state.songs).toEqual(mockSongs);
  });
});
