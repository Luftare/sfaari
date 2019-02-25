<template>
  <div class="song-player">
    <h4 class="song-player__song-name">{{songName}}</h4>
    <audio v-bind:src="songFileEndpointUrl" controls></audio>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State, namespace } from 'vuex-class';
import { Song } from '../interfaces';

const songModule = namespace('song');

@Component
export default class SongList extends Vue {
  @songModule.State selectedSong!: any;

  get songFileEndpointUrl() {
    return this.selectedSong ? `/api/songs/${this.selectedSong.id}/file` : '';
  }

  get songName() {
    return this.selectedSong ? this.selectedSong.name : '';
  }
}
</script>