<template>
  <div class="home">
    <SongList/>
    <SongPlayer/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import SongList from '../components/SongList.vue';
import SongPlayer from '../components/SongPlayer.vue';

@Component({
  components: {
    SongList,
    SongPlayer
  }
})
export default class Home extends Vue {}
</script>
