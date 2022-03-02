<template>
  <div class="dashboard-editor-container">
    <!-- <github-corner style="position: absolute; top: 0px; border: 0; right: 0;" />
    <div class="notice-box">
      <div class="client-notice" v-html="noticeInfo"></div>
      <div class="update-notice" v-if="vNo.newVersion>vNo.oldVersion">
        发现新版本 {{vNo.nv}}，
        <el-link
          v-if="versionInfo.description"
          style="font-size:12px;"
          type="primary"
          @click="showUpdateNotice()"
        >查看详情</el-link>
      </div>
    </div>
     -->
    <!-- 顶部统计数据 -->
    <panel-group :basicInfo="basicInfo" :dicSourceRoot="dicSourceRoot"/>
    <!-- 权限展示浮窗 -->
    <el-dialog
      width="55%"
      :title="$t('main.myPower')"
      :visible.sync="resourceShow"
      :close-on-click-modal="false"
    >
      <resource-view :resource="newSourceData" />
    </el-dialog>
    <el-row :gutter="8">
      <!-- 近期评论 -->
      <el-col
        :xs="{span: 24}"
        :sm="{span: 24}"
        :md="{span: 24}"
        :lg="{span: 7}"
        :xl="{span: 7}"
        style="padding-right:8px;margin-bottom:30px;"
      >
        <list-docs :listDocs="basicInfo.listDocs" />
      </el-col>
      <!-- 乐队列表 -->
      <el-col
        :xs="{span: 24}"
        :sm="{span: 12}"
        :md="{span: 12}"
        :lg="{span: 12}"
        :xl="{span: 12}"
        style="margin-bottom:30px;"
      >
        <artist-list :listArtists="basicInfo.listArtists" />
      </el-col>
      <!-- 当前用户信息 -->
      <el-col
        :xs="{span: 24}"
        :sm="{span: 12}"
        :md="{span: 12}"
        :lg="{span: 5}"
        :xl="{span: 5}"
        style="margin-bottom:30px;"
      >
        <box-card :basicInfo="basicInfo" @showMyResourceBox="showMyResource" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import GithubCorner from "@/components/GithubCorner";
import PanelGroup from "./components/PanelGroup";
import ResourceView from "./components/ResourceView.vue";
// import TransactionTable from "./components/TransactionTable";
// import UserList from "./components/UserList";
import ArtistList from "./components/ArtistList";
import ListDocs from "./components/ListDocs";
import BoxCard from "./components/BoxCard";
import { renderTreeData } from "@/utils";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "DashboardAdmin",
  components: {
    // GithubCorner,
    PanelGroup,
    ResourceView,
    // TransactionTable,
    // UserList,
    ArtistList,
    ListDocs,
    BoxCard
  },
  data() {
    return {
      resourceShow: false
    };
  },
  methods: {
    showMyResource() {
      this.resourceShow = true;
    },
    //showUpdateNotice() {
    //  if (this.versionInfo && this.versionInfo.description) {
    //    window.open(this.versionInfo.description);
    //  }
    //}
  },
  computed: {
    ...mapGetters(["basicInfo"]),//, "notice", "versionInfo"
    newSourceData() {
      return renderTreeData({ docs: this.basicInfo.resources });
    },
    // 根节点的访问能力字典
    dicSourceRoot(){
      if(this.basicInfo.resources.length == 0)return {};
      let listSourceChck=["regUser","artist","record","video","content","good"]
      let objRes={}
      this.basicInfo.resources.forEach(v=>{
        let strSourceName=listSourceChck.find(checkRoutePath=>(v.api==checkRoutePath+"/getList"));
        if(strSourceName){
          objRes[strSourceName]=v.hasPower;
        }
        // 文件夹全部访问权限:content和regUser和其他不一样
        // if(listSourceChck.find(checkRoutePath=>(v.routePath==checkRoutePath))){
        //   objRes[v.routePath]=v.isExt;
        // }
      })
      return objRes;
    },

    //noticeInfo() {
    //  if (this.notice && this.notice.length > 0) {
    //    let firstStr = this.notice[0].content;
    //    return `${firstStr}`;
    //  } else {
    //    return "";
    //  }
    //},
    //vNo() {
    //  let cmsVersion = this.$root.appVersion;
    //  let oldVersion = Number(cmsVersion.split(".").join(""));
    //  let newVersion;
    //  if (this.versionInfo && this.versionInfo.version) {
    //    newVersion = Number(this.versionInfo.version.split(".").join(""));
    //  }
    //  return {
    //    ov: cmsVersion,
    //    oldVersion,
    //    nv: this.versionInfo.version,
    //    newVersion
    //  };
    //}
  },
  mounted() {
    this.$store.dispatch("dashboard/getSiteBasicInfo");
    // this.$store.dispatch("dashboard/getNotice", { isPaging: "0" });
    // this.$store.dispatch("dashboard/getVersionMaintenanceInfo", {
    //   isPaging: "0"
    // });
    localStorage.clear();
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.update-dialog {
  .el-dialog__body {
    padding: 15px 20px !important;
  }
  ul {
    li {
      line-height: 28px;
    }
  }
}
.notice-box {
  color: #b4bccc;
  font-size: 12px;
  .client-notice {
    display: inline-block;
  }
  .update-notice {
    display: inline-block;
    margin-left: 10px;
  }
}

.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
