(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-a916954a"],{"66ff":function(e,t,i){"use strict";i.r(t);i("d1e8");var a,n,o=i("d3f2"),r=(i("9736"),i("0bbd"),i("388c"),i("3348"),i("5e06")),c=i.n(r),r=(i("c8a9"),{name:"ImgCropper",props:{nameMod:{type:String,default:"rubyeyes"},subPath:{type:String,default:""},aspectRatio:{type:Number,default:1},api:{type:String,default:"/manage/dr/uploadFiles"},prop:{type:String,default:"sImg"},label:{type:String,default:"主图"},value:{type:String,default:""},isInnerDialog:{type:Boolean,default:!1},cropSetting:{type:Object,default:{width:512,height:512,minWidth:256,minHeight:256,maxWidth:1024,maxHeight:1024,fillColor:"#fff",imageSmoothingEnabled:!1,imageSmoothingQuality:"high"}},"before-crop":{type:Function,default:function(e){var t="image/jpeg"===e.type,i="image/png"===e.type,e="image/gif"===e.type;return t||i||e||this.$message.error(this.$t("validate.limitUploadImgType")),t||i||e}},"on-success":{type:Function,default:null}},watch:{src:function(e,t){this.dialogVisible=""!=this.src,this.cropper&&this.cropper.replace(e)},srcPreview:function(e,t){-1==e.indexOf("music.126.net")&&-1==e.indexOf("mp.weixin.qq.com")&&-1==e.indexOf("mmbiz.qpic.cn")||this.fetchImgURL(e,"")}},data:function(){return{cropperImg:"",cropper:"",src:"",imgName:"",dialogVisible:!1}},computed:{srcPreview:function(){return this.value}},mounted:function(){},methods:{handleClose:function(e){this.src="",this.cropper.reset(),this.$refs.inputFile.value=this.src},initCropper:function(){this.cropper||(this.cropper=new c.a(this.$refs.img,{viewMode:1,dragMode:"move",aspectRatio:this.aspectRatio}))},eClickOpenImg:function(){this.$refs.inputFile.click()},checkBlob:function(e){var t=this;"function"==typeof this.beforeCrop&&this.beforeCrop(e)?(t.src=URL.createObjectURL(e),t.imgName=e.name||"unknow."+e.type.split("/")[1]):t.handleClose.call(t)},fetchImgURL:(n=Object(o.a)(regeneratorRuntime.mark(function e(t,i){var a,n;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:a=this,(n=new Image).setAttribute("crossOrigin","anonymous"),n.src=t,n.onload=function(){var e=document.createElement("canvas");e.width=n.width,e.height=n.height,e.getContext("2d").drawImage(n,0,0,n.width,n.height),e.toBlob(function(e){return a.checkBlob(e)})};case 5:case"end":return e.stop()}},e,this)})),function(e,t){return n.apply(this,arguments)}),uploadImg:function(e){e=e.target.files[0];this.checkBlob(e)},uploadBlob:(a=Object(o.a)(regeneratorRuntime.mark(function e(t){var i,a;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:i=this,(a=new FormData).append("nameMod",i.nameMod),a.append("subPath",i.subPath),a.append("upload_file",t,i.imgName),a=new Request(i.api,{method:"post",body:a}),fetch(a).then(function(e){return e.text()}).then(function(e){e=JSON.parse(e);200==e.status&&(i.src=e.data.path,i.src&&i.$emit("input",i.src),i.handleClose.call(i))}).catch(function(e){debugger});case 7:case"end":return e.stop()}},e,this)})),function(e){return a.apply(this,arguments)}),uploadCropImg:function(){this.cropper.getCroppedCanvas(this.cropSetting).toBlob(this.uploadBlob,"image/jpeg",1)},saveCropImg:function(){var i=this;this.cropper.getCroppedCanvas().toBlob(function(e){var e=window.URL.createObjectURL(e),t=document.createElement("a");t.href=e,t.download=i.imgName,document.body.appendChild(t),t.click(),document.body.removeChild(t),window.URL.revokeObjectURL(e)},"image/jpeg")}}}),o=(i("fc6c"),i("cba8")),i=Object(o.a)(r,function(){var t=this,e=t.$createElement,e=t._self._c||e;return e("el-form-item",{attrs:{label:"",prop:t.prop}},[e("el-card",{attrs:{"body-style":{padding:"0px"},shadow:"always"}},[e("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[e("el-button",{staticStyle:{width:"100%"},attrs:{type:"primary",plain:""},on:{click:t.eClickOpenImg}},[t._v("上传"),e("i",{staticClass:"el-icon-upload el-icon--right"})]),e("input",{directives:[{name:"show",rawName:"v-show",value:!1,expression:"false"}],ref:"inputFile",attrs:{type:"file",multiple:"",accept:"image/png,image/gif,image/jpeg"},on:{change:t.uploadImg}})],1),e("el-tooltip",{attrs:{content:"只能上传jpg/png文件，上传前自动裁切",placement:"top",effect:"light"}},[t.srcPreview?e("img",{ref:"imgPreview",staticClass:"imgResult",attrs:{src:t.srcPreview}}):t._e()])],1),e("el-dialog",{attrs:{xs:20,title:"上传图片",width:"80%",visible:t.dialogVisible,"before-close":t.handleClose,"append-to-body":t.isInnerDialog},on:{"update:visible":function(e){t.dialogVisible=e},opened:t.initCropper}},[e("div",{staticClass:"cropper",staticStyle:{width:"100%",height:"auto",border:"dashed #cacaca 1px","text-align":"center"}},[e("img",{ref:"img",staticStyle:{"max-width":"100%"},attrs:{src:t.src}})]),e("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[e("el-button",{on:{click:t.handleClose}},[t._v("取 消")]),e("el-button",{attrs:{type:"primary"},on:{click:t.uploadCropImg}},[t._v("上 传")])],1)])],1)},[],!1,null,null,null);t.default=i.exports},"6aaa":function(e,t,i){var a=i("bd01");(a="string"==typeof(a=a.__esModule?a.default:a)?[[e.i,a,""]]:a).locals&&(e.exports=a.locals);(0,i("5925").default)("921466c2",a,!0,{sourceMap:!1,shadowMode:!1})},bd01:function(e,t,i){(e.exports=i("690e")(!1)).push([e.i,"img{-o-object-fit:contain;object-fit:contain}.imgResult{position:relative;height:auto;width:100%;max-height:100%}.bnUpload{font-size:20px;color:#cacaca;width:200px;height:200px;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;line-height:36px}",""])},fc6c:function(e,t,i){"use strict";i("6aaa")}}]);