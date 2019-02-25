import axios from 'axios';
import { UserState } from './user';

export interface UserState {
  token: string;
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

      context.commit('receiveToken', response.data);
    }
  },
  mutations: {
    receiveToken: (state: UserState, { token }: any) => {
      state.token = token;
    }
  }
};
