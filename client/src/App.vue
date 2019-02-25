<template>
  <div id="app">
    <div class="header">
      <router-link class="header__link" to="/">Home</router-link>
      <router-link class="header__link" v-if="!loggedIn" to="/login">Login</router-link>
      <router-link v-if="loggedIn" class="header__link" to="/profile">Profile</router-link>
      <a
        v-if="loggedIn"
        class="header__link"
        @click.prevent="logout"
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
const songModule = namespace('song');

@Component
export default class App extends Vue {
  @userModule.Getter loggedIn!: any;
  @userModule.Action logout!: any;
  @songModule.Action requestAllSongs!: any;

  created() {
    this.requestAllSongs();
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
