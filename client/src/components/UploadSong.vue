<template>
  <div class="upload-song">
    <input type="text" v-model="songName" placeholder="name" class="upload-song__song-name">
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
  formData: any = null;
  songName: string = 'Jotain';

  @songModule.Action uploadSong!: any;

  handleSubmit() {
    this.uploadSong({ data: this.formData, songName: this.songName });
  }

  handleFileChange(e: any) {
    const data = new FormData();
    data.append('songName', this.songName);
    data.append('song', e.target.files[0]);
    this.formData = data;
  }
}
</script>