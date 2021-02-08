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
          <el-input size="small" v-model="formState.formData.name" maxlength="50" show-word-limit></el-input>
        </el-form-item>
        <el-form-item :label="$t(nameMod + '.nameAlias')" prop="alias">
          <el-input size="small" v-model="formState.formData.alias" maxlength="50" show-word-limit></el-input>
        </el-form-item>
        <!-- 作者 -->
        <SelectIds :label="this.$t(nameMod+'.listArtists')" :allow-create="false" @change="eChangeArtist" :listIds="formState.formData.listRefs" :nameMode="nameMod" :apiAdd="false" apiFind="/manage/artist/getList" :initTag="false"/>

        <!-- 发行日期 -->
        <el-form-item :label="$t(nameMod + '.dateRelease')" prop="dateRelease">
          <el-date-picker v-model="formState.formData.dateRelease" type="date" placeholder="发行日期" @change="eChangeDate"/>
        </el-form-item>

        <!-- 发行介质 -->
        <SelectIds :label="this.$t(nameMod+'.listFormatTags')" @change="eChangeFormats" :listIds="formState.formData.listFormatTags" :nameMode="nameMod" apiFind="/api/record/listAllFormats" :initTag="createFormatTag"/>
        <!-- 标签 -->
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
        <!-- 发行编号 -->
        <el-form-item :label="$t(nameMod + '.catalog')" prop="catalog">
          <el-input size="small" v-model="formState.formData.catalog" placeholder=""></el-input>
        </el-form-item>

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
        <el-form-item :label="$t(nameMod + '.listLinks')" prop="listLinks">
          <ListURL v-model="formState.formData.listLinks" label="购买链接" ref="listLinks"></ListURL>
        </el-form-item>

        <el-form-item class="" style="text-align:right;"><!-- dr-submitContent -->
          <el-button size="medium" type="primary" @click="submitForm('ruleForm')">{{formState.edit ? $t('main.form_btnText_update') : $t('main.form_btnText_save')}}</el-button>
          <el-button size="medium" @click="backToList">{{$t('main.back')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
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
    groups: Array
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
    
    // SelectIds变化::listFormatTags;
    eChangeFormats(e){
      let that=this;
      that.formState.formData.listFormatTags=e.listIds;
      if(e.strAction=="delete"){
        that.formState.formData.tags=that.formState.formData.tags.filter(v=>{
          //看tags里是否有  新删除的
          return !e.listObjDiff.find(objDiff=>(objDiff._id==v));
        })
      }else{
        // tags去重添加
        that.formState.formData.tags=[...new Set(that.formState.formData.tags.concat(e.listIds))];
      }
      that.updateKeywords(e.listObjDiff,e.strAction=="delete");
    },
    // 创建新发行方式标签时上传的基本数据
    createFormatTag(v){
      return {
          name:v,
          comments:"发行介质",
          alias:v,
      }
    },
    // SelectIds变化::listRefs;
    eChangeArtist(e){
      this.formState.formData.listRefs=e.listIds;
      this.updateKeywords(e.listObjDiff,e.strAction=="delete");
    },
    // SelectIds变化::Tags;
    // {
    //     listObjDiff:listObjDiff,
    //     listIds:listIds,
    //     strAction:(isAdd?"add":"delete")
    // }
    eChangeTag(e){
      this.formState.formData.tags=e.listIds;
      this.updateKeywords(e.listObjDiff,e.strAction=="delete");
    },

  },
  computed: {
    ...mapGetters(["contentCategoryList"]),
    // formState() {
    //   return this.$store.getters.contentFormState;
    // },
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
