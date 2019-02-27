<template>
  <div class="upload-song">
    <input
      type="text"
      v-model="songName"
      placeholder="name"
      class="upload-song__song-name"
      required
    >
    <input type="file" @change="handleFileChange" class="upload-song__select-file" required>
    <button class="upload-song__submit" @click.prevent="handleSubmit">Submit</button>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State, Action, namespace } from 'vuex-class';

const songModule = namespace('song');

@Component
export default class SongList extends Vue {
  songName: string = '';
  file: any = null;

  @songModule.Action uploadSong!: any;

  handleSubmit() {
    const data = new FormData();
    data.append('song', this.file);
    data.append('songName', this.songName);
    this.uploadSong({ data, songName: this.songName });
  }

  handleFileChange(e: any) {
    this.file = e.target.files[0];
  }
}
</script>