import axios from 'axios';
import Vue from 'vue';
import { UserState } from './user';

export interface UserState {
  token: string;
  id: any;
  username: string;
  roles: any[];
}

export interface Credentials {
  username: string;
  password: string;
}

export default {
  namespaced: true,
  state: {
    token: ''
  },
  getters: {
    loggedIn: ({ token }: UserState) => {
      return !!token;
    }
  },
  actions: {
    login: async (context: any, { username, password }: Credentials) => {
      const response: any = await axios.post('/api/login', {
        username,
        password
      });

      context.commit('receiveUserDetails', {
        token: response.data.token,
        id: response.data.user.id,
        roles: response.data.user.roles,
        username: response.data.user.username
      });
    },
    resumeSession: (context: any, details: UserState) => {
      context.commit('receiveUserDetails', details);
    },
    logout: (context: any) => {
      context.commit('receiveUserDetails', {
        token: '',
        id: null,
        username: '',
        roles: []
      });
    }
  },
  mutations: {
    receiveUserDetails: (state: UserState, details: UserState) => {
      Vue.set(state, 'token', details.token);
      Vue.set(state, 'id', details.id);
      Vue.set(state, 'username', details.username);
      Vue.set(state, 'id', details.id);
      Vue.set(state, 'roles', details.roles);
    }
  }
};
