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
        <el-form-item :label="$t('artist.name')" prop="name">
          <el-input size="small" v-model="formState.formData.name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('artist.nameAlias')" prop="alias">
          <el-input size="small" v-model="formState.formData.alias"></el-input>
        </el-form-item>
        <el-form-item :label="$t('artist.from')" prop="from">
          <el-input size="small" v-model="formState.formData.from" placeholder="中国/China"></el-input>
        </el-form-item>
        <el-form-item :label="$t('artist.date')" prop="listDateDur">
          <el-date-picker
            v-model="formState.formData.listDateDur[0]"
            type="date"
            placeholder="加入日期" @change="eChangeDate">
          </el-date-picker>
          <el-date-picker
            v-model="formState.formData.listDateDur[1]"
            type="date"
            placeholder="退出日期" @change="eChangeDate">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('artist.listMembers')" prop="listMembers">
          <el-select
            size="medium"
            v-model="formState.formData.listMembers"
            filterable
            multiple
            allow-create
            placeholder="请输入乐队成员名"
            :remote-method="remoteUserMethod"
            :loading="userLoading"
            @change="changeTargetUser"
          >
          <!--           remote
            reserve-keyword -->
            <el-option
              v-for="item in dataMembers.docs"
              :key="item._id"
              :label="item.name"
              :value="item._id"
            ></el-option>
          </el-select>
        </el-form-item>

        <div v-if="formState.formData.type == '1'">
          <el-form-item label="乐队关键字" prop="keywords">
            <el-input size="small" v-model="formState.formData.keywords"></el-input>
          </el-form-item>

          <el-form-item label="乐队标签" prop="tags">
            <el-select
              size="medium"
              v-model="formState.formData.tags"
              multiple
              filterable
              allow-create
              :loading="userLoading"
              :placeholder="$t('validate.selectNull', {label: this.$t('contents.tags')})"
              @change="eChangeTags"
            >
              <el-option
                v-for="item in contentTagList.docs"
                :key="item._id"
                :label="item.name"
                :value="item._id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item class="upSimg" :label="$t('contents.sImg')" prop="sImg">
          <el-upload
            class="avatar-uploader"
            action="/api/upload/files"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :data="{action:'uploadimage'}"
          >
            <img v-if="formState.formData.sImg" :src="formState.formData.sImg" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-button size="mini" @click="getRandomContentImg()" class="refresh-btn" plain round>
            <svg-icon icon-class="reload" />
          </el-button>
        </el-form-item>
        <el-form-item :label="$t('contents.discription')" prop="discription">
          <el-input size="small" type="textarea" v-model="formState.formData.discription"></el-input>
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
        <el-form-item :label="$t('artist.listHotMusics')" prop="listHotMusics">
          <ListURL @list-changed="eListHotMusicChanged" label="歌名" ref="listHotMusics"></ListURL>
        </el-form-item>
        <el-form-item :label="$t('artist.listLinks')">
          <ListURL @list-changed="eListLinks" label="注释" :listObjURL="formState.formData.listLinks"></ListURL>
        </el-form-item>
        <el-form-item class="dr-submitContent">
          <el-button
            size="medium"
            type="primary"
            @click="submitForm('ruleForm')"
          >{{formState.edit ? $t('main.form_btnText_update') : $t('main.form_btnText_save')}}</el-button>
          <el-button size="medium" @click="backToList">{{$t('main.back')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss">
.dr-contentForm {
  margin: 15px 0;
  width: 80%;
  padding-bottom: 50px;
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
    line-height: 150px;
    text-align: center;
  }
  .avatar {
    width: 200px;
    height: 158px;
    display: block;
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
}
</style>

<script>
//需要修改的:
const nameMod="artist"

import VueUeditorWrap from "vue-ueditor-wrap";
import { initEvent } from "@root/publicMethods/events";
import {
  addUser,
  getOneContent,
  // addContent,
  addOne,
  updateContent,
  getRandomContentImg,
  // regUserList,
} from "@/api/artist";
import {
  addContentTag,
} from "@/api/contentTag"
import ListURL from "../common/ListURL.vue";

import _ from "lodash";
import { mapGetters, mapActions,createNamespacedHelpers} from "vuex";
const mod = createNamespacedHelpers(nameMod)////模块,含mapGetters, mapActions等

export default {
  props: {
    groups: Array
  },
  data() {
    return {
      contentState: [
        { value: "0", label: "退回" },
        { value: "1", label: "待审核" },
        { value: "2", label: "审核通过" },
        { value: "3", label: "审核不通过" }
      ],
      selectUserList: [],
      loading: false,
      userLoading: false,//是否loading用户
      loadingTag:false,//是否loading标签
      selectSpecialList: [],
      content: "",
      simpleComments: "",
      isflash: false,
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 320
      },
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
      imageUrl: "",
      currentType: "1",
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
        ]
      }
    };
  },
  components: {
    VueUeditorWrap,
    ListURL,
  },
  methods: {
    //获取表单信息
    ...mod.mapActions(["showContentForm"]),// 将 `this.showContentForm(params)` 映射为 `this.$store.dispatch(nameMod+'/incrementBy', params)`
    changeTargetUser(value) {
      let that=this;
      //检查 是否有没在列表里的值v=[idUser1,idUser2...text]
      this.formState.formData.listMembers.forEach((v,idx,arr) => {
        let tagFound=this.dataMembers.docs.find(user=>(user._id==v));
        let isFound = tagFound?true:false;
        console.log("添加成员：",v,"是否已经创建:",isFound,that.dataMembers.docs);
        if(!isFound){
          //loading停止操作
          that.userLoading=true;
          //创建标签 // 新增
          let formData={
            name:v,
            comments:"即时创建",
            group:"乐手",
          }
          //添加contentTag标签
          addUser(formData).then(result => {
            if (result.status === 200) {
              that.$message({
                message: that.$t("main.addSuccess"),
                type: "success"
              });
              //替换文字为idTag//可以在返回结果中获得result.data.data._id{}
              that.formState.formData.listMembers[idx]=result.data._id;
              //关键词里同步
              that.updateKeywords(v);
              //刷新用户列表
              that.userLoading = true;       
              // that.queryUserListByParams({ searchkey: that.formState.formData.listMembers });
              that.remoteUserMethod();
            } else {
              console.error(result)
              debugger
              that.$message.error(result.data.message);
            }
            //恢复操作
            that.loadingTag=false;
          }).catch(error=>{
              console.error(error)
              debugger
              that.$message.error(error.message);

          });
          
        }else{
          //关键词里同步
          this.updateKeywords(tagFound.name);
        }

      });

      // let targetUserInfo = _.filter(this.selectUserList, item => {
      //   return item.value == value;
      // });
      // if (!_.isEmpty(targetUserInfo)) {
      //   localStorage.setItem(
      //     "contentAuthor",
      //     JSON.stringify(targetUserInfo[0])
      //   );
      // }
    },
    //标签变化
    eChangeTags(e){
      //检查 是否有没在列表里的值e=[idTag1,idTag2...text]
      this.formState.formData.tags.forEach((v,idx,arr) => {
        // console.log("添加标签e,v:",e,this.formState.formData.tags,v);
        if(!v){
          this.$message.error("标签undefined：",v);
          return;
        }
        let tagFound=this.contentTagList.docs.find(tag=>(tag._id==v));
        let isTagFound = tagFound?true:false;
        if(!isTagFound){
          //loading停止操作
          this.loadingTag=true;
          //创建标签 // 新增
          let formDataTag={
            name:v,
            comments:"即时创建",
            alias:v,
          }
          //添加contentTag标签
          addContentTag(formDataTag).then(result => {
            console.log("添加标签返回的result:",result);
            if (result.status === 200) {
              // this.$store.dispatch("hideContentTagForm");
              this.$store.dispatch("contentTag/getContentTagList");
              this.$message({
                message: this.$t("main.addSuccess"),
                type: "success"
              });
              //替换文字为idTag//可以在返回结果中获得result.data._id{}
              this.formState.formData.tags[idx]=result.data._id;
              //关键词里同步
              this.updateKeywords(v);
            } else {
              this.$message.error("添加标签错误："+result.message,formDataTag);
            }
            //恢复操作
            this.loadingTag=false;
          }).catch(error=>{
            this.$message.error("添加标签错误："+error,formDataTag);
            let t=formDataTag;
            debugger
          });
          
        }else{
          //关键词里同步
          this.updateKeywords(tagFound.name);
        }
      });
      //console.log(v,this.formState.formData.tags,this.contentTagList.docs);
    },
    remoteUserMethod(query="") {
      if (query !== "") {
        this.userLoading = true;
        let _this = this;
        
        this.queryUserListByParams({ searchkey: query, pageSize : 200,});
      } else {
        this.queryUserListByParams({ pageSize : 200,});
        // this.selectUserList = [];
      }
    },
    queryUserListByParams(params = {}) {
      let _this = this;
      Object.assign(params,{ pageSize : 200, });
      // this.$store.dispatch("getRegUserList",params);
      this.$store.dispatch("artist/getArtistList",params);

      this.userLoading = false;
    },
    //TODO：20200107默认图片
    getRandomContentImg(params = {}) {
      let _this = this;
      getRandomContentImg(params)
        .then(result => {
          if (result.status == 200 && result && result.data) {
            let randomImg = result.data[0];
            let initFormData = Object.assign({}, this.formState.formData, {
              sImg: randomImg
            });
            // 保留原有指定作者
            let oldUauthor = localStorage.getItem("contentAuthor");
            if (oldUauthor) {
              let targetUser = JSON.parse(oldUauthor);
              this.queryUserListByParams({
                searchkey: targetUser.label
              });
              Object.assign(initFormData, { targetUser: targetUser.value });
            }
            this.showContentForm({
              formData: initFormData
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    checkFlashPost(currentType) {
      this.showContentForm({
        edit: this.formState.edit,
        formData: Object.assign({}, this.formState.formData, {
          type: currentType ? "2" : "1"
        })
      });
    },
    inputEditor(value) {
      this.showContentForm({
        edit: this.formState.edit,
        formData: Object.assign({}, this.formState.formData, {
          markDownComments: value
        })
      });
      
    },
    changeEditor(value) {
      console.log(value);
    },
    getLocalContents() {
      let localContent = localStorage.getItem("addContent") || "";
      if (localContent) {
        return JSON.parse(localContent);
      } else {
        return {};
      }
    },
    editorReady(instance) {
      this.ueditorObj = instance;
    },

    handleAvatarSuccess(res, file) {
      let imageUrl = res.data.path;
      this.showContentForm({
        edit: this.formState.edit,
        formData: Object.assign({}, this.formState.formData, {
          sImg: imageUrl
        })
      });
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isGIF = file.type === "image/gif";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG && !isPNG && !isGIF) {
        this.$message.error(this.$t("validate.limitUploadImgType"));
      }
      if (!isLt2M) {
        this.$message.error(
          this.$t("validate.limitUploadImgSize", { size: 2 })
        );
      }
      return (isJPG || isPNG || isGIF) && isLt2M;
    },
    // handleChangeCategory(value) {
    //   console.log(value);
    // },
    backToList() {
      // this.$router.push("/"+nameMod);
      // this.$store.dispatch(nameMod+"/showContentForm",{edit:false,formData:{test:"debug:backToList"},isInit:true});
      this.$router.push(this.$root.adminBasePath + "/"+nameMod);

    },
    // 热门歌曲列表变化
    eListHotMusicChanged(e){
      console.log("热门歌曲列表变化",e);
      this.formState.formData.listHotMusics=e;
    },
    eListLinks(e){      
      
      
      if(e && e.length > 0 ){
          e.forEach(objLink => {
              if(objLink.url.indexOf("weibo.com")!=-1)objLink.icon="/static/themes/dorawhite/images/link/logo_sina_32x32.png";
              if(objLink.url.indexOf("douban.com")!=-1)objLink.icon="/static/themes/dorawhite/images/link/logo_douban_32x32.png"
              if(objLink.url.indexOf("music.163.com")!=-1)objLink.icon="/static/themes/dorawhite/images/link/logo_163_32x32.png"
          });
      }
      console.log("其他链接列表变化",e);
      this.formState.formData.listLinks=e;
    },
    // 选择日期
    eChangeDate(e){
      console.log("选取日期变化",e,this.formState.formData.listDateDur);
    },
    // 20191206 自动添加关键词
    updateKeywords(inStr){
      //两处自动复制：乐队成员，标签
      let listTmp=this.formState.formData.keywords.split(",");
      if(inStr && inStr!="")listTmp.push(inStr);
      listTmp = [...(new Set(listTmp))];
      this.formState.formData.keywords=listTmp.join();
      return this.formState.formData.keywords;
    },
    submitForm(formName, type = "") {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = Object.assign({}, this.formState.formData, {
            comments: this.ueditorObj.getContent(),
            simpleComments: this.ueditorObj.getPlainTxt()
          });
          // 更新
          if (this.formState.edit) {
            updateContent(params).then(result => {
              if (result.status === 200) {
                this.backToList();
                this.$message({
                  message: this.$t("main.updateSuccess"),
                  type: "success"
                });
              } else {
                this.$message.error(result.message);
              }
            }).catch(error=>{
              debugger
              console.error("乐队更新:fail,",error,params);
              this.$message.error(JSON.stringify(error));
            });
          } else {
            // 新增
            addOne(params).then(result => {
              console.log("新增:",params,result);
              if (result.status === 200) {
                this.backToList();
                this.$message({
                  message: this.$t("main.addSuccess"),
                  type: "success"
                });
              } else {
                this.$message.error(result.message);
              }
            }).catch(error=>{
              console.error("乐队添加：fail:",error,params);
              this.$message.error(error.message);
            });
          }
        } else {
          console.log("提交格式审核不通过!valid",valid);
          return false;
        }
      });
    }
  },
  computed: {
    ...mapGetters(["contentTagList", "contentCategoryList"]),//"regUserList",
    // formState() {
    //   return this.$store.getters.contentFormState;
    // },
    ...mod.mapState({
      formState: state => state.formState,
      dataMembers:state => state.dataMembers,
    }),//模块的state
  },
  mounted() {
    initEvent(this);

    // 针对手动页面刷新
    let _this = this;
    if (this.$route.params.id) {
      getOneContent({ id: this.$route.params.id }).then(result => {
        if (result.status === 200) {
          if (result.data) {
            let contentObj = result.data,
              categoryIdArr = [],
              tagsArr = [];
            console.info("获取乐队信息：",contentObj);
            if (contentObj.categories) {
              contentObj.categories.map((item, index) => {
                item && categoryIdArr.push(item._id);
              });
              contentObj.categories = categoryIdArr;
            }
            if (contentObj.tags) {
              contentObj.tags.map((item, index) => {
                item && tagsArr.push(item._id);
              });
              contentObj.tags = tagsArr;
            }
            if (contentObj.keywords) {
              contentObj.keywords = contentObj.keywords.join();
            }
            if (contentObj.listMembers) {
              let listMembersId=contentObj.listMembers.map(v=>{return v._id});
              this.remoteUserMethod();//{searchkey: listMembersId}
              contentObj.listMembers = listMembersId;
              // contentObj.targetUser = contentObj.listMembers._id;
            }

            this.showContentForm({
              edit: true,
              formData: contentObj
            });
          } else {
            this.$message({
              message: this.$t("validate.error_params"),
              type: "warning",
              onClose: () => {
                this.backToList();
              }
            });
          }
        } else {
          this.$message.error(result.message);
        }
      }).catch(e=>{
        console.error("getOneContent error:",e)
        debugger;
      });
    } else {//新创建
      let localContent = this.getLocalContents();
      if (!_.isEmpty(localContent)) {
        this.$confirm(
          this.$t("main.askForReInputContent"),
          this.$t("main.scr_modal_title"),
          {
            confirmButtonText: this.$t("main.confirmBtnText"),
            cancelButtonText: this.$t("main.cancelBtnText"),
            type: "warning"
          }
        )
          .then(() => {
            let currentComments = localContent.comments || "";
            _this.$refs.ueditor.setContent(currentComments);
            // 清除缓存
            localStorage.removeItem(this.$route.path.split("/")[1]);
            this.showContentForm({
              edit: false,
              formData: localContent
            });
          })
          .catch(() => {
            localStorage.removeItem(this.$route.path.split("/")[1]);
            this.$message({
              type: "info",
              message: this.$t("main.scr_modal_del_error_info")
            });
          });
      } else {
        //初始化表單

        this.getRandomContentImg();
      }
    }
    this.$store.dispatch("contentCategory/getContentCategoryList");
    this.$store.dispatch("contentTag/getContentTagList", {
      pageSize: 200
    });
    // this.$store.dispatch("getRegUserList",{pageSize:200});
    this.$store.dispatch("artist/getArtistList",{pageSize:200});
  }
};
</script>
