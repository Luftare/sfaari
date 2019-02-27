<template>
  <div class="home">
    <h4>All songs:</h4>
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
