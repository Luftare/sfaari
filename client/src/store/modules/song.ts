import axios from 'axios';
import { Song } from '../../interfaces';

export default {
  namespaced: true,
  state: {
    songs: [],
    selectedSong: null
  },
  actions: {
    requestAllSongs: async (context: any) => {
      const response: any = await axios.get('/api/songs');
      const songs: Song[] = response.data.songs;

      context.commit('receiveSongs', { songs });
    },

    selectSong: (context: any, payload: any) => {
      context.commit('selectSong', payload.song);
    }
  },
  mutations: {
    receiveSongs: (state: any, payload: any) => {
      state.songs = payload.songs;
    },

    selectSong: (state: any, song: Song) => {
      state.selectedSong = song;
    }
  }
};
