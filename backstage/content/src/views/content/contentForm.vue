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
        <el-input v-model="formState.formData.name" maxlength="50" show-word-limit><template slot="suffix" style="color:red;">{{$t(nameMod + '.name')}}</template><!-- <label slot="suffix" class="el-form-item__label">{{$t(nameMod + '.name')}}</label> --></el-input>
      </el-form-item>
    </template>
    <template v-slot:leftMiddle>
      <!-- 上传word -->
      <el-row v-if="formState.formData" :gutter="40" type="flex" justify="space-between" style="flex-wrap: wrap;">
        <el-col :lg="12">
          <!-- 上传WORD -->
          <el-form-item prop="uploadWord">
            <el-upload
              class="upload-demo"
              action="/api/content/getWordHtmlContent"
              :on-preview="handleWordPreview"
              :on-remove="handleWordRemove"
              :before-remove="beforeWordRemove"
              :on-success="uploadWordSuccess"
              :before-upload="beforeWordUpload"
              multiple
              :limit="1"
              :on-exceed="handleWordExceed"
              :file-list="wordFileList"
            >
            <el-tooltip content="只能上传doc/docx文件，且不超过5mb" placement="top" effect="light">
              <el-button size="small" type="primary">{{$t('contents.uploadWord')}}</el-button>
            </el-tooltip>
              <!-- <div slot="tip" class="el-upload__tip"></div> -->
            </el-upload>
          </el-form-item>

        </el-col> 
        <el-col :lg="12" style="min-width: min-content;">
          <!-- 文章类别 -->
          <el-form-item prop="categories">
            <el-cascader
              disabled 
              size="small"
              expandTrigger="hover"
              :options="contentCategoryList.docs"
              v-model="formState.formData.categories"
              @change="handleChangeCategory"
              :props="categoryProps"
            ><template slot="suffix">{{$t('contents.categories')}}</template></el-cascader>
          </el-form-item>
        </el-col> 
      </el-row>
    </template>

  </ContentForm>
</template>

<script>
const nameMod="content";
import {methods,initData,components,} from "@root/publicMethods/vue/contentForm";
// word上传:相关函数在contentForm.js,import，


import {
  // getOneContent,
  // addContent,
  // updateContent,
  //getOne,
  //addOne,
  //updateOne,
  //getRandomContentImg,
  // regUserList,
} from "@/api/content";
import _ from "lodash";
import { mapGetters, mapActions,createNamespacedHelpers} from "vuex";
const mod = createNamespacedHelpers(nameMod)////模块,含mapGetters, mapActions等

// import _ from "lodash";
// import { mapGetters, mapActions } from "vuex";
export default {
  props: {
  },
  data() {
    return {
      nameMod:nameMod,
      wordFileList: [],
      wordFileUrl: "",

      selectUserList: [],
      // loading: false,
      userLoading: false,
      content: "",
      //simpleComments: "",
      //isflash: false,

      categoryProps: {
        value: "_id",
        label: "name",
        children: "children"
      },
    };
  },
  components: {
    LinkWX:components.LinkWX,
    ContentForm: () => import('@root/publicMethods/vue/ContentForm.vue'),//表格头部
  },
  methods: {
    //获取表单信息
    ...mod.mapActions(["showContentForm"]),// 将 `this.showContentForm(params)` 映射为 `this.$store.dispatch(nameMod+'/incrementBy', params)`

    //backToList，getLocalContents在initData里使用
    backToList:methods.backToList,
    getLocalContents:methods.getLocalContents,
    // updateKeywords:methods.updateKeywords,
    ...methods.funForWordUpload,


    //submitForm(formName, type = "") {
    //  this.$refs[formName].validate(async valid => {
    //    if (valid) {
    //      try {
    //        let params = Object.assign({}, this.formState.formData, {
    //          comments: this.ueditorObj.getContent(),
    //          simpleComments: this.ueditorObj.getPlainTxt()
    //        });
    //        // 上传合成图片
    //        if (this.formState.formData.sImgType == "1") {
    //          params.sImg = await this.htmlToImage();
    //        }
    //        // 更新
    //        if (this.formState.edit) {
    //          updateContent(params).then(result => {
    //            if (result.status === 200) {
    //              this.$router.push(this.$root.adminBasePath + "/content");
    //              this.$message({
    //                message: this.$t("main.updateSuccess"),
    //                type: "success"
    //              });
    //            } else {
    //              this.$message.error(result.message);
    //            }
    //          });
    //        } else {
    //          // 新增
    //          if (
    //            !_.isEmpty(this.adminUserInfo) &&
    //            !_.isEmpty(this.adminUserInfo.targetEditor)
    //          ) {
    //            params.targetUser = this.adminUserInfo.targetEditor._id;
    //          } else {
    //            this.$message.error("在添加文档之前，您需要指定一个默认编辑！");
    //            this.$router.push(this.$root.adminBasePath + "/content");
    //            return false;
    //          }
    //          addContent(params).then(result => {
    //            if (result.status === 200) {
    //              this.$router.push(this.$root.adminBasePath + "/content");
    //              this.$message({
    //                message: this.$t("main.addSuccess"),
    //                type: "success"
    //              });
    //            } else {
    //              this.$message.error(result.message);
    //            }
    //          });
    //        }
    //      } catch (error) {
    //        this.$message.error(error.message);
    //      }
    //    } else {
    //      console.log("error submit!!");
    //      return false;
    //    }
    //  });
    //}
  },
  computed: {
    ...mod.mapState({
      formState: state => state.formState,
      // dataArtists:state => state.dataArtists,
    }),//模块的state
    ...mapGetters([
      //"contentTagList",
      "contentCategoryList",
      "adminUserInfo",
      //"contentCoverDialog"
    ]),
    // listAllTags(){
    //   return this.$refs.contentForm.listAllTags || [];
    // },
  },
  watch:{
    "contentCategoryList.docs"(nV,oV){
      let listCates=nV;
      if(listCates.length>0){
        // 选择默认栏目;
        let idxFind=this.contentCategoryList.docs.findIndex(cat=>{
          return cat.defaultUrl.toLowerCase()=="news";
        })
        if(!idxFind)return 1;
        this.formState.formData.categories=[this.contentCategoryList.docs[idxFind]._id];
        console.info("初始化栏目成功：",this.contentCategoryList.docs[idxFind],this.formState.formData.categories);
        return idxFind;
      }
    },
  },
  mounted() {
    // initEvent(this);
    this.$store.dispatch("adminUser/getUserInfo");
    //this.$store.dispatch("contentCategory/getContentCategoryList");
    // 给artist检索标签用;
    //this.$store.dispatch("contentTag/getContentTagList", {
    //  pageSize: 0,isPaging:"0",
    //});
    initData(this);
    //// 针对手动页面刷新
    //let _this = this;
    //if (this.$route.params.id) {
    //  getOneContent({ id: this.$route.params.id }).then(result => {
    //    if (result.status === 200) {
    //      if (result.data) {
    //        let contentObj = result.data,
    //          categoryIdArr = [],
    //          tagsArr = [];
//
    //        if (contentObj.categories) {
    //          contentObj.categories.map((item, index) => {
    //            item && categoryIdArr.push(item._id);
    //          });
    //          contentObj.categories = categoryIdArr;
    //        }
    //        if (contentObj.tags) {
    //          contentObj.tags.map((item, index) => {
    //            item && tagsArr.push(item._id);
    //          });
    //          contentObj.tags = tagsArr;
    //        }
    //        if (contentObj.keywords) {
    //          contentObj.keywords = contentObj.keywords.join();
    //        }
    //        if (contentObj.uAuthor) {
    //          this.queryUserListByParams({
    //            searchkey: contentObj.uAuthor.userName
    //          });
    //          contentObj.targetUser = contentObj.uAuthor._id;
    //        }
//
    //        this.$store.dispatch("content/showContentForm", {
    //          edit: true,
    //          formData: contentObj
    //        });
    //      } else {
    //        this.$message({
    //          message: this.$t("validate.error_params"),
    //          type: "warning",
    //          onClose: () => {
    //            this.$router.push(this.$root.adminBasePath + "/content");
    //          }
    //        });
    //      }
    //    } else {
    //      this.$message.error(result.message);
    //    }
    //  });
    //} else {
    //  let localContent = this.getLocalContents();
    //  if (!_.isEmpty(localContent)) {
    //    this.$confirm(
    //      this.$t("main.askForReInputContent"),
    //      this.$t("main.scr_modal_title"),
    //      {
    //        confirmButtonText: this.$t("main.confirmBtnText"),
    //        cancelButtonText: this.$t("main.cancelBtnText"),
    //        type: "warning"
    //      }
    //    )
    //      .then(() => {
    //        let currentComments = localContent.comments || "";
    //        _this.$refs.ueditor.setContent(currentComments);
    //        // 清除缓存
    //        localStorage.removeItem(this.$route.path.split("/")[1]);
    //        this.$store.dispatch("content/showContentForm", {
    //          edit: false,
    //          formData: localContent
    //        });
    //      })
    //      .catch(() => {
    //        localStorage.removeItem(this.$route.path.split("/")[1]);
    //        this.$message({
    //          type: "info",
    //          message: this.$t("main.scr_modal_del_error_info")
    //        });
    //      });
    //  } else {
    //    this.getRandomContentImg();
    //  }
    //}
    //this.$store.dispatch("contentCategory/getContentCategoryList");
    //this.$store.dispatch("contentTag/getContentTagList", {
    //  pageSize: 200
    //});
  }
};

//import {
//  // getOneContent,
//  // addContent,
//  // updateContent,
//  getRandomContentImg,
//  // regUserList,
    //coverList,
    //coverInfo,
    //uploadCover,
    //contentCoverTypeList,
//} from "@/api/content";
// import CoverTable from "./coverTable";
// import html2canvas from "html2canvas";
//    <CoverTable
//      @updateTargetCover="updateTargetCover"
//      :coverTypeList="coverTypeList"
//      :targetCover="targetCover"
//      :dialogState="contentCoverDialog"
//      :device="device"
//    ></CoverTable>
let objBackUpCover={
  data(){
    return{
      dataURL: "",
      coverImg: "https://cdn.html-js.cn/cms/covers/1.png",
      targetCover: "",
      coverTypeList: [],

      selectSpecialList: [],
      selectCoverList: [],

    }
  },
  components: {
    //CoverTable,
  },
  computed:{
    coverActiveStyle() {
      return {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.4)",
        display: "block"
      };
    },
    currentStyle() {
      let renderStyle = {};
      return Object.assign(
        {},
        {
          color: this.targetCover.titleColor,
          fontSize: Number(this.targetCover.titleSize) + "px"
        }
      );
    },
    renderPreviewBackground() {
      let backStyle = this.targetCover.backgroundDefaultCss;
      let defaultCss = {
        backgroundImage: "url(" + this.targetCover.cover + ")",
        backgroundSize: "cover",
        width: this.targetCover.width + "px",
        height: this.targetCover.height + "px"
      };
      if (!_.isEmpty(backStyle)) {
        Object.assign(defaultCss, JSON.parse(backStyle));
      }
      return defaultCss;
    },
    renderPreviewTitle() {
      let stitle = this.formState.formData.stitle;
      let targetCover = this.targetCover;
      if (!_.isEmpty(targetCover) && !_.isEmpty(targetCover.type)) {
        if (stitle) {
          let stitleArr = stitle.split("--");
          let newHtml = this.targetCover.type.structure.replace(
            "content_title",
            stitle
          );
          if (
            stitleArr.length == 2 &&
            this.targetCover.type.structure.indexOf("content_title_1") >= 0
          ) {
            newHtml = this.targetCover.type.structure
              .replace("content_title", stitleArr[0])
              .replace("content_title_1", stitleArr[1]);
          }
          return newHtml;
        } else {
          return this.targetCover.type.structure;
        }
      } else {
        return "";
      }
    }
  },
  mounted() {
    //initEvent(this);
    // 初始化模板
    this.queryCoverTypeListByParams({ isDefault: true });
  },
  methods:{

    updateTargetCover(item) {
      this.targetCover = item;
    },
    showMoreCovers() {
      this.$store.dispatch("content/showCoverListDialog");
      if (!_.isEmpty(this.coverTypeList)) {
        let defaultCoverType = !_.isEmpty(this.targetCover)
          ? this.targetCover.type._id
          : this.coverTypeList[0]._id;
        this.$store.dispatch("content/getContentCoverList", {
          type: defaultCoverType,
          pageSize: 30
        });
      }
    },
    //// 合成图片
    //htmlToImage() {
    //  return new Promise((reslove, reject) => {
    //    let element = document.getElementsByClassName("preview")[0];
    //    var width = element.offsetWidth;
    //    var height = element.offsetHeight;
    //    var scale = 1;
    //    var canvas = document.createElement("canvas");
    //    // 获取元素相对于视窗的偏移量
    //    var rect = element.getBoundingClientRect();
    //    canvas.width = width * scale;
    //    canvas.height = height * scale * 1;
    //    var context = canvas.getContext("2d");
    //    context.scale(scale, scale);
    //
    //    // 设置context位置, 值为相对于视窗的偏移量的负值, 实现图片复位
    //    let canvasHeight = window.scrollY;
    //    context.translate(0, -canvasHeight);
    //
    //    var options = {
    //      scale: scale,
    //      canvas: canvas,
    //      width: width,
    //      height: height,
    //      taintTest: true, //在渲染前测试图片
    //      useCORS: true, //貌似与跨域有关，但和allowTaint不能共存
    //      dpi: window.devicePixelRatio, // window.devicePixelRatio是设备像素比
    //      background: "#fff"
    //    };
    //
    //    html2canvas(element, options).then(function(canvas) {
    //      var dataURL = canvas.toDataURL("image/png", 1.0); //将图片转为base64, 0-1 表示清晰度
    //      var base64String = dataURL
    //        .toString()
    //        .substring(dataURL.indexOf(",") + 1); //截取base64以便上传
    //      let params = { base64: base64String };
    //      uploadCover(params).then(result => {
    //        if (result.status === 200) {
    //          reslove(result.data);
    //        } else {
    //          reject(result.message);
    //        }
    //      });
    //    });
    //  });
    //},
    selectThisCover(item) {
      if (!_.isEmpty(item)) {
        this.targetCover = item;
        this.formState.formData.cover = item._id;
      }
    },

    getRandomContentImg(params = {}) {
      let _this = this;
      getRandomContentImg(params)
        .then(result => {
          if (result.status == 200 && result && result.data) {
            let randomImg = result.data[0];
            let initFormData = Object.assign({}, this.formState.formData, {
              sImg: randomImg
            });
            this.$store.dispatch("content/showContentForm", {
              formData: initFormData
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    queryCoverListByParams(params = {}) {
      let _this = this;
      coverList(params)
        .then(result => {
          let cvList = result.data.docs;
          if (cvList) {
            _this.selectCoverList = cvList;
            setTimeout(() => {
              if (this.$route.params.id) {
                coverInfo({
                  id: _this.formState.formData.cover
                }).then(result => {
                  if (!_.isEmpty(result)) {
                    _this.targetCover = result.data;
                    _this.formState.formData.cover = result.data._id;
                  }
                });
              } else {
                _this.targetCover = cvList[0];
                _this.formState.formData.cover = cvList[0]._id;
              }
            }, 1000);
          } else {
            _this.selectCoverList = [];
          }
        })
        .catch(err => {
          console.log(err);
          _this.selectUserList = [];
        });
    },

    queryCoverTypeListByParams(params = {}) {
      let _this = this;
      contentCoverTypeList(params)
        .then(result => {
          let typeList = result.data;
          if (typeList) {
            _this.coverTypeList = typeList;
            let defaultType = _.filter(typeList, item => {
              return item.isDefault;
            });
            if (!_.isEmpty(defaultType)) {
              _this.queryCoverListByParams({ type: defaultType[0]._id });
            }
          } else {
            _this.coverTypeList = [];
          }
        })
        .catch(err => {
          console.log(err);
          _this.coverTypeList = [];
        });
    },
  },
}
</script>
<style lang="scss">
.edui-default .edui-toolbar {
  line-height: 20px !important;
}
.dr-contentForm {
  // padding: 20px;
  .post-rate {
    .el-rate {
      margin-top: 10px;
    }
  }
  .dr-submitContent {
    position: fixed;
    z-index: 9999999;
    padding: 10px 30px;
    text-align: right;
    right: 0;
    bottom: 0;
    background: none;
    margin-bottom: 0;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 200px;
    height: 150px;
    line-height: 150px !important;
    text-align: center;
  }
  .avatar {
    width: 200px;
    height: 158px;
    display: block;
    object-fit:contain;
  }

  .upSimg {
    position: relative;
    .refresh-btn {
      position: absolute;
      left: 220px;
      top: 0;
      i {
        // color: #dcdfe6;
        font-weight: 400;
      }
    }
  }

  .covers-list {
    .el-col {
      height: 100px;
      margin-bottom: 15px;
      .grid-img {
        border-radius: 4px;
        overflow: hidden;
        height: 100%;
        cursor: pointer;
        position: relative;
        .cover {
          display: none;
          span {
            position: absolute;
            top: 50%;
            left: 50%;
            display: inline-block;
            transform: translate(-50%, -50%);
            color: #fff;
            font-size: 12px;
            width: 60px;
            svg {
              margin-right: 4px;
            }
          }
          .showMoreCover {
            color: rgb(170, 170, 170);
            text-align: center;
            border: 1px solid #eee;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            line-height: 50px;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            font-size: 15px;
          }
        }
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .preview {
      position: relative;
      padding-left: 0 !important;
      padding-right: 0 !important;
      .grid-img {
        overflow: hidden;
        height: 100%;
        .cover-title {
          overflow: hidden;
          word-break: break-word;
          font-family: fzlthjt;
        }
      }
    }
  }
}

.dr-contentForm.mobile {
  .covers-list {
    .preview {
      width: 300px !important;
      height: 200px !important;
    }
    .el-col {
      height: 50px !important;
    }
  }
}
</style>
