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
      <!-- 展开行 -->
      <el-table-column v-if="isMobile" type="expand" width="20">
        <div class="expandedContainer" slot-scope="props">
          <div class="listBadges">
            <!-- 图集 -->
            <el-badge :value="props.row.listImages.length" :hidden="props.row.listImages.length==0?true:false" :max="99" type="info">
              <el-button @click="eAlbumEdit(props.$index,dataList)" size="large" plain icon="el-icon-picture-outline" :type="props.row.listImages.length==0?'':'primary'" circle></el-button>  
            </el-badge>
            <!-- 专辑 -->
            <el-badge :value="props.row.cntRecords" :hidden="props.row.cntRecords==0?true:false" :max="99" type="info">
              <el-button @click="eRecordEdit(props.$index,dataList)" size="large" plain icon="el-icon-files" :type="props.row.cntRecords==0?'':'primary'" circle></el-button>  
            </el-badge>
            <!-- 视频 -->
            <el-badge :value="props.row.listVideos.length" :hidden="props.row.listVideos.length==0?true:false" :max="99" type="info">
              <el-button @click="eListVideosEdit(props.$index,dataList)" size="large" plain icon="el-icon-video-camera" :type="props.row.listVideos.length==0?'':'primary'" circle></el-button>  
            </el-badge>          
            <!-- 热门歌曲 -->
            <el-badge :value="props.row.listHotMusics.length" :hidden="props.row.listHotMusics.length==0?true:false" :max="99" type="info">
              <el-button @click="eListHotMusicsEdit(props.$index,dataList)" size="large" plain icon="el-icon-headset" :type="props.row.listHotMusics.length==0?'':'primary'" circle></el-button>  
            </el-badge>          
            <!-- 其他链接 -->
            <el-badge :value="props.row.listLinks.length" :hidden="props.row.listLinks.length==0?true:false" :max="99" type="info">
              <el-button @click="eListLinksEdit(props.$index,dataList)" size="large" plain icon="el-icon-link" :type="props.row.listLinks.length==0?'':'primary'" circle></el-button>  
            </el-badge>
          </div>
          <!-- 标签 -->
          <div class="containerTag">
              <el-tag size="mini" type="success" v-for="tag in props.row.listMembers" :key="tag">{{tag.name}}</el-tag>
              <el-tag size="mini" type="info" v-for="tag in props.row.tags" :key="tag._id">{{tag.name}}</el-tag>
          </div>
          <!-- 时间@地点 -->
          <div class="info">
            <div class="foot">来自：{{props.row.from}}</div>              
            <div class="foot">{{parseTime(props.row.dateStart,"{y}-{m}-{d}")}} 至 {{props.row.dateEnd ? parseTime(props.row.dateEnd,"{y}-{m}-{d}") : "今"}}</div>              
          </div>
        </div>
      </el-table-column>
      <!-- 复选框 -->
      <el-table-column type="selection" width="25"></el-table-column>

      <!-- 名称 -->
      <el-table-column class-name="table-column--name" prop="name" :label="$t('docs.name')" min-width="300">
        <el-row :gutter="20" slot-scope="scope">
          <el-col class="sImg">
            <el-avatar :src="scope.row.sImg" fit="cover" :size="70"  shape="square" />
          </el-col>
          <!-- 名称和功能 -->
          <el-col class="col-name" style="text-align:left;min-width:128px;">
            <!-- 名称 -->
            <el-button type="text" size="large" @click="editContentInfo(scope.$index, dataList)" >{{scope.row.name}}  <i class="el-icon-edit" /></el-button>
            <!-- 置顶/推荐 -->
            <div class="actionInName">
              <el-button-group>
                <el-button v-if="isMobile" icon="el-icon-view" :type="scope.row.state!=2?'':'primary'" plain :disabled="scope.row.state!=2" size="medium" @click="eLink('/timeline/artists'+scope.row.url)" />
                <el-tooltip content="推荐" placement="top" effect="light">
                  <el-button :icon="scope.row.isTop === 1?'el-icon-star-on':'el-icon-star-off'" size="medium" :type="scope.row.isTop === 1?'warning':''" @click="topContent(scope.$index, dataList)" plain/>
                </el-tooltip>
                <el-tooltip content="置顶" placement="top" effect="light">
                  <el-button v-show="scope.row.isTop===1" :icon="scope.row.isTop === 1 && scope.row.roofPlacement == 1?'el-icon-medal-1':'el-icon-medal'" size="medium" :type="scope.row.isTop === 1 && scope.row.roofPlacement == 1?'danger':''" @click="roofContent(scope.$index, dataList)"  plain/>
                </el-tooltip>
              </el-button-group>
            </div>
          </el-col>
        </el-row>
      </el-table-column>
      <!-- 图 -->
      <el-table-column class-name="table-column--links" prop="listImages" :label="$t('artist.listImages')" min-width="70" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-badge :value="scope.row.listImages.length" :hidden="scope.row.listImages.length==0?true:false" :max="99" type="info">
            <el-button @click="eAlbumEdit(scope.$index,dataList)" size="large" plain icon="el-icon-picture-outline" :type="scope.row.listImages.length==0?'':'primary'" circle></el-button>  
          </el-badge>
        </template>
      </el-table-column>
      <!-- 专辑 -->
      <el-table-column class-name="table-column--links" prop="listRecords" :label="$t('artist.listRecords')" min-width="70" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-badge :value="scope.row.cntRecords" :hidden="scope.row.cntRecords==0?true:false" :max="99" type="info">
            <el-button @click="eRecordEdit(scope.$index,dataList)" size="large" plain icon="el-icon-files" :type="scope.row.cntRecords==0?'':'primary'" circle></el-button>  
          </el-badge>
        </template>
      </el-table-column>
      <!-- 视频 -->
      <el-table-column class-name="table-column--links" prop="listVideos" :label="$t('artist.listVideos')" min-width="70" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-badge :value="scope.row.listVideos.length" :hidden="scope.row.listVideos.length==0?true:false" :max="99" type="info">
            <el-button @click="eListVideosEdit(scope.$index,dataList)" size="large" plain icon="el-icon-video-camera" :type="scope.row.listVideos.length==0?'':'primary'" circle></el-button>  
          </el-badge>          
        </template>
      </el-table-column>      
      <!-- 热门歌曲 -->
      <el-table-column class-name="table-column--links" prop="listHotMusics" :label="$t('artist.listHotMusics')" min-width="70" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-badge :value="scope.row.listHotMusics.length" :hidden="scope.row.listHotMusics.length==0?true:false" :max="99" type="info">
            <el-button @click="eListHotMusicsEdit(scope.$index,dataList)" size="large" plain icon="el-icon-headset" :type="scope.row.listHotMusics.length==0?'':'primary'" circle></el-button>  
          </el-badge>          
        </template>
      </el-table-column>      
      <!-- 其他链接 -->
      <el-table-column class-name="table-column--links" prop="listLinks" :label="$t('artist.listLinks')" min-width="70" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-badge :value="scope.row.listLinks.length" :hidden="scope.row.listLinks.length==0?true:false" :max="99" type="info">
            <el-button @click="eListLinksEdit(scope.$index,dataList)" size="large" plain icon="el-icon-link" :type="scope.row.listLinks.length==0?'':'primary'" circle></el-button>  
          </el-badge>          
        </template>
      </el-table-column>      

      <!-- 右侧固定栏 -->
      <el-table-column v-if="!isMobile" :label="$t('main.dataTableOptions')" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button-group>
            <el-button icon="el-icon-view" :type="scope.row.state==2?'':'info'" :disabled="scope.row.state!=2" size="large" @click="eLink('/artists/news/'+scope.row.url)" />
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
  // .el-table__body td.el-table__expand-column{
  //   // display:table-cell;
  //   width:0px;
  //   @media only screen and (min-width: 768px){
  //     // display:none;
  //     width:0px;
  //   }    
  // }
  .el-table__expanded-cell{
    .expandedContainer{
      display:flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      max-width:75vw;   
      .listBadges{
        display: flex;
        justify-content: space-between;
        flex: 1 1 100%;
        width: 100%;
        .el-badge{
          // margin-right: 6vw;
        }
      }
      .info{

      }
      .listTags{
        display:flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
        flex-wrap: wrap;

      }
    }
  }
  .tableBox .el-table__expand-column .cell{
    padding-left:0px;
  }
  .tableBox .el-table-column--selection .cell{
    padding-left:10px;
  }
</style>
<script>
import { remove, roof, updateToTop } from "@root/publicMethods/apiGeneral";
// 相册上传
import Album from "../common/Album.vue";
// 相册上传
import Record from "../common/Record.vue";
// 时间格式化
import {parseTime} from "@/utils"
import {methods,props,data,computed} from "@root/publicMethods/vue/dataTable";

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
    // 时间格式化
    parseTime:parseTime,
  },
  computed: {
    ...computed,
  }
};
</script>
