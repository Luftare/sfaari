<template>
  <div class="login">
    <h1>login</h1>
    <form @submit.prevent="handleSubmit">
      <input v-model="username" placeholder="username" required>
      <input v-model="password" placeholder="password" type="password" required>
      <input type="submit">
    </form>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Model, Vue } from 'vue-property-decorator';
import { State, Action, Getter, namespace } from 'vuex-class';

const userModule = namespace('user');

@Component
export default class Login extends Vue {
  username: string = '';
  password: string = '';

  @userModule.Getter loggedIn!: any;
  @userModule.Action login!: any;

  handleSubmit() {
    const { username, password } = this;
    this.username = '';
    this.password = '';
    this.login({ username, password });
  }
}
</script>
<style lang="scss">
</style>