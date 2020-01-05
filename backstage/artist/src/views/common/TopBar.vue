<template>
  <div class="dr-toolbar">
    <el-col :xs="12" :md="6" class="option-button">
      <!-- 艺人列表 -->
      <div v-if="type === 'artist'">
        <el-button size="small" type="primary" plain @click="addArtist('artist')" round>
          <svg-icon icon-class="icon_add" />
        </el-button>
        <el-button size="small" type="danger" plain round @click="branchDelete('artist')">
          <svg-icon icon-class="icon_delete" />
        </el-button>
      </div>
      <!-- TOPBARLEFT -->
    </el-col>

    <el-col :xs="12" :md="18">
      <!-- TOPBARRIGHT -->
      <div class="dr-toolbar-right" >&nbsp;</div>
    </el-col>
  </div>
</template>
<script>
import { remove } from "@/api/artist";
import _ from "lodash";
import { setTimeout } from "timers";
export default {
  props: {
    pageInfo: Object,
    type: String,
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

    addArtist(strMod) {
      this.$store.dispatch(strMod+"/showContentForm");
      // this.$router.push("/addArtist");
      this.$router.push(this.$root.adminBasePath + "/artist/addArtist");

    },

    branchDelete(target) {
      let _this = this,
        targetName;
      if (target === "msg") {
        targetName = this.$t("topBar.del_message");
      } else if (target === "user") {
        targetName = this.$t("topBar.del_user");
      } else if (target === "systemlogs") {
        targetName = this.$t("topBar.del_sysopt_log");
      } else if (target === "systemnotify") {
        targetName = this.$t("topBar.del_sys_notice");
      }
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
          if (target === "artist") {
            return remove({
              ids
            });
          } 
        })
        .then(result => {
          if (result.data.status === 200) {
            if (target === "artist") {
              this.$store.dispatch("artist/list");
            } else if (target === "content") {
              this.$store.dispatch("content/getContentList");
            }
            this.$message({
              message: `${this.$t("main.scr_modal_del_succes_info")}`,
              type: "success"
            });
          } else {
            this.$message.error(result.data.message);
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
