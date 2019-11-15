<template>
  <div class="content">
    <DirectUser :dialogState="directUserFormState" :ids="selectlist"/>
    <el-row class="dr-datatable">
      <el-col :span="24">
        <TopBar :type="nameMod" :ids="selectlist" :pageInfo="dataList.pageInfo"></TopBar>
        <DataTable
          :nameMod="nameMod"
          :dataList="dataList.docs"
          :pageInfo="dataList.pageInfo"
          @changeContentSelectList="changeSelect"
        ></DataTable>
        <Pagination :pageInfo="dataList.pageInfo" :pageType="nameMod"></Pagination>
      </el-col>
    </el-row>
  </div>
</template>
<script>
const nameMod="content"


import DataTable from "./dataTable.vue";
import DirectUser from "./directUser.vue";
import TopBar from "../common/TopBar.vue";
import Pagination from "../common/Pagination.vue";
import { mapGetters, mapActions,createNamespacedHelpers} from "vuex";
const mod = createNamespacedHelpers(nameMod)////模块,含mapGetters, mapActions等

export default {
  name: "index",
  data() {
    return {
      selectlist: [],
      nameMod:nameMod,

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
    ...mapGetters(["directUserFormState"]),//全局
    ...mod.mapState({
      dataList: state => state.dataList,
    }),//模块的state
  },
  mounted() {
    // 触发action,异步
    this.$store.dispatch(nameMod+"/getList",{mod:nameMod});
  }
};
</script>

<style lang="">
</style>