<template>
  <div>
    <el-dialog
    :xs="20"
    title="图集"
    width="80%"
    :close-on-click-modal="false"
    :visible.sync="dialogState.isShow"
    :before-close="handleClose"
    @open="eDialogOpen">
    <div slot="title" class="el-dialog__title">
        <el-avatar :src="dialogState.formData.sImg" fit="cover"/>{{dialogState.formData.name}}的{{label}}
    </div>
      <el-divider content-position="left">已保存的视频</el-divider>
      <div class="listGrid local">
          <div v-for="(domain, index) in listObjURL" :key="domain.idURL">
            <el-card :body-style="{ padding: '0px' }" shadow="hover" v-loading="domain.isLoading">
              <!-- <el-form-item style=""
                :prop="'['+index+'].link'"
                :rules="{
                  required: true, type: 'url', message: '请输入有效链接', trigger: 'blur'
                }"
                :error="strErrorUpdate"> -->
                <el-input v-model="domain.link" disabled>
                  <img slot="prepend" v-if="domain.icon" :src="domain.icon" class="img-circle" style="width:32px">
                  <span slot="prepend" v-else style="text-align:center;font-size: 18px;" ><i class="el-icon-link"/>视频 {{index+1}}</span>
                  <!-- <el-button slot="append" icon="el-icon-delete" @click.prevent="removeDomain(domain)"/> -->
                </el-input>
              <el-image :md="24" :src="domain.urlImg" fit="contain" crossOrigin="Anonymous"/>
              <div class="titleVideo" style="">
                <span v-if="domain.name">{{domain.name}}</span>
                <el-tooltip :content="'从'+dialogState.formData.name+'的'+label+'移除'" placement="top" effect="light">
                  <el-button type="danger" plain icon="el-icon-delete" @click.prevent="removeDomain(domain)"/>
                </el-tooltip>
              </div>
              <!-- </el-form-item> -->
            </el-card>
          </div>
      </div>
      <!-- 网易云抓取 -->
      <el-divider content-position="left">网易云音乐数据</el-divider>
      <div class="listGrid">
          <div v-for="(domain, index) in listNCM" :key="domain.idURL">
            <el-card :body-style="{ padding: '0px' }" shadow="hover" v-loading="domain.isLoading">
                <el-input v-model="domain.link" disabled>
                  <img slot="prepend" v-if="domain.icon" :src="domain.icon" class="img-circle" style="width:32px">
                  <span slot="prepend" v-else style="text-align:center;font-size: 18px;" ><i class="el-icon-link"/>视频 {{index+1}}</span>
                  <!-- <el-button slot="append" icon="el-icon-delete" @click.prevent="removeDomain(domain)"/> -->
                </el-input>
              <el-image :md="24" :src="domain.urlImg" fit="contain" @load="eImgLoaded" v-loading="!domain.isFitted" crossOrigin="Anonymous"/>
              <div class="titleVideo" style="">
                <span v-if="domain.name">{{domain.name}}</span>
                <el-tooltip :content="'添加到'+dialogState.formData.name+'的'+label" placement="top" effect="light">
                  <el-button type="prime" plain icon="el-icon-plus" :disabled="!domain.isFitted" @click.prevent="addDomain(domain)"/>
                </el-tooltip>
              </div>
            </el-card>
          </div>
        <!-- 新增 -->
        <div style="height:100%">
          <el-card :body-style="{ padding: '0px' }" shadow="hover">
            <div>
              <!-- <span style="font-size: 18px;">添加视频链接</span> -->
              <!-- <div :span="24" style="border-top: 2px dashed #eee;height:auto;"><i class="el-icon-plus"/></div> -->
              <el-form :model="objToAdd" ref="formAdd" status-icon label-width="0px">
                <el-form-item :span="11"
                      inline-message="true"
                      :key="'add'"
                      :prop="'link'"
                      :rules="[{
                        type: 'url', message: '请输入有效链接',trigger:'change'
                      }]"
                      :error="strErrorAdd">
                  <el-input v-model="objToAdd.link" @change="eAddURL">
                    <template slot="prepend" style=""><span style="text-align:center;font-size: 18px;" >视频链接</span></template>
                    <el-button slot="append" icon="el-icon-connection" @click="eAddURL"/>
                  </el-input>
                </el-form-item>
              </el-form>
            </div>
            <div style="font-size: 18px;padding: 18px 20px;">{{strNoticeListNCM?strNoticeListNCM:'可使用网易云音乐MV链接'}}</div>
          </el-card>
        </div>
        <!--  -->
      </div>
      
      <span slot="footer" class="dialog-footer">
          <el-button v-if="dialogState.formData.idNCM" type="warning" @click="eBnSyncNCM">读取网易云音乐</el-button>
          <!-- <el-button type="success" @click="submitUpload">保 存</el-button> -->
          <el-button @click="handleClose">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style scoped>
.el-form-item{
  margin-bottom:0px !important;
}
.titleVideo{
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  padding: 18px 20px;
}
.listGrid{
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  grid-gap: 1rem;
  margin: 0rem 1rem;
}
@media only screen and (min-width: 768px){
  .listGrid{
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
}  
.listGrid.local{
  margin-bottom:4rem;
}

</style>
<script>
  import { updateOne } from "@root/publicMethods/apiGeneral";
  import { imgFit } from "@root/publicMethods/imgFit";
  const objURLDefault={
    name:"",
    type:"link:music.163.com",
    date:"",
    idURL:"",
    status:"",
    urlImg:"",
    urlVideo:"",
    link:"",
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
        listNCM:[],
        strNoticeListNCM:"",//全部同步的提示
      };
    },
    watch:{
      listNCM(newV,oldV){
        if(newV.length==0)this.strNoticeListNCM="网易云音乐MV已全部同步完成"
        else this.strNoticeListNCM=""
      }
    },
    computed: {
      // 主要列表
      listObjURL: function () {
        //   let list=this.dialogState.formData[this.dialogState.strListObjURL]?this.dialogState.formData[this.dialogState.strListObjURL].filter(v=>(v)):[];
          return this.dialogState.formData[this.dialogState.strListObjURL] || [];
      },
      listDataToUpdate:function(){
        return this.listObjURL.map(v=>{
          return{
            name:v.name,
            type:v.type,
            date:v.date,
            idURL:v.idURL,
            status:v.status,
            urlImg:v.urlImg,
            urlVideo:v.urlVideo,
            link:v.link,
          }
        })
      }
    },
    methods: {
      // 手动同步网易云的乐队MV
      eBnSyncNCM(e){
        let that=this;
        fetch("/api/artist/fetchNCMMV?id="+this.dialogState.formData._id)
        .then((data)=>data.text())
        .then((data)=> {
            // 在这个then里面我们能拿到最终的数据
            let res=JSON.parse(data);
            if(res.status==200 && res.data.length>0){
              
              // let list=res.data.concat(that.listObjURL);              
              // that.listObjURL.splice(0,that.listObjURL.length,...list);
              let msg="";
              //去重 & 合并
              let listNew=res.data.filter(vNew=>{
                let isOld= (that.listObjURL.find(vOld=>(vNew.idURL==vOld.idURL))) || (that.listNCM.find(vOld=>(vNew.idURL==vOld.idURL)));
                if(isOld)msg+=vNew.name+","
                return !isOld;
              })
              msg="剔除重复"+listNew.length+"条V,新增:"+msg;
              that.listNCM.unshift(...listNew);
              //去重 & 合并
              // that.listNCM=[...new Set(that.listNCM)];
              // if(listNew.length<res.data.length)that.$message({
              //   message: msg,
              //   type: "success"
              // });
              that.$message({
                message: "找到网易"+res.data.length+"条。"+msg,
                type: "success"
              });
              // 去空数据
              // that.listObjURL=that.listObjURL.filter(v=>(v));

            }else{
              that.$message.error(
                that.$t("validate.inputCorrect", { label: "网易云音乐获取MV" })
              );
            }
        }).catch(e=>{
          debugger
          that.$message.error(
            that.$t("validate.inputCorrect", { label: "网易云音乐获取MV" })
          );
          console.error(e)
        })

      },
      // 弹窗打开时
      eDialogOpen(e){
        this.eBnSyncNCM(e);
      },
      // // 手动更新到服务器
      // submitUpload(){
      //   let that=this;
      //   let payload={
      //     _id:this.dialogState.formData._id,
      //     funUpdate:"updateList",
      //     [this.dialogState.strListObjURL]:this.listDataToUpdate,
      //   }
      //   updateOne(payload,this.nameMod).then(result => {
      //     if (result.status === 200) {
      //       that.$message({
      //         message: that.$t("main.updateSuccess"),
      //         type: "success"
      //       });
      //     } else {
      //       that.$message.error(result.message);
      //     }
      //     setTimeout(() => {
      //       that.handleClose();
      //     }, 500);
          
      //   }).catch(error=>{
      //     debugger
      //     console.error(that.nameMod,"更新:fail,",error,params);
      //     that.$message.error(JSON.stringify(error));
      //   });
      // },
      // 弹窗关闭
      handleClose(e){
          this.$emit('complete',this.listObjURL);
          this.dialogState.isShow=false;
          // 清空数据
          this.dialogState.formData={};
          this.dialogState.isEdited=false;
          this.listNCM=[];
      },
      // 上传blob到后台
      uploadBlob(blob){
        let _this=this;
        return new Promise((resolve,reject)=>{
          const params = new FormData()
          // 路径相关:
          params.append("nameMod",_this.nameMod);
          params.append("subPath","videos");
          params.append('upload_file', blob, "imgVideo.jpg")
          let uploadFileRequest = new Request("/manage/dr/uploadFiles", {
              method: 'post',
              //指定header会eggjs接收不到multipart
              // headers: {'Content-Type': 'multipart/form-data'},
              body:params,
          })
          fetch(uploadFileRequest).then(response => {
              return response.text();
          }).then(res => {
              // 在这个then里面我们能拿到最终的数据
              let objData=JSON.parse(res);
              if(objData.status==200){
                console.log("resUpload::",objData);
                resolve(objData.data.path)
              }else reject({err:objData,msg:"上传错误"})
          }).catch(e=>{
            reject({err:e,msg:"上传错误"})
            debugger
          })          
        })
      },      
      // 生成要新增的数组数据
      getPushDataToUpdate(item){
        let data={
            name:item.name,
            type:item.type,
            date:item.date,
            idURL:item.idURL,
            status:item.status,
            urlImg:item.urlImg,
            urlVideo:item.urlVideo,
            link:item.link,
          }
        return {
          _id:this.dialogState.formData._id,
          funUpdate:"updateList",
          $push:{
            [this.dialogState.strListObjURL]:data
          },
          // [this.dialogState.strListObjURL]:data,
        }
      },
      // 获取mv详情
      getDetailMV(item){
        return new Promise((resolve,reject)=>{
          fetch("/api/video/item?idNCMMV="+item.idURL)
          .then((data)=>data.text())
          .then((data)=> {
              // 在这个then里面我们能拿到最终的数据
              let res=JSON.parse(data);
              if(res.status==200 && res.data){
                resolve(res);
              }else{
                reject({
                  status:res.status,
                  msg:"获取云音乐MV详情错误",
                  data:res.data,
                })
              }
          }).catch(e=>{
            reject({
              status:res.status,
              msg:"获取云音乐MV详情错误",
              data:res.data,
            })
            debugger
          })
        })        
      },
      // 获取mv播放地址
      getURLMV(item){
        return new Promise((resolve,reject)=>{
          fetch("/api/video/url?idNCMMV="+item.idURL)
          .then((data)=>data.text())
          .then((data)=> {
              // 在这个then里面我们能拿到最终的数据
              let res=JSON.parse(data);
              if(res.status==200 && res.data.length>0){
                resolve(res);
              }else{
                reject({
                  status:res.status,
                  msg:"获取云音乐MV播放地址错误",
                  data:res.data,
                })
              }
          }).catch(e=>{
            reject({
              status:res.status,
              msg:"获取云音乐MV播放地址错误",
              data:res.data,
            })
            debugger
          })
        })
      },
      // 添加到本地,检查图片是否已修正，上传图片+数据
      addDomain(item){
        let that=this;
        item.isLoading=true;
        that.uploadBlob(item.blob).then(resSrc=>{
          item.urlImg=resSrc;
        //  // return that.getURLMV(item);
        //  return that.getDetailMV(item);
        //}).then(resURLMV=>{
        //  item.urlVideo=resURLMV.data.urlVideo;
        //  // 更新乐队信息
          let payload=that.getPushDataToUpdate(item);
          return updateOne(payload,this.nameMod);
        }).then(result => {
          if (result.status === 200) {
            that.$message({
              message: that.$t("main.updateSuccess"),
              type: "success"
            });
            item.isLoading=false;
            // 从网易云列表中移除，添加到listVideos
            let idxNCM=that.listNCM.findIndex(v=>(v.link==item.link));
            that.listObjURL.push(...that.listNCM.splice(idxNCM,1));
          } else {
            that.$message.error(result.message);
          }         
        }).catch(error=>{
          debugger
          console.error(that.nameMod,"更新:fail,",error);
          that.$message.error(JSON.stringify(error));
        });    
            
      },
      // 删除链接
      removeDomain(item) {
        let that=this;
        var index = this.listObjURL.findIndex((v,idx)=>(v.link==item.link))
        if (index !== -1) {
          item.isLoading=true;
          // 从listVideos中移除，添加到网易云列表
          this.listNCM.push(...this.listObjURL.splice(index, 1));
          // let itemNCM=this.listNCM.find((v,idx)=>(v.link==item.link))

          // 更新整个列表
          let payload={
            _id:this.dialogState.formData._id,
            funUpdate:"updateList",
            [this.dialogState.strListObjURL]:this.listDataToUpdate,
          }
          updateOne(payload,that.nameMod).then(result => {
            if (result.status === 200) {
              let itemNCM=that.listNCM.find((v,idx)=>(v.link==item.link))
              if(itemNCM)itemNCM.isLoading=false;
              that.listNCM=that.listNCM.map(v=>(v));
              that.$message({
                message: that.$t("main.updateSuccess"),
                type: "success"
              });
            } else {
              that.$message.error(result.message);
            }         
          }).catch(error=>{
            debugger
            console.error(that.nameMod,"删除:fail,",error,params);
            that.$message.error(JSON.stringify(error));
          }); 
        }

      },
      // 获取图标和fetch信息
      getURLData(objLink,formName){
        let that=this;
        // 判断更新图标和objLink.icon
        if(objLink.link.indexOf("weibo.com") != -1 ) objLink.icon="/static/themes/images/link/logo_sina_32x32.png";
        if(objLink.link.indexOf("douban.com") !=-1 ) objLink.icon="/static/themes/images/link/logo_douban_32x32.png";
        if(objLink.link.indexOf("music.163.com")!=-1)objLink.icon="/static/themes/images/link/logo_163_32x32.png";
        // 更新name
        return new Promise((resolve,reject)=>{
          // 分析idNCMMV,
          let idNCMMV=objLink.link.split("music.163.com/#/mv?id=")[1];
          if(objLink.link.indexOf("music.163.com")!=-1 && idNCMMV){
            // 接口
            fetch("/api/video/item?idNCMMV="+idNCMMV)
            .then((data)=>data.json())
            .then((data)=> {
                // 在这个then里面我们能拿到最终的数据
                let res=data;
                if(res.status==200 && res.data){
                  resolve(res.data);
                }else{
                  reject(res)
                }
            }).catch(e=>{
              debugger
              reject(e)
              console.error(e)
            })
          }else{
            reject({
              msg:"非网易云音乐MV链接"+objLink.link,
              err:"链接错误",
              data:objLink,
            })

          }
        })
      },

      eAddURL(e){
        let that=this;
        let link=this.objToAdd.link;
        if(!link)return;
        // 验证表单
        this.$refs["formAdd"].validate((valid) => {
          if (valid) {
            // this.objToAdd.link=link;
            // 获取具体数据
            this.getURLData(this.objToAdd,"formAdd").then(resVideo=>{
              if(resVideo && resVideo.name){
                that.$message({
                  message: "找到网易云音乐MV信息，自动填充",
                  type: "success"
                });
                that.listObjURL.push(resVideo);
                // 去重
                that.listObjURL=[new Set(...that.listObjURL)]
                // 新增恢复初始值
                that.objToAdd=Object.assign({},objURLDefault);
                // console.log("增加链接：",this.objToAdd);
              }else{
                that.$message.error(
                  that.$t("validate.error_params", { label: "网易云返回数据异常" })
                );                
              }
            }).catch(e=>{
              debugger
              console.error(e);
              that.$message.error( that.$t("validate.inputCorrect", { label: "网易云音乐MV详情"+link }) );

            });            
          } else {
            // console.log('新增链接表单验证失败');
            this.$message.error(
              this.$t("validate.inputCorrect", { label: "链接" })
            );
            return false;
          }
        });
      },
      // 图片读取完成，开始裁切、缩小
      eImgLoaded(e){
        let targetWidth=1920;
        let targetHeight=1080;

        let img=e.target;
        let typeSrc=img.src.substring(0,7);
        let time=new Date();
        let srcOrg=img.src;
        let objToChange=this.listNCM.find(v=>(v.urlImg==srcOrg));
        // if(typeSrc.indexOf("data:")==-1 && typeSrc.indexOf("blob:")==-1)
        if(img.naturalWidth!=targetWidth || img.naturalHeight!=targetHeight){
          if(objToChange){
            img.type='image/jpeg';
            imgFit(img,targetWidth,targetHeight).then(resSrc=>{
              objToChange.urlImg=resSrc.src;
              objToChange.blob=resSrc.blob;
              objToChange.isFitted=true;
              // img.src= resSrc;
              console.log("图片裁切完成",(new Date()-time),typeSrc)
            });//网易云MV图尺寸628,353
          }

        }else{
          if(objToChange)objToChange.isFitted=true;
          else{
            objToChange=this.listObjURL.find(v=>(v.urlImg==srcOrg));
            if(objToChange)objToChange.isFitted=true;
          }
        }
      },

    }
  }
</script>