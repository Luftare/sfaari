import axios from 'axios';
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

      context.commit('receiveUserDetails', response.data);
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
      state.token = details.token;
      state.username = details.username;
      state.id = details.id;
      state.roles = details.roles;
    }
  }
};
