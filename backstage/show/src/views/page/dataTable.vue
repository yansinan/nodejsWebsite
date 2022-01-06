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
      <!-- 名称 -->
      <el-table-column prop="sImg" :label="$t(nameMod+'.sImg')"  min-width="350" show-overflow-tooltip>
        <el-row :gutter="20" slot-scope="scope">
          <el-col :span="12">
            <el-avatar :src="scope.row.sImg" fit="cover" :size="128"  shape="square" />
          </el-col>
          <el-col :span="12" style="text-align:left">
            <el-button type="text" size="large" @click="editContentInfo(scope.$index, dataList)">{{scope.row.name}}  <i class="el-icon-edit" /></el-button>
            <div class="containerTag">
              <el-tag size="mini" type="success" v-for="artist in scope.row.listRefs" :key="artist._id">{{artist.name}}</el-tag>
            </div>
            <!-- <div><span v-for="artist in scope.row.listRefs" :key="artist._id">{{artist.name+','}}</span></div> -->
            <div >{{scope.row.date}}</div>              
          </el-col>
         <!-- <div v-else class="col-name hide" ><el-avatar :src="scope.row.sImg" :fit="cover"/>{{scope.row.name}}</div> -->
        </el-row>
      </el-table-column>
      <!-- 
      <el-table-column prop="name" :label="$t('docs.name')" min-width="350" show-overflow-tooltip>
        <template slot-scope="scope">
          <a :href="'/'+nameMod+'/'+scope.row._id+'.html'" target="_blank">{{scope.row.name}}</a>
        </template>
      </el-table-column>
       -->
      <!-- 
      <el-table-column prop="listRefs" :label="$t(nameMod+'.listArtists')" min-width="200"  show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-for="artist in scope.row.listRefs" :key="artist._id">{{artist.name+','}}</span>
        </template>
      </el-table-column>
       -->
      <el-table-column prop="tags" :label="$t('contents.tags')" min-width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag size="mini" type="info" v-for="tag in scope.row.tags" :key="tag._id">{{tag.name}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="date" :label="$t(nameMod+'.date')" width="100">
        <template slot-scope="scope">{{scope.row.date}}</template>
      </el-table-column>
      <el-table-column prop="location" :label="$t(nameMod+'.location')" width="50" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.location}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="listDateDur" :label="$t(nameMod+'.listDateDur')" width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.listDateDur[0]}}~{{scope.row.listDateDur[1] || ''}}</span>
        </template>
      </el-table-column>

      <!-- 其他链接 -->
      <el-table-column prop="listLinks" :label="$t('show.listLinks')" width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-badge :value="scope.row.listLinks.length" :hidden="scope.row.listLinks.length==0?true:false" :max="99" type="info">
            <el-button @click="eListLinksEdit(scope.$index,dataList)" size="large" plain icon="el-icon-link" :type="scope.row.listLinks.length==0?'':'primary'" circle></el-button>  
          </el-badge>          
        </template>
      </el-table-column>  
      
      <!-- 右侧固定栏 -->
      <el-table-column :label="$t('main.dataTableOptions')" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button-group>
            <el-button icon="el-icon-view" :type="scope.row.state?'':'info'" :disabled="!scope.row.state" size="large" @click="eLink('/timeline/shows/'+scope.row.url)" />
            <el-button icon="el-icon-edit" size="large" type="success" @click="editContentInfo(scope.$index, dataList)" plain/>
            <el-button icon="el-icon-delete" size="large" type="danger" plain @click="deleteContent(scope.$index, dataList)" />
          </el-button-group>
        </template>
      </el-table-column>  
    </el-table>
    <DialogURL @complete="getList" :nameMod="nameMod" :label="$t('show.listLinks')" :dialogState="dialogStateLink" />

  </div>
</template>
<style lang="scss">
  @import "@root/publicMethods/sass/dataTable.scss";
</style>
<script>
import _ from "lodash";
import {methods,props,data} from "@root/publicMethods/vue/dataTable";

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
  computed: {}
};
</script>
