<template>
  <ContentForm :nameMod="nameMod" v-model="formState" ref="contentForm">
    <template v-slot:top>
      <el-form-item v-if="!formState.edit" :label="'公众号文章链接'">
        <LinkWX v-model="formState.formData" />
      </el-form-item>
    </template>
    <!-- 大标题:不知道为什么必须要设置一个，否则模板识别出错 -->
    <template v-slot:leftTop>
      <el-form-item prop="name">
        <el-input v-model="formState.formData.name" maxlength="100" show-word-limit><template slot="suffix" style="color:red;">{{$t(nameMod + '.name')}}</template><!-- <label slot="suffix" class="el-form-item__label">{{$t(nameMod + '.name')}}</label> --></el-input>
      </el-form-item>
    </template>

    <template v-slot:leftMiddle>
      <!-- 日期&地点 -->
      <el-row v-if="formState.formData" :gutter="40" type="flex" justify="space-between" style="flex-wrap: wrap;">
        <el-col :lg="15" style="min-width: min-content;">
          <el-form-item prop="listDateDur"><!-- :label="$t(nameMod + '.listDateDur')"  -->
            <!-- 
            <el-date-picker
              v-model="formState.formData.listDateDur"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
              @change="eChangeDate">
            </el-date-picker>
            -->
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
          <el-form-item prop="location">
            <el-input v-model="formState.formData.location" placeholder="" maxlength="10"><template slot="suffix">{{$t(nameMod + '.location')}}</template></el-input>
          </el-form-item>
        </el-col> 
      </el-row>

    </template>

    <template v-slot:footer>
      <!-- 热门歌曲：相关链接 -->
        <ListURL v-model="formState.formData.listLinks" label="购买链接" ref="listLinks"></ListURL>
    </template>
  </ContentForm>
</template>
<style lang="scss">
</style>
<script>
const nameMod="show";
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
    LinkWX:components.LinkWX,
    ListURL:components.ListURL,
    ContentForm: () => import('@root/publicMethods/vue/ContentForm.vue'),//表格头部
  },
  methods: {
    //获取表单信息
    ...mod.mapActions(["showContentForm"]),// 将 `this.showContentForm(params)` 映射为 `this.$store.dispatch(nameMod+'/incrementBy', params)`
    //backToList，getLocalContents在initData里使用
    backToList:methods.backToList,
    getLocalContents:methods.getLocalContents,
  },
  computed: {
    ...mapGetters(["contentCategoryList",]),//"regUserList","contentTagList", 
    ...mod.mapState({
      formState: state => state.formState,
      dataArtists:state => state.dataArtists,
    }),//模块的state
    // listAllTags(){
    //   return this.$refs.contentForm.listAllTags || [];
    // },
  },
  mounted() {
    initData(this);
    // initVuex(this);
  }
};
</script>
