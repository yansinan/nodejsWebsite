<template>
  <div :id="nameMod+'-app'" class="manageMainOuter">
    <router-view />
  </div>
</template>
<script>
const nameMod="artist";

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
