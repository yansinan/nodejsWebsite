(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-13e6ce22"],{"162d":function(e,t,o){"use strict";o("fc98")},"330f":function(e,t,o){"use strict";o.d(t,"a",function(){return i});var t=o("e04f"),r=o.n(t);function n(e){var t=r.a.get("sidebarStatus");e.sidebarOpened="1"==t,e.sidebar&&(e.sidebar.opened=e.sidebarOpened)}function i(t){var e=t.$root;setTimeout(function(){n(t)},500),e&&e.eventBus&&(e.eventBus.$on("toggleSideBar",function(e){setTimeout(function(){n(t)},500)}),e.eventBus.$on("toggleDevice",function(e){t.device=e}));e=document.body.getBoundingClientRect();t.device=e.width-1<992?"mobile":"desktop"}},"4b1f":function(e,t,o){(e.exports=o("690e")(!1)).push([e.i,".demo-ruleForm{margin:15px 0;width:80%;padding-bottom:50px}.demo-ruleForm .post-rate .el-rate{margin-top:10px}.demo-ruleForm .dr-submitContent{position:fixed;z-index:9999999;padding:10px 30px;text-align:right;right:0;bottom:0;background:none;margin-bottom:0}.demo-ruleForm .avatar-uploader .el-upload{border:1px dashed #d9d9d9;border-radius:6px;cursor:pointer;position:relative;overflow:hidden}.demo-ruleForm .avatar-uploader .el-upload:hover{border-color:#409eff}.demo-ruleForm .avatar-uploader-icon{font-size:28px;color:#8c939d;width:200px;height:150px;line-height:150px;text-align:center}.demo-ruleForm .avatar{width:200px;height:158px;display:block}.demo-ruleForm .upSimg{position:relative}.demo-ruleForm .upSimg .refresh-btn{position:absolute;left:220px;top:0}.demo-ruleForm .upSimg .refresh-btn i{font-weight:400}.demo-ruleForm .el-autocomplete,.demo-ruleForm .el-range-editor.el-input__inner,.demo-ruleForm .el-select{width:100%}.demo-ruleForm .el-select-suffix{width:0;overflow:visible}.demo-ruleForm .el-select-suffix .el-input__suffix-inner{position:absolute;right:100%;white-space:nowrap;background-color:#fff;background-clip:content-box;border:2px solid transparent;max-height:-webkit-fill-available}",""])},6258:function(e,t,o){"use strict";o("7439")},7439:function(e,t,o){var r=o("4b1f");(r="string"==typeof(r=r.__esModule?r.default:r)?[[e.i,r,""]]:r).locals&&(e.exports=r.locals);(0,o("5925").default)("7a999b78",r,!0,{sourceMap:!1,shadowMode:!1})},"79b1":function(e,t,o){"use strict";o.d(t,"f",function(){return i}),o.d(t,"d",function(){return a}),o.d(t,"c",function(){return s}),o.d(t,"b",function(){return c}),o.d(t,"a",function(){return d}),o.d(t,"e",function(){return l});var r=o("250d"),n=function(e,t){var o=2<arguments.length&&void 0!==arguments[2]?arguments[2]:"post";return Object(r.a)({url:"/"+e,params:t,data:t,method:o})};function i(e){return n("manage/"+(1<arguments.length&&void 0!==arguments[1]?arguments[1]:"artist")+"/top",e)}function a(e){return n("manage/"+(1<arguments.length&&void 0!==arguments[1]?arguments[1]:"artist")+"/roof",e)}function s(e){return n("manage/"+(1<arguments.length&&void 0!==arguments[1]?arguments[1]:"artist")+"/delete",e,"get")}function c(e){return n("manage/"+(1<arguments.length&&void 0!==arguments[1]?arguments[1]:"artist")+"/getOne",e,"get")}function d(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:"artist";return Object(r.a)({url:"/manage/"+t+"/addOne",data:e,method:"post"})}function l(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:"artist";return Object(r.a)({url:"/manage/"+t+"/updateOne",data:e,method:"post"})}},9856:function(e,t,o){"use strict";o.r(t);o("ac67"),o("1bc7"),o("32ea"),o("4057"),o("8dee"),o("fc02"),o("e680"),o("a7e5");var r=o("5d62"),n=(o("6e69"),o("330f")),i=o("c100"),a=(o("cc48"),o("60bb")),s=o.n(a),c=o("5880");function d(t,e){var o,r=Object.keys(t);return Object.getOwnPropertySymbols&&(o=Object.getOwnPropertySymbols(t),e&&(o=o.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),r.push.apply(r,o)),r}function l(t){for(var e=1;e<arguments.length;e++){var o=null!=arguments[e]?arguments[e]:{};e%2?d(Object(o),!0).forEach(function(e){Object(r.a)(t,e,o[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(o)):d(Object(o)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(o,e))})}return t}var u,a=Object(c.createNamespacedHelpers)(nameMod),a={props:l({},i.f),data:function(){return{nameMod:nameMod,wordFileList:[],wordFileUrl:"",selectUserList:[],userLoading:!1,content:"",categoryProps:{value:"_id",label:"name",children:"children"}}},components:l(l({},i.a),{},{ContentForm:function(){return o.e("chunk-57241d3e").then(o.bind(null,"46d4"))}}),methods:l(l({},a.mapActions(["showContentForm"])),{},{backToList:i.e.backToList,updateKeywords:i.e.updateKeywords,getLocalContents:i.e.getLocalContents},i.e.funForWordUpload),computed:l(l(l(l({},i.b),a.mapState({formState:function(e){return e.formState}})),Object(c.mapGetters)(["contentCategoryList","adminUserInfo"])),{},{listAllTags:function(){return this.$refs.contentForm.listAllTags||[]}}),watch:{"contentCategoryList.docs":function(e,t){if(0<e.length){e=this.contentCategoryList.docs.findIndex(function(e){return"news"==e.defaultUrl.toLowerCase()});return e?(this.formState.formData.categories=[this.contentCategoryList.docs[e]._id],e):1}}},mounted:function(){Object(n.a)(this),this.$store.dispatch("adminUser/getUserInfo"),Object(i.d)(this)}};u=function(){var t=this;getRandomContentImg(0<arguments.length&&void 0!==arguments[0]?arguments[0]:{}).then(function(e){200==e.status&&e&&e.data&&(e=e.data[0],e=Object.assign({},t.formState.formData,{sImg:e}),t.$store.dispatch("content/showContentForm",{formData:e}))}).catch(function(e){})},m.toString=function(){return u.toString()};function m(){return u.apply(this,arguments)}c=a,o("6258"),o("162d"),a=o("5d22"),c=Object(a.a)(c,function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"dr-contentForm",class:t.classObj},[o("div",{staticClass:"main-container"},[o("ContentForm",{ref:"contentForm",attrs:{nameMod:t.nameMod},scopedSlots:t._u([{key:"top",fn:function(){return[t.formState.edit?t._e():o("el-form-item",{attrs:{label:"公众号文章链接"}},[o("LinkWX",{model:{value:t.formState.formData,callback:function(e){t.$set(t.formState,"formData",e)},expression:"formState.formData"}})],1)]},proxy:!0},{key:"leftMiddle",fn:function(){return[t.formState.formData?o("el-row",{staticStyle:{"flex-wrap":"wrap"},attrs:{gutter:40,type:"flex",justify:"space-between"}},[o("el-col",{attrs:{lg:12}},[o("el-form-item",{attrs:{prop:"uploadWord"}},[o("el-upload",{staticClass:"upload-demo",attrs:{action:"/api/content/getWordHtmlContent","on-preview":t.handleWordPreview,"on-remove":t.handleWordRemove,"before-remove":t.beforeWordRemove,"on-success":t.uploadWordSuccess,"before-upload":t.beforeWordUpload,multiple:"",limit:1,"on-exceed":t.handleWordExceed,"file-list":t.wordFileList}},[o("el-tooltip",{attrs:{content:"只能上传doc/docx文件，且不超过5mb",placement:"top",effect:"light"}},[o("el-button",{attrs:{size:"small",type:"primary"}},[t._v(t._s(t.$t("contents.uploadWord")))])],1)],1)],1)],1),o("el-col",{staticStyle:{"min-width":"min-content"},attrs:{lg:12}},[o("el-form-item",{attrs:{prop:"categories"}},[o("el-cascader",{attrs:{disabled:"",size:"small",expandTrigger:"hover",options:t.contentCategoryList.docs,props:t.categoryProps},on:{change:t.handleChangeCategory},model:{value:t.formState.formData.categories,callback:function(e){t.$set(t.formState.formData,"categories",e)},expression:"formState.formData.categories"}},[o("template",{slot:"suffix"},[t._v(t._s(t.$t("contents.categories")))])],2)],1)],1)],1):t._e()]},proxy:!0},{key:"footer",fn:function(){},proxy:!0}]),model:{value:t.formState,callback:function(e){t.formState=e},expression:"formState"}})],1)])},[],!1,null,null,null),t.default=c.exports},a088:function(e,t,o){(e.exports=o("690e")(!1)).push([e.i,".edui-default .edui-toolbar{line-height:20px!important}.dr-contentForm{padding:20px}.dr-contentForm .post-rate .el-rate{margin-top:10px}.dr-contentForm .dr-submitContent{position:fixed;z-index:9999999;padding:10px 30px;text-align:right;right:0;bottom:0;background:none;margin-bottom:0}.dr-contentForm .avatar-uploader .el-upload{border:1px dashed #d9d9d9;border-radius:6px;cursor:pointer;position:relative;overflow:hidden}.dr-contentForm .avatar-uploader .el-upload:hover{border-color:#409eff}.dr-contentForm .avatar-uploader-icon{font-size:28px;color:#8c939d;width:200px;height:150px;line-height:150px!important;text-align:center}.dr-contentForm .avatar{width:200px;height:158px;display:block;-o-object-fit:contain;object-fit:contain}.dr-contentForm .upSimg{position:relative}.dr-contentForm .upSimg .refresh-btn{position:absolute;left:220px;top:0}.dr-contentForm .upSimg .refresh-btn i{font-weight:400}.dr-contentForm .covers-list .el-col{height:100px;margin-bottom:15px}.dr-contentForm .covers-list .el-col .grid-img{border-radius:4px;overflow:hidden;height:100%;cursor:pointer;position:relative}.dr-contentForm .covers-list .el-col .grid-img .cover{display:none}.dr-contentForm .covers-list .el-col .grid-img .cover span{position:absolute;top:50%;left:50%;display:inline-block;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);color:#fff;font-size:12px;width:60px}.dr-contentForm .covers-list .el-col .grid-img .cover span svg{margin-right:4px}.dr-contentForm .covers-list .el-col .grid-img .cover .showMoreCover{color:#aaa;text-align:center;border:1px solid #eee;border-radius:50%;width:50px;height:50px;line-height:50px;-webkit-box-shadow:0 2px 12px 0 rgba(0,0,0,.1);box-shadow:0 2px 12px 0 rgba(0,0,0,.1);font-size:15px}.dr-contentForm .covers-list .el-col .grid-img img{width:100%;height:100%}.dr-contentForm .covers-list .preview{position:relative;padding-left:0!important;padding-right:0!important}.dr-contentForm .covers-list .preview .grid-img{overflow:hidden;height:100%}.dr-contentForm .covers-list .preview .grid-img .cover-title{overflow:hidden;word-break:break-word;font-family:fzlthjt}.dr-contentForm.mobile .covers-list .preview{width:300px!important;height:200px!important}.dr-contentForm.mobile .covers-list .el-col{height:50px!important}",""])},c100:function(e,t,o){"use strict";o.d(t,"f",function(){return a}),o.d(t,"c",function(){return s}),o.d(t,"a",function(){return c}),o.d(t,"d",function(){return d}),o.d(t,"e",function(){return l}),o.d(t,"b",function(){return u});var t=o("ac50"),t=o("873e"),t=o("5c10"),n=o("17eb"),t=o("0bbd"),t=o("9736"),i=o("79b1"),t=o("6e69"),r=o("e9d9"),t=o("196d"),a={groups:Array},s={nameMod:nameMod,contentState:[{value:"0",label:"撤回",color:""},{value:"1",label:"草稿",color:"#409EFF"},{value:"2",label:"发布",color:"#67C23A"}],sidebarOpened:!0,device:"desktop"},c={VueUeditorWrap:o.n(t).a,ListURL:function(){return o.e("chunk-16250e40").then(o.bind(null,"33b5"))},LinkWX:function(){return o.e("chunk-6aa8ecfb").then(o.bind(null,"1f3f"))},Cropper:function(){return Promise.all([o.e("chunk-739b0ebc"),o.e("chunk-75fc0d60")]).then(o.bind(null,"66ff"))},SelectIds:function(){return o.e("chunk-245feb58").then(o.bind(null,"6d92"))}};function d(r){var t;r.$route.params.id?Object(i.b)({id:r.$route.params.id},r.nameMod).then(function(e){var t,o;200===e.status?e.data?(t=e.data,o=[],t.categories&&(t.categories.map(function(e,t){e&&o.push(e._id)}),t.categories=o),t.tags&&(t.tags=t.tags.map(function(e){return e&&e._id})),t.keywords&&(t.keywords=t.keywords.join(",")),t.listRefs&&(t.listRefs=t.listRefs.map(function(e){return e._id})),t.listMembers&&(t.listMembers=t.listMembers.map(function(e){return e._id})),t.listFormatTags&&(t.listFormatTags=t.listFormatTags.map(function(e){return e&&e._id})),r.showContentForm({edit:!0,formData:t})):r.$message({message:r.$t("validate.error_params"),type:"warning",onClose:function(){r.backToList()}}):r.$message.error(e.message)}).catch(function(e){debugger}):(t=r.getLocalContents(),_.isEmpty(t)?r.showContentForm({edit:!1}):r.$confirm(r.$t("main.askForReInputContent"),r.$t("main.scr_modal_title"),{confirmButtonText:r.$t("main.confirmBtnText"),cancelButtonText:r.$t("main.cancelBtnText"),type:"warning"}).then(function(){var e=t.comments||"";r.$refs.ueditor.setContent(e),localStorage.removeItem(r.$route.path.split("/")[1]),r.showContentForm({edit:!1,formData:t})}).catch(function(){localStorage.removeItem(r.$route.path.split("/")[1]),r.$message({type:"info",message:r.$t("main.scr_modal_del_error_info")})})),r.$store.dispatch("contentCategory/getContentCategoryList")}var l={updateKeywords:function(e){var t=1<arguments.length&&void 0!==arguments[1]&&arguments[1],o=""!=this.formState.formData.keywords?this.formState.formData.keywords.split(","):[],r=[];return e&&""!=e&&e instanceof String&&(r=[e]),e&&0<e.length&&e instanceof Array&&(r=(r=e.filter(function(e){return e&&e.name||e instanceof String})).map(function(e){return e.name||e})),t?o=o.filter(function(e){return-1===r.indexOf(e)}):o.push.apply(o,Object(n.a)(r)),o=Object(n.a)(new Set(o)),this.formState.formData.keywords=o.filter(function(e){return e&&""!=e}).join(),this.formState.formData.keywords},getLocalContents:function(){var e=localStorage.getItem("addContent")||"";return e?JSON.parse(e):{}},editorReady:function(e){this.ueditorObj=e},backToList:function(){this.formState.formData.tags=[],this.$router.push(this.$root.adminBasePath+"/"+this.nameMod)},submitForm:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:"",o=this;""!=t&&(o.formState.formData.state=t),this.$refs[e].validate(function(e){if(!e)return!1;e=Object.assign({},o.formState.formData,{comments:o.ueditorObj.getContent(),simpleComments:o.ueditorObj.getPlainTxt()});o.formState.edit?Object(i.e)(e,o.nameMod).then(function(e){200===e.status?(localStorage.removeItem(o.$route.path.split("/")[1]),o.backToList(),o.$message({message:o.$t("main.updateSuccess"),type:"success"})):o.$message.error(e.message)}).catch(function(e){debugger;o.$message.error(JSON.stringify(e))}):Object(i.a)(e,o.nameMod).then(function(e){200===e.status?(localStorage.removeItem(o.$route.path.split("/")[1]),o.backToList(),o.$message({message:o.$t("main.addSuccess"),type:"success"})):o.$message.error(e.message)}).catch(function(e){o.$message.error(e.message)})})},funForWordUpload:{handleWordRemove:function(e,t){},handleWordPreview:function(e){},handleWordExceed:function(e,t){this.$message.warning("当前限制选择 1 个文件，本次选择了 ".concat(e.length," 个文件，共选择了 ").concat(e.length+t.length," 个文件"))},beforeWordRemove:function(e,t){},uploadWordSuccess:function(e,t){Object(r.b)(),this.wordFileUrl=e.data||"";debugger;this.formState.formData.comments=e.data,this.$message({message:"恭喜，导入成功！",type:"success"})},beforeWordUpload:function(e){var t=!!(e.type.indexOf("officedocument")||e.name.indexOf(".doc")||0<e.name.indexOf(".docx")),e=e.size/1024/1024<5;return t||this.$message.error("只能上传docx,doc格式！"),e||this.$message.error(this.$t("validate.limitUploadImgSize",{size:5})),t&&e&&Object(r.a)(),t&&e}}},u={classObj:function(){return{hideSidebar:!this.sidebarOpened,openSidebar:this.sidebarOpened,withoutAnimation:"false",mobile:"mobile"===this.device}},device:function(){return document.body.getBoundingClientRect().width-1<992?"mobile":"desktop"}}},fc98:function(e,t,o){var r=o("a088");(r="string"==typeof(r=r.__esModule?r.default:r)?[[e.i,r,""]]:r).locals&&(e.exports=r.locals);(0,o("5925").default)("af1b9452",r,!0,{sourceMap:!1,shadowMode:!1})}}]);