<template>
  <div>
    <el-table
      align="center"
      v-loading="loading"
      ref="multipleTable"
      :data="dataList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleUserSelect"
      class="tableBox"
    >
      <el-table-column type="selection" width="30"></el-table-column>
      <!-- 
      <el-table-column prop="userName" :label="$t('regUser.userName')" width="120"></el-table-column>
      <el-table-column prop="enable" :label="$t('regUser.enable')" show-overflow-tooltip width="60">
        <template slot-scope="scope">
          <svg-icon v-show="scope.row.enable" :style="green" icon-class="check-circle-fill" />
          <svg-icon v-show="!scope.row.enable" :style="red" icon-class="minus-circle-fill" />
        </template>
      </el-table-column>
      -->
      <el-table-column class-name="table-column--name" prop="name" :label="$t('regUser.name')" :min-width="isMobile?200:200">
        <el-row :gutter="20" slot-scope="scope">
          <el-col class="sImg">
            <el-avatar :src="scope.row.avatar" fit="cover" size="large" :style="scope.row.enable ? '' : 'filter: opacity(0.5) grayscale(1);'">{{scope.row.avatarName}}</el-avatar>
            <el-tag size="mini" type="info" v-if="isMobile">{{scope.row.group == '0' ? '普通用户' : scope.row.group}}</el-tag>
          </el-col>
          <el-col class="col-name" style="text-align:left">
            <el-button type="text" size="large" @click="editUserInfo(scope.$index, dataList)">{{scope.row.name}}  <i class="el-icon-edit" /></el-button>
            <!-- 时间@地点 -->
            <div v-if="isMobile" class="info">
              <!-- <div class="foot" v-if="scope.row.group == '0'">普通用户</div> -->
              <!-- <div class="foot" v-else >{{scope.row.group}}</div> -->
              <div class="foot">{{scope.row.dateInOut}}</div>
            </div>
          </el-col>
        </el-row>
      </el-table-column>

      <!-- 类型 -->
      <el-table-column 
        v-if="!isMobile"
        prop="group" 
        :label="$t('regUser.group')" 
        width="auto"      
        :filters="groups"
        :filter-method="filterHandler">
        <template slot-scope="scope">
          <span v-if="scope.row.group == '0'">普通用户</span>
          <span v-else >{{scope.row.group}}</span>
        </template>
      </el-table-column>
      <!-- 日期 -->
      <el-table-column v-if="!isMobile" prop="dateInOut" :label="$t('regUser.dateInOut')" show-overflow-tooltip align="left" :width="!isMobile?'300':'auto'"></el-table-column>
      <el-table-column :label="$t('main.dataTableOptions')" width="70">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            plain
            round
            @click="editUserInfo(scope.$index, dataList)"
          >
            <svg-icon icon-class="edit" />
          </el-button>
          <el-button
            :disabled="lockDel"
            size="mini"
            type="danger"
            plain
            round
            @click="deleteUser(scope.$index, dataList)"
          >
            <svg-icon icon-class="icon_delete" />
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<style lang="scss">
  @import "@root/publicMethods/sass/dataTable.scss";
  .tableBox{
      td{
        .foot{
          font-size: .3rem;
          color: darkgrey;
          word-break: keep-all;
        }    
      }
  }
</style>

<script>
import { getOneRegUser, deleteRegUser } from "@/api/regUser";
import {computed} from "@root/publicMethods/vue/dataTable";
export default {
  props: {
    dataList: Array,
    pageInfo: Object,
    groups:Array,
  },
  data() {
    return {
      green: { color: "#13CE66" },
      red: { color: "#FF4949" },
      lockDel: true,
      loading: false,
      tableData3: this.$store.getters.regUserList.docs,
      multipleSelection: []
    };
  },

  methods: {
    handleUserSelect(val) {
      if (val && val.length > 0) {
        let ids = val.map((item, index) => {
          return item._id;
        });
        this.multipleSelection = ids;
        this.$emit("changeUserSelectList", ids);
      }
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    editUserInfo(index, rows) {
      let rowData = rows[index];
      getOneRegUser({ id: rowData._id })
        .then(result => {
          if (result.status === 200) {
            this.$store.dispatch("regUser/showRegUserForm", {
              edit: true,
              formData: result.data
            });
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("main.scr_modal_del_error_info")
          });
        });
    },
    deleteUser(index, rows) {
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
          return deleteRegUser({
            ids: rows[index]._id
          });
        })
        .then(result => {
          if (result.status === 200) {
            this.$store.dispatch("regUser/getRegUserList", this.pageInfo);
            this.$message({
              message: this.$t("main.scr_modal_del_succes_info"),
              type: "success"
            });
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(err => {
          this.$message({
            type: "info",
            message: this.$t("regUser.scr_modal_del_error_info")
          });
        });
    },
    // 表格筛选
    filterHandler(value, row, column) {
        return row.group === value;
    }
  },
  computed: {
    ...computed,
  }
};
</script>