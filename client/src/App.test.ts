import Vuex from 'vuex';
import App from './App.vue';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import { mockSongs } from './testUtils/mockData';
import { Song } from '@/interfaces';
import store from './store';
import router from './router';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('App.vue', () => {
  it('should render without crashing', () => {
    const wrapper = shallowMount(App, { store, router, localVue });
  });
});
