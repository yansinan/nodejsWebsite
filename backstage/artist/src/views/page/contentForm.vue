<template>
  <div :class="classObj" class="dr-contentForm">
    <div class="main-container">
      <el-form
        :model="formState.formData"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="demo-ruleForm"
        :label-position="device == 'mobile' ? 'top' : 'right'"
      >
        <el-form-item :label="$t('contents.enable')" prop="state">
          <el-select size="small" v-model="formState.formData.state" placeholder="审核文章">
            <el-option
              v-for="item in contentState"
              :key="'kw_'+item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="formState.formData.state == '3'" label="驳回原因" prop="dismissReason">
          <el-input size="small" v-model="formState.formData.dismissReason"></el-input>
        </el-form-item>
        <el-form-item :label="$t(nameMod + '.name')" prop="name">
          <el-input size="small" v-model="formState.formData.name" ref="inputName" maxlength="50" show-word-limit>
            <el-tooltip slot="append" content="尝试搜索网易云音乐" placement="top" effect="light">
              <el-button type="success" plain :disabled="!(formState.formData.name)" icon="el-icon-cloudy" @click.prevent="eBnFetchNCM">搜索网易云音乐</el-button>
            </el-tooltip>            
          </el-input>
        </el-form-item>
        <el-form-item :label="$t(nameMod + '.nameAlias')" prop="alias">
          <el-input size="small" v-model="formState.formData.alias" :placeholder="'别名或英文名'" maxlength="50" show-word-limit></el-input>
        </el-form-item>
        <el-form-item :label="$t(nameMod + '.from')" prop="from">
          <el-input size="small" v-model="formState.formData.from" placeholder="中国/China" maxlength="20" show-word-limit></el-input>
        </el-form-item>
        <el-form-item :label="$t(nameMod + '.date')" prop="listDateDur">
          <el-date-picker
            v-model="formState.formData.listDateDur[0]"
            type="date"
            placeholder="加入日期">
          </el-date-picker>
          <icon class="el-icon-minus"/>
          <el-date-picker
            v-model="formState.formData.listDateDur[1]"
            type="date"
            placeholder="退出日期">
          </el-date-picker>
        </el-form-item>
        <!-- 乐队成员 -->
        <SelectIds :label="this.$t(nameMod+'.listMembers')" @change="eChangeMember" :listIds="formState.formData.listMembers" :nameMode="nameMod" apiAdd="/manage/regUser/addOneName" apiFind="/manage/regUser/findByName" :initTag="createMember"/>

        <div v-if="formState.formData.type == '1'">
          <SelectIds :label="this.$t(nameMod+'.tags')" @change="eChangeTag" :listIds="formState.formData.tags" :nameMode="nameMod" :initTag="createTag" />
          <el-form-item label="乐队关键字" prop="keywords">
            <el-input size="small" v-model="formState.formData.keywords"></el-input>
          </el-form-item>
        </div>
        <Cropper 
          :nameMod="nameMod"
          v-model="formState.formData.sImg" 
          :label="$t('contents.sImg')" 
          prop="sImg"></Cropper>
        <el-form-item :label="$t('contents.discription')" prop="discription">
          <el-input size="small" type="textarea" v-model="formState.formData.discription" maxlength="300" show-word-limit :autosize="{minRows: 4, maxRows: 10 }"></el-input>
        </el-form-item>
        <el-form-item :label="$t('contents.comments')" prop="comments">
          <!-- <Ueditor @ready="editorReady" ref="ueditor"></Ueditor> -->
          <vue-ueditor-wrap
            class="editorForm"
            @ready="editorReady"
            v-model="formState.formData.comments"
            :config="editorConfig"
          ></vue-ueditor-wrap>
        </el-form-item>
        <!-- 热门歌曲：相关链接 -->
        <el-form-item :label="$t(nameMod + '.listHotMusics')" prop="listHotMusics">
          <ListURL v-model="formState.formData.listHotMusics" label="热门歌曲"></ListURL>
        </el-form-item>
        <el-form-item :label="$t(nameMod + '.listLinks')" prop="listLinks">
          <ListURL v-model="formState.formData.listLinks" label="其他链接" ref="listLinks"></ListURL>
        </el-form-item>
        <el-form-item class="" style="text-align:right;"><!-- dr-submitContent -->
          <el-button size="medium" type="primary" @click="submitForm('ruleForm')">{{formState.edit ? $t('main.form_btnText_update') : $t('main.form_btnText_save')}}</el-button>
          <el-button size="medium" @click="backToList">{{$t('main.back')}}</el-button>
        </el-form-item>
      </el-form>
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
import VueUeditorWrap from "vue-ueditor-wrap";
import { initEvent } from "@root/publicMethods/events";
import {methods,initData,data,props} from "@root/publicMethods/vue/contentForm";

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
      editorConfig: {
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 240,
        // 初始容器宽度
        initialFrameWidth: "100%",
        // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
        serverUrl: "/api/upload/ueditor",
        // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
        UEDITOR_HOME_URL: this.$root.staticRootPath + "/plugins/ueditor/"
      },
      rules: {
        sImg: [
          {
            required: true,
            message: this.$t("validate.selectNull", {
              label: "缩略图"
            }),
            trigger: "blur"
          }
        ],
        name: [
          {
            required: true,
            message: this.$t("validate.inputNull", {
              label: this.$t("contents.name")
            }),
            trigger: "blur"
          },
          {
            min: 1,
            max: 50,
            message: this.$t("validate.rangelength", { min: 1, max: 50 }),
            trigger: "blur"
          }
        ],
        tags: [
          {
            validator: (rule, value, callback) => {
              if (_.isEmpty(value)) {
                callback(
                  new Error(
                    this.$t("validate.selectNull", {
                      label: this.$t("contents.tags")
                    })
                  )
                );
              } else {
                callback();
              }
            },
            trigger: "change"
          }
        ],
        discription: [
          {
            required: true,
            message: this.$t("validate.inputNull", {
              label: this.$t("contents.discription")
            }),
            trigger: "blur"
          },
          {
            min: 5,
            max: 300,
            message: this.$t("validate.rangelength", { min: 5, max: 100 }),
            trigger: "blur"
          }
        ],
        comments: [
          {
            required: true,
            message: this.$t("validate.inputNull", {
              label: this.$t("contents.comments")
            }),
            trigger: "blur"
          },
          {
            min: 5,
            message: this.$t("validate.rangelength", { min: 5, max: 100000 }),
            trigger: "blur"
          }
        ],
      }, 
      objDataNCM:{isPop:false,isFetched:false},//用于存储网易云抓取结果
    };
  },
  components: {
    VueUeditorWrap,
    ListURL: () => import('@root/publicMethods/vue/ListURL.vue'),
    Cropper: () => import('@root/publicMethods/vue/Cropper.vue'),
    SelectIds: () => import('@root/publicMethods/vue/SelectIds.vue'),
  },
  methods: {
    ...methods,

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
    // SelectIds变化;
    // {
    //     listObjDiff:listObjDiff,
    //     listIds:listIds,
    //     strAction:(isAdd?"add":"delete")
    // }
    eChangeTag(e){
      this.formState.formData.tags=e.listIds;
      this.updateKeywords(e.listObjDiff,e.strAction=="delete");
    },
    // 创建新标签时上传的基本数据
    createTag(v){
      return {
          name:v,
          comments:"即时创建",
          alias:v,
      }
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
      that.formState.formData.comments=that.formState.formData.comments?that.formState.formData.comments:(that.objDataNCM.comments.txt || "");
      let isLinked=that.formState.formData.listLinks.find(v=>(v.url==that.objDataNCM.link));
      if(!isLinked)that.$refs.listLinks.eAddURL(that.objDataNCM.link);
      console.warn("网易云音乐数据自动填充",that.objDataNCM);
      that.objDataNCM.isPop=false;
    },
  },
  computed: {
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
