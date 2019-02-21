<template>
  <div class="songs">
    <h3>Songs:</h3>
    <div v-bind:key="song.id" v-for="song in songs">{{song.name}}</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State, Action } from 'vuex-class';
import { Song } from '../interfaces';

@Component
export default class SongList extends Vue {
  @State songs!: Song[];
  @Action requestAllSongs!: any;

  created() {
    this.requestAllSongs();
  }
}
</script>