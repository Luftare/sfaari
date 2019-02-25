<template>
  <div id="app">
    <div>
      <router-link to="/">Home</router-link>
      <router-link v-if="!loggedIn" to="/login">Login</router-link>
      <a v-if="loggedIn">Logout</a>
    </div>
    <router-view></router-view>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State, Getter, namespace } from 'vuex-class';

const userModule = namespace('user');

@Component
export default class App extends Vue {
  @userModule.Getter loggedIn!: any;
}
</script>
<style lang="scss">
</style>
