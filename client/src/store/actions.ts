import { Song } from '../interfaces';
import axios from 'axios';

export default {
  requestAllSongs: async (context: any) => {
    const response: any = await axios.get('/api/songs');
    const songs: Song[] = response.data.songs;

    context.commit('receiveSongs', { songs });
  },

  selectSong: (context: any, payload: any) => {
    context.commit('selectSong', payload.song);
  }
};
