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
      <el-table-column type="selection" width="20"></el-table-column>
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
      <!-- 名称 -->
      <el-table-column class-name="table-column--name" prop="sImg" :label="$t(nameMod+'.sImg')"  min-width="360">
        <el-row :gutter="20" slot-scope="scope">
          <el-col class="sImg" :span="12">
            <el-avatar :src="scope.row.sImg" fit="cover" :size="128"  shape="square" />
            <el-badge v-if="isMobile" :value="scope.row.listLinks.length" :hidden="scope.row.listLinks.length==0?true:false" :max="99" type="info">
              <el-button @click="eListLinksEdit(scope.$index,dataList)" size="mini" plain icon="el-icon-link" :type="scope.row.listLinks.length==0?'':'primary'"></el-button>  
            </el-badge>
          </el-col>
          <el-col class="col-name" :span="12" style="text-align:left">
            <el-button type="text" size="large" @click="editContentInfo(scope.$index, dataList)">{{scope.row.name}}  <i class="el-icon-edit" /></el-button>
            <!-- 置顶/推荐 -->
            <div class="actionInName">
              <el-button-group>
                <el-button v-if="isMobile" icon="el-icon-view" :type="scope.row.state!=2?'':'primary'" plain :disabled="scope.row.state!=2" size="medium" @click="eLink('/timeline/shows'+scope.row.url)"/>
                <el-tooltip content="推荐" placement="top" effect="light">
                  <el-button :icon="scope.row.isTop === 1?'el-icon-star-on':'el-icon-star-off'" size="medium" :type="scope.row.isTop === 1?'warning':''" @click="topContent(scope.$index, dataList)" plain/>
                </el-tooltip>
                <el-tooltip content="置顶" placement="top" effect="light">
                  <el-button v-show="scope.row.isTop===1" :icon="scope.row.isTop === 1 && scope.row.roofPlacement == 1?'el-icon-medal-1':'el-icon-medal'" size="medium" :type="scope.row.isTop === 1 && scope.row.roofPlacement == 1?'danger':''" @click="roofContent(scope.$index, dataList)"  plain/>
                </el-tooltip>
              </el-button-group>
            </div>
            <div class="containerTag">
              <el-tag size="mini" type="success" v-for="artist in scope.row.listRefs" :key="artist._id">{{artist.name}}</el-tag>
            </div>
            <!-- <div><span v-for="artist in scope.row.listRefs" :key="artist._id">{{artist.name+','}}</span></div> -->
            <!-- 时间@地点 -->
            <div class="info">
              <div class="foot">@{{scope.row.location?scope.row.location:"未定义"}}</div>              
              <div class="foot">{{parseTime(scope.row.dateStart,"{y}-{m}-{d}")}} 至 {{parseTime(scope.row.dateEnd,"{y}-{m}-{d}")}}</div>              
            </div>
          </el-col>
         <!-- <div v-else class="col-name hide" ><el-avatar :src="scope.row.sImg" :fit="cover"/>{{scope.row.name}}</div> -->
        </el-row>
      </el-table-column>

      <!-- 其他链接PC -->
      <el-table-column v-if="!isMobile" class-name="table-column--links" prop="listLinks" :label="$t(nameMod+'.listTicketLink')" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-badge :value="scope.row.listLinks.length" :hidden="scope.row.listLinks.length==0?true:false" :max="99" type="info">
            <el-button @click="eListLinksEdit(scope.$index,dataList)" size="large" plain icon="el-icon-link" :type="scope.row.listLinks.length==0?'':'primary'" circle></el-button>  
          </el-badge>          
        </template>
      </el-table-column>  

      <!-- 标签 -->
      <el-table-column class-name="table-column--tags" prop="tags" :label="$t('contents.tags')" min-width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag size="mini" type="info" v-for="tag in scope.row.tags" :key="tag._id">{{tag.name}}</el-tag>
        </template>
      </el-table-column>
      
      <!-- 右侧固定栏 -->
      <el-table-column v-if="!isMobile" :label="$t('main.dataTableOptions')" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button-group>
            <el-button icon="el-icon-view" :type="scope.row.state==2?'':'info'" :disabled="scope.row.state!=2" size="large" @click="eLink('/timeline/shows'+scope.row.url)" />
            <el-button icon="el-icon-edit" size="large" type="success" @click="editContentInfo(scope.$index, dataList)" plain/>
            <el-button icon="el-icon-delete" size="large" type="danger" plain @click="deleteContent(scope.$index, dataList)" />
          </el-button-group>
        </template>
      </el-table-column>  
    </el-table>
    <DialogURL @complete="getList" :nameMod="nameMod" :label="$t(nameMod+'.listLinks')" :dialogState="dialogStateLink" />

  </div>
</template>
<style lang="scss">
  @import "@root/publicMethods/sass/dataTable.scss";
  .tableBox .table-column--name .cell .el-row .el-col.col-name{
    .el-button--text{
      font-size:1rem;
    }
  }
</style>
<script>
import _ from "lodash";
import {parseTime} from "../../utils"
import {methods,props,data,computed} from "@root/publicMethods/vue/dataTable";

export default {
  props: {
    ...props,
  },
  data() {
    return {
      ...data,
    };
  },
  components: {
    DialogURL:() => import("@root/publicMethods/vue/DialogURL.vue"),
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
