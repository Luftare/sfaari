import Vuex from 'vuex';
import Login from './Login.vue';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import store from '../store';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('Login.vue', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = shallowMount(Login, {
      store,
      localVue
    });
  });

  it('should render without crashing', () => {
    expect(wrapper).toBeDefined();
  });
});
