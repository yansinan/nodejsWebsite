<template>
  <div>
        <el-dialog
        :xs="20"
        title="图集"
        width="80%"
        :close-on-click-modal="false"
        :visible.sync="dialogState.isShow"
        :before-close="handleClose"
        :open="eDialogOpen">
        <div slot="title" class="el-dialog__title">
            <el-avatar :src="dialogState.formData.sImg" fit="cover"/>{{dialogState.formData.name}}的{{label}}
        </div>

        <el-form :model="listObjURL" ref="formUpdate" status-icon inline-message="true" label-width="0px" @validate="eValidate">
            <el-form-item
                v-for="(domain, index) in listObjURL"
                :key="domain._id"
                :prop="'['+index+'].url'"
                :rules="{
                required: true, type: 'url', message: '请输入有效链接', trigger: 'blur'
                }"
                :error="strErrorUpdate"
            >
              <el-input v-model="domain.url" @input="eChangeURL({index,objLink:domain})">
                  <template slot="prepend" >
                    <span v-if="domain.type==='音乐' && domain.name" style="width:120px;">{{domain.name}}</span>
                    <img v-else :src="domain.icon" class="img-circle" style="width:32px">
                  </template>
                  <el-button slot="append" icon="el-icon-delete" @click.prevent="removeDomain(domain)"/>
              </el-input>
            </el-form-item>  
        </el-form>
        <el-form :model="objToAdd" ref="formAdd" status-icon label-width="0px" @validate="eValidate">
            <el-form-item
                inline-message="true"
                :key="'add'"
                :prop="url"
                :rules="{
                required: true, type: 'url', message: '请输入有效链接', trigger: 'blur'
                }"
                :error="strErrorAdd"
            >
              <el-input v-model="objToAdd.url" @input="eAddURL">
                  <template slot="prepend" style=""><span style="width:32px;text-align:center;" >其他</span></template>
              </el-input>
            </el-form-item>     
        </el-form>
        
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="success" @click="submitUpload">更 新</el-button>
        </span>
    </el-dialog>

  </div>
</template>

<script>
  import { updateOne } from "@root/publicMethods/apiGeneral";
  const objURLDefault={
      name: '',
      url:'',
      icon:'',
      error:''
  }
  export default {
    props: {
        nameMod:{
          type:String,
          default:"rubyeyes"
        },
        label: {
            type:String,
            default:"链接",
        },
        dialogState:{
          type:Object,
          default:{
            isShow:false,
            isEdited:false,
            formData:{},
            strListObjURL:"listVideos",
          }
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
      listObjURL: function () {
          return this.dialogState.formData[this.dialogState.strListObjURL] || [];
      }
    },
    methods: {
        idNCM(){
            let idNCM="";
            // 是否有现成的163链接在listLinks;
            let objLink=this.dialogState.formData.listLinks.find(v=>(v.url.indexOf("music.163.com")!=-1));            
            if(objLink){
                idNCM=objLink.url.split("artist?id=")[1] || "";//https://music.163.com/#/artist?id=12371
            }
            // 没有现成链接，用乐队名手动搜索api
            if(idNCM!="")return Promise.resove({status:"success",msg:"",data:{idNCM:idNCM}});
            // 没有则需要手动搜索
            let nameArtist=this.dialogState.formData.name;
            return new Promise((resolve,reject)=>{
                let nameArtist=this.dialogState.formData.name;
                fetch("http://192.168.1.202/cloudsearch?keywords="+nameArtist).then(function(data){
                    // text()方法属于fetchAPI的一部分，它返回一个Promise实例对象，// 用于获取后台返回的数据 return data.text();
                    return data.text();
                }).then(function (data) {
                    // 在这个then里面我们能拿到最终的数据
                    let res=JSON.parse(data);
                    if(res.data && res.data.code==200){
                        debugger;
                        that.$message({
                            message: "找到网易云音乐歌手信息，准备同步...",
                            type: "success"
                        });
                        idNCM=res.data.result.artist[0];
                        debugger
                        resolve({
                            status:"success",
                            msg:"",
                            data:{
                                idNCM:idNCM,
                            }
                        });
                    }else{
                        reject(res);
                    }

                })
            })
        },
        // 弹窗打开时
        eDialogOpen(e){
            // let tmp=await ctx.service.webCrawler.findVideo("https://music.163.com/#/mv?id=10921982");
            // let tmp=await ctx.service.webCrawler.api("/search",{keywords:listRes.docs[0].name,type:10});
            debugger
            let idNCM="";
            this.idNCM().then(resIdNCM=>{
                let idNCM=resIdNCM.data.idNCM;
                return fetch("http://192.168.1.202//artist/mv?id="+idNCM);
            }).then(data=>{
                return data.text();
            }).then(resListMV=>{
                // 在这个then里面我们能拿到最终的数据
                resListMV=JSON.parse(resListMV);
                if(resListMV.data && resListMV.data.code==200){
                    debugger;
                    that.$message({
                        message: "找到网易云音乐歌手的MC信息，准备同步...",
                        type: "success"
                    });
                }
            }).catch(e=>console.error(e));            

        },
      // 更新到服务器
      submitUpload(){
        let that=this;
        updateOne(this.dialogState.formData,this.nameMod).then(result => {
          if (result.status === 200) {
            that.$message({
              message: that.$t("main.updateSuccess"),
              type: "success"
            });
          } else {
            that.$message.error(result.message);
          }
          setTimeout(() => {
            that.handleClose();
          }, 500);
          
        }).catch(error=>{
          debugger
          console.error(that.nameMod,"更新:fail,",error,params);
          that.$message.error(JSON.stringify(error));
        });
      },
      // 弹窗关闭
      handleClose(e){
          if(typeof this["onComplete"] === "function")this["onComplete"]();
          this.dialogState.isShow=false;
          // 清空数据
          this.dialogState.formData={};
          this.dialogState.isEdited=false;
      },
      // 删除链接
      removeDomain(item) {
        var index = this.listObjURL.findIndex((v,idx)=>(v.url==item.url))
        if (index !== -1) {
          this.listObjURL.splice(index, 1)
        }
        if(this.listObjURL)this.$emit('list-changed',this.listObjURL);

      },
      // 获取图标和fetch信息
      getURLData(objLink,formName){
        let that=this;
        // 判断更新图标和objLink.icon
        if(objLink.url.indexOf("weibo.com") != -1 ) objLink.icon="/static/themes/images/link/logo_sina_32x32.png";
        if(objLink.url.indexOf("douban.com") !=-1 ) objLink.icon="/static/themes/images/link/logo_douban_32x32.png";
        if(objLink.url.indexOf("music.163.com")!=-1)objLink.icon="/static/themes/images/link/logo_163_32x32.png";
        // 更新name
        if(objLink.url.indexOf("weibo.com") != -1 ) objLink.name="微博";
        if(objLink.url.indexOf("douban.com") !=-1 ) objLink.name="豆瓣小站";
        if(objLink.url.indexOf("music.163.com")!=-1){
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
                  // 触发事件;
                  if(that.listObjURL)that.$emit('list-changed',that.listObjURL);

                }else{
                  objLink.name="歌曲无效";
                  that.$message.error(
                    that.$t("validate.inputCorrect", { label: "网易云音乐获取歌曲名称" })
                  );
                  if(formName=="formUpdate")that.strErrorUpdate="未找到网易云音乐歌曲信息："+objLink.url;
                  if(formName=="formAdd")that.strErrorAdd="未找到网易云音乐歌曲信息："+objLink.url;
                }
                // console.log(res.songs[0].name);
                
            })
          }else{
            
          }
        }


        return objLink;
      },
      eChangeURL(e){
        let {index,objLink}=e;
        // console.log("更新链接：",e);
        // 处理http
        // if((objLink.url.toLowerCase()).indexOf("http://")==0){
        //   objLink.urlHead="Http://";
        //   objLink.url=(objLink.url.toLowerCase()).split("http://")[1];
        // }
        // if((objLink.url.toLowerCase()).indexOf("https://")==0){
        //   objLink.urlHead="Https://";
        //   objLink.url=(objLink.url.toLowerCase()).split("https://")[1];
        // }        
        this.getURLData(objLink,"formUpdate");

      },
      eAddURL(url){
        this.objToAdd.url=url;

        this.getURLData(this.objToAdd,"formAdd");
        // 验证表单
        this.$refs["formAdd"].validate((valid) => {
          if (valid) {
            this.listObjURL.push(this.objToAdd);
            this.objToAdd=Object.assign({},objURLDefault);
            // console.log("增加链接：",this.objToAdd);
            if(this.listObjURL)this.$emit('list-changed',this.listObjURL);
            
          } else {
            // console.log('新增链接表单验证失败');
            this.$message.error(
              this.$t("validate.inputCorrect", { label: this.label })
            );
            return false;
          }
        });

      },
      eValidate(prop,res){
        // console.debug("链接验证结果：this.listObjURL",prop,res);//表单项 prop 值，校验是否通过
        if(res){
          // 如果是新增验证通过
          // if(prop=="url"){
          //   this.listObjURL.push(this.objToAdd);
          //   this.objToAdd=Object.assign({},objURLDefault);
          // }
          this.$emit('list-changed',this.listObjURL);
        }else {
            // console.error('新增链接表单验证失败',this.listObjURL[prop],prop,res);
            this.$message.error(
              this.$t("validate.inputCorrect", { label: this.label })
            );
            this.$emit('list-changed',false);
            return false;
        }
      }
    }
  }
</script>