import Vuex from 'vuex';
import UploadSong from './UploadSong.vue';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import { Store } from 'vuex-mock-store';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('UploadSong.vue', () => {
  let wrapper: any;
  const store: any = new Store({
    state: {
      song: {}
    }
  });

  beforeEach(() => {
    wrapper = shallowMount(UploadSong, {
      mocks: {
        $store: store
      },
      localVue
    });
  });

  it('should render without crashing', () => {
    expect(wrapper).toBeDefined();
  });
});
