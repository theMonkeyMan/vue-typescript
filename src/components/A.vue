<template>
  <div>
      <input v-model="name"></input>
      <router-link to="/hello">
        <button>turn</button>
      </router-link>
  </div>
</template>
<script lang="ts">
import * as Vue from 'vue';
import Component from 'vue-class-component';
@Component({
  props:{
  }
})
export default class A extends Vue {
    name:string="richard";
}
</script>
<style lang='less' rel="stylesheet/less">
</style>

