(window.webpackJsonp=window.webpackJsonp||[]).push([["addContent"],{"49a8":function(t,e,r){var o=r("be48");(o="string"==typeof(o=o.__esModule?o.default:o)?[[t.i,o,""]]:o).locals&&(t.exports=o.locals);(0,r("5925").default)("36c87118",o,!0,{sourceMap:!1,shadowMode:!1})},"4b1f":function(t,e,r){(t.exports=r("690e")(!1)).push([t.i,".edui-default .edui-toolbar{line-height:20px!important}.dr-contentForm{padding:20px}.dr-contentForm .post-rate .el-rate{margin-top:10px}.dr-contentForm .dr-submitContent{position:fixed;z-index:9999999;padding:10px 30px;text-align:right;right:0;bottom:0;background:none;margin-bottom:0}.dr-contentForm .avatar-uploader .el-upload{border:1px dashed #d9d9d9;border-radius:6px;cursor:pointer;position:relative;overflow:hidden}.dr-contentForm .avatar-uploader .el-upload:hover{border-color:#409eff}.dr-contentForm .avatar-uploader-icon{font-size:28px;color:#8c939d;width:200px;height:150px;line-height:150px!important;text-align:center}.dr-contentForm .avatar{width:200px;height:158px;display:block;-o-object-fit:contain;object-fit:contain}.dr-contentForm .upSimg{position:relative}.dr-contentForm .upSimg .refresh-btn{position:absolute;left:220px;top:0}.dr-contentForm .upSimg .refresh-btn i{font-weight:400}.dr-contentForm .covers-list .el-col{height:100px;margin-bottom:15px}.dr-contentForm .covers-list .el-col .grid-img{border-radius:4px;overflow:hidden;height:100%;cursor:pointer;position:relative}.dr-contentForm .covers-list .el-col .grid-img .cover{display:none}.dr-contentForm .covers-list .el-col .grid-img .cover span{position:absolute;top:50%;left:50%;display:inline-block;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);color:#fff;font-size:12px;width:60px}.dr-contentForm .covers-list .el-col .grid-img .cover span svg{margin-right:4px}.dr-contentForm .covers-list .el-col .grid-img .cover .showMoreCover{color:#aaa;text-align:center;border:1px solid #eee;border-radius:50%;width:50px;height:50px;line-height:50px;-webkit-box-shadow:0 2px 12px 0 rgba(0,0,0,.1);box-shadow:0 2px 12px 0 rgba(0,0,0,.1);font-size:15px}.dr-contentForm .covers-list .el-col .grid-img img{width:100%;height:100%}.dr-contentForm .covers-list .preview{position:relative;padding-left:0!important;padding-right:0!important}.dr-contentForm .covers-list .preview .grid-img{overflow:hidden;height:100%}.dr-contentForm .covers-list .preview .grid-img .cover-title{overflow:hidden;word-break:break-word;font-family:fzlthjt}.dr-contentForm.mobile .covers-list .preview{width:300px!important;height:200px!important}.dr-contentForm.mobile .covers-list .el-col{height:50px!important}",""])},6258:function(t,e,r){"use strict";r("7439")},"660e":function(t,e,r){"use strict";r("fc0c")},7439:function(t,e,r){var o=r("4b1f");(o="string"==typeof(o=o.__esModule?o.default:o)?[[t.i,o,""]]:o).locals&&(t.exports=o.locals);(0,r("5925").default)("7a999b78",o,!0,{sourceMap:!1,shadowMode:!1})},"7dea":function(t,e,r){(t.exports=r("690e")(!1)).push([t.i,".cover-dialog .el-dialog__body{padding-top:0!important}.dialog-covers-list{height:300px;overflow:hidden}.dialog-covers-list .el-col{height:60px;margin-bottom:15px}.dialog-covers-list .el-col .grid-img{background:#000;border-radius:4px;overflow:hidden;height:100%;cursor:pointer;position:relative}.dialog-covers-list .el-col .grid-img .cover{display:none}.dialog-covers-list .el-col .grid-img .cover span{position:absolute;top:50%;left:50%;display:inline-block;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);color:#fff;font-size:12px;width:60px}.dialog-covers-list .el-col .grid-img .cover span svg{margin-right:4px}.dialog-covers-list .el-col .grid-img img{width:100%;height:100%}.dialog-covers-list .preview{width:400px;height:269px;position:relative;padding-left:0!important;padding-right:0!important}.dialog-covers-list .preview .grid-img{overflow:hidden;height:100%}.dialog-covers-list .preview .grid-img .cover-title{overflow:hidden;word-break:break-word;font-family:fzlthjt}",""])},9856:function(t,e,r){"use strict";r.r(e);r("ac67"),r("1bc7"),r("32ea"),r("8dee"),r("fc02"),r("e680");var o=r("5d62"),a=(r("6a61"),r("6585")),i=(r("a450"),r("4057"),r("196d")),n=r.n(i),s=r("330f"),l=r("cc48"),c=r("60bb"),d=r.n(c),m=r("5880"),u={props:{device:String,pageInfo:Object,pageType:String},methods:{renderPageList:function(){var t=this.pageInfo?this.pageInfo.type:"";this.$store.dispatch("content/getContentCoverList",{current:0<arguments.length&&void 0!==arguments[0]?arguments[0]:1,pageSize:1<arguments.length&&void 0!==arguments[1]?arguments[1]:10,type:t})},handleSizeChange:function(t){var e=this.pageInfo?this.pageInfo.current:1;this.renderPageList(e,t)},handleCurrentChange:function(t){var e=this.pageInfo?this.pageInfo.pageSize:10;this.renderPageList(t,e)}},data:function(){return{}}},i=(r("cdac"),r("5d22")),c=Object(i.a)(u,function(){var e=this,t=e.$createElement,t=e._self._c||t;return t("div",{staticClass:"block dr-pagination"},[e.pageInfo?t("div",["mobile"==e.device?t("div",[t("el-pagination",{attrs:{"current-page":e.pageInfo.current,"page-size":e.pageInfo.pageSize,small:"",layout:"prev, pager, next",total:e.pageInfo.totalItems},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange,"update:currentPage":function(t){return e.$set(e.pageInfo,"current",t)},"update:current-page":function(t){return e.$set(e.pageInfo,"current",t)}}})],1):t("div",[t("el-pagination",{attrs:{"current-page":e.pageInfo.current,"page-sizes":[30,50],"page-size":e.pageInfo.pageSize,layout:"sizes, prev, pager, next",total:e.pageInfo.totalItems},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange,"update:currentPage":function(t){return e.$set(e.pageInfo,"current",t)},"update:current-page":function(t){return e.$set(e.pageInfo,"current",t)}}})],1)]):e._e()])},[],!1,null,null,null).exports;function p(e,t){var r,o=Object.keys(e);return Object.getOwnPropertySymbols&&(r=Object.getOwnPropertySymbols(e),t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),o.push.apply(o,r)),o}function g(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?p(Object(r),!0).forEach(function(t){Object(o.a)(e,t,r[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):p(Object(r)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))})}return e}var u={props:{dialogState:Object,targetCover:Object,coverTypeList:Array,device:String},data:function(){return{targetCoverList:[]}},computed:g(g({},Object(m.mapGetters)(["contentCoverList"])),{},{formState:function(){return this.$store.getters.contentFormState},coverActiveStyle:function(){return{position:"absolute",top:0,left:0,width:"100%",height:"100%",background:"rgba(0, 0, 0, 0.4)",display:"block"}},currentType:function(){return d.a.isEmpty(this.contentCoverList)||d.a.isEmpty(this.contentCoverList.docs)?"":this.contentCoverList.docs[0].type._id}}),components:{CoverPagination:c},methods:{handleTypeClick:function(t,e){t=this.coverTypeList[t.index];this.$store.dispatch("content/getContentCoverList",{type:t._id,pageSize:30})},selectThisCover:function(t){d.a.isEmpty(t)||(this.$emit("updateTargetCover",t),this.$store.dispatch("content/showContentForm",{edit:this.formState.edit,formData:Object.assign({},this.formState.formData,{cover:t._id})}),this.$store.dispatch("content/hideCoverListDialog"))}},mounted:function(){}},c=(r("660e"),Object(i.a)(u,function(){var r=this,t=r.$createElement,o=r._self._c||t;return o("div",{class:"dr-contentCoverForm "+r.device},[o("el-dialog",{staticClass:"cover-dialog",attrs:{xs:20,sm:20,md:4,lg:4,xl:4,title:"选择封面",width:"60%",visible:r.dialogState.show,"close-on-click-modal":!1},on:{"update:visible":function(t){return r.$set(r.dialogState,"show",t)}}},[o("el-tabs",{staticStyle:{height:"400px"},attrs:{"tab-position":"top"},on:{"tab-click":r.handleTypeClick},model:{value:r.currentType,callback:function(t){r.currentType=t},expression:"currentType"}},r._l(r.coverTypeList,function(t){return o("el-tab-pane",{key:t._id,attrs:{name:t._id,label:t.name}},[o("el-row",{staticClass:"dialog-covers-list",staticStyle:{"padding-left":"10px"},attrs:{gutter:20}},r._l(r.contentCoverList.docs,function(e){return o("el-col",{key:e._id,attrs:{xs:8,md:3}},[o("div",{staticClass:"grid-img",style:e.backgroundDefaultCss?JSON.parse(e.backgroundDefaultCss):"",on:{click:function(t){return r.selectThisCover(e)}}},[o("img",{attrs:{src:e.cover}}),o("div",{staticClass:"cover",style:r.formState.formData.cover==e._id?r.coverActiveStyle:{}},[o("span",[o("svg-icon",{attrs:{"icon-class":"icon_check_right"}}),r._v("已选择\n                ")],1)])])])}),1),o("CoverPagination",{attrs:{device:r.device,pageInfo:r.contentCoverList.pageInfo}})],1)}),1)],1)],1)},[],!1,null,null,null).exports),f=r("e9d9"),u=r("072e"),h=r.n(u);function v(e,t){var r,o=Object.keys(e);return Object.getOwnPropertySymbols&&(r=Object.getOwnPropertySymbols(e),t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),o.push.apply(o,r)),o}function b(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?v(Object(r),!0).forEach(function(t){Object(o.a)(e,t,r[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):v(Object(r)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))})}return e}m={props:{groups:Array},data:function(){var o=this;return{dataURL:"",coverImg:"https://cdn.html-js.cn/cms/covers/1.png",targetCover:"",coverTypeList:[],wordFileList:[],wordFileUrl:"",sidebarOpened:!0,device:"desktop",contentState:[{value:"0",label:"退回"},{value:"1",label:"待审核"},{value:"2",label:"审核通过"},{value:"3",label:"审核不通过"}],selectUserList:[],loading:!1,userLoading:!1,selectSpecialList:[],selectCoverList:[],content:"",simpleComments:"",isflash:!1,config:{initialFrameWidth:null,initialFrameHeight:320},editorConfig:{autoHeightEnabled:!1,initialFrameHeight:600,initialFrameWidth:"100%",serverUrl:"/api/upload/ueditor",UEDITOR_HOME_URL:this.$root.staticRootPath+"/plugins/ueditor/"},imageUrl:"",categoryProps:{value:"_id",label:"name",children:"children"},currentType:"1",rules:{targetUser:[{required:!0,message:this.$t("validate.selectNull",{label:"指定用户"}),trigger:"blur"}],sImg:[{required:!0,message:this.$t("validate.selectNull",{label:"缩略图"}),trigger:"blur"}],categories:[{required:!0,message:this.$t("validate.selectNull",{label:this.$t("contents.categories")}),trigger:"blur"}],title:[{required:!0,message:this.$t("validate.inputNull",{label:this.$t("contents.title")}),trigger:"blur"},{min:2,max:50,message:this.$t("validate.rangelength",{min:2,max:50}),trigger:"blur"}],stitle:[{required:!0,message:this.$t("validate.inputNull",{label:this.$t("contents.stitle")}),trigger:"blur"},{min:2,max:50,message:this.$t("validate.rangelength",{min:2,max:50}),trigger:"blur"}],tags:[{required:!0,message:this.$t("validate.inputNull",{label:this.$t("contents.tags")}),trigger:"blur"},{validator:function(t,e,r){d.a.isEmpty(e)?r(new Error(o.$t("validate.selectNull",{label:o.$t("contents.tags")}))):r()},trigger:"change"}],discription:[{required:!0,message:this.$t("validate.inputNull",{label:this.$t("contents.discription")}),trigger:"blur"},{min:5,max:300,message:this.$t("validate.rangelength",{min:5,max:100}),trigger:"blur"}],comments:[{required:!0,message:this.$t("validate.inputNull",{label:this.$t("contents.comments")}),trigger:"blur"},{min:5,message:this.$t("validate.rangelength",{min:5,max:1e5}),trigger:"blur"}]}}},components:{VueUeditorWrap:n.a,CoverTable:c,LinkWX:function(){return r.e("chunk-0fda6dad").then(r.bind(null,"1f3f"))},Cropper:function(){return Promise.all([r.e("chunk-535c2948"),r.e("chunk-75fc0d60")]).then(r.bind(null,"66ff"))}},methods:{updateTargetCover:function(t){this.targetCover=t},showMoreCovers:function(){var t;this.$store.dispatch("content/showCoverListDialog"),d.a.isEmpty(this.coverTypeList)||(t=(d.a.isEmpty(this.targetCover)?this.coverTypeList[0]:this.targetCover.type)._id,this.$store.dispatch("content/getContentCoverList",{type:t,pageSize:30}))},htmlToImage:function(){return new Promise(function(e,r){var t=document.getElementsByClassName("preview")[0],o=t.offsetWidth,a=t.offsetHeight,i=document.createElement("canvas");t.getBoundingClientRect();i.width=+o,i.height=+a;var n=i.getContext("2d");n.scale(1,1);var s=window.scrollY;n.translate(0,-s);a={scale:1,canvas:i,width:o,height:a,taintTest:!0,useCORS:!0,dpi:window.devicePixelRatio,background:"#fff"};h()(t,a).then(function(t){t=t.toDataURL("image/png",1),t={base64:t.toString().substring(t.indexOf(",")+1)};Object(l.p)(t).then(function(t){200===t.status?e(t.data):r(t.message)})})})},selectThisCover:function(t){d.a.isEmpty(t)||(this.targetCover=t,this.formState.formData.cover=t._id)},handleWordRemove:function(t,e){},handleWordPreview:function(t){},handleWordExceed:function(t,e){this.$message.warning("当前限制选择 1 个文件，本次选择了 ".concat(t.length," 个文件，共选择了 ").concat(t.length+e.length," 个文件"))},beforeWordRemove:function(t,e){return this.$confirm("确定移除 ".concat(t.name,"？"))},uploadWordSuccess:function(t,e){Object(f.b)(),this.wordFileUrl=t.data||"",this.ueditorObj.setContent(t.data),this.$message({message:"恭喜，导入成功！",type:"success"})},beforeWordUpload:function(t){var e=0<t.type.indexOf("officedocument"),t=t.size/1024/1024<5;return e||this.$message.error("只能上传docx,doc格式！"),t||this.$message.error(this.$t("validate.limitUploadImgSize",{size:5})),e&&t&&Object(f.a)(),e&&t},queryUserListByParams:function(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{},e=this;Object(l.j)(t).then(function(t){t=t.data.docs;t?(e.selectUserList=t.map(function(t){return{value:t._id,label:t.userName}}),e.userLoading=!1):e.selectUserList=[]}).catch(function(t){e.selectUserList=[]})},getRandomContentImg:function(){var e=this,t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{};Object(l.h)(t).then(function(t){200==t.status&&t&&t.data&&(t=t.data[0],t=Object.assign({},e.formState.formData,{sImg:t}),e.$store.dispatch("content/showContentForm",{formData:t}))}).catch(function(t){})},queryCoverListByParams:function(){var r=this,t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{},o=this;Object(l.e)(t).then(function(t){var e=t.data.docs;e?(o.selectCoverList=e,setTimeout(function(){r.$route.params.id?Object(l.d)({id:o.formState.formData.cover}).then(function(t){d.a.isEmpty(t)||(o.targetCover=t.data,o.formState.formData.cover=t.data._id)}):(o.targetCover=e[0],o.formState.formData.cover=e[0]._id)},1e3)):o.selectCoverList=[]}).catch(function(t){o.selectUserList=[]})},queryCoverTypeListByParams:function(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{},e=this;Object(l.b)(t).then(function(t){t=t.data;t?(e.coverTypeList=t,t=d.a.filter(t,function(t){return t.isDefault}),d.a.isEmpty(t)||e.queryCoverListByParams({type:t[0]._id})):e.coverTypeList=[]}).catch(function(t){e.coverTypeList=[]})},checkFlashPost:function(t){this.$store.dispatch("content/showContentForm",{edit:this.formState.edit,formData:Object.assign({},this.formState.formData,{type:t?"2":"1"})})},inputEditor:function(t){this.$store.dispatch("content/showContentForm",{edit:this.formState.edit,formData:Object.assign({},this.formState.formData,{markDownComments:t})})},changeEditor:function(t){},getLocalContents:function(){var t=localStorage.getItem("addContent")||"";return t?JSON.parse(t):{}},editorReady:function(t){this.ueditorObj=t},handleAvatarSuccess:function(t,e){t=t.data.path;this.$store.dispatch("content/showContentForm",{edit:this.formState.edit,formData:Object.assign({},this.formState.formData,{sImg:t})})},beforeAvatarUpload:function(t){var e="image/jpeg"===t.type,r="image/png"===t.type,o="image/gif"===t.type,t=t.size/1024/1024<2;return e||r||o||this.$message.error(this.$t("validate.limitUploadImgType")),t||this.$message.error(this.$t("validate.limitUploadImgSize",{size:2})),(e||r||o)&&t},handleChangeCategory:function(t){},backToList:function(){this.$router.push(this.$root.adminBasePath+"/content")},submitForm:function(t){var o=this;this.$refs[t].validate(function(){var e=Object(a.a)(regeneratorRuntime.mark(function t(e){var r;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(!e){t.next=26;break}if(t.prev=1,r=Object.assign({},o.formState.formData,{comments:o.ueditorObj.getContent(),simpleComments:o.ueditorObj.getPlainTxt()}),"1"==o.formState.formData.sImgType)return t.next=6,o.htmlToImage();t.next=7;break;case 6:r.sImg=t.sent;case 7:if(!o.formState.edit){t.next=11;break}Object(l.l)(r).then(function(t){200===t.status?(o.$router.push(o.$root.adminBasePath+"/content"),o.$message({message:o.$t("main.updateSuccess"),type:"success"})):o.$message.error(t.message)}),t.next=19;break;case 11:if(d.a.isEmpty(o.adminUserInfo)||d.a.isEmpty(o.adminUserInfo.targetEditor)){t.next=15;break}r.targetUser=o.adminUserInfo.targetEditor._id,t.next=18;break;case 15:return o.$message.error("在添加文档之前，您需要指定一个默认编辑！"),o.$router.push(o.$root.adminBasePath+"/content"),t.abrupt("return",!1);case 18:Object(l.a)(r).then(function(t){200===t.status?(o.$router.push(o.$root.adminBasePath+"/content"),o.$message({message:o.$t("main.addSuccess"),type:"success"})):o.$message.error(t.message)});case 19:t.next=24;break;case 21:t.prev=21,t.t0=t.catch(1),o.$message.error(t.t0.message);case 24:t.next=28;break;case 26:return t.abrupt("return",!1);case 28:case"end":return t.stop()}},t,null,[[1,21]])}));return function(t){return e.apply(this,arguments)}}())}},computed:b(b({},Object(m.mapGetters)(["contentTagList","contentCategoryList","adminUserInfo","contentCoverDialog"])),{},{formState:function(){return this.$store.getters.contentFormState},classObj:function(){return{hideSidebar:!this.sidebarOpened,openSidebar:this.sidebarOpened,withoutAnimation:"false",mobile:"mobile"===this.device}},coverActiveStyle:function(){return{position:"absolute",top:0,left:0,width:"100%",height:"100%",background:"rgba(0, 0, 0, 0.4)",display:"block"}},currentStyle:function(){return Object.assign({},{color:this.targetCover.titleColor,fontSize:Number(this.targetCover.titleSize)+"px"})},renderPreviewBackground:function(){var t=this.targetCover.backgroundDefaultCss,e={backgroundImage:"url("+this.targetCover.cover+")",backgroundSize:"cover",width:this.targetCover.width+"px",height:this.targetCover.height+"px"};return d.a.isEmpty(t)||Object.assign(e,JSON.parse(t)),e},renderPreviewTitle:function(){var t=this.formState.formData.stitle,e=this.targetCover;if(d.a.isEmpty(e)||d.a.isEmpty(e.type))return"";if(t){e=t.split("--"),t=this.targetCover.type.structure.replace("content_title",t);return t=2==e.length&&0<=this.targetCover.type.structure.indexOf("content_title_1")?this.targetCover.type.structure.replace("content_title",e[0]).replace("content_title_1",e[1]):t}return this.targetCover.type.structure}}),mounted:function(){var a=this;Object(s.a)(this),this.queryCoverTypeListByParams({isDefault:!0}),this.$store.dispatch("adminUser/getUserInfo");var e,r=this;this.$route.params.id?Object(l.g)({id:this.$route.params.id}).then(function(t){var e,r,o;200===t.status?t.data?(e=t.data,r=[],o=[],e.categories&&(e.categories.map(function(t,e){t&&r.push(t._id)}),e.categories=r),e.tags&&(e.tags.map(function(t,e){t&&o.push(t._id)}),e.tags=o),e.keywords&&(e.keywords=e.keywords.join()),e.uAuthor&&(a.queryUserListByParams({searchkey:e.uAuthor.userName}),e.targetUser=e.uAuthor._id),a.$store.dispatch("content/showContentForm",{edit:!0,formData:e})):a.$message({message:a.$t("validate.error_params"),type:"warning",onClose:function(){a.$router.push(a.$root.adminBasePath+"/content")}}):a.$message.error(t.message)}):(e=this.getLocalContents(),d.a.isEmpty(e)?this.getRandomContentImg():this.$confirm(this.$t("main.askForReInputContent"),this.$t("main.scr_modal_title"),{confirmButtonText:this.$t("main.confirmBtnText"),cancelButtonText:this.$t("main.cancelBtnText"),type:"warning"}).then(function(){var t=e.comments||"";r.$refs.ueditor.setContent(t),localStorage.removeItem(a.$route.path.split("/")[1]),a.$store.dispatch("content/showContentForm",{edit:!1,formData:e})}).catch(function(){localStorage.removeItem(a.$route.path.split("/")[1]),a.$message({type:"info",message:a.$t("main.scr_modal_del_error_info")})})),this.$store.dispatch("contentCategory/getContentCategoryList"),this.$store.dispatch("contentTag/getContentTagList",{pageSize:200})}},r("6258"),m=Object(i.a)(m,function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"dr-contentForm",class:e.classObj},[r("CoverTable",{attrs:{coverTypeList:e.coverTypeList,targetCover:e.targetCover,dialogState:e.contentCoverDialog,device:e.device},on:{updateTargetCover:e.updateTargetCover}}),r("div",{staticClass:"main-container"},[r("el-form",{ref:"ruleForm",staticClass:"demo-ruleForm",attrs:{model:e.formState.formData,rules:e.rules,"label-width":"120px","label-position":"mobile"==e.device?"top":"right"}},[e.formState.edit?r("el-form-item",{attrs:{label:e.$t("contents.enable"),prop:"state"}},[r("el-select",{attrs:{size:"small",placeholder:"审核文章"},model:{value:e.formState.formData.state,callback:function(t){e.$set(e.formState.formData,"state",t)},expression:"formState.formData.state"}},e._l(e.contentState,function(t){return r("el-option",{key:"kw_"+t.value,attrs:{label:t.label,value:t.value}})}),1)],1):r("el-form-item",{attrs:{label:"公众号文章链接"}},[r("LinkWX",{model:{value:e.formState.formData,callback:function(t){e.$set(e.formState,"formData",t)},expression:"formState.formData"}})],1),"3"==e.formState.formData.state?r("el-form-item",{attrs:{label:"驳回原因",prop:"dismissReason"}},[r("el-input",{attrs:{size:"small"},model:{value:e.formState.formData.dismissReason,callback:function(t){e.$set(e.formState.formData,"dismissReason",t)},expression:"formState.formData.dismissReason"}})],1):e._e(),r("Cropper",{attrs:{nameMod:e.nameMod,label:e.$t("contents.sImg"),prop:"sImg"},model:{value:e.formState.formData.sImg,callback:function(t){e.$set(e.formState.formData,"sImg",t)},expression:"formState.formData.sImg"}}),r("el-form-item",{attrs:{label:e.$t("contents.title"),prop:"title"}},[r("el-input",{attrs:{size:"small",maxlength:"50","show-word-limit":""},model:{value:e.formState.formData.title,callback:function(t){e.$set(e.formState.formData,"title",t)},expression:"formState.formData.title"}})],1),r("el-form-item",{attrs:{label:e.$t("contents.stitle"),prop:"stitle"}},[r("el-input",{attrs:{size:"small",maxlength:"50","show-word-limit":""},model:{value:e.formState.formData.stitle,callback:function(t){e.$set(e.formState.formData,"stitle",t)},expression:"formState.formData.stitle"}})],1),r("el-form-item",{attrs:{label:e.$t("contents.categories"),prop:"categories"}},[r("el-cascader",{attrs:{size:"small",expandTrigger:"hover",options:e.contentCategoryList.docs,props:e.categoryProps},on:{change:e.handleChangeCategory},model:{value:e.formState.formData.categories,callback:function(t){e.$set(e.formState.formData,"categories",t)},expression:"formState.formData.categories"}})],1),r("el-form-item",{attrs:{label:"关键字",prop:"keywords"}},[r("el-input",{attrs:{size:"small"},model:{value:e.formState.formData.keywords,callback:function(t){e.$set(e.formState.formData,"keywords",t)},expression:"formState.formData.keywords"}})],1),r("el-form-item",{attrs:{label:"标签",prop:"tags"}},[r("el-select",{attrs:{size:"small",multiple:"",filterable:"","allow-create":"","default-first-option":"",placeholder:e.$t("validate.selectNull",{label:this.$t("contents.tags")})},model:{value:e.formState.formData.tags,callback:function(t){e.$set(e.formState.formData,"tags",t)},expression:"formState.formData.tags"}},e._l(e.contentTagList.docs,function(t){return r("el-option",{key:t._id,attrs:{label:t.name,value:t._id}})}),1)],1),r("el-form-item",{attrs:{label:e.$t("contents.discription"),prop:"discription"}},[r("el-input",{attrs:{size:"small",type:"textarea",maxlength:"300","show-word-limit":"",autosize:{minRows:4,maxRows:10}},model:{value:e.formState.formData.discription,callback:function(t){e.$set(e.formState.formData,"discription",t)},expression:"formState.formData.discription"}})],1),r("el-form-item",{attrs:{label:e.$t("contents.comments"),prop:"comments"}},[r("vue-ueditor-wrap",{staticClass:"editorForm",attrs:{config:e.editorConfig},on:{ready:e.editorReady},model:{value:e.formState.formData.comments,callback:function(t){e.$set(e.formState.formData,"comments",t)},expression:"formState.formData.comments"}})],1),r("el-form-item",{attrs:{label:e.$t("contents.date"),prop:"date"}},[r("el-date-picker",{attrs:{type:"date",placeholder:e.$t("contents.date")},model:{value:e.formState.formData.date,callback:function(t){e.$set(e.formState.formData,"date",t)},expression:"formState.formData.date"}})],1),r("el-form-item",{attrs:{label:e.$t("contents.uploadWord"),prop:"uploadWord"}},[r("el-upload",{staticClass:"upload-demo",attrs:{action:"/api/content/getWordHtmlContent","on-preview":e.handleWordPreview,"on-remove":e.handleWordRemove,"before-remove":e.beforeWordRemove,"on-success":e.uploadWordSuccess,"before-upload":e.beforeWordUpload,multiple:"",limit:1,"on-exceed":e.handleWordExceed,"file-list":e.wordFileList}},[r("el-button",{attrs:{size:"small",type:"primary"}},[e._v("点击上传")]),r("div",{staticClass:"el-upload__tip",attrs:{slot:"tip"},slot:"tip"},[e._v("只能上传doc/docx文件，且不超过5mb")])],1)],1),r("el-form-item",{staticClass:"dr-submitContent"},[r("el-button",{attrs:{size:"medium",type:"primary"},on:{click:function(t){return e.submitForm("ruleForm")}}},[e._v(e._s(e.formState.edit?e.$t("main.form_btnText_update"):e.$t("main.form_btnText_save")))]),r("el-button",{attrs:{size:"medium"},on:{click:e.backToList}},[e._v(e._s(e.$t("main.back")))])],1)],1)],1)],1)},[],!1,null,null,null),e.default=m.exports},be48:function(t,e,r){(t.exports=r("690e")(!1)).push([t.i,".dr-pagination{text-align:center;margin:15px auto}",""])},cdac:function(t,e,r){"use strict";r("49a8")},fc0c:function(t,e,r){var o=r("7dea");(o="string"==typeof(o=o.__esModule?o.default:o)?[[t.i,o,""]]:o).locals&&(t.exports=o.locals);(0,r("5925").default)("df6dd9d8",o,!0,{sourceMap:!1,shadowMode:!1})}}]);
