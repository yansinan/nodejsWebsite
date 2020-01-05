<template>
  <div>
    <el-table
      align="center"
      v-loading="loading"
      ref="multipleTable"
      :data="dataList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleContentSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="isTop" :label="$t('contents.rec')" width="55" show-overflow-tooltip>
        <template slot-scope="scope">
          <svg-icon
            :style="yellow"
            v-show="scope.row.isTop === 1"
            @click="topContent(scope.$index, dataList)"
            icon-class="icon_star_fill"
          />
          <svg-icon
            :style="gray"
            v-show="scope.row.isTop != 1"
            @click="topContent(scope.$index, dataList)"
            icon-class="icon_star"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="roofPlacement"
        :label="$t('contents.roofPlacement')"
        width="55"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <svg-icon
            :style="green"
            v-show="scope.row.isTop === 1 && scope.row.roofPlacement == 1"
            @click="roofContent(scope.$index, dataList)"
            icon-class="icon_ping"
          />
          <svg-icon
            :style="gray"
            v-show="scope.row.isTop === 1 && scope.row.roofPlacement != 1"
            @click="roofContent(scope.$index, dataList)"
            icon-class="icon_ding"
          />
        </template>
      </el-table-column>
      <el-table-column prop="name" :label="$t('docs.name')" width="350" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="scope.row.state">
            <a :href="'/details/'+scope.row._id+'.html'" target="_blank">{{scope.row.name}}</a>
          </div>
          <div v-else>{{scope.row.name}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="author.name" :label="$t('contents.author')" show-overflow-tooltip>
        <template
          slot-scope="scope"
        >{{scope.row.uAuthor?scope.row.uAuthor.userName:(scope.row.author?scope.row.author.userName:'')}}</template>
      </el-table-column>
      <el-table-column prop="date" :label="$t('contents.date')" width="180">
        <template slot-scope="scope">{{scope.row.updateDate}}</template>
      </el-table-column>
      <!-- <el-table-column prop="type" :label="$t('contents.type')">
        <template slot-scope="scope">
          <span v-if="scope.row.type == '1'">普通</span>
        </template>
      </el-table-column> -->
      <el-table-column
        prop="categories"
        :label="$t('contents.categories')"
        show-overflow-tooltip
        width="120"
      >
        <template slot-scope="scope">
          <span>{{(scope.row.categories&&scope.row.categories[0])?scope.row.categories[0].name:''}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="tags" :label="$t('contents.tags')" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-for="tag in scope.row.tags" :key="tag._id">{{tag.name+','}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="clickNum" :label="$t('contents.clickNum')" show-overflow-tooltip></el-table-column>
      <el-table-column prop="commentNum" :label="$t('contents.commentNum')" show-overflow-tooltip></el-table-column>
      <el-table-column prop="state" :label="$t('contents.enable')" show-overflow-tooltip>
        <template slot-scope="scope">
          <svg-icon v-show="scope.row.state=='2'" :style="green" icon-class="check-circle-fill" />
          <svg-icon v-show="scope.row.state!='2'" :style="red" icon-class="minus-circle-fill" />
        </template>
      </el-table-column>
      
      <el-table-column :label="$t('main.dataTableOptions')" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            plain
            round
            @click="editContentInfo(scope.$index, dataList)"
          >
            <svg-icon icon-class="edit" />
          </el-button>
          <el-button
            size="mini"
            type="danger"
            plain
            round
            @click="deleteContent(scope.$index, dataList)"
          >
            <svg-icon icon-class="icon_delete" />
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<style lang="scss">
.fa-star,
.fa-thumbs-up {
  cursor: pointer;
}

.fa-star-o,
.fa-thumbs-o-up {
  cursor: pointer;
}
</style>
<script>
import { remove, roof, updateToTop } from "@/api/artist";

import _ from "lodash";
// import { mapGetters, mapActions,createNamespacedHelpers} from "vuex";
// let mod = createNamespacedHelpers(nameMod)////模块,含mapGetters, mapActions等

export default {
  props: {
    nameMod:String,
    dataList: Array,
    pageInfo: Object
  },
  data() {
    return {
      loading: false,
      multipleSelection: [],
      yellow: {
        color: "#F7BA2A"
      },
      gray: {
        color: "#CCC"
      },
      green: { color: "#13CE66" },
      red: { color: "#FF4949" }
    };
  },

  methods: {
    // 从mod获取列表更新
    getList(){
      this.pageInfo.mod=this.nameMod;
      this.$store.dispatch(this.nameMod+"/getList", this.pageInfo);
    },
    handleContentSelectionChange(val) {
      if (val && val.length > 0) {
        let ids = val.map((item, index) => {
          return item._id;
        });
        this.multipleSelection = ids;
        this.$emit("changeContentSelectList", ids);
      }
    },
    //编辑按钮
    editContentInfo(index, rows) {
      let rowData = rows[index];
      this.$router.push("artist/edit_"+this.nameMod+"/" + rowData._id);
    },
    //推荐
    topContent(index, rows) {
      let contentData = rows[index];
      // contentData.isTop = contentData.isTop == 1 ? 0 : 1;
      let targetParams = {
        _id: contentData._id,
        isTop: contentData.isTop == 1 ? 0 : 1
      };
      updateToTop(targetParams).then(result => {
        if (result.data.status === 200) {
          this.getList();
        } else {
          this.$message.error(result.data.message);
        }
      });
    },
    // 置顶
    roofContent(index, rows) {
      let contentData = rows[index];
      // 推荐的才允许置顶
      if (contentData.isTop != 1) {
        return false;
      }
      let targetParams = {
        _id: contentData._id,
        roofPlacement: contentData.roofPlacement == "1" ? "0" : "1"
      };
      roof(targetParams).then(result => {
        if (result.data.status === 200) {
          this.getList();
        } else {
          this.$message.error(result.data.message);
        }
      });
    },
    deleteContent(index, rows) {
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
          return remove({
            ids: rows[index]._id
          });
        })
        .then(result => {
          if (result.data.status === 200) {
            Object.assign(this.pageInfo);
            this.getList();
            this.$message({
              message: this.$t("main.scr_modal_del_succes_info"),
              type: "success"
            });
          } else {
            this.$message.error(result.data.message);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("main.scr_modal_del_error_info")
          });
        });
    }
  },
  computed: {}
};
</script>
