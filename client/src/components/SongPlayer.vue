<template>
  <div class="song-player">
    <h4>{{songName}}</h4>
    <audio v-bind:src="songFileEndpointUrl" controls></audio>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { Song } from '../interfaces';

@Component
export default class SongList extends Vue {
  @State selectedSong!: any;

  get songFileEndpointUrl() {
    return this.selectedSong ? `/api/songs/${this.selectedSong.id}/file` : '';
  }

  get songName() {
    return this.selectedSong ? this.selectedSong.name : '';
  }
}
</script>