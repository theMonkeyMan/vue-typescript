<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import * as Vue from 'vue';
import Component from 'vue-class-component';
@Component({
  props:{
    
  }
})
export default class App extends Vue {
  name: 'app'
}
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
