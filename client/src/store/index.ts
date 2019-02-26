import Vue from 'vue';
import Vuex from 'vuex';

import modules from './modules';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules,
  plugins: [
    function persistToken(store: any) {
      store.subscribe((mutation: any) => {
        if (mutation.type === 'user/receiveUserDetails') {
          localStorage.setItem('jwt-token', mutation.payload.token);
        }
      });
    }
  ]
});
