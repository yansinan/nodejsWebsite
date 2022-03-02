<template>
  <div class="dr-toolbar">
    <!-- 新建用户 -->
    <el-col :xs="19" :sm="6">
        <el-input
          class="add"
          size="small"
          placeholder="人员姓名或昵称"
          v-model="strNameAdd"
          suffix-icon="el-icon-plus"
          @keyup.enter.native="addPeople"
        ><template slot="suffix" style="color:green;">{{"新增人员"}}</template></el-input>
    </el-col>
    <el-col :xs="2" :sm="11" class="option-button">
      <el-button size="small" type="danger" plain round @click="branchDelete('user')">
        <svg-icon icon-class="icon_delete" />
      </el-button>
      <!-- TOPBARLEFT -->
    </el-col>
    <el-col :xs="24" :sm="6">
      <div class="dr-toolbar-right">
        <el-input
          class="dr-searchInput"
          size="small"
          placeholder="搜索用户名/手机号/邮箱"
          v-model="pageInfo.searchkey"
          suffix-icon="el-icon-search"
          @keyup.enter.native="searchResult"
        ></el-input>
      </div>
    </el-col>
  </div>
</template>
<script>
import { deleteRegUser,addRegUserByName } from "@/api/regUser";
export default {
  props: {
    device: String,
    pageInfo: Object,
    type: String,
    ids: Array,
    groups:Array,//人员分类
  },
  data() {
    return {
      // selectUserList: [],
      // searchkey: "",
      strNameAdd:"",
    };
  },
  methods: {
    // 新建人员;
    addPeople(e){
      let that=this;
      let strName=e.target.value;
      const objNewPeople = {
          name: strName,
          // userName:getPinYin(strName),
          group:this.groups[0].value,
      }
      // 增加
      addRegUserByName(objNewPeople).then(result=>{
        if (result.status === 200) {
          // if(result.status)
          // TODO:如果重名怎么处理
          this.$store.dispatch("regUser/getRegUserList");
          that.$message({
              message: that.$t("main.addSuccess"),
              type: "success"
          });
        } else {
          this.$message.error(result.message);
        }
      });
    },
    branchDelete(target) {
      let _this = this;
      if (_.isEmpty(_this.ids)) {
        this.$message({
          type: "info",
          message: this.$t("validate.selectNull", {
            label: this.$t("main.target_Item")
          })
        });
        return false;
      }
      this.$confirm(
        this.$t("main.del_notice"),
        this.$t("main.scr_modal_title"),
        {
          confirmButtonText: this.$t("main.confirmBtnText"),
          cancelButtonText: this.$t("main.cancelBtnText"),
          type: "warning"
        }
      )
        .then(() => {
          let ids = _this.ids.join();
          return deleteRegUser({
            ids
          });
        })
        .then(result => {
          if (result.status === 200) {
            this.$store.dispatch("regUser/getRegUserList");
            this.$message({
              message: `${this.$t("main.scr_modal_del_succes_info")}`,
              type: "success"
            });
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(err => {
          this.$message({
            type: "info",
            message: this.$t("main.scr_modal_del_error_info")
          });
        });
    },
    searchResult(ev) {
      let searchkey = this.pageInfo ? this.pageInfo.searchkey : "";
      this.$store.dispatch("regUser/getRegUserList", {
        searchkey,
        isTopBar: "1"
      });
    }
    // TOPBARLEFTOPTION
  },
  components: {}
};
</script>
<style lang="scss">
.dr-toolbar .option-button{
  margin-left: 2rem;
}
.dr-toolbar .el-col{
  margin-bottom:1rem;
}
.el-input.add .el-input__inner{
  border: 1px solid limegreen;
}
.el-input.add .el-input__suffix{
  color:limegreen
}
</style>
