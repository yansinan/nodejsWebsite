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
      <el-table-column class-name="table-column--name" prop="name" :label="$t('docs.name')" min-width="360" show-overflow-tooltip>
        <el-row :gutter="20" slot-scope="scope">
          <el-col class="sImg" :span="12">
            <el-avatar :src="scope.row.sImg" fit="cover" :size="128"  shape="square" />
            <el-badge v-if="isMobile" :value="scope.row.listLinks.length" :hidden="scope.row.listLinks.length==0?true:false" :max="99" type="info">
              <el-button @click="eListLinksEdit(scope.$index,dataList)" size="mini" plain icon="el-icon-link" :type="scope.row.listLinks.length==0?'':'primary'"></el-button>  
            </el-badge>
          </el-col>
          <el-col class="col-name" :span="12" style="text-align:left;min-width:128px;">
            <el-button type="text" size="large" @click="editContentInfo(scope.$index, dataList)">{{scope.row.name}}  <i class="el-icon-edit" /></el-button>
            <!-- 置顶/推荐 -->
            <div class="actionInName">
              <el-button-group>
                <el-button v-if="isMobile" icon="el-icon-view" :type="scope.row.state!=2?'':'primary'" plain :disabled="scope.row.state!=2" size="medium" @click="eLink('/timeline/records'+scope.row.url)" />
                <el-tooltip content="推荐" placement="top" effect="light">
                  <el-button :icon="scope.row.isTop === 1?'el-icon-star-on':'el-icon-star-off'" size="medium" :type="scope.row.isTop === 1?'warning':''" @click="topContent(scope.$index, dataList)" plain/>
                </el-tooltip>
                <el-tooltip content="置顶" placement="top" effect="light">
                  <el-button v-show="scope.row.isTop===1" :icon="scope.row.isTop === 1 && scope.row.roofPlacement == 1?'el-icon-medal-1':'el-icon-medal'" size="medium" :type="scope.row.isTop === 1 && scope.row.roofPlacement == 1?'danger':''" @click="roofContent(scope.$index, dataList)"  plain/>
                </el-tooltip>
              </el-button-group>
            </div>
            <!--  
            <div class="actionInName">
              <div class="top">
                <svg-icon :style="yellow" v-show="scope.row.isTop === 1" @click="topContent(scope.$index, dataList)" icon-class="icon_star_fill" />
                <svg-icon :style="gray" v-show="scope.row.isTop != 1" @click="topContent(scope.$index, dataList)" icon-class="icon_star" />
              </div>
              <div class="roofPlacement">
                <svg-icon :style="green" v-show="scope.row.isTop === 1 && scope.row.roofPlacement == 1" @click="roofContent(scope.$index, dataList)" icon-class="icon_ping" />
                <svg-icon :style="gray" v-show="scope.row.isTop === 1 && scope.row.roofPlacement != 1" @click="roofContent(scope.$index, dataList)" icon-class="icon_ding" />
              </div>
            </div>
            -->
            <div class="containerTag">
              <el-tag size="mini" type="" v-for="tag in scope.row.listFormatTags" :key="tag._id">{{tag.name}}</el-tag>
              <el-tag size="mini" type="success" v-for="artist in scope.row.listRefs" :key="artist._id">{{artist.name}}</el-tag>
            </div>
            <!-- <div><span v-for="artist in scope.row.listRefs" :key="artist._id">{{artist.name+','}}</span></div> -->
            <div class="foot">{{scope.row.dateFull}}</div>              
          </el-col>
         <!-- <div v-else class="col-name hide" ><el-avatar :src="scope.row.sImg" :fit="cover"/>{{scope.row.name}}</div> -->
        </el-row>
      </el-table-column>
      <!-- 
      <el-table-column prop="date" :label="$t(nameMod+'.dateRelease')" width="180">
        <template slot-scope="scope">{{scope.row.date}}</template>
      </el-table-column>
      -->
      <!-- 其他链接PC -->
      <el-table-column v-if="!isMobile" class-name="table-column--links" prop="listLinks" :label="$t('record.listLinks')" min-width="70" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-badge :value="scope.row.listLinks.length" :hidden="scope.row.listLinks.length==0?true:false" :max="99" type="info">
            <el-button @click="eListLinksEdit(scope.$index,dataList)" size="large" plain icon="el-icon-link" :type="scope.row.listLinks.length==0?'':'primary'" circle></el-button>  
          </el-badge>          
        </template>
      </el-table-column>      
      <el-table-column class-name="table-column--tags" prop="tags" :label="$t('contents.tags')" min-width="100" show-overflow-tooltip>
        <div class="containerTag" slot-scope="scope">
          <el-tag size="mini" type="info" v-for="tag in scope.row.tags" :key="tag._id">{{tag.name}}</el-tag>
        </div>
      </el-table-column>

      <!-- 右侧固定栏 -->
      <el-table-column v-if="!isMobile" :label="$t('main.dataTableOptions')" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button-group>
            <el-button icon="el-icon-view" :type="scope.row.state==2?'':'info'" :disabled="scope.row.state!=2" size="large" @click="eLink('/timeline/records'+scope.row.url)" />
            <el-button icon="el-icon-edit" size="large" type="success" @click="editContentInfo(scope.$index, dataList)" plain/>
            <el-button icon="el-icon-delete" size="large" type="danger" plain @click="deleteContent(scope.$index, dataList)" />
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <DialogURL @complete="getList" :nameMod="nameMod" :label="$t('record.listLinks')" :dialogState="dialogStateLink" />
  </div>
</template>
<style lang="scss">
  @import "@root/publicMethods/sass/dataTable.scss";
</style>
<script>

import _ from "lodash";
// import { mapGetters, mapActions,createNamespacedHelpers} from "vuex";
// let mod = createNamespacedHelpers(nameMod)////模块,含mapGetters, mapActions等
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
    ...methods
  },
  computed: {
    ...computed,
  }
};
</script>
