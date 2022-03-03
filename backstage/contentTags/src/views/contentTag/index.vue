<template>
  <div :class="classObj" class="contentTag">
    <div class="main-container">
      <TagForm :device="device" :dialogState="formState" :groups="groups"></TagForm>
      <el-row class="dr-datatable">
        <el-col :span="24">
          <TopBar type="contentTag" :pageInfo="contentTagList.pageInfo"></TopBar>
          <DataTable :pageInfo="contentTagList.pageInfo" :dataList="contentTagList.docs" :groups="groups"></DataTable>
          <Pagination :device="device" :pageInfo="contentTagList.pageInfo" pageType="contentTag"></Pagination>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import TagForm from "./tagForm";
import DataTable from "./dataTable.vue";
import TopBar from "../common/TopBar.vue";
import Pagination from "../common/Pagination.vue";
import { mapGetters, mapActions } from "vuex";
import { initEvent } from "@root/publicMethods/events";

export default {
  name: "contentTag",
  data() {
    return {
      sidebarOpened: true,
      device: "desktop",
      // 标签分类
      groups:[
        {text:"乐队标签",value:"乐队标签",label:"乐队标签"},
        {text:"即时创建",value:"即时创建",label:"即时创建"},
        {text:"发行介质",value:"发行介质",label:"发行介质"},
        {text:"音乐风格",value:"音乐风格",label:"音乐风格"},
        {text:"地点",value:"地点",label:"地点"}],//分类名称
    };
  },
  components: {
    DataTable,
    TopBar,
    TagForm,
    Pagination
  },
  methods: mapActions([]),
  computed: {
    ...mapGetters(["contentTagList"]),
    formState() {
      return this.$store.getters.contentTagFormState;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebarOpened,
        openSidebar: this.sidebarOpened,
        withoutAnimation: "false",
        mobile: this.device === "mobile"
      };
    }
  },
  mounted() {
    initEvent(this);
    this.$store.dispatch("contentTag/getContentTagList");
  }
};
</script>

<style lang="">
</style>