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

  it('should display display login link if user is not logged in', () => {
    const wrapper = shallowMount(App, {
      store,
      router,
      localVue
    });

    expect(wrapper.html()).toContain('login');
  });

  it('should not display display login link if user is logged in', () => {
    console.log(store.state.user.loggedIn);
    const wrapper = shallowMount(App, {
      router,
      store,
      localVue
    });

    store.state.user.loggedIn = true;

    expect(wrapper.html()).not.toContain('login');
  });
});
