(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-a46c6baa"],{"04e6":function(e,t,a){(e.exports=a("690e")(!1)).push([e.i,".demo-ruleForm{margin:15px 0;width:80%;padding-bottom:50px}.demo-ruleForm .post-rate .el-rate{margin-top:10px}.demo-ruleForm .dr-submitContent{position:fixed;z-index:9999999;padding:10px 30px;text-align:right;right:0;bottom:0;background:none;margin-bottom:0}.demo-ruleForm .avatar-uploader .el-upload{border:1px dashed #d9d9d9;border-radius:6px;cursor:pointer;position:relative;overflow:hidden}.demo-ruleForm .avatar-uploader .el-upload:hover{border-color:#409eff}.demo-ruleForm .avatar-uploader-icon{font-size:28px;color:#8c939d;width:200px;height:150px;line-height:150px;text-align:center}.demo-ruleForm .avatar{width:200px;height:158px;display:block}.demo-ruleForm .upSimg{position:relative}.demo-ruleForm .upSimg .refresh-btn{position:absolute;left:220px;top:0}.demo-ruleForm .upSimg .refresh-btn i{font-weight:400}.demo-ruleForm .el-autocomplete,.demo-ruleForm .el-range-editor.el-input__inner,.demo-ruleForm .el-select{width:100%}.demo-ruleForm .el-select-suffix{width:0;overflow:visible}.demo-ruleForm .el-select-suffix .el-input__suffix-inner{position:absolute;right:100%;white-space:nowrap;background-color:#fff;background-clip:content-box;border:2px solid transparent;max-height:-webkit-fill-available}",""])},1179:function(e,t,a){"use strict";a("53f5")},1953:function(e,t,a){"use strict";a.r(t);a("ac67"),a("32ea"),a("1bc7"),a("0c84"),a("c5cb");var o=a("0e2e"),r=(a("e5b4"),a("34f5")),n=(a("6e69"),a("330f")),i=a("c100"),s=a("60bb"),l=a.n(s),c=a("5880");function m(t,e){var a,o=Object.keys(t);return Object.getOwnPropertySymbols&&(a=Object.getOwnPropertySymbols(t),e&&(a=a.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),o.push.apply(o,a)),o}function u(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?m(Object(a),!0).forEach(function(e){Object(r.a)(t,e,a[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):m(Object(a)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(a,e))})}return t}s=Object(c.createNamespacedHelpers)(nameMod),c={props:u({},i.f),data:function(){var o=this;return u(u({},i.c),{},{rules:{sImg:[{required:!0,message:this.$t("validate.selectNull",{label:"缩略图"}),trigger:"blur"}],name:[{required:!0,message:this.$t("validate.inputNull",{label:this.$t("contents.name")}),trigger:"blur"},{min:1,max:50,message:this.$t("validate.rangelength",{min:1,max:50}),trigger:"blur"}],tags:[{validator:function(e,t,a){l.a.isEmpty(t)?a(new Error(o.$t("validate.selectNull",{label:o.$t("contents.tags")}))):a()},trigger:"change"}],discription:[{required:!0,message:this.$t("validate.inputNull",{label:this.$t("contents.discription")}),trigger:"blur"},{min:5,max:300,message:this.$t("validate.rangelength",{min:5,max:100}),trigger:"blur"}],comments:[{required:!0,message:this.$t("validate.inputNull",{label:this.$t("contents.comments")}),trigger:"blur"},{min:5,message:this.$t("validate.rangelength",{min:5,max:1e5}),trigger:"blur"}]}})},components:u(u({},i.a),{},{ContentForm:function(){return a.e("chunk-52065c9b").then(a.bind(null,"46d4"))}}),methods:u(u(u({},i.e),s.mapActions(["showContentForm"])),{},{eChangeFormats:function(e){var t=this;t.formState.formData.listFormatTags=e.listIds,"delete"==e.strAction?t.formState.formData.tags=t.formState.formData.tags.filter(function(t){return!e.listObjDiff.find(function(e){return e._id==t})}):t.formState.formData.tags=Object(o.a)(new Set(t.formState.formData.tags.concat(e.listIds))),t.updateKeywords(e.listObjDiff,"delete"==e.strAction)},createFormatTag:function(e){return{name:e,comments:"发行介质",alias:e}}}),computed:u(u(u(u({},i.b),Object(c.mapGetters)(["contentCategoryList"])),s.mapState({formState:function(e){return e.formState}})),{},{listAllTags:function(){return this.$refs.contentForm.listAllTags||[]}}),mounted:function(){Object(n.a)(this),Object(i.d)(this)}},a("1179"),s=a("5d22"),c=Object(s.a)(c,function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"dr-contentForm",class:t.classObj},[a("div",{staticClass:"main-container"},[a("ContentForm",{ref:"contentForm",attrs:{nameMod:t.nameMod},scopedSlots:t._u([{key:"leftTop",fn:function(){return[a("el-form-item",{attrs:{prop:"name"}},[a("el-input",{attrs:{size:"small",maxlength:"50","show-word-limit":""},model:{value:t.formState.formData.name,callback:function(e){t.$set(t.formState.formData,"name",e)},expression:"formState.formData.name"}},[a("template",{slot:"suffix"},[t._v(t._s(t.$t(t.nameMod+".name")))])],2)],1)]},proxy:!0},{key:"leftMiddle",fn:function(){return[t.formState.formData?a("el-row",{staticStyle:{"flex-wrap":"wrap"},attrs:{gutter:40,type:"flex",justify:"space-between"}},[a("el-col",{attrs:{lg:12}},[a("el-form-item",{attrs:{prop:"dateRelease"}},[a("el-date-picker",{attrs:{type:"date",placeholder:"发行日期"},on:{change:t.eChangeDate},model:{value:t.formState.formData.dateRelease,callback:function(e){t.$set(t.formState.formData,"dateRelease",e)},expression:"formState.formData.dateRelease"}})],1)],1),a("el-col",{staticStyle:{"min-width":"min-content"},attrs:{lg:12}},[a("el-form-item",{attrs:{prop:"catalog"}},[a("el-input",{attrs:{size:"small",placeholder:""},model:{value:t.formState.formData.catalog,callback:function(e){t.$set(t.formState.formData,"catalog",e)},expression:"formState.formData.catalog"}},[a("template",{slot:"suffix"},[t._v(t._s(t.$t(t.nameMod+".catalog")))])],2)],1)],1)],1):t._e(),a("SelectIds",{attrs:{label:t.$t(t.nameMod+".listFormatTags"),listIds:t.formState.formData.listFormatTags,nameMode:t.nameMod,apiFind:"/api/record/listAllFormats",initTag:t.createFormatTag},on:{change:t.eChangeFormats}})]},proxy:!0},{key:"footer",fn:function(){return[a("ListURL",{ref:"listLinks",attrs:{label:"购买链接"},model:{value:t.formState.formData.listLinks,callback:function(e){t.$set(t.formState.formData,"listLinks",e)},expression:"formState.formData.listLinks"}})]},proxy:!0}]),model:{value:t.formState,callback:function(e){t.formState=e},expression:"formState"}})],1)])},[],!1,null,null,null),t.default=c.exports},"330f":function(e,t,a){"use strict";a.d(t,"a",function(){return n});var t=a("e04f"),o=a.n(t);function r(e){var t=o.a.get("sidebarStatus");e.sidebarOpened="1"==t,e.sidebar&&(e.sidebar.opened=e.sidebarOpened)}function n(t){var e=t.$root;setTimeout(function(){r(t)},500),e&&e.eventBus&&(e.eventBus.$on("toggleSideBar",function(e){setTimeout(function(){r(t)},500)}),e.eventBus.$on("toggleDevice",function(e){t.device=e}));e=document.body.getBoundingClientRect();t.device=e.width-1<992?"mobile":"desktop"}},"53f5":function(e,t,a){var o=a("04e6");"string"==typeof o&&(o=[[e.i,o,""]]),o.locals&&(e.exports=o.locals);(0,a("85cb").default)("42fa9bfc",o,!0,{sourceMap:!1,shadowMode:!1})},c100:function(e,t,a){"use strict";a.d(t,"f",function(){return i}),a.d(t,"c",function(){return s}),a.d(t,"a",function(){return l}),a.d(t,"d",function(){return c}),a.d(t,"e",function(){return m}),a.d(t,"b",function(){return u});var t=a("ac50"),t=a("873e"),t=a("5c10"),r=a("0e2e"),t=a("0bbd"),t=a("9736"),n=a("79b1"),t=a("6e69"),o=a("e9d9"),t=a("196d"),i={groups:Array},s={nameMod:nameMod,contentState:[{value:"0",label:"撤回",color:""},{value:"1",label:"草稿",color:"#409EFF"},{value:"2",label:"发布",color:"#67C23A"}],sidebarOpened:!0,device:"desktop"},l={VueUeditorWrap:a.n(t).a,ListURL:function(){return a.e("chunk-16250e40").then(a.bind(null,"33b5"))},LinkWX:function(){return a.e("chunk-017bf9d6").then(a.bind(null,"1f3f"))},Cropper:function(){return Promise.all([a.e("chunk-6dcfd71c"),a.e("chunk-672af0a4")]).then(a.bind(null,"66ff"))},SelectIds:function(){return a.e("chunk-6cd37fd8").then(a.bind(null,"6d92"))}};function c(o){var t;o.$route.params.id?Object(n.b)({id:o.$route.params.id},o.nameMod).then(function(e){var t,a;200===e.status?e.data?(t=e.data,a=[],t.categories&&(t.categories.map(function(e,t){e&&a.push(e._id)}),t.categories=a),t.tags&&(t.tags=t.tags.map(function(e){return e&&e._id})),t.keywords&&(t.keywords=t.keywords.join()),t.listRefs&&(t.listRefs=t.listRefs.map(function(e){return e._id})),t.listMembers&&(t.listMembers=t.listMembers.map(function(e){return e._id})),t.listFormatTags&&(t.listFormatTags=t.listFormatTags.map(function(e){return e&&e._id})),o.showContentForm({edit:!0,formData:t})):o.$message({message:o.$t("validate.error_params"),type:"warning",onClose:function(){o.backToList()}}):o.$message.error(e.message)}).catch(function(e){debugger}):(t=o.getLocalContents(),_.isEmpty(t)?o.showContentForm({edit:!1}):o.$confirm(o.$t("main.askForReInputContent"),o.$t("main.scr_modal_title"),{confirmButtonText:o.$t("main.confirmBtnText"),cancelButtonText:o.$t("main.cancelBtnText"),type:"warning"}).then(function(){var e=t.comments||"";o.$refs.ueditor.setContent(e),localStorage.removeItem(o.$route.path.split("/")[1]),o.showContentForm({edit:!1,formData:t})}).catch(function(){localStorage.removeItem(o.$route.path.split("/")[1]),o.$message({type:"info",message:o.$t("main.scr_modal_del_error_info")})})),o.$store.dispatch("contentCategory/getContentCategoryList")}var m={updateKeywords:function(e){var t=1<arguments.length&&void 0!==arguments[1]&&arguments[1],a=this.formState.formData.keywords.split(","),o=[];return e&&""!=e&&e instanceof String&&(o=[e]),e&&0<e.length&&e instanceof Array&&(o=(o=e.filter(function(e){return e&&e.name||e instanceof String})).map(function(e){return e.name||e})),t?a=a.filter(function(e){return-1===o.indexOf(e)}):a.push.apply(a,Object(r.a)(o)),a=Object(r.a)(new Set(a)),this.formState.formData.keywords=a.join(),this.formState.formData.keywords},getLocalContents:function(){var e=localStorage.getItem("addContent")||"";return e?JSON.parse(e):{}},editorReady:function(e){this.ueditorObj=e},backToList:function(){this.formState.formData.tags=[],this.$router.push(this.$root.adminBasePath+"/"+this.nameMod)},submitForm:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:"",a=this;""!=t&&(a.formState.formData.state=t),this.$refs[e].validate(function(e){if(!e)return!1;e=Object.assign({},a.formState.formData,{comments:a.ueditorObj.getContent(),simpleComments:a.ueditorObj.getPlainTxt()});a.formState.edit?Object(n.f)(e,a.nameMod).then(function(e){200===e.status?(localStorage.removeItem(a.$route.path.split("/")[1]),a.backToList(),a.$message({message:a.$t("main.updateSuccess"),type:"success"})):a.$message.error(e.message)}).catch(function(e){debugger;a.$message.error(JSON.stringify(e))}):Object(n.a)(e,a.nameMod).then(function(e){200===e.status?(localStorage.removeItem(a.$route.path.split("/")[1]),a.backToList(),a.$message({message:a.$t("main.addSuccess"),type:"success"})):a.$message.error(e.message)}).catch(function(e){a.$message.error(e.message)})})},funForWordUpload:{handleWordRemove:function(e,t){},handleWordPreview:function(e){},handleWordExceed:function(e,t){this.$message.warning("当前限制选择 1 个文件，本次选择了 ".concat(e.length," 个文件，共选择了 ").concat(e.length+t.length," 个文件"))},beforeWordRemove:function(e,t){},uploadWordSuccess:function(e,t){Object(o.b)(),this.wordFileUrl=e.data||"";debugger;this.formState.formData.comments=e.data,this.$message({message:"恭喜，导入成功！",type:"success"})},beforeWordUpload:function(e){var t=!!(e.type.indexOf("officedocument")||e.name.indexOf(".doc")||0<e.name.indexOf(".docx")),e=e.size/1024/1024<5;return t||this.$message.error("只能上传docx,doc格式！"),e||this.$message.error(this.$t("validate.limitUploadImgSize",{size:5})),t&&e&&Object(o.a)(),t&&e}}},u={classObj:function(){return{hideSidebar:!this.sidebarOpened,openSidebar:this.sidebarOpened,withoutAnimation:"false",mobile:"mobile"===this.device}},device:function(){return document.body.getBoundingClientRect().width-1<992?"mobile":"desktop"}}}}]);