<template>
  <div class="dr-toolbar">
    <el-col :xs="12" :md="6" class="option-button">
      <!-- xxx列表 -->
      <el-button size="small" type="primary" plain @click="eBnAdd" round>
        <svg-icon icon-class="icon_add" />
      </el-button>
      <el-button size="small" type="danger" plain round @click="branchDelete">
        <svg-icon icon-class="icon_delete" />
      </el-button>
      <!-- TOPBARLEFT -->
    </el-col>

    <el-col :xs="12" :md="18">
      <!-- TOPBARRIGHT -->
      <div class="dr-toolbar-right" >&nbsp;</div>
    </el-col>
  </div>
</template>
<script>
import {remove} from "@root/publicMethods/apiGeneral"
import _ from "lodash";
import { setTimeout } from "timers";
export default {
  props: {
    nameMod:String,
    pageInfo: Object,
    ids: Array,
    code: String,
    path: String,
    device: String,

  },
  data() {
    return {
      selectUserList: [],
      loading: false,
      searchkey: "",
      authPost: "0",
      authPostOptions: [
        {
          value: "0",
          label: "全部"
        },
        {
          value: "1",
          label: "待审核"
        }
      ]
    };
  },
  methods: {

    eBnAdd() {
      this.$store.dispatch(this.nameMod+"/showContentForm",{isInit:true});
      this.$router.push(this.$root.adminBasePath + "/"+this.nameMod+"/add");

    },

    branchDelete() {
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
        return remove({
          ids
        },this.nameMod);
        
      })
      .then(result => {
        if (result.status === 200) {
          this.$store.dispatch(this.nameMod+"/list");
          this.$message({
            message: `${this.$t("main.scr_modal_del_succes_info")}`,
            type: "success"
          });
        } else {
          this.$message.error(result.data.message || result.message);
        }
      })
      .catch(err => {
        this.$message({
          type: "info",
          message: this.$t("main.scr_modal_del_error_info")
        });
      });
    },


    // TOPBARLEFTOPTION
  },
  components: {}
};
</script>
<style lang="scss">
.option-button {
  display: inline-block;
}
</style>
