import Vuex from 'vuex';
import Login from './Login.vue';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import { Store } from 'vuex-mock-store';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('Login.vue', () => {
  let wrapper: any;
  const store: any = new Store({
    state: {
      user: {
        username: '',
        password: ''
      }
    }
  });

  beforeEach(() => {
    wrapper = shallowMount(Login, {
      mocks: {
        $store: store
      },
      localVue
    });
  });

  it('should render without crashing', () => {
    expect(wrapper).toBeDefined();
  });

  describe('when submitting username and password', () => {
    const username = 'mockusername';
    const password = 'mockpassword';
    beforeEach(() => {
      const usernameInput = wrapper.find('.login__username');
      const passwordInput = wrapper.find('.login__password');
      const submitButton = wrapper.find('.login__submit');

      usernameInput.element.value = username;
      usernameInput.trigger('input');

      passwordInput.element.value = password;
      passwordInput.trigger('input');

      submitButton.trigger('submit');
    });

    it('should login', () => {
      expect(store.dispatch.mock.calls.length).toEqual(1);
      expect(store.dispatch.mock.calls[0][0]).toEqual('user/login');
      expect(store.dispatch.mock.calls[0][1]).toEqual({ username, password });
    });
  });
});
