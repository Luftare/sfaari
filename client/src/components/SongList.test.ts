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
      expect(html).toContain(song.name);
    });
  });

  describe('when a song is clicked', () => {
    beforeEach(() => {
      wrapper.find('.song').trigger('click');
    });

    it('should select the song', () => {
      expect(store.dispatch).toHaveBeenCalled();
      expect(store.dispatch.mock.calls[0][0]).toEqual('song/selectSong');
      expect(store.dispatch.mock.calls[0][1]).toEqual({ song: mockSongs[0] });
    });
  });
});

describe('SongList.vue with user songs and edit mode', () => {
  let wrapper: any;
  let html: any;
  let store: any;

  beforeEach(() => {
    store = new Store({
      state: {
        song: {
          songs: mockSongs
        }
      }
    });

    wrapper = shallowMount(SongList, {
      propsData: {
        userId: 1,
        edit: true
      },
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

  it('should render songs filtered by user', () => {
    mockSongs
      .filter(song => song.userId === 1)
      .forEach(song => {
        expect(html).toContain(song.name);
      });
  });

  it('should not render other user songs', () => {
    mockSongs
      .filter(song => song.userId === 2)
      .forEach(song => {
        expect(html).not.toContain(song.name);
      });
  });

  it('should have delete buttons', () => {
    const deleteSongElements = wrapper.findAll('.song__delete');
    expect(deleteSongElements.length).toEqual(2);
  });

  describe('when a song is clicked', () => {
    beforeEach(() => {
      wrapper.find('.song').trigger('click');
    });

    it('should select the song', () => {
      expect(store.dispatch).toHaveBeenCalled();
      expect(store.dispatch.mock.calls[0][0]).toEqual('song/selectSong');
      expect(store.dispatch.mock.calls[0][1]).toEqual({ song: mockSongs[0] });
    });
  });

  describe('when delete song is clicked', () => {
    beforeEach(() => {
      wrapper.find('.song__delete').trigger('click');
    });

    it('should delete the song', () => {
      expect(store.dispatch.mock.calls.length).toEqual(1);
      expect(store.dispatch.mock.calls[0][0]).toEqual('song/deleteSong');
      expect(store.dispatch.mock.calls[0][1]).toEqual({ song: mockSongs[0] });
    });
  });
});
