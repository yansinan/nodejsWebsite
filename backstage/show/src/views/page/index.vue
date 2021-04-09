<template>
  <div :class="classObj" class="content">
    <div class="main-container">
      <el-row class="dr-datatable">
        <el-col :span="24">
          <TopBar :nameMod="nameMod" :ids="selectlist" :pageInfo="dataList.pageInfo"></TopBar>
          <DataTable
            :nameMod="nameMod"
            :dataList="dataList.docs"
            :pageInfo="dataList.pageInfo"
            @changeContentSelectList="changeSelect"
          ></DataTable>
          <Pagination :pageInfo="dataList.pageInfo" :nameMod="nameMod"></Pagination>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import '@/set-public-path'
import DataTable from "./dataTable.vue";
import TopBar from "../common/TopBar.vue";
import Pagination from "../common/Pagination.vue";
import { mapGetters, mapActions,createNamespacedHelpers} from "vuex";
import { initEvent } from "@root/publicMethods/events";
const mod = createNamespacedHelpers(nameMod)////模块,含mapGetters, mapActions等

export default {
  name: "index",
  data() {
    return {
      selectlist: [],
      sidebarOpened: true,
      device: "desktop",
      nameMod:nameMod,
    };
  },
  components: {
    DataTable,
    TopBar,
    Pagination,
  },
  methods: {
    changeSelect(ids) {
      this.selectlist = ids;
    }
  },
  computed: {
    classObj() {
      return {
        hideSidebar: !this.sidebarOpened,
        openSidebar: this.sidebarOpened,
        withoutAnimation: "false",
        mobile: this.device === "mobile"
      };
    },
    // ...mod.mapState({
    //   dataList: state => state.dataList,
    // }),//模块的state
    ...mapGetters({dataList:"getterListData"}),//模块
  },
  mounted() {
    initEvent(this);
    // 触发action,异步
    this.$store.dispatch(nameMod+"/getList",{mod:nameMod});
  }
};
</script>

<style lang="">
</style>