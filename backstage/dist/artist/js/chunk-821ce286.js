(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-821ce286"],{"0c42":function(t,e,s){(t.exports=s("690e")(!1)).push([t.i,".article[data-v-66d3afa8]{max-height:50vh;overflow-y:scroll;overflow-x:hidden;border:1px dashed #909399;border-radius:.5em;padding:10px 20px;margin-bottom:60px}.el-upload__tip[data-v-66d3afa8]{color:#f56c6c}.el-divider__text[data-v-66d3afa8]{color:#67c23a}.groupSelectorImg[data-v-66d3afa8]{-ms-flex-wrap:wrap;flex-wrap:wrap;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;margin-top:20px;border:1px dashed #909399;border-radius:.5em;padding:20px 10px}.groupSelectorImg[data-v-66d3afa8],.selectorImg[data-v-66d3afa8]{display:-webkit-box;display:-ms-flexbox;display:flex}.selectorImg[data-v-66d3afa8]{padding:10px;border:1px dashed #909399;width:120px;height:120px;margin:5px 5px;border-radius:.25em}.selectorImg.selected[data-v-66d3afa8]{border:2px solid #409eff}.selectorImg .imgSelectSImg[data-v-66d3afa8]{width:100px;height:100px}",""])},"1f3f":function(t,e,s){"use strict";s.r(e);s("388c"),s("0bbd"),s("9736");var i=s("1adb"),a={props:{value:{type:Object,default:{}}},data:function(){return{strURLWX:"",objRes:{sImg:"",title:"",date:"",comments:""},objResDefault:{sImg:"",title:"",date:"",comments:""},isDialog:!1,isLoading:!1,listSrcImgWX:[]}},computed:{},components:{},methods:{eClickSImg:function(t){this.$set(this.objRes,"sImg",t.currentTarget.attributes["data-src"].value)},errURL:function(t){var e=this;e.strErrMsg=t,e.isLoading=!1,t&&e.$message.error(e.strErrMsg)},eInputURL:function(){var e=this,t=e.$refs.inputURL.value;t?(t=t.split("mp.weixin.qq.com/s?")[1])?(e.isLoading=!0,fetch("/api/content/fetchWX?"+t).then(function(t){return t.text()}).then(function(t){e.isLoading=!1;t=JSON.parse(t)||{};t&&200==t.status&&t.data&&t.data.title&&t.data.comments?(e.$message({message:"找到公帐号文章，自动填充："+t.data.title,type:"success"}),Object.assign(e.objRes,t.data),e.objRes.name=e.objRes.name||e.objRes.title,e.objRes.alias=t.data.name||t.data.title,e.objRes.stitle=e.objRes.alias,e.objRes.discription=t.data.name||t.data.title,e.listSrcImgWX=t.data.listSrcImg,e.objRes.listSrcImg=t.data.listSrcImg.map(function(t){return t.replace("https://mmbiz.qpic.cn","/getWXImg")}),e.$set(e.objRes,"sImg",e.objRes.listSrcImg[0]),e.isDialog=!0):e.errURL(t.message)}).catch(function(t){debugger;e.errURL(t.message)})):e.errURL("文章地址不正确"):e.errURL("")},submitUpload:function(){Object.assign(this.value,this.objRes),this.value&&this.value.title&&this.value.comments&&this.$emit("input",this.value),this.handleClose()},handleClose:function(t){this.isLoading=!1,this.strErrMsg="",Object.assign(this.objRes,this.objResDefault),this.isDialog=!1},eImgLoaded:function(t){var e=t.target,t=(e.removeEventListener("load",this.eImgLoaded),e.naturalWidth),s=e.naturalHeight,a=e.src.substring(0,7);-1==a.indexOf("blob")&&(new Date,e.src,e.type="image/jpeg",Object(i.imgFit)(e,t,s).then(function(t){e.srcOrg=e.src,e.crossOrigin=void 0,e.src=t.src,e.blob=t.blob}))}}},s=(s("c352"),s("cba8")),s=Object(s.a)(a,function(){var s=this,t=s.$createElement,a=s._self._c||t;return a("div",{staticStyle:{"text-align":"left"}},[a("el-tooltip",{attrs:{content:"输入公众号文章链接",placement:"top",effect:"light"}},[a("el-input",{directives:[{name:"loading",rawName:"v-loading",value:s.isLoading,expression:"isLoading"}],ref:"inputURL",attrs:{size:"small"},on:{change:s.eInputURL},model:{value:s.strURLWX,callback:function(t){s.strURLWX=t},expression:"strURLWX"}},[a("span",{attrs:{slot:"prepend"},slot:"prepend"},[s._v("https://")]),a("el-button",{attrs:{slot:"append",type:"success",plain:"",icon:"el-icon-cloudy"},on:{click:function(t){return t.preventDefault(),s.eInputURL.apply(null,arguments)}},slot:"append"},[s._v("读 取")])],1)],1),s.strErrMsg?a("div",{staticClass:"el-upload__tip"},[s._v(s._s(s.strErrMsg))]):s._e(),a("el-dialog",{attrs:{xs:20,title:"读取结果",width:"80%",top:"5vh","close-on-click-modal":!0,visible:s.isDialog,"before-close":s.handleClose},on:{"update:visible":function(t){s.isDialog=t}}},[a("div",{staticClass:"el-dialog__title",attrs:{slot:"title"},slot:"title"},[a("h2",[s._v(s._s(s.objRes.title))]),a("em",[s._v(" "+s._s(s.objRes.date)+" ")])]),a("div",{staticClass:"article",domProps:{innerHTML:s._s(s.objRes.comments)}}),a("el-divider",{attrs:{"content-position":"left"}},[s._v("请选择主形象图")]),a("div",{staticClass:"groupSelectorImg"},s._l(s.listSrcImgWX,function(t,e){return a("div",{key:e,staticClass:"selectorImg",class:s.objRes.sImg==t?"selected":"",attrs:{"data-src":t},on:{click:s.eClickSImg}},[a("el-tooltip",{attrs:{effect:"dark",content:s.objRes.sImg==t?"作为主图":"",value:s.objRes.sImg==t,placement:"top",manual:""}},[a("img",{staticClass:"imgSelectSImg",attrs:{src:s.objRes.listSrcImg[e],fit:"cover"},on:{load:s.eImgLoaded}})])],1)}),0),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:s.handleClose}},[s._v("取 消")]),a("el-button",{attrs:{type:"success"},on:{click:s.submitUpload}},[s._v("使 用")])],1)],1)],1)},[],!1,null,"66d3afa8",null);e.default=s.exports},"388c":function(t,e,s){"use strict";var j=s("d407"),L=s("0345"),S=s("a323"),_=s("ca37"),w=s("61cd"),k=s("b57d"),y=Math.max,U=Math.min,C=Math.floor,$=/\$([$&`']|\d\d?|<[^>]*>)/g,M=/\$([$&`']|\d\d?)/g;s("82fb")("replace",2,function(i,r,R,I){return[function(t,e){var s=i(this),a=null==t?void 0:t[r];return void 0!==a?a.call(t,s,e):R.call(String(s),t,e)},function(t,e){var s=I(R,t,this,e);if(s.done)return s.value;for(var a,i=j(t),r=String(this),o="function"==typeof e,n=(o||(e=String(e)),i.global),l=(n&&(a=i.unicode,i.lastIndex=0),[]);null!==(g=k(i,r))&&(l.push(g),n);)""===String(g[0])&&(i.lastIndex=w(r,S(i.lastIndex),a));for(var c,d="",u=0,p=0;p<l.length;p++){for(var g=l[p],m=String(g[0]),f=y(U(_(g.index),r.length),0),h=[],v=1;v<g.length;v++)h.push(void 0===(c=g[v])?c:String(c));var b=g.groups,x=o?(x=[m].concat(h,f,r),void 0!==b&&x.push(b),String(e.apply(void 0,x))):function(r,o,n,l,c,t){var d=n+r.length,u=l.length,e=M;void 0!==c&&(c=L(c),e=$);return R.call(t,e,function(t,e){var s;switch(e.charAt(0)){case"$":return"$";case"&":return r;case"`":return o.slice(0,n);case"'":return o.slice(d);case"<":s=c[e.slice(1,-1)];break;default:var a,i=+e;if(0==i)return t;if(u<i)return 0!==(a=C(i/10))&&a<=u?void 0===l[a-1]?e.charAt(1):l[a-1]+e.charAt(1):t;s=l[i-1]}return void 0===s?"":s})}(m,r,f,h,b,e);u<=f&&(d+=r.slice(u,f)+x,u=f+m.length)}return d+r.slice(u)}]})},"4c1a":function(t,e,s){var a=s("0c42");(a="string"==typeof(a=a.__esModule?a.default:a)?[[t.i,a,""]]:a).locals&&(t.exports=a.locals);(0,s("5925").default)("74b81519",a,!0,{sourceMap:!1,shadowMode:!1})},c352:function(t,e,s){"use strict";s("4c1a")}}]);