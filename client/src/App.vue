<template>
  <div id="app">
    <div class="header">
      <router-link class="header__link" to="/">Home</router-link>
      <router-link class="header__link" v-if="!loggedIn" to="/login">Login</router-link>
      <a
        v-if="loggedIn"
        class="header__link"
        @click.prevent="handleLogout"
        href="javascript:void(0)"
      >Logout</a>
    </div>
    <router-view></router-view>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State, Getter, Action, namespace } from 'vuex-class';

const userModule = namespace('user');

@Component
export default class App extends Vue {
  @userModule.Getter loggedIn!: any;
  @userModule.Action logout!: any;

  handleLogout() {
    this.logout();
  }
}
</script>
<style lang="scss">
.header {
  &__link {
    margin-right: 16px;
  }
}
</style>
