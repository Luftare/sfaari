<template>
  <div class="song-list">
    <h3>Songs:</h3>
    <div
      class="song"
      v-bind:key="song.id"
      v-for="song in filteredSongs"
      @click="selectSong({ song })"
    >
      {{song.name}}
      <a
        href="javascript:void(0)"
        class="song__delete"
        @click.stop="deleteSong({ song })"
      >Delete</a>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State, Action, namespace } from 'vuex-class';
import { Song } from '../interfaces';

const songModule = namespace('song');

@Component
export default class SongList extends Vue {
  @songModule.State songs!: Song[];
  @songModule.Action selectSong!: any;
  @songModule.Action deleteSong!: any;
  @Prop({ default: null }) userId!: any;

  get filteredSongs() {
    if (this.userId === null) return this.songs;
    return this.songs.filter(song => song.userId === this.userId);
  }
}
</script>