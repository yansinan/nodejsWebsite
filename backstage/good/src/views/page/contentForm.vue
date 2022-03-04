<template>
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
</template>

<script>
const nameMod="good";
import {methods,initData,components} from "@root/publicMethods/vue/contentForm";

import _ from "lodash";
import { mapGetters, mapActions,createNamespacedHelpers} from "vuex";
const mod = createNamespacedHelpers(nameMod)////模块,含mapGetters, mapActions等

export default {
  props: {},
  data() {
    return {
      nameMod:nameMod,
    };
  },
  components: {
    ListURL:components.ListURL,
    WebCrawler: () => import('@root/publicMethods/vue/WebCrawler.vue'),//爬虫
    ContentForm: () => import('@root/publicMethods/vue/ContentForm.vue'),//表格头部
  },
  methods: {
    //获取表单信息
    ...mod.mapActions(["showContentForm"]),// 将 `this.showContentForm(params)` 映射为 `this.$store.dispatch(nameMod+'/incrementBy', params)`
    //backToList，getLocalContents在initData里使用
    backToList:methods.backToList,
    getLocalContents:methods.getLocalContents,


    eWebCrawlerConfirm(e){
      if(e.url){
        let url=e.url.split("&spider_token")[0];
        this.$refs.listLinks.eAddURL(url);
      }
    }
  },
  computed: {
    ...mapGetters(["contentCategoryList",]),//"regUserList","contentTagList", 
    ...mod.mapState({
      formState: state => state.formState,
    }),//模块的state
  },
  mounted() {
    initData(this);
  }
};
</script>
