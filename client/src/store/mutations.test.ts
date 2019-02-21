import mutations from './mutations';
import { mockSongs } from '../testUtils/mockData';
import { Song } from '../interfaces';

describe('mutations', () => {
  it('can receive songs', () => {
    const state: any = {
      songs: []
    };

    mutations.receiveSongs(state, { songs: mockSongs });

    expect(state.songs).toEqual(mockSongs);
  });
});
