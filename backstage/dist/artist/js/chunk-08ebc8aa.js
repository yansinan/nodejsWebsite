(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-08ebc8aa"],{"1adb":function(t,e){t.exports={imgFit:function(l,c,d,t){var u=3<arguments.length&&void 0!==t?t:"cover";return new Promise(function(e,t){var i,a=document.createElement("canvas"),n=a.getContext("2d");a.width=c,a.height=d;var o=1;"cover"==u&&(o=Math.max(a.width/l.width,a.height/l.height)),"fill"==u&&(o=Math.min(a.width/l.width,a.height/l.height));var s=a.width/2-l.width/2*o,r=a.height/2-l.height/2*o;n.drawImage(l,s,r,l.width*o,l.height*o),a.toBlob(function(t){i=URL.createObjectURL(t),e({src:i,blob:t})},l.type||"image/jpeg")})}}},"330f":function(t,e,i){"use strict";i.d(e,"a",function(){return o});var e=i("e04f"),a=i.n(e);function n(t){var e=a.a.get("sidebarStatus");t.sidebarOpened="1"==e,t.sidebar&&(t.sidebar.opened=t.sidebarOpened)}function o(e){var t=e.$root;setTimeout(function(){n(e)},500),t&&t.eventBus&&(t.eventBus.$on("toggleSideBar",function(t){setTimeout(function(){n(e)},500)}),t.eventBus.$on("toggleDevice",function(t){e.device=t}));t=document.body.getBoundingClientRect();e.device=t.width-1<992?"mobile":"desktop"}},"43b2":function(t,e,i){(t.exports=i("690e")(!1)).push([t.i,".el-dialog__title{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center}.el-dialog__title .el-avatar{margin-right:5px;margin-left:5px;min-width:40px}.el-upload-list__item-thumbnail{-o-object-fit:cover;object-fit:cover}",""])},4720:function(t,e,i){"use strict";i("d6c7")},"726d":function(t,e,i){"use strict";i.r(e);i("ac67"),i("1bc7"),i("32ea");var a,n=i("34f5"),o=(i("6e69"),i("79b1")),s=(i("a450"),i("e5b4"),i("0c84"),i("6a61"),i("ed32")),r=i("250d"),l=i("1adb"),c={name:"Album",props:{api:{type:String,default:"/manage/artist/updateAlbum"},label:{type:String,default:"主图"},dialogState:{type:Object,default:{isShow:!1,isEdited:!1,formData:{}}},"on-success":{type:Function,default:null},"before-upload":{type:Function,default:function(t){var e="image/jpeg"===t.type,i="image/png"===t.type,a="image/gif"===t.type,t=t.size/1024/1024<2;return e||i||a||this.$message.error(this.$t("validate.limitUploadImgType")),t||this.$message.error(this.$t("validate.limitUploadImgSize",{size:2})),(e||i||a)&&t}},"on-complete":{type:Function,default:null}},watch:{},data:function(){return{dialogPreviewVisible:!1,dialogImageUrl:"",disabled:!1,nameMod:nameMod,infoImageUploading:{isLoading:!1,name:"",progress:0}}},mounted:function(){},methods:{eImgLoaded:function(t){var e=this,i=t.target;i.removeEventListener("load",e.eImgLoaded);var a=i.naturalWidth/i.naturalHeight,n=Math.min(640,i.naturalWidth),t=640<i.naturalWidth?640*i.naturalHeight/i.naturalWidth:i.naturalHeight;a<1&&(n=640<i.naturalHeight?640*i.naturalWidth/i.naturalHeight:i.naturalWidth,t=Math.min(640,i.naturalHeight));new Date,i.src;i.type="image/jpeg",Object(l.imgFit)(i,n,t).then(function(t){i.srcOrg=i.src,i.crossOrigin=void 0,i.src=t.src,i.blob=t.blob,e.uploadBlob(i,t.blob,i.nameFile)})},uploadBlob:(a=Object(s.a)(regeneratorRuntime.mark(function t(e,i){var a,n,o,s=arguments;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:a=2<s.length&&void 0!==s[2]?s[2]:"",n=this,o=new FormData,n=n.getObjField(),o.append("nameMod",n.nameMod),o.append("isKeepName",!0),o.append("subPath",n.subPath),o.append("_id",n._id),o.append("upload_file",i,a),o=new Request("/manage/dr/uploadFiles",{method:"post",body:o}),fetch(o).then(function(t){return t.text()}).then(function(t){t=JSON.parse(t);debugger;200==t.status&&(e.dispatchEvent(new CustomEvent("uploaded",t)),e.dispose())}).catch(function(t){debugger});case 11:case"end":return t.stop()}},t,this)})),function(t,e){return a.apply(this,arguments)}),handleSuccess:function(e,i,a){var n=this,o=this;Promise.all(e.data.listInfoImage.map(function(a){return new Promise(function(e,t){var i=new Image;i.addEventListener("load",n.eImgLoaded),i.addEventListener("uploaded",e),i.addEventListener("error",function(t){e()}),i.nameFile="s"+a.nameServerFile,i.src=a.url})})).then(function(t){"function"==typeof o.onSuccess&&o.onSuccess(e,i,a),a.find(function(t){return"success"!=t.status})||(o.handleClose(),o.infoImageUploading.isLoading=!1)}).catch(function(t){debugger})},handleRemove:function(){this.infoImageUploading.isLoading=!1},handleBeforeRemove:function(a){var n=this;return a.url==this.dialogState.formData.sImg?(this.$confirm("主形象图：请勿删除","提示：",{confirmButtonText:"知道了",type:"warning"}),!1):new Promise(function(e,i){var t;"success"==a.status?(t={url:a.url,_id:n.dialogState.formData.id},t=new Request("/manage/artist/removeAlbum",{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),n.infoImageUploading.isLoading=!0,n.infoImageUploading.name="移除",fetch(t).then(function(t){return t.text()}).then(function(t){t=JSON.parse(t);200==t.status?(Object.assign(n.dialogState.formData,t._doc),e(t)):i(t)})):"ready"==a.status&&e()})},handlePictureCardPreview:function(t){this.dialogImageUrl=t.url,this.dialogPreviewVisible=!0},handleClose:function(){"function"==typeof this.onComplete&&this.onComplete(),this.dialogState.isShow=!1,this.dialogState.formData.listImages=[]},handleProgress:function(t,e){this.infoImageUploading.progress=t.percent,this.infoImageUploading.isLoading=e.isLoading||t.percent,this.infoImageUploading.name="上传:"+e.name},submitUpload:function(){this.$refs.upload.submit()},getObjField:function(){return{action:"uploadimage",nameMod:this.nameMod,subPath:this.dialogState.formData.id,_id:this.dialogState.formData.id}}}},d=(i("d5fc"),i("c701")),u=Object(d.a)(c,function(){var e=this,t=e.$createElement,t=e._self._c||t;return t("div",[t("el-dialog",{attrs:{xs:20,title:"图集",width:"80%","close-on-click-modal":!1,visible:e.dialogState.isShow,"before-close":e.handleClose},on:{"update:visible":function(t){return e.$set(e.dialogState,"isShow",t)}}},[t("div",{staticClass:"el-dialog__title",attrs:{slot:"title"},slot:"title"},[t("el-avatar",{attrs:{src:e.dialogState.formData.sImg,fit:"cover"}}),e._v(e._s(e.dialogState.formData.name)+"的"+e._s(e.label)+"\n        ")],1),t("el-upload",{directives:[{name:"loading",rawName:"v-loading",value:e.infoImageUploading.isLoading,expression:"infoImageUploading.isLoading"}],ref:"upload",attrs:{multiple:"","show-file-list":"true","list-type":"picture-card",accept:"image/png,image/gif,image/jpeg","element-loading-text":"正在"+e.infoImageUploading.name,"auto-upload":!1,action:e.api,"file-list":e.dialogState.formData.listImages,"on-success":e.handleSuccess,"on-progress":e.handleProgress,"on-preview":e.handlePictureCardPreview,"on-remove":e.handleRemove,"before-remove":e.handleBeforeRemove,"before-upload":e.beforeUpload,data:e.getObjField()}},[t("i",{staticClass:"el-icon-plus",attrs:{slot:"trigger"},slot:"trigger"}),t("div",{staticClass:"el-upload__tip",attrs:{slot:"tip"},slot:"tip"},[e._v("只能上传jpg/png文件，且不超过2M")])]),t("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[t("el-button",{on:{click:e.handleClose}},[e._v("取 消")]),t("el-button",{attrs:{type:"success"},on:{click:e.submitUpload}},[e._v("上 传")])],1)],1),t("el-dialog",{attrs:{visible:e.dialogPreviewVisible},on:{"update:visible":function(t){e.dialogPreviewVisible=t}}},[t("img",{attrs:{width:"100%",src:e.dialogImageUrl,alt:""}})])],1)},[],!1,null,null,null).exports,g=(i("a7e5"),i("0e2e")),p={props:{nameMod:{type:String,default:"rubyeyes"},label:{type:String,default:"链接"},dialogState:{type:Object,default:{isShow:!1,isEdited:!1,formData:{}}}},data:function(){return{listRecords:[],listRecordsNCM:[],strNoticeListNCM:""}},watch:{listRecordsNCM:function(t){0==t.length?this.strNoticeListNCM="网易云音乐MV已全部同步完成":this.strNoticeListNCM=""}},methods:{eBnSyncNCM:function(s){var t=this,r=this;return this.dialogState.formData.idNCM?new Promise(function(n,o){fetch("/api/artist/fetchNCMArtistAlbums?idNCM="+t.dialogState.formData.idNCM+"&_id="+t.dialogState.formData._id).then(function(t){return t.json()}).then(function(t){var e,i,a;200==t.status&&0<t.data.length?(a="",a="剔除重复"+(i=t.data.filter(function(e){var t=r.listRecordsNCM.find(function(t){return e.idAlbumNCM==t.idAlbumNCM})||r.listRecordsNCM.find(function(t){return e.name==t.name})||r.listRecords.find(function(t){return e.idAlbumNCM==t.idAlbumNCM})||r.listRecords.find(function(t){return e.name==t.name});return t&&(a+=e.name+","),!t})).length+"条V,新增:"+a,(e=r.listRecordsNCM).unshift.apply(e,Object(g.a)(i)),r.$message({message:"找到网易"+t.data.length+"条。"+a,type:"success"}),n(t)):(r.$message.error(r.$t("validate.inputCorrect",{label:"网易云音乐获取MV"})),o(s))}).catch(function(t){debugger;r.$message.error(r.$t("validate.inputCorrect",{label:"网易云音乐获取MV"})),o(t)})}):Promise.reject({err:"fail",msg:"no idNCM"})},getListRecords:function(){return Object(r.a)({url:"/api/artist/listRecords",method:"get",params:{_id:this.dialogState.formData._id}})},eDialogOpen:function(e){var i=this,a=this;this.getListRecords().then(function(t){return 200==t.status&&t.data&&0<t.data.length&&(a.listRecords=t.data),i.eBnSyncNCM(e)}).then(function(t){}).catch(function(t){debugger})},handleClose:function(){this.$emit("complete",this.listRecords),this.dialogState.isShow=!1,this.dialogState.formData={},this.dialogState.isEdited=!1,this.listRecordsNCM=[],this.listRecords=[]},uploadBlob:function(a){var n=this;return new Promise(function(e,i){var t=new FormData;t.append("nameMod",n.nameMod),t.append("subPath","records"),t.append("upload_file",a,"imgRecord.jpg");t=new Request("/manage/dr/uploadFiles",{method:"post",body:t});fetch(t).then(function(t){return t.text()}).then(function(t){t=JSON.parse(t);200==t.status?e(t.data.path):i({err:t,msg:"上传错误"})}).catch(function(t){i({err:t,msg:"上传错误"});debugger})})},getPushDataToUpdate:function(t){return{idAlbumNCM:t.idAlbumNCM,name:t.name,alias:t.alias,dateRelease:t.dateRelease,sImg:t.sImg,discription:t.discription,comments:t.comments,listRefs:t.listRefs}},addRecord:function(i){var a=this;i.isLoading=!0,a.uploadBlob(i.blob).then(function(t){return i.sImg=t,Object(r.a)({url:"/manage/record/addOne",method:"post",data:a.getPushDataToUpdate(i)})}).then(function(t){return 200===t.status?(a.$message({message:a.$t("main.addContents"),type:"success"}),Object(r.a)({url:"/manage/record/getOne",method:"get",params:{idAlbumNCM:i.idAlbumNCM}})):(a.$message.error(t.message),Promise.reject(t))}).then(function(t){if(200!==t.status||!t.data)return a.$message.error(t.message),Promise.reject(t);a.$message({message:a.$t("main.seeDetails"),type:"success"}),i.isLoading=!1,Object.assign(i,t.data);var e=a.listRecordsNCM.findIndex(function(t){return t.idAlbumNCM==i.idAlbumNCM});(t=a.listRecords).push.apply(t,Object(g.a)(a.listRecordsNCM.splice(e,1)))}).catch(function(t){debugger;a.$message.error(JSON.stringify(t))})},eEditRecord:function(t){this.$router.push(this.$root.adminBasePath+"/record/edit/"+t._id)},eImgLoaded:function(t){var t=t.target,e=(t.src.substring(0,7),new Date,t.src),i=this.listRecordsNCM.find(function(t){return t.sImg==e});512!=t.naturalWidth||512!=t.naturalHeight?i&&(t.type="image/jpeg",Object(l.imgFit)(t,512,512).then(function(t){i.sImg=t.src,i.blob=t.blob,i.isFitted=!0})):(i=i||this.listRecords.find(function(t){return t.sImg==e}))&&(i.isFitted=!0)}}},m=(i("b826"),Object(d.a)(p,function(){var i=this,t=i.$createElement,a=i._self._c||t;return a("div",[a("el-dialog",{attrs:{xs:20,title:"发行",width:"80%","close-on-click-modal":!1,visible:i.dialogState.isShow,"before-close":i.handleClose},on:{"update:visible":function(t){return i.$set(i.dialogState,"isShow",t)},open:i.eDialogOpen}},[a("div",{staticClass:"el-dialog__title",attrs:{slot:"title"},slot:"title"},[a("el-avatar",{attrs:{src:i.dialogState.formData.sImg,fit:"cover"}}),i._v(i._s(i.dialogState.formData.name)+"的"+i._s(i.label)+"\n  ")],1),a("el-divider",{attrs:{"content-position":"left"}},[i._v("已保存的专辑")]),a("div",{staticClass:"listGrid local"},i._l(i.listRecords,function(e,t){return a("div",{key:e.idAlbumNCM},[a("el-card",{directives:[{name:"loading",rawName:"v-loading",value:e.isLoading,expression:"domain.isLoading"}],attrs:{"body-style":{padding:"0px"},shadow:"hover"}},[a("el-image",{attrs:{span:24,src:e.sImg,fit:i.contain,crossOrigin:"Anonymous"}}),a("div",{staticClass:"titleVideo"},[e.name?a("span",[i._v(i._s(e.name))]):i._e(),a("el-tooltip",{attrs:{content:"编辑专辑内容",placement:"top",effect:"light"}},[a("el-button",{attrs:{type:"primary",plain:"",icon:"el-icon-edit"},on:{click:function(t){return t.preventDefault(),i.eEditRecord(e)}}})],1)],1)],1)],1)}),0),a("el-divider",{attrs:{"content-position":"left"}},[i._v("网易云音乐数据")]),a("div",{staticClass:"listGrid"},i._l(i.listRecordsNCM,function(e,t){return a("div",{key:e.idAlbumNCM},[a("el-card",{directives:[{name:"loading",rawName:"v-loading",value:e.isLoading,expression:"domain.isLoading"}],attrs:{"body-style":{padding:"0px"},shadow:"hover"}},[a("el-image",{directives:[{name:"loading",rawName:"v-loading",value:!e.isFitted,expression:"!domain.isFitted"}],attrs:{span:24,src:e.sImg,fit:i.contain,crossOrigin:"Anonymous"},on:{load:i.eImgLoaded}}),a("div",{staticClass:"titleVideo"},[e.name?a("span",[i._v(i._s(e.name))]):i._e(),a("el-tooltip",{attrs:{content:"复制到本站",placement:"top",effect:"light"}},[a("el-button",{attrs:{type:"success",plain:"",disabled:!e.isFitted,icon:"el-icon-document-copy"},on:{click:function(t){return t.preventDefault(),i.addRecord(e)}}})],1)],1)],1)],1)}),0),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:i.handleClose}},[i._v("关 闭")])],1)],1)],1)},[],!1,null,"091679ed",null).exports),s={nameMod:String,dataList:Array,pageInfo:Object},f={loading:!1,multipleSelection:[],yellow:{color:"#F7BA2A"},gray:{color:"#CCC"},green:{color:"#13CE66"},red:{color:"#FF4949"},dialogStateLink:{isShow:!1,isEdited:!1,formData:{},strListObjURL:"listLinks"}},c={getList:function(){this.pageInfo.mod=this.nameMod,this.$store.dispatch(this.nameMod+"/getList",this.pageInfo)},handleContentSelectionChange:function(t){t&&0<t.length&&(t=t.map(function(t,e){return t._id}),this.multipleSelection=t,this.$emit("changeContentSelectList",t))},editContentInfo:function(t,e){t=e[t];this.$router.push(this.nameMod+"/edit/"+t._id)},topContent:function(t,e){var i=this,t=e[t],t={_id:t._id,isTop:1==t.isTop?0:1};Object(o.g)(t,this.nameMod).then(function(t){200===t.status?i.getList():i.$message.error(t.data.message||t.message)})},roofContent:function(t,e){var i=this,t=e[t];if(1!=t.isTop)return!1;t={_id:t._id,roofPlacement:"1"==t.roofPlacement?"0":"1"};Object(o.e)(t,this.nameMod).then(function(t){200===t.status?i.getList():i.$message.error(t.data.message||t.message)})},deleteContent:function(t,e){var i=this;this.$confirm(this.$t("main.del_notice"),this.$t("main.scr_modal_title"),{confirmButtonText:this.$t("main.confirmBtnText"),cancelButtonText:this.$t("main.cancelBtnText"),type:"warning"}).then(function(){return Object(o.d)({ids:e[t]._id,draft:"1"},i.nameMod)}).then(function(t){200===t.status?(Object.assign(i.pageInfo),i.getList(),i.$message({message:i.$t("main.scr_modal_del_succes_info"),type:"success"})):i.$message.error(t.data.message||t.message)}).catch(function(){i.$message({type:"info",message:i.$t("main.scr_modal_del_error_info")})})},eListLinksEdit:function(t,e){this.dialogStateLink={isShow:!0,isEdited:!1,formData:e[t],strListObjURL:"listLinks"}},eLink:function(t,e){window.open(t,e)}},p=i("60bb"),h=i.n(p);function b(e,t){var i,a=Object.keys(e);return Object.getOwnPropertySymbols&&(i=Object.getOwnPropertySymbols(e),t&&(i=i.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),a.push.apply(a,i)),a}function v(e){for(var t=1;t<arguments.length;t++){var i=null!=arguments[t]?arguments[t]:{};t%2?b(Object(i),!0).forEach(function(t){Object(n.a)(e,t,i[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):b(Object(i)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(i,t))})}return e}var s={props:v({},s),data:function(){return v(v({},f),{},{dialogStateAlbum:{isShow:!1,isEdited:!1,formData:{}},dialogStateRecord:{isShow:!1,isEdited:!1,formData:{}},dialogStateMusic:{isShow:!1,isEdited:!1,formData:{},strListObjURL:"listHotMusics"},dialogStateVideos:{isShow:!1,isEdited:!1,formData:{},strListObjURL:"listVideos"}})},components:{Album:u,Record:m,DialogURL:function(){return Promise.all([i.e("chunk-332f0fce"),i.e("chunk-182b15d5")]).then(i.bind(null,"b7ef"))},ListVideos:function(){return i.e("chunk-31af503c").then(i.bind(null,"7127"))}},methods:v(v({},c),{},{eAlbumEdit:function(t,e){this.dialogStateAlbum={isShow:!0,isEdited:!1,formData:e[t]}},eRecordEdit:function(t,e){this.dialogStateRecord={isShow:!0,isEdited:!1,formData:e[t]}},eListHotMusicsEdit:function(t,e){this.dialogStateMusic={isShow:!0,isEdited:!1,formData:e[t],strListObjURL:"listHotMusics"}},eListVideosEdit:function(t,e){this.dialogStateVideos={isShow:!0,isEdited:!1,formData:e[t],strListObjURL:"listVideos"}}}),computed:{}},u=(i("7b03"),Object(d.a)(s,function(){var i=this,t=i.$createElement,a=i._self._c||t;return a("div",[a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:i.loading,expression:"loading"}],ref:"multipleTable",staticClass:"tableBox",staticStyle:{width:"100%"},attrs:{align:"center",data:i.dataList,"tooltip-effect":"dark"},on:{"selection-change":i.handleContentSelectionChange}},[a("el-table-column",{attrs:{type:"selection",width:"30"}}),a("el-table-column",{attrs:{prop:"isTop",label:i.$t("contents.rec"),width:"30","show-overflow-tooltip":""},scopedSlots:i._u([{key:"default",fn:function(e){return[a("svg-icon",{directives:[{name:"show",rawName:"v-show",value:1===e.row.isTop,expression:"scope.row.isTop === 1"}],style:i.yellow,attrs:{"icon-class":"icon_star_fill"},on:{click:function(t){return i.topContent(e.$index,i.dataList)}}}),a("svg-icon",{directives:[{name:"show",rawName:"v-show",value:1!=e.row.isTop,expression:"scope.row.isTop != 1"}],style:i.gray,attrs:{"icon-class":"icon_star"},on:{click:function(t){return i.topContent(e.$index,i.dataList)}}})]}}])}),a("el-table-column",{attrs:{prop:"roofPlacement",label:i.$t("contents.roofPlacement"),width:"30","show-overflow-tooltip":""},scopedSlots:i._u([{key:"default",fn:function(e){return[a("svg-icon",{directives:[{name:"show",rawName:"v-show",value:1===e.row.isTop&&1==e.row.roofPlacement,expression:"scope.row.isTop === 1 && scope.row.roofPlacement == 1"}],style:i.green,attrs:{"icon-class":"icon_ping"},on:{click:function(t){return i.roofContent(e.$index,i.dataList)}}}),a("svg-icon",{directives:[{name:"show",rawName:"v-show",value:1===e.row.isTop&&1!=e.row.roofPlacement,expression:"scope.row.isTop === 1 && scope.row.roofPlacement != 1"}],style:i.gray,attrs:{"icon-class":"icon_ding"},on:{click:function(t){return i.roofContent(e.$index,i.dataList)}}})]}}])}),a("el-table-column",{attrs:{prop:"name",label:i.$t("docs.name"),"min-width":"250","show-overflow-tooltip":""},scopedSlots:i._u([{key:"default",fn:function(e){return[a("el-avatar",{style:2!=e.row.state?"filter: opacity(0.5) grayscale(1);":"",attrs:{src:e.row.sImg,fit:"cover",size:"large"}}),a("el-button",{style:2!=e.row.state?"filter: opacity(0.5) grayscale(1);":"",attrs:{type:"text",size:"large"},on:{click:function(t){return i.editContentInfo(e.$index,i.dataList)}}},[i._v(i._s(e.row.name)+"  "),a("i",{staticClass:"el-icon-edit"})])]}}])}),a("el-table-column",{attrs:{prop:"listImages",label:i.$t("artist.listImages"),width:"80","show-overflow-tooltip":""},scopedSlots:i._u([{key:"default",fn:function(e){return[a("el-badge",{attrs:{value:e.row.listImages.length,hidden:0==e.row.listImages.length,max:99,type:"info"}},[a("el-button",{attrs:{size:"large",plain:"",icon:"el-icon-picture-outline",type:0==e.row.listImages.length?"":"primary",circle:""},on:{click:function(t){return i.eAlbumEdit(e.$index,i.dataList)}}})],1)]}}])}),a("el-table-column",{attrs:{prop:"listRecords",label:i.$t("artist.listRecords"),width:"80","show-overflow-tooltip":""},scopedSlots:i._u([{key:"default",fn:function(e){return[a("el-badge",{attrs:{value:e.row.cntRecords,hidden:0==e.row.cntRecords,max:99,type:"info"}},[a("el-button",{attrs:{size:"large",plain:"",icon:"el-icon-files",type:0==e.row.cntRecords?"":"primary",circle:""},on:{click:function(t){return i.eRecordEdit(e.$index,i.dataList)}}})],1)]}}])}),a("el-table-column",{attrs:{prop:"listVideos",label:i.$t("artist.listVideos"),width:"80","show-overflow-tooltip":""},scopedSlots:i._u([{key:"default",fn:function(e){return[a("el-badge",{attrs:{value:e.row.listVideos.length,hidden:0==e.row.listVideos.length,max:99,type:"info"}},[a("el-button",{attrs:{size:"large",plain:"",icon:"el-icon-video-camera",type:0==e.row.listVideos.length?"":"primary",circle:""},on:{click:function(t){return i.eListVideosEdit(e.$index,i.dataList)}}})],1)]}}])}),a("el-table-column",{attrs:{prop:"listHotMusics",label:i.$t("artist.listHotMusics"),width:"80","show-overflow-tooltip":""},scopedSlots:i._u([{key:"default",fn:function(e){return[a("el-badge",{attrs:{value:e.row.listHotMusics.length,hidden:0==e.row.listHotMusics.length,max:99,type:"info"}},[a("el-button",{attrs:{size:"large",plain:"",icon:"el-icon-headset",type:0==e.row.listHotMusics.length?"":"primary",circle:""},on:{click:function(t){return i.eListHotMusicsEdit(e.$index,i.dataList)}}})],1)]}}])}),a("el-table-column",{attrs:{prop:"listLinks",label:i.$t("artist.listLinks"),width:"80","show-overflow-tooltip":""},scopedSlots:i._u([{key:"default",fn:function(e){return[a("el-badge",{attrs:{value:e.row.listLinks.length,hidden:0==e.row.listLinks.length,max:99,type:"info"}},[a("el-button",{attrs:{size:"large",plain:"",icon:"el-icon-link",type:0==e.row.listLinks.length?"":"primary",circle:""},on:{click:function(t){return i.eListLinksEdit(e.$index,i.dataList)}}})],1)]}}])}),a("el-table-column",{attrs:{label:i.$t("main.dataTableOptions"),width:"200",fixed:"right"},scopedSlots:i._u([{key:"default",fn:function(e){return[a("el-button-group",[a("el-button",{attrs:{icon:"el-icon-view",type:e.row.state?"":"info",disabled:!e.row.state,size:"large"},on:{click:function(t){return i.eLink("/artists/news/"+e.row.url)}}}),a("el-button",{attrs:{icon:"el-icon-edit",size:"large",type:"success",plain:""},on:{click:function(t){return i.editContentInfo(e.$index,i.dataList)}}}),a("el-button",{attrs:{icon:"el-icon-delete",size:"large",type:"danger",plain:""},on:{click:function(t){return i.deleteContent(e.$index,i.dataList)}}})],1)]}}])})],1),a("Album",{attrs:{nameMod:i.nameMod,label:i.$t("artist.listImages"),dialogState:i.dialogStateAlbum,"on-complete":i.getList}}),a("DialogURL",{attrs:{nameMod:i.nameMod,label:i.$t("artist.listHotMusics"),dialogState:i.dialogStateMusic},on:{complete:i.getList}}),a("DialogURL",{attrs:{nameMod:i.nameMod,label:i.$t("artist.listLinks"),dialogState:i.dialogStateLink},on:{complete:i.getList}}),a("ListVideos",{attrs:{nameMod:i.nameMod,label:i.$t("artist.listVideos"),dialogState:i.dialogStateVideos},on:{complete:i.getList}}),a("Record",{attrs:{label:i.$t("artist.listRecords"),dialogState:i.dialogStateRecord},on:{complete:i.getList}})],1)},[],!1,null,null,null).exports),m=(i("07c3"),{props:{nameMod:String,pageInfo:Object,ids:Array,code:String,path:String,device:String},data:function(){return{selectUserList:[],loading:!1,searchkey:"",authPost:"0",authPostOptions:[{value:"0",label:"全部"},{value:"1",label:"待审核"}]}},methods:{eBnAdd:function(){this.$store.dispatch(this.nameMod+"/showContentForm",{isInit:!0}),this.$router.push(this.$root.adminBasePath+"/"+this.nameMod+"/add")},branchDelete:function(){var e=this,i=this;if(h.a.isEmpty(i.ids))return this.$message({type:"info",message:this.$t("validate.selectNull",{label:this.$t("main.target_Item")})}),!1;this.$confirm(this.$t("main.del_notice"),this.$t("main.scr_modal_title"),{confirmButtonText:this.$t("main.confirmBtnText"),cancelButtonText:this.$t("main.cancelBtnText"),type:"warning"}).then(function(){var t=i.ids.join();return Object(o.d)({ids:t},e.nameMod)}).then(function(t){200===t.status?(e.$store.dispatch(e.nameMod+"/getList",{mod:nameMod}),e.$message({message:"".concat(e.$t("main.scr_modal_del_succes_info")),type:"success"})):e.$message.error(t.data.message||t.message)}).catch(function(t){e.$message({type:"info",message:e.$t("main.scr_modal_del_error_info")})})}},components:{}}),c=(i("4720"),Object(d.a)(m,function(){var t=this,e=t.$createElement,e=t._self._c||e;return e("div",{staticClass:"dr-toolbar"},[e("el-col",{staticClass:"option-button",attrs:{xs:12,md:6}},[e("el-button",{attrs:{size:"small",type:"primary",plain:"",round:""},on:{click:t.eBnAdd}},[e("svg-icon",{attrs:{"icon-class":"icon_add"}})],1),e("el-button",{attrs:{size:"small",type:"danger",plain:"",round:""},on:{click:t.branchDelete}},[e("svg-icon",{attrs:{"icon-class":"icon_delete"}})],1)],1),e("el-col",{attrs:{xs:12,md:18}},[e("div",{staticClass:"dr-toolbar-right"},[t._v(" ")])])],1)},[],!1,null,null,null).exports),s={props:{device:String,pageInfo:Object,nameMod:String},methods:{renderPageList:function(t,e){var i=0<arguments.length&&void 0!==t?t:1,a=1<arguments.length&&void 0!==e?e:30,n=this.pageInfo?this.pageInfo.searchkey:"",t=this.pageInfo?this.pageInfo.state:"",e=this.pageInfo?this.pageInfo.user:"";this.$store.dispatch(this.nameMod+"/getList",{current:i,pageSize:a,searchkey:n,state:t,userId:e,mod:this.nameMod})},handleSizeChange:function(t){var e=this.pageInfo?this.pageInfo.current:1;this.renderPageList(e,t)},handleCurrentChange:function(t){var e=this.pageInfo?this.pageInfo.pageSize:30;this.renderPageList(t,e)}},data:function(){return{}}},m=(i("ad72"),Object(d.a)(s,function(){var e=this,t=e.$createElement,t=e._self._c||t;return t("div",{staticClass:"block dr-pagination"},[e.pageInfo?t("div",["mobile"==e.device?t("div",[t("el-pagination",{attrs:{"current-page":e.pageInfo.current,"page-size":e.pageInfo.pageSize,small:"",layout:"prev, pager, next",total:e.pageInfo.totalItems},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange,"update:currentPage":function(t){return e.$set(e.pageInfo,"current",t)},"update:current-page":function(t){return e.$set(e.pageInfo,"current",t)}}})],1):t("div",[t("el-pagination",{attrs:{"current-page":e.pageInfo.current,"page-sizes":[10,30,50,100],"page-size":e.pageInfo.pageSize,layout:"sizes, prev, pager, next",total:e.pageInfo.totalItems},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange,"update:currentPage":function(t){return e.$set(e.pageInfo,"current",t)},"update:current-page":function(t){return e.$set(e.pageInfo,"current",t)}}})],1)]):e._e()])},[],!1,null,null,null).exports),s=i("5880"),w=i("330f");function y(e,t){var i,a=Object.keys(e);return Object.getOwnPropertySymbols&&(i=Object.getOwnPropertySymbols(e),t&&(i=i.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),a.push.apply(a,i)),a}Object(s.createNamespacedHelpers)(nameMod);s={name:"index",data:function(){return{selectlist:[],sidebarOpened:!0,device:"desktop",nameMod:nameMod}},components:{DataTable:u,TopBar:c,Pagination:m},methods:{changeSelect:function(t){this.selectlist=t}},computed:function(e){for(var t=1;t<arguments.length;t++){var i=null!=arguments[t]?arguments[t]:{};t%2?y(Object(i),!0).forEach(function(t){Object(n.a)(e,t,i[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):y(Object(i)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(i,t))})}return e}({classObj:function(){return{hideSidebar:!this.sidebarOpened,openSidebar:this.sidebarOpened,withoutAnimation:"false",mobile:"mobile"===this.device}}},Object(s.mapGetters)({dataList:"getterListData"})),mounted:function(){Object(w.a)(this),this.$store.dispatch(nameMod+"/getList",{mod:nameMod})}},s=Object(d.a)(s,function(){var t=this,e=t.$createElement,e=t._self._c||e;return e("div",{class:t.classObj},[e("div",{staticClass:"main-container"},[e("el-row",{staticClass:"dr-datatable"},[e("el-col",{attrs:{span:24}},[e("TopBar",{attrs:{nameMod:t.nameMod,ids:t.selectlist,pageInfo:t.dataList.pageInfo}}),e("DataTable",{attrs:{nameMod:t.nameMod,dataList:t.dataList.docs,pageInfo:t.dataList.pageInfo},on:{changeContentSelectList:t.changeSelect}}),e("Pagination",{attrs:{pageInfo:t.dataList.pageInfo,nameMod:t.nameMod}})],1)],1)],1)])},[],!1,null,null,null),e.default=s.exports},"7b03":function(t,e,i){"use strict";i("d47a")},"7bd1":function(t,e,i){var a=i("af9c");"string"==typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);(0,i("85cb").default)("74643671",a,!0,{sourceMap:!1,shadowMode:!1})},9525:function(t,e,i){(t.exports=i("690e")(!1)).push([t.i,".option-button{display:inline-block}",""])},"9e58":function(t,e,i){var a=i("43b2");"string"==typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);(0,i("85cb").default)("5667eab8",a,!0,{sourceMap:!1,shadowMode:!1})},a620:function(t,e,i){(t.exports=i("690e")(!1)).push([t.i,".tableBox th{height:100%}.tableBox td{height:80px}.tableBox .cell{height:100%;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;text-align:center}.tableBox .cell .el-button--text{color:#303133;font-size:18px;line-height:2.5em}.tableBox .cell .el-avatar{margin-right:5px;margin-left:5px;min-width:40px}.tableBox .cell .containerTag{display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;-webkit-box-pack:start;-ms-flex-pack:start;justify-content:start;-webkit-box-align:start;-ms-flex-align:start;align-items:start}.tableBox .cell .containerTag .el-tag{margin-top:20px;margin-right:10px}.fa-star,.fa-thumbs-up{cursor:pointer}.fa-star-o,.fa-thumbs-o-up{cursor:pointer}",""])},a864:function(t,e,i){(t.exports=i("690e")(!1)).push([t.i,".dr-pagination{text-align:center;margin:15px auto}",""])},ad72:function(t,e,i){"use strict";i("fea7")},af9c:function(t,e,i){(t.exports=i("690e")(!1)).push([t.i,".el-form-item[data-v-091679ed]{margin-bottom:0!important}.titleVideo[data-v-091679ed]{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;font-size:18px;padding:18px 20px}.listGrid[data-v-091679ed]{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;grid-template-rows:auto;grid-gap:1rem;margin:0 1rem}.listGrid.local[data-v-091679ed]{margin-bottom:4rem}",""])},b826:function(t,e,i){"use strict";i("7bd1")},d47a:function(t,e,i){var a=i("a620");"string"==typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);(0,i("85cb").default)("2fc13288",a,!0,{sourceMap:!1,shadowMode:!1})},d5fc:function(t,e,i){"use strict";i("9e58")},d6c7:function(t,e,i){var a=i("9525");"string"==typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);(0,i("85cb").default)("e138365e",a,!0,{sourceMap:!1,shadowMode:!1})},fea7:function(t,e,i){var a=i("a864");"string"==typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);(0,i("85cb").default)("750250ee",a,!0,{sourceMap:!1,shadowMode:!1})}}]);