<template>
  <div class="login">
    <h1>login</h1>
    <form @submit.prevent="handleLogin">
      <input v-model="loginUsername" placeholder="username" class="login__username" required>
      <input
        v-model="loginPassword"
        placeholder="password"
        type="password"
        class="login__password"
        required
      >
      <input type="submit" class="login__submit">
    </form>
    <h1>register</h1>
    <form @submit.prevent="handleRegister">
      <input v-model="registerUsername" placeholder="username" class="register__username" required>
      <input
        v-model="registerPassword"
        placeholder="password"
        type="password"
        class="register__password"
        required
      >
      <input type="submit" class="register__submit">
    </form>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Model, Vue } from 'vue-property-decorator';
import { Action, namespace } from 'vuex-class';

const userModule = namespace('user');

@Component
export default class Login extends Vue {
  loginUsername: string = '';
  loginPassword: string = '';
  registerUsername: string = '';
  registerPassword: string = '';

  @userModule.Action login!: any;
  @userModule.Action register!: any;

  handleLogin() {
    const { loginUsername, loginPassword } = this;
    this.loginUsername = '';
    this.loginPassword = '';
    this.login({ username: loginUsername, password: loginPassword });
    this.$router.push('/');
  }

  handleRegister() {
    const { registerUsername, registerPassword } = this;
    this.registerUsername = '';
    this.registerPassword = '';
    this.register({ username: registerUsername, password: registerPassword });
    this.$router.push('/');
  }
}
</script>
<style lang="scss">
</style>