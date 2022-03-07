<template>
  <div>
    <el-table
      align="center"
      v-loading="loading"
      ref="multipleTable"
      :data="dataList"
      tooltip-effect="dark"
      style="width: 100%"
      class="tableBox"
      @selection-change="handleContentSelectionChange"
    >
      <el-table-column type="selection" width="30"></el-table-column>
      <!-- 
      <el-table-column prop="isTop" :label="$t('contents.rec')" width="30" show-overflow-tooltip>
        <template slot-scope="scope">
          <svg-icon :style="yellow" v-show="scope.row.isTop === 1" @click="topContent(scope.$index, dataList)" icon-class="icon_star_fill" />
          <svg-icon :style="gray" v-show="scope.row.isTop != 1" @click="topContent(scope.$index, dataList)" icon-class="icon_star" />
        </template>
      </el-table-column>
      <el-table-column prop="roofPlacement" :label="$t('contents.roofPlacement')" width="30" show-overflow-tooltip>
        <template slot-scope="scope">
          <svg-icon :style="green" v-show="scope.row.isTop === 1 && scope.row.roofPlacement == 1" @click="roofContent(scope.$index, dataList)" icon-class="icon_ping" />
          <svg-icon :style="gray" v-show="scope.row.isTop === 1 && scope.row.roofPlacement != 1" @click="roofContent(scope.$index, dataList)" icon-class="icon_ding" />
        </template>
      </el-table-column>
       -->
      <!-- 名称 
      <el-table-column class-name="table-column--name" prop="title" :label="$t('contents.title')" min-width="350" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="scope.row.state =='2'">
            <a :href="'/timeline/news/'+scope.row.url" target="_blank">{{scope.row.title}}</a>
          </div>
          <div v-else>{{scope.row.title}}</div>
        </template>
      </el-table-column>
      -->
      <!-- 名称 -->
      <el-table-column class-name="table-column--name" prop="name" sortable sort-by="date" :label="$t('contents.title')" min-width="360" show-overflow-tooltip>
        <el-row :gutter="20" slot-scope="scope">
          <!-- 名称和功能 -->
          <el-col class="col-name" style="text-align:left;min-width:128px;">
            <!-- 名称 -->
            <el-button type="text" size="large" @click="editContentInfo(scope.$index, dataList)" >{{scope.row.title}}  <i class="el-icon-edit" /></el-button>
            <!-- 置顶/推荐 -->
            <!-- 栏目&时间 -->
            <div class="info">
              <div class="foot">@{{(scope.row.categories&&scope.row.categories[scope.row.categories.length-1])?scope.row.categories[scope.row.categories.length-1].name:''}}</div>
              <div class="foot">{{parseTime(scope.row.date,"{y}-{m}-{d}")}} by {{scope.row.author.name}}</div>              
            </div>
            <div class="actionInName">
              <el-button-group>
                <el-button v-if="isMobile" icon="el-icon-view" :type="scope.row.state!=2?'':'primary'" plain :disabled="scope.row.state!=2" size="medium" @click="eLink('/timeline/news'+scope.row.url)" />
                <el-tooltip content="推荐" placement="top" effect="light">
                  <el-button :icon="scope.row.isTop === 1?'el-icon-star-on':'el-icon-star-off'" size="medium" :type="scope.row.isTop === 1?'warning':''" @click="topContent(scope.$index, dataList)" plain/>
                </el-tooltip>
                <el-tooltip content="置顶" placement="top" effect="light">
                  <el-button v-show="scope.row.isTop===1" :icon="scope.row.isTop === 1 && scope.row.roofPlacement == 1?'el-icon-medal-1':'el-icon-medal'" size="medium" :type="scope.row.isTop === 1 && scope.row.roofPlacement == 1?'danger':''" @click="roofContent(scope.$index, dataList)"  plain/>
                </el-tooltip>
              </el-button-group>
            </div>
            <div class="containerTag">
              <el-tag size="mini" type="success" v-for="tag in scope.row.tags" :key="tag._id">{{tag.name}}</el-tag>
            </div>
          </el-col>
        </el-row>
      </el-table-column>

      <!-- 日期 -->
      <el-table-column prop="updateDate" label="最后更新" width="100"></el-table-column>


      <!-- 栏目 
      <el-table-column prop="categories" :label="$t('contents.categories')" show-overflow-tooltip width="120">
        <template slot-scope="scope">
          <span>{{(scope.row.categories&&scope.row.categories[scope.row.categories.length-1])?scope.row.categories[scope.row.categories.length-1].name:''}}</span>
        </template>
      </el-table-column>
      -->
      <!-- 标签
      <el-table-column class-name="table-column--tags" prop="tags" :label="$t('contents.tags')" min-width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag size="mini" type="info" v-for="tag in scope.row.tags" :key="tag._id">{{tag.name}}</el-tag>
        </template>
      </el-table-column>
       -->
      <!-- <el-table-column prop="clickNum" :label="$t('contents.clickNum')" show-overflow-tooltip></el-table-column> -->
      <!-- <el-table-column prop="commentNum" :label="$t('contents.commentNum')" show-overflow-tooltip></el-table-column> -->
      <!-- 
      <el-table-column prop="state" :label="$t('contents.enable')" show-overflow-tooltip>
        <template slot-scope="scope">
          <svg-icon v-show="scope.row.state=='2'" :style="green" icon-class="check-circle-fill" />
          <svg-icon v-show="scope.row.state!='2'" :style="red" icon-class="minus-circle-fill" />
        </template>
      </el-table-column>
       -->

      <!-- 右侧固定栏 -->
      <el-table-column v-if="!isMobile" :label="$t('main.dataTableOptions')" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button-group>
            <el-button icon="el-icon-view" :type="scope.row.state==2?'':'info'" :disabled="scope.row.state!=2" size="large" @click="eLink('/timeline/news'+scope.row.url)" />
            <el-button icon="el-icon-edit" size="large" type="success" @click="editContentInfo(scope.$index, dataList)" plain/>
            <el-button icon="el-icon-delete" size="large" type="danger" plain @click="deleteContent(scope.$index, dataList)" />
          </el-button-group>
        </template>
      </el-table-column>      
    </el-table>
  </div>
</template>
<style lang="scss">
  @import "@root/publicMethods/sass/dataTable.scss";
  .tableBox .table-column--name .cell .el-row .el-col.col-name{
    display: flex;
    flex-wrap: wrap;
    .el-button--text{
      flex: 1 1 100%;
      justify-content: flex-start;
      text-align: start;
      font-size:1rem;
    }
  }
</style>

<script>
// import { deleteContent, roofContent, updateContentToTop } from "@/api/content";
import {parseTime} from "@/utils"
import {methods,props,data,computed} from "@root/publicMethods/vue/dataTable";

import _ from "lodash";
export default {
  props: {
    ...props,
  },
  data() {
    return {
      ...data,
    };
  },

  methods: {
    ...methods,
    parseTime:parseTime,

  },
  computed: {
    ...computed,
  }
};
</script>
