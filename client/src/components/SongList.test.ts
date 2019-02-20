import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import SongList from '@/components/SongList.vue';
import { Song } from '@/interfaces';
import { mockSongs } from '../testUtils/mockData';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('SongList.vue', () => {
  it('renders all song names', () => {
    const songs: Song[] = mockSongs;

    const wrapper = shallowMount(SongList, {
      mocks: {
        $store: {
          state: {
            songs: mockSongs
          }
        }
      },
      localVue
    });

    const html = wrapper.html();

    songs.forEach((song: Song) => {
      expect(html).toContain(song.name);
    });
  });
});
