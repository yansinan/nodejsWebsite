<template>
  <div :class="classObj" class="dr-contentForm">
    <div class="main-container">
        <!--  @submit="eFormSubmit" -->
        <ContentForm :nameMod="nameMod" :aspectRatio="1.2278" v-model="formState">
          <template v-slot:leftTop>
            <!-- 乐队名 -->
            <el-form-item :label="$t(nameMod + '.name')" prop="name">
              <el-input size="small" v-model="formState.formData.name" ref="inputName" maxlength="50" show-word-limit>
                <el-tooltip slot="append" content="尝试搜索网易云音乐" placement="top" effect="light">
                  <el-button type="success" plain :disabled="!(formState.formData.name)" icon="el-icon-cloudy" @click.prevent="eBnFetchNCM">搜索网易云音乐</el-button>
                </el-tooltip>            
              </el-input>
            </el-form-item>
          </template>

          <template v-slot:leftMiddle>
            <!-- 日期&地点 -->
            <el-row v-if="formState.formData" :gutter="40" type="flex" justify="space-between" style="flex-wrap: wrap;">
              <el-col :lg="16">
                <el-form-item prop="listDateDur">
                  <el-row :gutter="5" type="flex" justify="space-around"  align="middle" style="flex-wrap: nowrap;min-width: min-content;max-width: fit-content;">
                    <el-col :span="11">
                      <el-date-picker
                        v-model="formState.formData.listDateDur[0]"
                        type="date"
                        :span="12"
                        placeholder="加入日期">
                      </el-date-picker>
                    </el-col> 
                    <el-col :span="1" style="min-width: min-content;">
                      <icon class="el-icon-minus"/>
                    </el-col> 
                    <el-col :span="11">
                      <el-date-picker
                        v-model="formState.formData.listDateDur[1]"
                        :span="12"
                        type="date"
                        placeholder="退出日期">
                      </el-date-picker>
                    </el-col> 
                  </el-row>
                </el-form-item>
              </el-col> 
              <el-col :lg="8" style="min-width: min-content;">
                <el-form-item prop="from">
                  <el-input v-model="formState.formData.from" placeholder="中国/China" maxlength="20" show-word-limit><template slot="suffix">{{$t(nameMod + '.from')}}</template></el-input>
                </el-form-item>
              </el-col> 
            </el-row>
            <!-- 乐队成员 -->
            <SelectIds :label="$t(nameMod+'.listMembers')" @change="eChangeMember" :listIds="formState.formData.listMembers" :nameMode="nameMod" apiAdd="/manage/regUser/addOneName" apiFind="/manage/regUser/findByName" :initTag="createMember"/>
          </template>

          <template v-slot:footer>
            <!-- 相关链接 -->
            <ListURL v-model="formState.formData.listLinks" label="其他链接" ref="listLinks"></ListURL>
            <!-- 热门歌曲 -->
            <ListURL v-model="formState.formData.listHotMusics" label="热门歌曲"></ListURL>
          </template>
        </ContentForm>
    </div>

    <!-- 网易云结果 -->
    <el-dialog
      title="网易云音乐搜索结果"
      width="80%"
      :visible.sync="objDataNCM.isPop">
      <!-- <el-card v-if="objDataNCM.nameNCM" :body-style="{ padding: '0px' }"> -->
        <el-image :src="objDataNCM.sImg" :fit="contain" :span="24"/>
        <div style="overflow:hidden;text-overflow: ellipsis;">{{objDataNCM.nameNCM}}({{objDataNCM.alias || "无别名"}})：<a :href="objDataNCM.link" target="_blank">{{ objDataNCM.link }}</a></div>
        <div style="padding: 14px;">
          <el-divider content-position="left">简介</el-divider>
          <div style="max-height:100px;overflow:overlay;text-overflow:ellipsis;">{{objDataNCM.discription}}</div>
          <el-divider content-position="left">详细介绍</el-divider>
          <div style="max-height:100px;overflow:overlay;text-overflow:ellipsis;">{{objDataNCM.comments}}</div>
          <!-- <div class="bottom clearfix">
            <el-button type="primary" size="mini" @click="eBnSetNcm">使 用</el-button>
          </div> -->
        </div>
      <!-- </el-card> -->
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="objDataNCM.isPop = false">忽 略</el-button>
        <el-button type="primary" size="mini" @click="eBnSetNcm">使 用</el-button>
      </div>
      <!-- <el-button slot="reference" type="success" plain :disabled="!(formState.formData.name)" icon="el-icon-cloudy" @click.prevent="eBnFetchNCM">搜索网易云音乐</el-button> -->
    </el-dialog>
  </div>
</template>

<style lang="scss"> 
@import "@root/publicMethods/sass/contentForm.scss";
</style>

<script>
import '@/set-public-path'
import { initEvent } from "@root/publicMethods/events";
import {methods,initData,components,data,props,computed} from "@root/publicMethods/vue/contentForm";

import _ from "lodash";
import { mapGetters, mapActions,createNamespacedHelpers} from "vuex";
const mod = createNamespacedHelpers(nameMod)////模块,含mapGetters, mapActions等

export default {
  props: {
    ...props,
  },
  data() {
    return {
      ...data,
      nameMod:nameMod,
      objDataNCM:{isPop:false,isFetched:false},//用于存储网易云抓取结果
    };
  },
  components: {
    ...components,
    ContentForm: () => import('@root/publicMethods/vue/ContentForm.vue'),//表格头部

  },
  methods: {
    //...methods,
    backToList:methods.backToList,
    updateKeywords:methods.updateKeywords,
    getLocalContents:methods.getLocalContents,

    //获取表单信息
    ...mod.mapActions(["showContentForm"]),// 将 `this.showContentForm(params)` 映射为 `this.$store.dispatch(nameMod+'/incrementBy', params)`

    // 创建新乐手时上传的基本数据
    createMember(v){
      return {
        name:v,
        comments:"即时创建",
        group:"乐手",
      }
    },
    // SelectIds变化;
    eChangeMember(e){
      this.formState.formData.listMembers=e.listIds;
      this.updateKeywords(e.listObjDiff,e.strAction=="delete");
    },

    // 名字改变，搜索网易云
    eBnFetchNCM(e){
      let that=this;
      let strName=that.$refs.inputName.value;
      that.objDataNCM.isFetched=false;
      fetch("/api/artist/fetchNCMArtist?name="+strName)
      .then((data)=>data.text())
      .then((data)=> {
          // 在这个then里面我们能拿到最终的数据
          let res=JSON.parse(data);
          if(res.status==200 && res.data && res.data.idNCM){

            that.$message({
              message: "网易云音乐数据自动填充",
              type: "success"
            });
            // idNCM: resNCM.data.artist.id,
            // sImg:resNCM.data.artist.cover,// "https://p1.music.126.net/yYudcBFmVRCDdDnGjK5HFQ==/109951164565744552.jpg",
            // discription:resNCM.data.artist.briefDesc,
            // alias:resNCM.data.artist.transNames[0] || "",
            // comments:"",
            that.objDataNCM=Object.assign(that.objDataNCM,res.data,{isPop:true,isFetched:true});           

          }else{
            that.$message.error(
              that.$t("validate.inputCorrect", { label: "网易云音乐未找到数据" })
            );
          }
      })
    },
    // 使用网易云数据
    eBnSetNcm(e){
      let that=this;
      that.formState.formData.idNCM=that.formState.formData.idNCM?that.formState.formData.idNCM:that.objDataNCM.idNCM;
      that.formState.formData.sImg=(that.formState.formData.sImg && that.formState.formData.sImg!="/static/upload/images/defaultImg.jpg")?that.formState.formData.sImg:(that.objDataNCM.sImg || "");
      that.formState.formData.discription=that.formState.formData.discription?that.formState.formData.discription:(that.objDataNCM.discription || "");
      that.formState.formData.alias=that.formState.formData.alias?that.formState.formData.alias:(that.objDataNCM.alias || "");
      that.formState.formData.comments=that.formState.formData.comments?that.formState.formData.comments:(that.objDataNCM.comments.txt || that.formState.formData.discription);
      let isLinked=that.formState.formData.listLinks.find(v=>(v.url==that.objDataNCM.link));
      if(!isLinked)that.$refs.listLinks.eAddURL(that.objDataNCM.link);
      console.warn("网易云音乐数据自动填充",that.objDataNCM);
      that.objDataNCM.isPop=false;
    },
  },
  computed: {
    ...computed,
    ...mapGetters(["contentCategoryList"]),//"regUserList",
    ...mod.mapState({
      formState: state => state.formState,
    }),//模块的state
  },
  mounted() {
    initEvent(this);
    initData(this);
  }
};
</script>
