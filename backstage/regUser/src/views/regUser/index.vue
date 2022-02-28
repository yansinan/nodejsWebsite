<template>
  <div :class="classObj" class="regUser">
    <div class="main-container">
      <UserForm :device="device" :dialogState="formState" :groups="groups"></UserForm>
      <el-row class="dr-datatable">
        <el-col :span="24">
          <TopBar
            :device="device"
            type="regUser"
            :ids="selectlist"
            :pageInfo="regUserList.pageInfo"
            :groups="groups"
          ></TopBar>
          <DataTable
            :pageInfo="regUserList.pageInfo"
            :dataList="regUserList.docs"
            @changeUserSelectList="changeSelect"
            :groups="groups"
          ></DataTable>
          <Pagination :device="device" :pageInfo="regUserList.pageInfo" pageType="regUser"></Pagination>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import UserForm from "./userForm";
import DataTable from "./dataTable.vue";
import TopBar from "../common/TopBar.vue";
import Pagination from "../common/Pagination.vue";
import { mapGetters, mapActions } from "vuex";
import { initEvent } from "@root/publicMethods/events";

export default {
  name: "index",
  data() {
    return {
      sidebarOpened: true,
      device: "desktop",
      selectlist: [],
      groups:[
        {text:"工作人员",value:"工作人员",label:"工作人员"},
        {text:"乐手"    ,value:"乐手"    ,label:"乐手"   },
        {text:"网站管理",value:"网站管理",label:"网站管理"},
        {text:"注册用户",value:"注册用户",label:"注册用户"}],//分类名称
    };
  },
  components: {
    DataTable,
    TopBar,
    UserForm,
    Pagination
  },
  methods: {
    changeSelect(ids) {
      this.selectlist = ids;
    }
  },
  computed: {
    ...mapGetters(["regUserList"]),
    formState() {
      return this.$store.getters.regUserFormState;
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
    this.$store.dispatch("regUser/getRegUserList");
  }
};
</script>

<style lang="">
</style>