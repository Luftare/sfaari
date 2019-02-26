import Vuex from 'vuex';
import Login from './Login.vue';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import { Store } from 'vuex-mock-store';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('Login.vue', () => {
  let wrapper: any;
  let store: any;
  let router: any;

  beforeEach(() => {
    store = new Store({
      state: {
        user: {
          username: '',
          password: ''
        }
      }
    });

    router = {
      push: jest.fn()
    };

    wrapper = shallowMount(Login, {
      mocks: {
        $store: store,
        $router: router
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

    it('should login existing user', () => {
      expect(store.dispatch.mock.calls.length).toEqual(1);
      expect(store.dispatch.mock.calls[0][0]).toEqual('user/login');
      expect(store.dispatch.mock.calls[0][1]).toEqual({ username, password });
    });

    it('should navigate to home page', () => {
      expect(router.push.mock.calls.length).toEqual(1);
      expect(router.push.mock.calls[0][0]).toEqual('/');
    });
  });

  describe('when registering username and password', () => {
    const username = 'mockusername';
    const password = 'mockpassword';

    beforeEach(() => {
      const usernameInput = wrapper.find('.register__username');
      const passwordInput = wrapper.find('.register__password');
      const submitButton = wrapper.find('.register__submit');

      usernameInput.element.value = username;
      usernameInput.trigger('input');

      passwordInput.element.value = password;
      passwordInput.trigger('input');

      submitButton.trigger('submit');
    });

    it('should register new user', () => {
      expect(store.dispatch.mock.calls.length).toEqual(1);
      expect(store.dispatch.mock.calls[0][0]).toEqual('user/register');
      expect(store.dispatch.mock.calls[0][1]).toEqual({ username, password });
    });

    it('should navigate to home page', () => {
      expect(router.push.mock.calls.length).toEqual(1);
      expect(router.push.mock.calls[0][0]).toEqual('/');
    });
  });
});
