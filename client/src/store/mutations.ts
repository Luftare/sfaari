import { Song } from '../interfaces';

export default {
  receiveSongs: (state: any, payload: any) => {
    state.songs = payload.songs;
  }
};
