import Vuex from 'vuex';
import Profile from './Profile.vue';
import { Store } from 'vuex-mock-store';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import store from '../store';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('Profile.vue', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = shallowMount(Profile, {
      store,
      localVue
    });
  });

  it('should render without crashing', () => {
    expect(wrapper).toBeDefined();
  });
});
