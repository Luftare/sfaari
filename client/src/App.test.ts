import Vuex from 'vuex';
import App from './App.vue';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import { mockSongs } from './testUtils/mockData';
import { Song } from '@/interfaces';
import store from './store';
import state from './store/state';
import router from './router';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('App.vue', () => {
  it('should render without crashing', () => {
    const wrapper = shallowMount(App, { store, router, localVue });
  });

  // it('should display display login link if user is not logged in', () => {
  //   const wrapper = shallowMount(App, {
  //     store,
  //     router,
  //     localVue
  //   });

  //   expect(wrapper.html()).toContain('Login');
  //   expect(wrapper.html()).not.toContain('Logout');
  // });

  // it('should not display display login link if user is logged in', () => {
  //   const wrapper = shallowMount(App, {
  //     router,
  //     store,
  //     localVue
  //   });

  //   store.state.user.token = 'mocktoken';

  //   expect(wrapper.html()).not.toContain('Login');
  //   expect(wrapper.html()).toContain('Logout');
  // });
});
