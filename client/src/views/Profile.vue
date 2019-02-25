<template>
  <div class="profile">
    <UploadSong/>
    <SongList v-bind:userId="id"/>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import SongList from '../components/SongList.vue';
import UploadSong from '../components/UploadSong.vue';
import { State, Getter, Action, namespace } from 'vuex-class';

const userModule = namespace('user');

@Component({
  components: {
    SongList,
    UploadSong
  }
})
export default class Home extends Vue {
  @userModule.State id!: any;
}
</script>