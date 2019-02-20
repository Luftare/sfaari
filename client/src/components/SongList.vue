<template>
  <div>
    <div v-bind:key="song.id" v-for="song in songs">{{song.name}}</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Song } from '../interfaces';

@Component
export default class SongList extends Vue {
  @Prop() private songs!: Song[];
}
</script>