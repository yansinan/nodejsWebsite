<template>
  <div :class="classObj" class="dr-contentForm">
    <div class="main-container">
      <ContentForm :nameMod="nameMod" v-model="formState">
        <template v-slot:leftTop>
          <!-- 专辑名 -->
          <el-form-item prop="name">
            <el-input size="small" v-model="formState.formData.name" maxlength="50" show-word-limit><template slot="suffix">{{$t(nameMod + '.name')}}</template></el-input>
          </el-form-item>

        </template>

        <template v-slot:leftMiddle>
          <!-- 日期&地点 -->
          <el-row v-if="formState.formData" :gutter="40" type="flex" justify="space-between" style="flex-wrap: wrap;">
            <el-col :lg="12">
              <!-- 发行日期 -->
              <el-form-item prop="dateRelease">
                <el-date-picker v-model="formState.formData.dateRelease" type="date" placeholder="发行日期" @change="eChangeDate"/>
              </el-form-item>
            </el-col> 
            <el-col :lg="12" style="min-width: min-content;">
              <!-- 发行编号 -->
              <el-form-item prop="catalog">
                <el-input size="small" v-model="formState.formData.catalog" placeholder=""><template slot="suffix">{{$t(nameMod + '.catalog')}}</template></el-input>
              </el-form-item>
            </el-col> 
          </el-row>
          <!-- 作者 -->
          <SelectIds :label="$t(nameMod+'.listArtists')" :allow-create="false" @change="eChangeArtist" :listIds="formState.formData.listRefs" :nameMode="nameMod" :apiAdd="false" apiFind="/manage/artist/getList" :initTag="false"/>
          <!-- 发行介质 -->
          <SelectIds :label="$t(nameMod+'.listFormatTags')" @change="eChangeFormats" :listIds="formState.formData.listFormatTags" :nameMode="nameMod" apiFind="/api/record/listAllFormats" :initTag="createFormatTag"/>

        </template>

        <template v-slot:footer>
          <!-- 热门歌曲：相关链接 -->
          <ListURL v-model="formState.formData.listLinks" label="购买链接" ref="listLinks"></ListURL>
        </template>
      </ContentForm>

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
    ...components,
    ContentForm: () => import('@root/publicMethods/vue/ContentForm.vue'),//表格头部
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
    ...computed,
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
