<template>
  <ContentForm :nameMod="nameMod" v-model="formState" ref="contentForm">
    <template v-slot:leftTop>
      <!-- 专辑名 -->
      <el-form-item prop="name">
        <el-input size="small" v-model="formState.formData.name" maxlength="100" show-word-limit><template slot="suffix">{{$t(nameMod + '.name')}}</template></el-input>
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
      <!-- 发行介质 -->
      <SelectIds :label="$t(nameMod+'.listFormatTags')" @change="eChangeFormats" :listIds="formState.formData.listFormatTags" :nameMode="nameMod" apiFind="/api/record/listAllFormats" :initTag="createFormatTag"/>

    </template>

    <template v-slot:footer>
      <!-- 热门歌曲：相关链接 -->
      <ListURL v-model="formState.formData.listLinks" label="购买链接" ref="listLinks"></ListURL>
    </template>
  </ContentForm>
</template>

<script>
const nameMod="record";
import {initData,methods,components} from "@root/publicMethods/vue/contentForm";

import { mapGetters, mapActions,createNamespacedHelpers} from "vuex";
const mod = createNamespacedHelpers(nameMod)////模块,含mapGetters, mapActions等

export default {
  props: {
  },
  data() {
    return {
      nameMod:nameMod,
    };
  },
  components: {
    SelectIds:components.SelectIds,
    ListURL:components.ListURL,
    ContentForm: () => import('@root/publicMethods/vue/ContentForm.vue'),//表格头部
  },
  methods: {
    //获取表单信息
    ...mod.mapActions(["showContentForm"]),// 将 `this.showContentForm(params)` 映射为 `this.$store.dispatch(nameMod+'/incrementBy', params)`
    //backToList，getLocalContents在initData里使用
    backToList:methods.backToList,
    getLocalContents:methods.getLocalContents,
    updateKeywords:methods.updateKeywords,

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
  },
  computed: {
    ...mapGetters(["contentCategoryList"]),
    ...mod.mapState({
      formState: state => state.formState,
    }),//模块的state
    // listAllTags(){
    //   return this.$refs.contentForm.listAllTags || [];
    // },
  },
  mounted() {
    initData(this);
  }
};
</script>
