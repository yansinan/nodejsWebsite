<template>
  <div :class="classObj" class="dr-contentForm">
    <div class="main-container">
        <!--  @submit="eFormSubmit" -->
        <ContentForm :nameMod="nameMod" v-model="formState">
          <template v-slot:leftMiddle>
            <!-- 日期&地点 -->
            <el-row v-if="formState.formData" :gutter="40" type="flex" justify="space-between" style="flex-wrap: wrap;">
              <el-col :lg="15" style="min-width: min-content;">
                <el-form-item prop="listDateDur"><!-- :label="$t(nameMod + '.listDateDur')"  -->
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
                </el-form-item>
              </el-col> 
              <el-col :lg="8" style="min-width: min-content;">
                <el-form-item prop="location">
                  <el-input v-model="formState.formData.location" placeholder="" maxlength="10"><template slot="suffix">{{$t(nameMod + '.location')}}</template></el-input>
                </el-form-item>
              </el-col> 
            </el-row>

            <!-- 作者 -->
            <SelectIds v-if="formState.formData" :label="$t(nameMod+'.listArtists')" :allow-create="false" @change="eChangeArtist" :listIds="formState.formData.listRefs" :nameMode="nameMod" :apiAdd="false" apiFind="/manage/artist/getList" :initTag="false"/>
          </template>

          <template v-slot:footer>
            <!-- 热门歌曲：相关链接 -->
            <el-form-item :label="$t(nameMod + '.listTicketLink')" prop="listTicketLink">
              <ListURL @list-changed="eListHotMusicChanged" label="购买链接" :listObjURL="formState.formData.listTicketLink"></ListURL>
            </el-form-item>
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
// import VueUeditorWrap from "vue-ueditor-wrap";
import { initEvent } from "@root/publicMethods/events";
import {methods,initData,components,data,props} from "@root/publicMethods/vue/contentForm";

import _ from "lodash";
import { mapGetters, mapActions,createNamespacedHelpers} from "vuex";
const mod = createNamespacedHelpers(nameMod)////模块,含mapGetters, mapActions等

export default {
  props: {
    ...props,
    groups: Array,
  },

  data() {
    return {
      ...data,


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

    // SelectIds变化::listRefs;
    eChangeArtist(e){
      this.formState.formData.listRefs=e.listIds;
      this.updateKeywords(e.listObjDiff,e.strAction=="delete");
    },


    // 热门歌曲列表变化
    eListHotMusicChanged(e){
      console.log("热门歌曲列表变化",e);
      // 链接验证失败
      if(!e){
          // TODO:优化表单验证的方式，目前这个错误数据仍然能够提交
          this.isValidate=false;

          this.$message.error(
            this.$t("validate.inputCorrect", { label: "热门歌曲链接" })
          );
        return;
      }
      this.formState.formData.listHotMusics=e;
    },
    //// 选择日期
    // eChangeDate(e){
    //   console.log("选取日期变化",e,this.formState.formData.listDateDur);
    // },
  },
  computed: {
    ...mapGetters(["contentTagList", "contentCategoryList",]),//"regUserList",
    // formState() {
    //   return this.$store.getters.contentFormState;
    // },
    ...mod.mapState({
      formState: state => state.formState,
      dataArtists:state => state.dataArtists,
    }),//模块的state
  },
  mounted() {
    initEvent(this);
    initData(this);
  }
};
</script>
