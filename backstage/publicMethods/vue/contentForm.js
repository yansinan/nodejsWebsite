import {
    getOne,
    addOne,
    updateOne,
    // regUserList,
} from "../apiGeneral";
import '@/set-public-path'

export let props={
    groups: Array
}
export let data={
    nameMod:nameMod,
    contentState: [
      { value: "0", label: "撤回" , color:""},//{ value: "0", label: "退回" },
      { value: "1", label: "草稿" , color:"#409EFF"},//{ value: "1", label: "待审核" },
      { value: "2", label: "发布" , color:"#67C23A"},//{ value: "2", label: "审核通过" },
      // { value: "3", label: "审核不通过" }
    ],
}

import VueUeditorWrap from "vue-ueditor-wrap";
export let components={
    VueUeditorWrap,
    ListURL: () => import('@root/publicMethods/vue/ListURL.vue'),
    LinkWX: () => import('@root/publicMethods/vue/LinkWX.vue'),//抓公众号文章
    Cropper: () => import('@root/publicMethods/vue/Cropper.vue'),
    SelectIds: () => import('@root/publicMethods/vue/SelectIds.vue'),

}
// 初始化时判断读取或新建
export function initData(that){
    // 针对手动页面刷新
    let _this = this;
    if (that.$route.params.id) {
        getOne({ id: that.$route.params.id },that.nameMod).then(result => {
            if (result.status === 200) {
                if (result.data) {
                    let contentObj = result.data,
                        categoryIdArr = [],
                        tagsArr = [],
                        formatTagArr=[];
                    console.info("获取乐队信息：",contentObj);
                    if (contentObj.categories) {
                        contentObj.categories.map((item, index) => {
                            item && categoryIdArr.push(item._id);
                        });
                        contentObj.categories = categoryIdArr;
                    }
                    if (contentObj.tags)contentObj.tags = contentObj.tags.map(v=>(v && v._id));
                    if (contentObj.keywords)contentObj.keywords = contentObj.keywords.join();
                    if (contentObj.listRefs)contentObj.listRefs=contentObj.listRefs.map(v=>{return v._id});
                    if (contentObj.listMembers)contentObj.listMembers = contentObj.listMembers.map(v=>{return v._id});

                    // 对象转id
                    if (contentObj.listFormatTags)contentObj.listFormatTags = contentObj.listFormatTags.map(item => (item && item._id));
                    that.showContentForm({
                        edit: true,
                        formData: contentObj
                    });
                } else {
                    that.$message({
                        message: that.$t("validate.error_params"),
                        type: "warning",
                        onClose: () => {
                            that.backToList();
                        }
                    });
                }
            } else {
                that.$message.error(result.message);
            }
        }).catch(e=>{
            console.error("getOne error:",e)
            debugger;
        });
    } else {//新创建
        let localContent = that.getLocalContents();
        if (!_.isEmpty(localContent)) {
            that.$confirm(
                that.$t("main.askForReInputContent"),
                that.$t("main.scr_modal_title"),
                {
                    confirmButtonText: that.$t("main.confirmBtnText"),
                    cancelButtonText: that.$t("main.cancelBtnText"),
                    type: "warning"
                }
            )
            .then(() => {
                let currentComments = localContent.comments || "";
                that.$refs.ueditor.setContent(currentComments);
                // 清除缓存
                localStorage.removeItem(that.$route.path.split("/")[1]);
                that.showContentForm({
                    edit: false,
                    formData: localContent
                });
            })
            .catch(() => {
                localStorage.removeItem(that.$route.path.split("/")[1]);
                that.$message({
                    type: "info",
                    message: that.$t("main.scr_modal_del_error_info")
                });
            });
        } else {
            //初始化表單
            that.showContentForm({
                edit: false,
            });
        }
    }
    that.$store.dispatch("contentCategory/getContentCategoryList");
}
// // vuex相关的配置
// import { mapGetters, mapActions,createNamespacedHelpers} from "vuex";
// export let computed= {
//     // ...mapGetters(["contentTagList", "contentCategoryList",]),//"regUserList",
//     // ...mod.mapState({
//     //   formState: state => state.formState,
//     //   dataArtists:state => state.dataArtists,
//     // }),//模块的state
//   }
// export function initVuex(that){
//     let nameMod=that.nameMod;
//     const mod = createNamespacedHelpers(nameMod)////模块,含mapGetters, mapActions等
//     let tmp=mod.mapActions(["showContentForm"]);
//     that.methods = that.methods || {};
//     that.computed = that.computed || {};
//     debugger;
//     Object.assign(that.methods,mod.mapActions(["showContentForm"]));
//     Object.assign(that.computed,
//         mapGetters(["contentCategoryList",]),
//         mod.mapState({
//             formState: state => state.formState,
//             dataArtists:state => state.dataArtists,
//         }),
//     );
// }
export let methods={
    //获取表单信息
    // ...mod.mapActions(["showContentForm"]),// 将 `this.showContentForm(params)` 映射为 `this.$store.dispatch(nameMod+'/incrementBy', params)`

    // 20191206 自动添加关键词 
    // 20210131 输入改为单个字符串，或name字符串数组
    updateKeywords(newVal,isDelete=false){
        //两处自动复制：乐队成员，标签
        let listTmp=this.formState.formData.keywords.split(",");
        let listName=[];
        if(newVal && newVal!="" && newVal instanceof String)listName=[newVal];
        if(newVal && newVal.length>0 && newVal instanceof Array){
          // 筛选，数组元素要么是有name的对象，要么直接是string;
          listName=newVal.filter(v=>((v && v.name) || v instanceof String));
          listName=listName.map(v=>(v.name || v));
        }
        if(!isDelete){
          listTmp.push(...listName);
        }else{
          listTmp=listTmp.filter(v=>(listName.indexOf(v)===-1))
        }
        listTmp = [...(new Set(listTmp))];
        this.formState.formData.keywords=listTmp.join();
        return this.formState.formData.keywords;
    },    
  
    //TOCheck： 本地缓存，在哪里保存？
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

    backToList() {
        // this.$router.push("/"+nameMod);
        // this.$store.dispatch(nameMod+"/showContentForm",{edit:false,formData:{test:"debug:backToList"},isInit:true});
        this.$router.push(this.$root.adminBasePath + "/"+this.nameMod);

    },

    submitForm(formName, type = "") {
        let that=this;
        if(type!="")that.formState.formData.state=type;
        this.$refs[formName].validate(valid => {
            if (valid) {
                let params = Object.assign({}, that.formState.formData, {
                    comments: that.ueditorObj.getContent(),
                    simpleComments: that.ueditorObj.getPlainTxt()
                });
                // 更新
                if (that.formState.edit) {
                    updateOne(params,that.nameMod).then(result => {
                        if (result.status === 200) {
                            localStorage.removeItem(that.$route.path.split("/")[1]);
                            that.backToList();
                            that.$message({
                                message: that.$t("main.updateSuccess"),
                                type: "success"
                            });
                        } else {
                            that.$message.error(result.message);
                        }
                    }).catch(error=>{
                        debugger
                        console.error("乐队更新:fail,",error,params);
                        that.$message.error(JSON.stringify(error));
                    });
                } else {
                    // 新增
                    addOne(params,that.nameMod).then(result => {
                        console.log("新增:",params,result);
                        if (result.status === 200) {
                            localStorage.removeItem(that.$route.path.split("/")[1]);
                            that.backToList();
                            that.$message({
                                message: that.$t("main.addSuccess"),
                                type: "success"
                            });
                        } else {
                            that.$message.error(result.message);
                        }
                    }).catch(error=>{
                        console.error("乐队添加：fail:",error,params);
                        that.$message.error(error.message);
                    });
                }
            } else {
                console.log("提交格式审核不通过!valid",valid);
                return false;
            }
        });
    },
}

export let computed= {
    classObj() {
      return {
        hideSidebar: !this.sidebarOpened,
        openSidebar: this.sidebarOpened,
        withoutAnimation: "false",
        mobile: this.device === "mobile"
      };
    },
    device(){
        // 修改移动端标记
        const {
            body
        } = document
        const WIDTH = 992
        const rect = body.getBoundingClientRect();
        return (rect.width - 1 < WIDTH ? 'mobile' : 'desktop');
    },
}