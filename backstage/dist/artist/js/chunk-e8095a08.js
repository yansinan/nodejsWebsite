(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-e8095a08"],{"006e":function(t,e,n){"use strict";var r=n("96d8"),a=n("0677"),s=n("0be6"),c=[].slice,l={};t.exports=Function.bind||function(e){var n=r(this),i=c.call(arguments,1),o=function(){var t=i.concat(c.call(arguments));return this instanceof o?function(t,e,n){if(!(e in l)){for(var i=[],o=0;o<e;o++)i[o]="a["+o+"]";l[e]=Function("F,a","return new F("+i.join(",")+")")}return l[e](t,n)}(n,t.length,t):s(n,t,e)};return a(n.prototype)&&(o.prototype=n.prototype),o}},"0b28":function(t,e,n){var i=n("9cff");t.exports=function(t,e){if(!i(t)||t._t!==e)throw TypeError("Incompatible receiver, "+e+" required!");return t}},"0bca":function(t,e,n){"use strict";var b=n("0b34"),v=n("e99b"),_=n("84e8"),y=n("6f45"),x=n("49f2"),k=n("2b37"),S=n("8b5a"),w=n("9cff"),O=n("0926"),L=n("1a9a"),j=n("bac3"),C=n("a83a");t.exports=function(n,t,e,i,o,r){function a(t){var n=m[t];_(m,t,"delete"==t?function(t){return!(r&&!w(t))&&n.call(this,0===t?0:t)}:"has"==t?function(t){return!(r&&!w(t))&&n.call(this,0===t?0:t)}:"get"==t?function(t){return r&&!w(t)?void 0:n.call(this,0===t?0:t)}:"add"==t?function(t){return n.call(this,0===t?0:t),this}:function(t,e){return n.call(this,0===t?0:t,e),this})}var s,c,l,u,d,f=b[n],p=f,g=o?"set":"add",m=p&&p.prototype,h={};return"function"==typeof p&&(r||m.forEach&&!O(function(){(new p).entries().next()}))?(c=(s=new p)[g](r?{}:-0,1)!=s,l=O(function(){s.has(1)}),u=L(function(t){new p(t)}),d=!r&&O(function(){for(var t=new p,e=5;e--;)t[g](e,e);return!t.has(-0)}),u||(((p=t(function(t,e){S(t,p,n);t=C(new f,t,p);return null!=e&&k(e,o,t[g],t),t})).prototype=m).constructor=p),(l||d)&&(a("delete"),a("has"),o&&a("get")),(d||c)&&a(g),r&&m.clear&&delete m.clear):(p=i.getConstructor(t,n,o,g),y(p.prototype,e),x.NEED=!0),j(p,n),h[n]=p,v(v.G+v.W+v.F*(p!=f),h),r||i.setStrong(p,n,o),p}},"0be6":function(t,e){t.exports=function(t,e,n){var i=void 0===n;switch(e.length){case 0:return i?t():t.call(n);case 1:return i?t(e[0]):t.call(n,e[0]);case 2:return i?t(e[0],e[1]):t.call(n,e[0],e[1]);case 3:return i?t(e[0],e[1],e[2]):t.call(n,e[0],e[1],e[2]);case 4:return i?t(e[0],e[1],e[2],e[3]):t.call(n,e[0],e[1],e[2],e[3])}return t.apply(n,e)}},"0c84":function(t,e,n){"use strict";var i=n("1663")(!0);n("120f")(String,"String",function(t){this._t=String(t),this._i=0},function(){var t=this._t,e=this._i;return e>=t.length?{value:void 0,done:!0}:(e=i(t,e),this._i+=e.length,{value:e,done:!1})})},"0ce8":function(t,e,n){var i=n("7c2b"),r=n("a8f3"),a=n("96d8"),s=n("970b"),c=n("0677"),o=n("99fe"),l=n("006e"),u=(n("a4cf").Reflect||{}).construct,d=o(function(){function t(){}return!(u(function(){},[],t)instanceof t)}),f=!o(function(){u(function(){})});i(i.S+i.F*(d||f),"Reflect",{construct:function(t,e,n){a(t),s(e);var i=arguments.length<3?t:a(n);if(f&&!d)return u(t,e,i);if(t==i){switch(e.length){case 0:return new t;case 1:return new t(e[0]);case 2:return new t(e[0],e[1]);case 3:return new t(e[0],e[1],e[2]);case 4:return new t(e[0],e[1],e[2],e[3])}var o=[null];return o.push.apply(o,e),new(l.apply(t,o))}o=i.prototype,i=r(c(o)?o:Object.prototype),o=Function.apply.call(t,i,e);return c(o)?o:i}})},"310d":function(t,e,n){t.exports=n("a755")},"38ab":function(t,e,n){n("0ce8"),t.exports=n("ce99").Reflect.construct},4090:function(t,e,o){function r(t,e){if(i(t),!n(e)&&null!==e)throw TypeError(e+": can't set as prototype!")}var n=o("0677"),i=o("970b");t.exports={set:Object.setPrototypeOf||("__proto__"in{}?function(t,n,i){try{(i=o("728a")(Function.call,o("37b4").f(Object.prototype,"__proto__").set,2))(t,[]),n=!(t instanceof Array)}catch(t){n=!0}return function(t,e){return r(t,e),n?t.__proto__=e:i(t,e),t}}({},!1):void 0),check:r}},"49f2":function(t,e,n){function i(t){s(t,o,{value:{i:"O"+ ++c,w:{}}})}var o=n("d8b3")("meta"),r=n("9cff"),a=n("4fd4"),s=n("bb8b").f,c=0,l=Object.isExtensible||function(){return!0},u=!n("0926")(function(){return l(Object.preventExtensions({}))}),d=t.exports={KEY:o,NEED:!1,fastKey:function(t,e){if(!r(t))return"symbol"==typeof t?t:("string"==typeof t?"S":"P")+t;if(!a(t,o)){if(!l(t))return"F";if(!e)return"E";i(t)}return t[o].i},getWeak:function(t,e){if(!a(t,o)){if(!l(t))return!0;if(!e)return!1;i(t)}return t[o].w},onFreeze:function(t){return u&&d.NEED&&l(t)&&!a(t,o)&&i(t),t}}},5289:function(t,e,n){"use strict";n("6b6f")("link",function(e){return function(t){return e(this,"a","href",t)}})},"591e":function(t,e,n){var i=n("7899");"string"==typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);(0,n("85cb").default)("69a3a00f",i,!0,{sourceMap:!1,shadowMode:!1})},"6b6f":function(t,e,n){function i(t,e,n,i){var o=String(a(t)),t="<"+e;return""!==n&&(t+=" "+n+'="'+String(i).replace(s,"&quot;")+'"'),t+">"+o+"</"+e+">"}var o=n("e99b"),r=n("0926"),a=n("3ab0"),s=/"/g;t.exports=function(e,t){var n={};n[e]=t(i),o(o.P+o.F*r(function(){var t=""[e]('"');return t!==t.toLowerCase()||3<t.split('"').length}),"String",n)}},7127:function(t,e,n){"use strict";n.r(e);n("1bc7"),n("0c84"),n("c5cb");var i=n("79d1"),o=n.n(i),i=n("310d"),r=n.n(i);function a(t,e){return(a=r.a||function(t,e){return t.__proto__=e,t})(t,e)}function s(t,e,n){return(s=function(){if("undefined"!=typeof Reflect&&o.a&&!o.a.sham){if("function"==typeof Proxy)return 1;try{return Date.prototype.toString.call(o()(Date,[],function(){})),1}catch(t){return}}}()?o.a:function(t,e,n){var i=[null];i.push.apply(i,e);i=new(Function.bind.apply(t,i));return n&&a(i,n.prototype),i}).apply(null,arguments)}n("fc02"),n("a7e5");var c=n("34f5"),l=n("0e2e"),u=(n("e5b4"),n("5289"),n("a450"),n("79b1")),d=n("1adb"),f={name:"",type:"link:music.163.com",date:"",idURL:"",status:"",urlImg:"",urlVideo:"",link:""},i={props:{nameMod:{type:String,default:"rubyeyes"},label:{type:String,default:"链接"},dialogState:{type:Object,default:{isShow:!1,isEdited:!1,formData:{},strListObjURL:"listVideos"}}},data:function(){return{objToAdd:Object.assign({},f),strErrorAdd:"",strErrorUpdate:"",listNCM:[],strNoticeListNCM:""}},watch:{listNCM:function(t){0==t.length?this.strNoticeListNCM="网易云音乐MV已全部同步完成":this.strNoticeListNCM=""}},computed:{listObjURL:function(){return this.dialogState.formData[this.dialogState.strListObjURL]||[]},listDataToUpdate:function(){return this.listObjURL.map(function(t){return{name:t.name,type:t.type,date:t.date,idURL:t.idURL,status:t.status,urlImg:t.urlImg,urlVideo:t.urlVideo,link:t.link}})}},methods:{eBnSyncNCM:function(){var o=this;fetch("/api/artist/fetchNCMMV?id="+this.dialogState.formData._id).then(function(t){return t.text()}).then(function(t){var e,n,i=JSON.parse(t);200==i.status&&0<i.data.length?(n="",n="剔除重复"+(e=i.data.filter(function(e){var t=o.listObjURL.find(function(t){return e.idURL==t.idURL})||o.listNCM.find(function(t){return e.idURL==t.idURL});return t&&(n+=e.name+","),!t})).length+"条V,新增:"+n,(t=o.listNCM).unshift.apply(t,Object(l.a)(e)),o.$message({message:"找到网易"+i.data.length+"条。"+n,type:"success"})):o.$message.error(o.$t("validate.inputCorrect",{label:"网易云音乐获取MV"}))}).catch(function(t){debugger;o.$message.error(o.$t("validate.inputCorrect",{label:"网易云音乐获取MV"}))})},eDialogOpen:function(t){this.eBnSyncNCM(t)},handleClose:function(){"function"==typeof this.onComplete&&this.onComplete(),this.dialogState.isShow=!1,this.dialogState.formData={},this.dialogState.isEdited=!1,this.listNCM=[]},uploadBlob:function(i){var o=this;return new Promise(function(e,n){var t=new FormData;t.append("nameMod",o.nameMod),t.append("subPath","videos"),t.append("upload_file",i,"imgVideo.jpg");t=new Request("/manage/dr/uploadFiles",{method:"post",body:t});fetch(t).then(function(t){return t.text()}).then(function(t){t=JSON.parse(t);200==t.status?e(t.data.path):n({err:t,msg:"上传错误"})}).catch(function(t){n({err:t,msg:"上传错误"});debugger})})},getPushDataToUpdate:function(t){t={name:t.name,type:t.type,date:t.date,idURL:t.idURL,status:t.status,urlImg:t.urlImg,urlVideo:t.urlVideo,link:t.link};return{_id:this.dialogState.formData._id,funUpdate:"updateList",$push:Object(c.a)({},this.dialogState.strListObjURL,t)}},addDomain:function(i){var e=this,o=this;i.isLoading=!0,o.uploadBlob(i.blob).then(function(t){i.urlImg=t;t=o.getPushDataToUpdate(i);return Object(u.f)(t,e.nameMod)}).then(function(t){var e,n;200===t.status?(o.$message({message:o.$t("main.updateSuccess"),type:"success"}),i.isLoading=!1,n=o.listNCM.findIndex(function(t){return t.link==i.link}),(e=o.listObjURL).push.apply(e,Object(l.a)(o.listNCM.splice(n,1)))):o.$message.error(t.message)}).catch(function(t){debugger;o.$message.error(JSON.stringify(t))})},removeDomain:function(n){var t,i=this,e=this.listObjURL.findIndex(function(t,e){return t.link==n.link});-1!==e&&(n.isLoading=!0,(t=this.listNCM).push.apply(t,Object(l.a)(this.listObjURL.splice(e,1))),e=Object(c.a)({_id:this.dialogState.formData._id,funUpdate:"updateList"},this.dialogState.strListObjURL,this.listDataToUpdate),Object(u.f)(e,i.nameMod).then(function(t){var e;200===t.status?((e=i.listNCM.find(function(t,e){return t.link==n.link}))&&(e.isLoading=!1),i.listNCM=i.listNCM.map(function(t){return t}),i.$message({message:i.$t("main.updateSuccess"),type:"success"})):i.$message.error(t.message)}).catch(function(t){debugger;i.$message.error(JSON.stringify(t))}))},getURLData:function(i){return-1!=i.link.indexOf("weibo.com")&&(i.icon="/static/themes/images/link/logo_sina_32x32.png"),-1!=i.link.indexOf("douban.com")&&(i.icon="/static/themes/images/link/logo_douban_32x32.png"),-1!=i.link.indexOf("music.163.com")&&(i.icon="/static/themes/images/link/logo_163_32x32.png"),new Promise(function(e,n){var t=i.link.split("music.163.com/#/mv?id=")[1];-1!=i.link.indexOf("music.163.com")&&t?fetch("/api/video/item?idNCMMV="+t).then(function(t){return t.json()}).then(function(t){200==t.status&&t.data?e(t.data):n(t)}).catch(function(t){debugger;n(t)}):n({msg:"非网易云音乐MV链接"+i.link,err:"链接错误",data:i})})},eAddURL:function(){var e=this,n=this,i=this.objToAdd.link;i&&this.$refs.formAdd.validate(function(t){return t?void e.getURLData(e.objToAdd,"formAdd").then(function(t){t&&t.name?(n.$message({message:"找到网易云音乐MV信息，自动填充",type:"success"}),n.listObjURL.push(t),n.listObjURL=[s(Set,Object(l.a)(n.listObjURL))],n.objToAdd=Object.assign({},f)):n.$message.error(n.$t("validate.error_params",{label:"网易云返回数据异常"}))}).catch(function(t){debugger;n.$message.error(n.$t("validate.inputCorrect",{label:"网易云音乐MV详情"+i}))}):(e.$message.error(e.$t("validate.inputCorrect",{label:"链接"})),!1)})},eImgLoaded:function(t){var t=t.target,e=(t.src.substring(0,7),new Date,t.src),n=this.listNCM.find(function(t){return t.urlImg==e});1920!=t.naturalWidth||1080!=t.naturalHeight?n&&(t.type="image/jpeg",Object(d.imgFit)(t,1920,1080).then(function(t){n.urlImg=t.src,n.blob=t.blob,n.isFitted=!0})):(n=n||this.listObjURL.find(function(t){return t.urlImg==e}))&&(n.isFitted=!0)}}},n=(n("936c"),n("c701")),i=Object(n.a)(i,function(){var n=this,t=n.$createElement,i=n._self._c||t;return i("div",[i("el-dialog",{attrs:{xs:20,title:"图集",width:"80%","close-on-click-modal":!1,visible:n.dialogState.isShow,"before-close":n.handleClose},on:{"update:visible":function(t){return n.$set(n.dialogState,"isShow",t)},open:n.eDialogOpen}},[i("div",{staticClass:"el-dialog__title",attrs:{slot:"title"},slot:"title"},[i("el-avatar",{attrs:{src:n.dialogState.formData.sImg,fit:"cover"}}),n._v(n._s(n.dialogState.formData.name)+"的"+n._s(n.label)+"\n  ")],1),i("el-divider",{attrs:{"content-position":"left"}},[n._v("已保存的视频")]),i("el-row",{attrs:{gutter:40}},n._l(n.listObjURL,function(e,t){return i("el-col",{key:e.idURL,staticStyle:{"margin-bottom":"40px"},attrs:{md:8}},[i("el-card",{directives:[{name:"loading",rawName:"v-loading",value:e.isLoading,expression:"domain.isLoading"}],attrs:{"body-style":{padding:"0px"},shadow:"hover"}},[i("el-input",{attrs:{disabled:""},model:{value:e.link,callback:function(t){n.$set(e,"link",t)},expression:"domain.link"}},[e.icon?i("img",{staticClass:"img-circle",staticStyle:{width:"32px"},attrs:{slot:"prepend",src:e.icon},slot:"prepend"}):i("span",{staticStyle:{"text-align":"center","font-size":"18px"},attrs:{slot:"prepend"},slot:"prepend"},[i("i",{staticClass:"el-icon-link"}),n._v("视频 "+n._s(t+1))])]),i("el-image",{directives:[{name:"loading",rawName:"v-loading",value:!e.isFitted,expression:"!domain.isFitted"}],attrs:{md:24,src:e.urlImg,fit:"contain",crossOrigin:"Anonymous"},on:{load:n.eImgLoaded}}),i("div",{staticClass:"titleVideo"},[e.name?i("span",[n._v(n._s(e.name))]):n._e(),i("el-tooltip",{attrs:{content:"从"+n.dialogState.formData.name+"的"+n.label+"移除",placement:"top",effect:"light"}},[i("el-button",{attrs:{type:"danger",plain:"",icon:"el-icon-delete"},on:{click:function(t){return t.preventDefault(),n.removeDomain(e)}}})],1)],1)],1)],1)}),1),i("el-divider",{attrs:{"content-position":"left"}},[n._v("网易云音乐数据")]),i("el-row",{attrs:{gutter:40}},[n._l(n.listNCM,function(e,t){return i("el-col",{key:e.idURL,staticStyle:{"margin-bottom":"40px"},attrs:{md:8}},[i("el-card",{directives:[{name:"loading",rawName:"v-loading",value:e.isLoading,expression:"domain.isLoading"}],attrs:{"body-style":{padding:"0px"},shadow:"hover"}},[i("el-input",{attrs:{disabled:""},model:{value:e.link,callback:function(t){n.$set(e,"link",t)},expression:"domain.link"}},[e.icon?i("img",{staticClass:"img-circle",staticStyle:{width:"32px"},attrs:{slot:"prepend",src:e.icon},slot:"prepend"}):i("span",{staticStyle:{"text-align":"center","font-size":"18px"},attrs:{slot:"prepend"},slot:"prepend"},[i("i",{staticClass:"el-icon-link"}),n._v("视频 "+n._s(t+1))])]),i("el-image",{directives:[{name:"loading",rawName:"v-loading",value:!e.isFitted,expression:"!domain.isFitted"}],attrs:{md:24,src:e.urlImg,fit:"contain",crossOrigin:"Anonymous"},on:{load:n.eImgLoaded}}),i("div",{staticClass:"titleVideo"},[e.name?i("span",[n._v(n._s(e.name))]):n._e(),i("el-tooltip",{attrs:{content:"添加到"+n.dialogState.formData.name+"的"+n.label,placement:"top",effect:"light"}},[i("el-button",{attrs:{type:"prime",plain:"",icon:"el-icon-plus",disabled:!e.isFitted},on:{click:function(t){return t.preventDefault(),n.addDomain(e)}}})],1)],1)],1)],1)}),i("el-col",{staticStyle:{height:"100%"},attrs:{md:8}},[i("el-card",{attrs:{"body-style":{padding:"0px"},shadow:"hover"}},[i("div",[i("el-form",{ref:"formAdd",attrs:{model:n.objToAdd,"status-icon":"","label-width":"0px"}},[i("el-form-item",{key:"add",attrs:{span:11,"inline-message":"true",prop:"link",rules:[{type:"url",message:"请输入有效链接",trigger:"change"}],error:n.strErrorAdd}},[i("el-input",{on:{change:n.eAddURL},model:{value:n.objToAdd.link,callback:function(t){n.$set(n.objToAdd,"link",t)},expression:"objToAdd.link"}},[i("template",{slot:"prepend"},[i("span",{staticStyle:{"text-align":"center","font-size":"18px"}},[n._v("视频链接")])]),i("el-button",{attrs:{slot:"append",icon:"el-icon-connection"},on:{click:n.eAddURL},slot:"append"})],2)],1)],1)],1),i("div",{staticStyle:{"font-size":"18px",padding:"18px 20px"}},[n._v(n._s(n.strNoticeListNCM||"可使用网易云音乐MV链接"))])])],1)],2),i("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[n.dialogState.formData.idNCM?i("el-button",{attrs:{type:"warning"},on:{click:n.eBnSyncNCM}},[n._v("读取网易云音乐")]):n._e(),i("el-button",{on:{click:n.handleClose}},[n._v("关 闭")])],1)],1)],1)},[],!1,null,"9740d942",null);e.default=i.exports},7899:function(t,e,n){(t.exports=n("690e")(!1)).push([t.i,".el-form-item[data-v-9740d942]{margin-bottom:0!important}.titleVideo[data-v-9740d942]{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;font-size:18px;padding:18px 20px}",""])},"79d1":function(t,e,n){t.exports=n("38ab")},"936c":function(t,e,n){"use strict";n("591e")},"98de":function(t,e,n){"use strict";function a(t,e){var n,i=g(e);if("F"!==i)return t._i[i];for(n=t._f;n;n=n.n)if(n.k==e)return n}var s=n("bb8b").f,c=n("7ee3"),l=n("6f45"),u=n("1e4d"),d=n("8b5a"),f=n("2b37"),i=n("120f"),o=n("6fef"),r=n("f966"),p=n("26df"),g=n("49f2").fastKey,m=n("0b28"),h=p?"_s":"size";t.exports={getConstructor:function(t,o,n,i){var r=t(function(t,e){d(t,r,o,"_i"),t._t=o,t._i=c(null),t._f=void 0,t._l=void 0,t[h]=0,null!=e&&f(e,n,t[i],t)});return l(r.prototype,{clear:function(){for(var t=m(this,o),e=t._i,n=t._f;n;n=n.n)n.r=!0,n.p&&(n.p=n.p.n=void 0),delete e[n.i];t._f=t._l=void 0,t[h]=0},delete:function(t){var e,n=m(this,o),i=a(n,t);return i&&(e=i.n,t=i.p,delete n._i[i.i],i.r=!0,t&&(t.n=e),e&&(e.p=t),n._f==i&&(n._f=e),n._l==i&&(n._l=t),n[h]--),!!i},forEach:function(t,e){m(this,o);for(var n,i=u(t,1<arguments.length?e:void 0,3);n=n?n.n:this._f;)for(i(n.v,n.k,this);n&&n.r;)n=n.p},has:function(t){return!!a(m(this,o),t)}}),p&&s(r.prototype,"size",{get:function(){return m(this,o)[h]}}),r},def:function(t,e,n){var i,o=a(t,e);return o?o.v=n:(t._l=o={i:i=g(e,!0),k:e,v:n,p:n=t._l,n:void 0,r:!1},t._f||(t._f=o),n&&(n.n=o),t[h]++,"F"!==i&&(t._i[i]=o)),t},getEntry:a,setStrong:function(t,n,e){i(t,n,function(t,e){this._t=m(t,n),this._k=e,this._l=void 0},function(){for(var t=this,e=t._k,n=t._l;n&&n.r;)n=n.p;return t._t&&(t._l=n=n?n.n:t._t._f)?o(0,"keys"==e?n.k:"values"==e?n.v:[n.k,n.v]):(t._t=void 0,o(1))},e?"entries":"values",!e,!0),r(n)}}},a755:function(t,e,n){n("be56"),t.exports=n("ce99").Object.setPrototypeOf},a83a:function(t,e,n){var o=n("9cff"),r=n("e0ff").set;t.exports=function(t,e,n){var i,e=e.constructor;return e!==n&&"function"==typeof e&&(i=e.prototype)!==n.prototype&&o(i)&&r&&r(t,i),t}},be56:function(t,e,n){var i=n("7c2b");i(i.S,"Object",{setPrototypeOf:n("4090").set})},c5cb:function(t,e,n){"use strict";var i=n("98de"),o=n("0b28");t.exports=n("0bca")("Set",function(e){return function(t){return e(this,0<arguments.length?t:void 0)}},{add:function(t){return i.def(o(this,"Set"),t=0===t?0:t,t)}},i)},e0ff:function(t,e,o){function r(t,e){if(i(t),!n(e)&&null!==e)throw TypeError(e+": can't set as prototype!")}var n=o("9cff"),i=o("a86f");t.exports={set:Object.setPrototypeOf||("__proto__"in{}?function(t,n,i){try{(i=o("1e4d")(Function.call,o("285b").f(Object.prototype,"__proto__").set,2))(t,[]),n=!(t instanceof Array)}catch(t){n=!0}return function(t,e){return r(t,e),n?t.__proto__=e:i(t,e),t}}({},!1):void 0),check:r}}}]);