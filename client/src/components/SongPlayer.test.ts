import Vuex from 'vuex';
import SongPlayer from './SongPlayer.vue';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import { Store } from 'vuex-mock-store';
import { mockSongs } from '../testUtils/mockData';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('SongPlayer.vue', () => {
  let wrapper: any;
  const store: any = new Store({
    state: {
      song: {
        selectedSong: mockSongs[0],
        songs: mockSongs
      }
    }
  });

  beforeEach(() => {
    wrapper = shallowMount(SongPlayer, {
      mocks: {
        $store: store
      },
      localVue
    });
  });

  it('should render without crashing', () => {
    expect(wrapper).toBeDefined();
  });

  it('should render selected song name', () => {
    expect(wrapper.find('.song-player__song-name').html()).toContain(mockSongs[0].name);
  });
});
