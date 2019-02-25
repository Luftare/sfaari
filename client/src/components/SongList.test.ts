import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import SongList from '@/components/SongList.vue';
import { Store } from 'vuex-mock-store';
import { mockSongs } from '../testUtils/mockData';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('SongList.vue', () => {
  let wrapper: any;
  let html: any;
  const store = new Store({
    state: {
      song: {
        songs: mockSongs
      }
    }
  });

  beforeEach(() => {
    wrapper = shallowMount(SongList, {
      mocks: {
        $store: store
      },
      localVue
    });

    html = wrapper.html();
  });

  it('should render without crashing', () => {
    expect(wrapper).toBeDefined();
  });

  it('should render all songs', () => {
    mockSongs.forEach(song => {
      expect(html).toContain(mockSongs[0].name);
    });
  });

  describe('when a song is clicked', () => {
    beforeEach(() => {
      wrapper.find('.song-list__song').trigger('click');
    });

    it('should select the song', () => {
      expect(store.dispatch).toHaveBeenCalled();
      expect(store.dispatch.mock.calls[0][0]).toEqual('song/selectSong');
      expect(store.dispatch.mock.calls[0][1]).toEqual({ song: mockSongs[0] });
    });
  });
});
