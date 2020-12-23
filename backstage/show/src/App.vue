<template>
  <div :id="nameMod+'-app'" class=“vue-app”>
    <router-view />
  </div>
</template>
<script>
import '@/set-public-path'

export default {
  data() {
    return {
      nameMod:nameMod,
    };
  },
  components: {}
};
</script>
<style>
</style>
