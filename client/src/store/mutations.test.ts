import mutations from './mutations';
import { mockSongs } from '../testUtils/mockData';
import { Song } from '../interfaces';

describe('mutations', () => {
  it('should receive songs', () => {
    const state: any = {
      songs: []
    };

    mutations.receiveSongs(state, { songs: mockSongs });

    expect(state.songs).toEqual(mockSongs);
  });

  it('should select a song', () => {
    const state: any = {
      selectedSong: null
    };
    const song = mockSongs[1];

    mutations.selectSong(state, song);

    expect(state.selectedSong).toEqual(song);
  });
});
