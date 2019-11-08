<template>
  <div class="content">
    <DirectUser :dialogState="directUserFormState" :ids="selectlist"/>
    <el-row class="dr-datatable">
      <el-col :span="24">
        <TopBar type="artist" :ids="selectlist" :pageInfo="artistList.pageInfo"></TopBar>
        <DataTable
          :dataList="artistList.docs"
          :pageInfo="artistList.pageInfo"
          @changeContentSelectList="changeSelect"
        ></DataTable>
        <Pagination :pageInfo="artistList.pageInfo" pageType="artist"></Pagination>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import DataTable from "./dataTable.vue";
import DirectUser from "./directUser.vue";
import TopBar from "../common/TopBar.vue";
import Pagination from "../common/Pagination.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "index",
  data() {
    return {
      selectlist: []
    };
  },
  components: {
    DataTable,
    TopBar,
    Pagination,
    DirectUser
  },
  methods: {
    changeSelect(ids) {
      this.selectlist = ids;
    }
  },
  computed: {
    ...mapGetters(["artistList", "directUserFormState"])
  },
  mounted() {
    this.$store.dispatch("getArtistList");
  }
};
</script>

<style lang="">
</style>