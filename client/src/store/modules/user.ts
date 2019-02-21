import axios from 'axios';

export default {
  namespaced: true,
  state: {
    loggedIn: false
  },
  actions: {
    requestToken: async (context: any, { username, password }: { username: string; password: string }) => {
      const response: any = await axios.post('/api/login', {
        username,
        password
      });

      context.commit('receiveToken', { token: response.data.token });
    }
  },
  mutations: {}
};
