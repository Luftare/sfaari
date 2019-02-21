import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import SongList from '@/components/SongList.vue';
import { Song } from '@/interfaces';
import { mockSongs } from '../testUtils/mockData';
import store from '../store';
import actions from '../store/actions';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('SongList.vue', () => {
  it('should render all song names', () => {
    const songs: Song[] = mockSongs;
    const mockDispatch = jest.fn();

    const wrapper = shallowMount(SongList, {
      mocks: {
        $store: {
          ...store,
          state: {
            songs: mockSongs
          },
          dispatch: mockDispatch
        }
      },
      localVue
    });

    const html = wrapper.html();

    songs.forEach((song: Song) => {
      expect(html).toContain(song.name);
    });
  });

  it('should refresh store songs when created', () => {
    const songs: Song[] = mockSongs;
    const mockDispatch = jest.fn();

    const wrapper = shallowMount(SongList, {
      mocks: {
        $store: {
          ...store,
          state: {
            songs: mockSongs
          },
          dispatch: mockDispatch
        }
      },
      localVue
    });

    expect(mockDispatch.mock.calls.length).toEqual(1);
    expect(mockDispatch.mock.calls[0][0]).toEqual('requestAllSongs');
  });
});
