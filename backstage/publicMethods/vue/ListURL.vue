<template>
  <div>
    <el-form :model="listObjURL" ref="formUpdate" status-icon inline-message="true"  label-width="0px">
        <el-form-item
            v-for="(domain, index) in listObjURL"
            :key="domain._id"
            :prop="'['+index+'].url'"
            :rules="{
              required: true, type: 'url', message: '请输入有效链接', trigger: 'blur'
            }"
            :error="strErrorUpdate"
        >
          <el-input v-model="domain.url" disabled @input="eChangeURL({index,objLink:domain})">
              <template slot="prepend" >
                <span v-if="domain.type==='音乐' && domain.name" style="width:120px;">{{domain.name}}</span>
                <img v-else-if="domain.icon" :src="domain.icon" class="img-circle" style="width:32px">
                <span v-else  style="width:120px;text-align: center; font-size: 18px;"><i class="el-icon-link" /></span>                
              </template>
              <el-button slot="append" icon="el-icon-delete" @click.prevent="removeDomain(domain)"/>
          </el-input>
        </el-form-item>  
    </el-form>
    <el-form :model="objToAdd" ref="formAdd" status-icon label-width="0px">
        <el-form-item
            inline-message="true"
            :key="'add'"
            :prop="'url'"
            :rules="{
              required: false, type: 'url', message: '请输入有效链接', trigger: ['change','input']
            }"
            :error="strErrorAdd"
        >
          <el-input v-model="objToAdd.url" @change="eAddURL">
              <!-- <template slot="prepend" style=""><span style="width:32px;text-align:center;" >其他</span></template> -->
              <template slot="suffix" style="color:red;">{{label}}</template>
          </el-input>
        </el-form-item>     
    </el-form>
  </div>
</template>

<script>
  const objURLDefault={
      name: '',
      url:'',
      icon:'',
      error:''
  }
  export default {
    props: {
        label: {
            type:String,
            default:"链接",
        },
        value: {
            type:Array,
            default:()=>([]),
        },
    },
    data() {
      return {
        objToAdd:Object.assign({},objURLDefault),
        strErrorAdd:"",
        strErrorUpdate:"",
      };
    },
    computed: {
      // 主要列表
      listObjURL: function () {  return this.value; }
    },
    methods: {
      removeDomain(item) {
        var index = this.listObjURL.findIndex((v,idx)=>(v.url==item.url))
        if (index !== -1) {
          this.listObjURL.splice(index, 1)
        }
        if(this.listObjURL) this.$emit('input',this.listObjURL);
      },
      // getURLData(objLink,formName){
      //   let that=this;
      //   // 判断更新图标和objLink.icon
      //   if(objLink.url.indexOf("weibo.com") != -1 ) objLink.icon="/static/themes/images/link/logo_sina_32x32.png";
      //   if(objLink.url.indexOf("douban.com") !=-1 ) objLink.icon="/static/themes/images/link/logo_douban_32x32.png";
      //   if(objLink.url.indexOf("music.163.com")!=-1)objLink.icon="/static/themes/images/link/logo_163_32x32.png";
      //   // 更新name
      //   if(objLink.url.indexOf("weibo.com") != -1 ) objLink.name="微博";
      //   if(objLink.url.indexOf("douban.com") !=-1 ) objLink.name="豆瓣小站";
      //   if(objLink.url.indexOf("music.163.com")!=-1){
      //     objLink.name="网易云音乐";
      //     // 如果是歌曲链接
      //     if(objLink.url.indexOf("song?id=")!=-1){
      //       objLink.type="音乐";
      //       objLink.name="歌曲名";
      //       let idSong=objLink.url.split("song?id=")[1];
      //       // name根据网易api自动读取;
      //       // Fetch会返回Promise 所以我们可以使用then 拿到请求成功的结果
      //       fetch("https://api.imjad.cn/cloudmusic/?type=detail&id="+idSong).then(function(data){
      //           // text()方法属于fetchAPI的一部分，它返回一个Promise实例对象，
      //           // 用于获取后台返回的数据 return data.text();
      //           return data.text();
      //       }).then(function (data) {
      //           // 在这个then里面我们能拿到最终的数据
      //           let res=JSON.parse(data);
      //           if(res.code==200 && res.songs.length>0 && res.songs[0].name){
      //             objLink.name=res.songs[0].name;
      //             that.$message({
      //               message: "找到网易云音乐歌曲信息，自动填充："+objLink.name,
      //               type: "success"
      //             });
      //             // 触发事件;
      //             if(that.listObjURL) that.$emit('input',that.listObjURL); 
      //           }else{
      //             objLink.name="歌曲无效";
      //             that.$message.error(
      //               that.$t("validate.inputCorrect", { label: "网易云音乐获取歌曲名称" })
      //             );
      //             if(formName=="formUpdate")that.strErrorUpdate="未找到网易云音乐歌曲信息："+objLink.url;
      //             if(formName=="formAdd")that.strErrorAdd="未找到网易云音乐歌曲信息："+objLink.url;
      //           }
      //           // console.log(res.songs[0].name);
                
      //       })
      //     }else{
            
      //     }
      //   }


      //   return objLink;
      // },
      // eChangeURL(e){
      //   let {index,objLink}=e;
      //   // console.log("更新链接：",e);
      //   // 处理http
      //   // if((objLink.url.toLowerCase()).indexOf("http://")==0){
      //   //   objLink.urlHead="Http://";
      //   //   objLink.url=(objLink.url.toLowerCase()).split("http://")[1];
      //   // }
      //   // if((objLink.url.toLowerCase()).indexOf("https://")==0){
      //   //   objLink.urlHead="Https://";
      //   //   objLink.url=(objLink.url.toLowerCase()).split("https://")[1];
      //   // }        
      //   this.getURLData(objLink,"formUpdate");

      // },
      // eAddURL(url){
      //   // 设置一下，为了外部调用传入url时可用
      //   this.objToAdd.url=url;
      //   // 验证表单
      //   this.$refs["formAdd"].validate((valid) => {
      //     if (valid) {
      //       this.getURLData(this.objToAdd,"formAdd");
      //       this.listObjURL.push(this.objToAdd);
      //       this.objToAdd=Object.assign({},objURLDefault);
      //       // console.log("增加链接：",this.objToAdd);
      //       if(this.listObjURL) this.$emit('input',this.listObjURL);
            
      //     } else {
      //       // this.$refs["formAdd"].clearValidate("url");

      //       // console.log('新增链接表单验证失败');
      //       this.$message.error(
      //         this.$t("validate.inputCorrect", { label: this.label })
      //       );
      //       return false;
      //     }
      //   });
      // },
      // 获取图标和fetch信息
      getURLData(objLink,formName){
        let that=this;
        // 判断更新图标和objLink.icon
        if(objLink.url.indexOf("weibo.com") != -1 ) objLink.icon="/static/themes/images/link/logo_sina_32x32.png";
        if(objLink.url.indexOf("douban.com") !=-1 ) objLink.icon="/static/themes/images/link/logo_douban_32x32.png";
        if(objLink.url.indexOf("music.163.com")!=-1)objLink.icon="/static/themes/images/link/logo_163_32x32.png";
        // 更新name
        if(objLink.url.indexOf("music.163.com")!=-1){
          return new Promise((resolve,reject)=>{
            objLink.name="网易云音乐";
            // 如果是歌曲链接
            if(objLink.url.indexOf("song?id=")!=-1){
              objLink.type="音乐";
              objLink.name="歌曲名";
              let idSong=objLink.url.split("song?id=")[1];
              // name根据网易api自动读取;
              // Fetch会返回Promise 所以我们可以使用then 拿到请求成功的结果
              fetch("https://api.imjad.cn/cloudmusic/?type=detail&id="+idSong).then(function(data){
                  // text()方法属于fetchAPI的一部分，它返回一个Promise实例对象，
                  // 用于获取后台返回的数据 return data.text();
                  return data.text();
              }).then(function (data) {
                  // 在这个then里面我们能拿到最终的数据
                  let res=JSON.parse(data);
                  if(res.code==200 && res.songs.length>0 && res.songs[0].name){
                    objLink.name=res.songs[0].name;
                    that.$message({
                      message: "找到网易云音乐歌曲信息，自动填充："+objLink.name,
                      type: "success"
                    });
                    resolve(objLink);

                  }else{
                    objLink.name="歌曲无效";
                    that.$message.error(
                      that.$t("validate.inputCorrect", { label: "网易云音乐获取歌曲名称" })
                    );
                    if(formName=="formUpdate")that.strErrorUpdate="未找到网易云音乐歌曲信息："+objLink.url;
                    if(formName=="formAdd")that.strErrorAdd="未找到网易云音乐歌曲信息："+objLink.url;
                    resolve(objLink)
                  }
                  // console.log(res.songs[0].name);                  
              }).catch(e=>{
                debugger
                reject(e)
                console.error(e)
              })
            }else if(objLink.url.indexOf("music.163.com/#/artist?id=")){
              // 非歌曲链接，是乐队链接
              resolve(objLink);
            }else{
              reject({
                msg:"网易云音乐链接参数错误"+objLink.link,
                err:"链接错误",
                data:objLink,
              })
            }
            
          })
        }
        if(objLink.url.indexOf("weibo.com") != -1 ) objLink.name="微博";
        if(objLink.url.indexOf("douban.com") !=-1 ) objLink.name="豆瓣小站";
        return Promise.resolve(objLink);
      },
      eAddURL(url){
        let that=this;
        // 设置一下，为了外部调用传入url时可用
        this.objToAdd.url=url;
        // 验证表单
        this.$refs["formAdd"].validate((valid) => {
          if (valid) {
            that.getURLData(that.objToAdd,"formAdd").then(resObj=>{
              // 验证是否重复:
              let objFind=that.listObjURL.find(v=>(v.url==url));
              if(objFind)Object.assign(objFind,resObj);
              else that.listObjURL.push(resObj);
              // 去重
              that.listObjURL=[...new Set(that.listObjURL)]

              that.objToAdd=Object.assign({},objURLDefault);
              // console.log("增加链接：",that.objToAdd);
              // 触发事件;
              if(that.listObjURL)that.$emit('input',that.listObjURL);

            }).catch(e=>{
              debugger
              console.error(e);
              that.$message.error( that.$t("validate.inputCorrect", { label: "链接编辑"+url }) );
            });  
            
          } else {
            // console.log('新增链接表单验证失败');
            this.$message.error(  this.$t("validate.inputCorrect", { label: this.label }) );
            return false;
          }
        });
      },      
    },
    //mounted() {
    //  this.objToAdd=Object.assign({},objURLDefault);
    //  this.value = [];
    //}
  }
</script>