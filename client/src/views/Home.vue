<template>
  <div class="home">
    <SongList/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import SongList from '../components/SongList.vue';

@Component({
  components: {
    SongList
  }
})
export default class Home extends Vue {}
</script>
