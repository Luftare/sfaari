import { Song, State } from '../interfaces';

export default {
  receiveSongs: (state: State, { songs }: { songs: Song[] }) => {
    state.songs = songs;
  }
};
