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
      <el-table-column prop="name" :label="$t('docs.name')" min-width="250" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-avatar :src="scope.row.sImg" fit="cover" size="large" :style="scope.row.state!=2 ? 'filter: opacity(0.5) grayscale(1);' : ''"/>
          <el-button type="text" size="large" @click="editContentInfo(scope.$index, dataList)" :style="scope.row.state!=2 ? 'filter: opacity(0.5) grayscale(1);' : ''">{{scope.row.name}}  <i class="el-icon-edit" /></el-button>
          <!-- <div v-else class="col-name hide" ><el-avatar :src="scope.row.sImg" :fit="cover"/>{{scope.row.name}}</div> -->
        </template>
      </el-table-column>
      <!-- 图 -->
      <el-table-column class-name="table-column--links" prop="listImages" :label="$t('artist.listImages')" width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-badge :value="scope.row.listImages.length" :hidden="scope.row.listImages.length==0?true:false" :max="99" type="info">
            <el-button @click="eAlbumEdit(scope.$index,dataList)" size="large" plain icon="el-icon-picture-outline" :type="scope.row.listImages.length==0?'':'primary'" circle></el-button>  
          </el-badge>
        </template>
      </el-table-column>
      <!-- 专辑 -->
      <el-table-column class-name="table-column--links" prop="listRecords" :label="$t('artist.listRecords')" width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-badge :value="scope.row.cntRecords" :hidden="scope.row.cntRecords==0?true:false" :max="99" type="info">
            <el-button @click="eRecordEdit(scope.$index,dataList)" size="large" plain icon="el-icon-files" :type="scope.row.cntRecords==0?'':'primary'" circle></el-button>  
          </el-badge>
        </template>
      </el-table-column>
      <!-- 视频 -->
      <el-table-column class-name="table-column--links" prop="listVideos" :label="$t('artist.listVideos')" width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-badge :value="scope.row.listVideos.length" :hidden="scope.row.listVideos.length==0?true:false" :max="99" type="info">
            <el-button @click="eListVideosEdit(scope.$index,dataList)" size="large" plain icon="el-icon-video-camera" :type="scope.row.listVideos.length==0?'':'primary'" circle></el-button>  
          </el-badge>          
        </template>
      </el-table-column>      
      <!-- 热门歌曲 -->
      <el-table-column class-name="table-column--links" prop="listHotMusics" :label="$t('artist.listHotMusics')" width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-badge :value="scope.row.listHotMusics.length" :hidden="scope.row.listHotMusics.length==0?true:false" :max="99" type="info">
            <el-button @click="eListHotMusicsEdit(scope.$index,dataList)" size="large" plain icon="el-icon-headset" :type="scope.row.listHotMusics.length==0?'':'primary'" circle></el-button>  
          </el-badge>          
        </template>
      </el-table-column>      
      <!-- 其他链接 -->
      <el-table-column class-name="table-column--links" prop="listLinks" :label="$t('artist.listLinks')" width="80" show-overflow-tooltip>
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
            <el-button icon="el-icon-view" :type="scope.row.state?'':'info'" :disabled="!scope.row.state" size="large" @click="eLink('/artists/news/'+scope.row.url)" />
            <el-button icon="el-icon-edit" size="large" type="success" @click="editContentInfo(scope.$index, dataList)" plain/>
            <el-button icon="el-icon-delete" size="large" type="danger" plain @click="deleteContent(scope.$index, dataList)" />
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <Album 
      :nameMod="nameMod"
      :label="$t('artist.listImages')"
      :dialogState="dialogStateAlbum"
      :on-complete="getList" />
    <DialogURL @complete="getList" :nameMod="nameMod" :label="$t('artist.listHotMusics')" :dialogState="dialogStateMusic" />
    <DialogURL @complete="getList" :nameMod="nameMod" :label="$t('artist.listLinks')" :dialogState="dialogStateLink" />
    <ListVideos @complete="getList" :nameMod="nameMod" :label="$t('artist.listVideos')" :dialogState="dialogStateVideos" />
    <Record 
      :label="$t('artist.listRecords')"
      :dialogState="dialogStateRecord"
      @complete="getList" />
  </div>
</template>
<style lang="scss">
  @import "@root/publicMethods/sass/dataTable.scss";
</style>
<script>
import { remove, roof, updateToTop } from "@root/publicMethods/apiGeneral";
// 相册上传
import Album from "../common/Album.vue";
// 相册上传
import Record from "../common/Record.vue";
import {methods,props,data} from "@root/publicMethods/vue/dataTable";

import _ from "lodash";
// import { mapGetters, mapActions,createNamespacedHelpers} from "vuex";
// let mod = createNamespacedHelpers(nameMod)////模块,含mapGetters, mapActions等

export default {
  props: {
    ...props,
  },
  data() {
    return {
      ...data,
      // 编辑图集弹窗
      dialogStateAlbum:{
        isShow:false,
        isEdited:false,
        formData:{},
      },
      // 编辑专辑弹窗
      dialogStateRecord:{
        isShow:false,
        isEdited:false,
        formData:{},
      },
      // 编辑热门歌曲弹窗
      dialogStateMusic:{
        isShow:false,
        isEdited:false,
        formData:{},
        strListObjURL:"listHotMusics"
      },
      // 编辑相关视频弹窗
      dialogStateVideos:{
        isShow:false,
        isEdited:false,
        formData:{},
        strListObjURL:"listVideos",
      },
    };
  },
  components: {
    Album,Record,
    DialogURL:() => import("@root/publicMethods/vue/DialogURL.vue"),
    ListVideos:()=> import("../common/ListVideos.vue"),

  },

  methods: {
    ...methods,
    // 编辑图集;
    eAlbumEdit(index,rows){
      this.dialogStateAlbum = {
        // _id: contentData._id,
        // name:contentData.name,
        // listImages: contentData.listImages,
        isShow:true,
        isEdited:false,
        formData:rows[index],
      };
    },
    // 编辑专辑列表
    eRecordEdit(index,rows){
      this.dialogStateRecord = {
        isShow:true,
        isEdited:false,
        formData:rows[index],
      };
    },
    // 编辑热门歌曲;
    eListHotMusicsEdit(index,rows){
      this.dialogStateMusic = {
        isShow:true,
        isEdited:false,
        formData:rows[index],
        strListObjURL:"listHotMusics",
      };
    },
    // 编辑视频列表;
    eListVideosEdit(index,rows){
      this.dialogStateVideos = {
        isShow:true,
        isEdited:false,
        formData:rows[index],
        strListObjURL:"listVideos",
      };
    },
  },
  computed: {}
};
</script>
