(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-243af39c"],{"06f4":function(t,e,i){var n=i("fd96");t.exports=function(t,e){return new(n(t))(e)}},5598:function(t,e,i){"use strict";i("8779")},"6d92":function(t,e,i){"use strict";i.r(e);i("0bbd"),i("873e"),i("5c10");var s=i("0e2e"),r=(i("ac50"),i("b589"),i("250d")),n={props:{nameMod:{type:String,default:"rubyeyes"},label:{type:String,default:"标签"},listIds:{type:Array,default:[]},apiFind:{type:String,default:"/manage/contentTag/getList"},allowCreate:{type:Boolean,default:!0},apiAdd:{type:String,default:"/manage/contentTag/addOne"},initTag:{type:Function,default:function(t){return{name:t,comments:"即时创建",alias:t}}}},data:function(){return{userLoading:!1,listAllTags:[]}},watch:{listIds:function(e,i){var n=this,t=(e=e||[]).concat(i=i||[]).filter(function(t){return-1===i.indexOf(t)||-1===e.indexOf(t)}),a=0<t.length,s=a&&e.length>i.length,r=!0,t=(t=t.map(function(e){var t=n.listAllTags.find(function(t){return t._id==e});if(!t){if(!s)return!1;r=!1}return t})).filter(function(t){return t});a&&r&&(s&&this.$emit("add",{listObjDiff:t,listIds:e}),s||this.$emit("delete",{listObjDiff:t,listIds:e}),this.$emit("change",{listObjDiff:t,listIds:e,strAction:s?"add":"delete"}))}},computed:{},methods:{eChangeTags:function(t){var a=this;this.listIds.forEach(function(e,t,i){if(e){var n=a.listAllTags.find(function(t){return t._id==e});if(!!n)e&&""!=e&&a.listIds.push(n._id),a.listIds=Object(s.a)(new Set(a.listIds));else{if(!(a.apiAdd&&a.allowCreate&&a.initTag))return!1;a.addTag(a.initTag(e))}}else a.$message.error("标签undefined：",e)})},addTag:function(i){var n=this,a=this;if(!a.apiAdd||!a.allowCreate||!a.initTag)return!1;a.loadingTag=!0,Object(r.a)({url:a.apiAdd,data:i,method:"post"}).then(function(t){var e;200===t.status&&t.data._id?(t.data&&a.listAllTags.unshift(t.data),-1!=(e=a.listIds.indexOf(i.name))?a.listIds[e]=t.data._id:a.listIds=a.clearListIdTags(),n.$emit("change",{listObjDiff:[t.data],listIds:a.listIds,strAction:"add"}),a.$message({message:a.$t("main.addSuccess"),type:"success"})):a.$message.error("添加标签错误："+t.message,i)}).catch(function(t){debugger;a.$message.error("添加标签错误："+t,i)}).finally(function(){a.loadingTag=!1})},findTags:function(){var t=this,e=0<arguments.length&&void 0!==arguments[0]&&arguments[0],i=this;this.userLoading=!0,Object(r.a)({url:i.apiFind,params:{pageSize:0,isPaging:"0",searchkey:e||null},method:"get"}).then(function(t){if(200==t.status){var e=t.data.docs||t.data||[];0<e.length&&(i.listAllTags=Object(s.a)(new Set(i.listAllTags.concat(e))))}else{debugger;i.$message.error("检索标签错误：status="+t.status,t)}}).catch(function(t){debugger}).finally(function(){t.userLoading=!1})},clearListIdTags:function(){var a=this;return this.listIds.filter(function(e,t,i){var n=!!a.listAllTags.find(function(t){return t._id==e});return n})}},mounted:function(){this.findTags()}},i=(i("5598"),i("5d22")),n=Object(i.a)(n,function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("el-form-item",{attrs:{prop:"listIds"}},[i("el-select",{attrs:{span:"24",multiple:"",filterable:"","allow-create":"","default-first-option":"",remote:"","remote-method":e.findTags,loading:e.userLoading,placeholder:e.$t("validate.selectNull",{label:this.label})},on:{change:e.eChangeTags},model:{value:e.listIds,callback:function(t){e.listIds=t},expression:"listIds"}},e._l(e.listAllTags,function(t){return i("el-option",{key:t._id,attrs:{label:t.name,value:t._id}})}),1),i("div",{staticClass:"el-select-suffix el-input--small el-input__suffix"},[i("span",{staticClass:" el-input__suffix-inner"},[e._v(e._s(e.label))])])],1)},[],!1,null,null,null);e.default=n.exports},"6ec2":function(t,e,i){var n=i("8132");t.exports=Array.isArray||function(t){return"Array"==n(t)}},8779:function(t,e,i){var n=i("ef08");"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);(0,i("85cb").default)("84631616",n,!0,{sourceMap:!1,shadowMode:!1})},b589:function(t,e,i){"use strict";var n=i("c51c"),a=i("da31")(5),s="find",r=!0;s in[]&&Array(1)[s](function(){r=!1}),n(n.P+n.F*r,"Array",{find:function(t){return a(this,t,1<arguments.length?arguments[1]:void 0)}}),i("d263")(s)},da31:function(t,e,i){var y=i("e760"),T=i("e7d3"),A=i("0345"),w=i("a323"),n=i("06f4");t.exports=function(f,t){var c=1==f,g=2==f,p=3==f,h=4==f,m=6==f,v=5==f||m,b=t||n;return function(t,e,i){for(var n,a,s=A(t),r=T(s),l=y(e,i,3),d=w(r.length),u=0,o=c?b(t,d):g?b(t,0):void 0;u<d;u++)if((v||u in r)&&(a=l(n=r[u],u,s),f))if(c)o[u]=a;else if(a)switch(f){case 3:return!0;case 5:return n;case 6:return u;case 2:o.push(n)}else if(h)return!1;return m?-1:p||h?h:o}}},ef08:function(t,e,i){(t.exports=i("690e")(!1)).push([t.i,".el-select{width:100%}.el-select-suffix{width:0;overflow:visible}.el-select-suffix .el-input__suffix-inner{position:absolute;right:100%;white-space:nowrap}",""])},fd96:function(t,e,i){var n=i("467c"),a=i("6ec2"),s=i("6b42")("species");t.exports=function(t){var e;return a(t)&&("function"!=typeof(e=t.constructor)||e!==Array&&!a(e.prototype)||(e=void 0),n(e)&&null===(e=e[s])&&(e=void 0)),void 0===e?Array:e}}}]);