(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-458b50fe"],{"1adb":function(t,e){t.exports={imgFit:function(c,l,d){var f=3<arguments.length&&void 0!==arguments[3]?arguments[3]:"cover";return new Promise(function(e,t){var s,i=document.createElement("canvas"),a=i.getContext("2d");i.width=l,i.height=d;var o=1;"cover"==f&&(o=Math.max(i.width/c.width,i.height/c.height)),"fill"==f&&(o=Math.min(i.width/c.width,i.height/c.height));var r=i.width/2-c.width/2*o,n=i.height/2-c.height/2*o;a.drawImage(c,r,n,c.width*o,c.height*o),i.toBlob(function(t){s=URL.createObjectURL(t),e({src:s,blob:t})},c.type||"image/jpeg")})}}},"26d8":function(t,e,s){(t.exports=s("690e")(!1)).push([t.i,".article[data-v-7ffebb67]{max-height:50vh;overflow-y:scroll;overflow-x:hidden;border:1px dashed #909399;border-radius:.5em;padding:10px 20px;margin-bottom:60px}.el-upload__tip[data-v-7ffebb67]{color:#f56c6c}.el-divider__text[data-v-7ffebb67]{color:#67c23a}.groupSelectorImg[data-v-7ffebb67]{-ms-flex-wrap:wrap;flex-wrap:wrap;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;margin-top:20px;border:1px dashed #909399;border-radius:.5em;padding:20px 10px}.groupSelectorImg[data-v-7ffebb67],.selectorImg[data-v-7ffebb67]{display:-webkit-box;display:-ms-flexbox;display:flex}.selectorImg[data-v-7ffebb67]{padding:10px;border:1px dashed #909399;width:120px;height:120px;margin:5px 5px;border-radius:.25em}.selectorImg.selected[data-v-7ffebb67]{border:2px solid #409eff}.selectorImg .imgSelectSImg[data-v-7ffebb67]{width:100px;height:100px}",""])},"44f4":function(t,e,s){var i=s("c51c"),c=s("d6c9"),l=s("c1be"),d=s("0e92"),f=s("e95f");i(i.S,"Object",{getOwnPropertyDescriptors:function(t){for(var e,s,i=l(t),a=d.f,o=c(i),r={},n=0;o.length>n;)void 0!==(s=a(i,e=o[n++]))&&f(r,e,s);return r}})},"5f99":function(t,e,s){var i=s("26d8");(i="string"==typeof(i=i.__esModule?i.default:i)?[[t.i,i,""]]:i).locals&&(t.exports=i.locals);(0,s("5925").default)("45d436dd",i,!0,{sourceMap:!1,shadowMode:!1})},"8cc2":function(t,e,s){"use strict";s("5f99")},ac46:function(t,e,s){var i=s("0345"),a=s("b185");s("bf69")("keys",function(){return function(t){return a(i(t))}})},bf69:function(t,e,s){var a=s("c51c"),o=s("983a"),r=s("603f");t.exports=function(t,e){var s=(o.Object||{})[t]||Object[t],i={};i[t]=e(s),a(a.S+a.F*r(function(){s(1)}),"Object",i)}},c685:function(t,e,s){"use strict";s.r(e);s("44f4"),s("ac50"),s("ac46");var i=s("c1a2"),a=(s("0bbd"),s("9736"),s("1adb"));function o(e,t){var s,i=Object.keys(e);return Object.getOwnPropertySymbols&&(s=Object.getOwnPropertySymbols(e),t&&(s=s.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),i.push.apply(i,s)),i}var r={props:{value:{type:Object,default:{}},api:{type:String,default:"/api/content/fetchWX"},urlKey:{type:String,default:"mp.weixin.qq.com/s?"}},data:function(){return{strURLWX:"",objRes:{sImg:"",title:"",date:"",comments:""},objResDefault:{sImg:"",title:"",date:"",comments:""},isDialog:!1,isLoading:!1,listSrcImgWX:[]}},computed:{},components:{},methods:{eClickSImg:function(t){this.$set(this.objRes,"sImg",t.currentTarget.attributes["data-src"].value)},errURL:function(t){this.strErrMsg=t,this.isLoading=!1,t&&this.$message.error(this.strErrMsg)},eInputURL:function(){var e=this,t=e.$refs.inputURL.value;t?(t=t.split(e.urlKey)[1])?(e.isLoading=!0,fetch(e.api+"?"+t).then(function(t){return t.text()}).then(function(t){e.isLoading=!1;t=JSON.parse(t)||{};t&&200==t.status&&t.data&&t.data.title&&t.data.comments?(e.$message({message:"找到文章，自动填充："+t.data.title,type:"success"}),Object.assign(e.objRes,t.data),e.objRes.name=e.objRes.name||e.objRes.title,e.objRes.alias=t.data.name||t.data.title,e.objRes.stitle=e.objRes.alias,e.objRes.discription=t.data.name||t.data.title,e.listSrcImgWX=t.data.listSrcImg,e.$set(e.objRes,"sImg",t.data.sImg||e.objRes.listSrcImg[0]),e.isDialog=!0):e.errURL(t.message)}).catch(function(t){debugger;e.errURL(t.message)})):e.errURL("文章地址不正确"):e.errURL("")},submitUpload:function(){Object.assign(this.value,this.objRes),this.value&&this.value.title&&this.value.comments&&(this.$emit("input",this.value),this.$emit("confirm",function(e){for(var t=1;t<arguments.length;t++){var s=null!=arguments[t]?arguments[t]:{};t%2?o(Object(s),!0).forEach(function(t){Object(i.a)(e,t,s[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(s)):o(Object(s)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(s,t))})}return e}({url:this.$refs.inputURL.value},this.objRes))),this.handleClose()},handleClose:function(t){this.isLoading=!1,this.strErrMsg="",Object.assign(this.objRes,this.objResDefault),this.isDialog=!1},eImgLoaded:function(t){var e=t.target;e.removeEventListener("load",this.eImgLoaded);var s=e.naturalWidth,i=e.naturalHeight,t=e.src.substring(0,7);-1==t.indexOf("blob")&&(new Date,e.src,e.type="image/jpeg",Object(a.imgFit)(e,s,i).then(function(t){e.srcOrg=e.src,e.crossOrigin=void 0,e.src=t.src,e.blob=t.blob}))}}},s=(s("8cc2"),s("cba8")),r=Object(s.a)(r,function(){var s=this,t=s.$createElement,i=s._self._c||t;return i("div",{staticStyle:{"text-align":"left"}},[i("el-tooltip",{attrs:{content:"输入文章链接",placement:"top",effect:"light"}},[i("el-input",{directives:[{name:"loading",rawName:"v-loading",value:s.isLoading,expression:"isLoading"}],ref:"inputURL",attrs:{size:"small"},on:{change:s.eInputURL},model:{value:s.strURLWX,callback:function(t){s.strURLWX=t},expression:"strURLWX"}},[i("span",{attrs:{slot:"prepend"},slot:"prepend"},[s._v("https://")]),i("el-button",{attrs:{slot:"append",type:"success",plain:"",icon:"el-icon-cloudy"},on:{click:function(t){return t.preventDefault(),s.eInputURL.apply(null,arguments)}},slot:"append"},[s._v("读 取")])],1)],1),s.strErrMsg?i("div",{staticClass:"el-upload__tip"},[s._v(s._s(s.strErrMsg))]):s._e(),i("el-dialog",{attrs:{xs:20,title:"读取结果",width:"80%",top:"5vh","close-on-click-modal":!0,visible:s.isDialog,"before-close":s.handleClose},on:{"update:visible":function(t){s.isDialog=t}}},[i("div",{staticClass:"el-dialog__title",attrs:{slot:"title"},slot:"title"},[i("h2",[s._v(s._s(s.objRes.title))]),i("em",[s._v(" "+s._s(s.objRes.date)+" ")])]),i("div",{staticClass:"article",domProps:{innerHTML:s._s(s.objRes.comments)}}),i("el-divider",{attrs:{"content-position":"left"}},[s._v("请选择主形象图")]),i("div",{staticClass:"groupSelectorImg"},s._l(s.listSrcImgWX,function(t,e){return i("div",{key:e,staticClass:"selectorImg",class:s.objRes.sImg==t?"selected":"",attrs:{"data-src":t},on:{click:s.eClickSImg}},[i("el-tooltip",{attrs:{effect:"dark",content:s.objRes.sImg==t?"作为主图":"",value:s.objRes.sImg==t,placement:"top",manual:""}},[i("img",{staticClass:"imgSelectSImg",attrs:{src:s.objRes.listSrcImg[e],fit:"cover"},on:{load:s.eImgLoaded}})])],1)}),0),i("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[i("el-button",{on:{click:s.handleClose}},[s._v("取 消")]),i("el-button",{attrs:{type:"success"},on:{click:s.submitUpload}},[s._v("使 用")])],1)],1)],1)},[],!1,null,"7ffebb67",null);e.default=r.exports},d6c9:function(t,e,s){var i=s("df1f"),a=s("e33d"),o=s("d407"),s=s("da5b").Reflect;t.exports=s&&s.ownKeys||function(t){var e=i.f(o(t)),s=a.f;return s?e.concat(s(t)):e}},df1f:function(t,e,s){var i=s("98a0"),a=s("45b8").concat("length","prototype");e.f=Object.getOwnPropertyNames||function(t){return i(t,a)}},e33d:function(t,e){e.f=Object.getOwnPropertySymbols},e95f:function(t,e,s){"use strict";var i=s("0ff5"),a=s("eb66");t.exports=function(t,e,s){e in t?i.f(t,e,a(0,s)):t[e]=s}}}]);