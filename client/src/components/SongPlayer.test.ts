import Vuex from 'vuex';
import SongPlayer from './SongPlayer.vue';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import { mockSongs } from '../testUtils/mockData';
import { Song } from '@/interfaces';
import store from '../store';
import state from '../store/state';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('SongPlayer.vue', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = shallowMount(SongPlayer, {
      mocks: {
        $store: {
          ...store,
          state: {
            ...state,
            songs: mockSongs,
            selectedSong: null
          }
        }
      },
      localVue
    });
  });

  it('should render without crashing', () => {
    expect(wrapper).toBeDefined();
  });

  it('should contain audio element', () => {
    expect(wrapper.contains('audio')).toBeTruthy();
  });

  it('audio element should have controls', () => {
    const audioElement = wrapper.find('audio');

    expect(audioElement.attributes('controls')).toBeTruthy();
  });
});

describe('SongPlayer.vue when a song is selected', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = shallowMount(SongPlayer, {
      mocks: {
        $store: {
          ...store,
          state: {
            ...state,
            songs: mockSongs,
            selectedSong: mockSongs[0]
          }
        }
      },
      localVue
    });
  });

  it('should render without crashing', () => {
    expect(wrapper).toBeDefined();
  });

  it('should render selected song name', () => {
    expect(wrapper.html()).toContain(mockSongs[0].name);
  });

  it('should set audio element source to request select song endpoint', () => {
    const audioElement = wrapper.find('audio');

    expect(audioElement.attributes('src')).toEqual(`/api/songs/${mockSongs[0].id}/file`);
  });
});
