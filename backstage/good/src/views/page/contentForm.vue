<template>
  <div :class="classObj" class="dr-contentForm">
    <div class="main-container">
        <!--  @submit="eFormSubmit" -->
        <ContentForm :nameMod="nameMod" v-model="formState" ref="contentForm">
          
          <template v-slot:top>
            <el-form-item v-if="!formState.edit" :label="'微店链接'">
              <WebCrawler @confirm="eWebCrawlerConfirm" v-model="formState.formData" :api="'/api/content/fetchArticle/weidian'" :urlKey="'weidian.com/item.html?'"/>
              <!-- <WebCrawler @confirm="eWebCrawlerConfirm" v-model="formState.formData" :api="'/api/content/fetchWX'" :urlKey="'mp.weixin.qq.com/s?'"/> -->
            </el-form-item>
          </template>
          <template v-slot:leftTop>
            <el-form-item prop="name">
              <el-input v-model="formState.formData.name" maxlength="50" show-word-limit><template slot="suffix" style="color:red;">{{$t(nameMod + '.name')}}</template><!-- <label slot="suffix" class="el-form-item__label">{{$t(nameMod + '.name')}}</label> --></el-input>
            </el-form-item>
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
const nameMod="good";
import { initEvent } from "@root/publicMethods/events";
import {methods,initData,initVuex,components,computed,data,props} from "@root/publicMethods/vue/contentForm";

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
    };
  },
  components: {
    ...components,
    WebCrawler: () => import('@root/publicMethods/vue/WebCrawler.vue'),//爬虫
    ContentForm: () => import('@root/publicMethods/vue/ContentForm.vue'),//表格头部
  },
  methods: {
    //获取表单信息
    ...mod.mapActions(["showContentForm"]),// 将 `this.showContentForm(params)` 映射为 `this.$store.dispatch(nameMod+'/incrementBy', params)`

    // ...methods,
    backToList:methods.backToList,
    updateKeywords:methods.updateKeywords,
    getLocalContents:methods.getLocalContents,
    eWebCrawlerConfirm(e){
      if(e.url){
        let url=e.url.split("&spider_token")[0];
        this.$refs.listLinks.eAddURL(url);
      }
    }
  },
  computed: {
    ...computed,
    ...mapGetters(["contentCategoryList",]),//"regUserList","contentTagList", 
    ...mod.mapState({
      formState: state => state.formState,
    }),//模块的state
    listAllTags(){
      return this.$refs.contentForm.listAllTags || [];
    },
  },
  mounted() {
    initEvent(this);
    initData(this);
  }
};
</script>
