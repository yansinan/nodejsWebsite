<template>
  <div class="dash-box">
    <h2 class="dash-title">乐队</h2>
     <div class="user-list">
       <ul>
         <li v-for="artist in listArtists" :key="artist.id">
           <random-avatar :user="artist"/>
           <label for="">{{artist.name}}</label>
         </li>
       </ul>
     </div>
  </div>
</template>

<script>
import RandomAvatar from "@/components/RandomAvatar";

export default {
  props: ["listArtists"],
  filters: {},
  components: {
    RandomAvatar
  },
  data() {
    return {
      list: null
    };
  }
};
</script>
<style lang="scss">
.user-list {
  padding: 0;
  ul {
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    @media only screen and (min-width: 768px) {
      grid-template-columns: 1fr 1fr 1fr;
    }
    li {
      display: block;
      position: relative;
      width: 100%;
      border-bottom: 1px solid #eee;
      padding: 15px;

      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;

      label {
        height: 40px;
        line-height: 40px;
        margin-left: 50px;
      }
    }
  }
}
</style>
