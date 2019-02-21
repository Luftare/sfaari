<template>
  <div id="app">
    <div>
      <router-link to="/">Home</router-link>
      <router-link v-if="!loggedIn" to="/login">Login</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State, Action, namespace } from 'vuex-class';

const userModule = namespace('user');

@Component
export default class App extends Vue {
  @userModule.State loggedIn!: any;
}
</script>
<style lang="scss">
</style>
