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

      <el-row :gutter="40">
        <!-- <el-form :model="listObjURL" ref="formUpdate" status-icon inline-message="true" label-width="0px" @validate="eValidate"> -->
          <el-col v-for="(domain, index) in listObjURL" :key="domain.idURL" :md="11" style="margin-bottom:40px;">
            <el-card :body-style="{ padding: '0px' }" shadow="hover">
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
              <img width="100%" :src="domain.urlImg" fit="contain" @load="eImgLoaded" crossOrigin="Anonymous"/>
              <div class="titleVideo" style="">
                <span v-if="domain.name">{{domain.name}}</span>
                <el-button type="danger" plain slot="append" icon="el-icon-delete" @click.prevent="removeDomain(domain)"/>
              </div>
              <!-- </el-form-item> -->
            </el-card>
          </el-col>
        <!-- </el-form> -->
        <!-- 新增 -->
        <el-col :md="11" style="height:100%">
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
                    <template slot="prepend" style=""><span style="text-align:center;font-size: 18px;" >新链接</span></template>
                    <el-button slot="append" icon="el-icon-plus" @click="eAddURL"/>
                  </el-input>
                </el-form-item>
              </el-form>
            </div>
            <div style="font-size: 18px;padding: 18px 20px;">可使用网易云音乐MV链接</div>
          </el-card>
        </el-col>
        <!--  -->
      </el-row>
      
      <span slot="footer" class="dialog-footer">
          <el-button v-if="dialogState.formData.idNCM" type="warning" @click="eBnSyncNCM">同步网易云音乐</el-button>
          <el-button type="success" @click="submitUpload">保 存</el-button>
          <el-button @click="handleClose">取 消</el-button>
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
      };
    },
    computed: {
      // 主要列表
      listObjURL: function () {
        //   let list=this.dialogState.formData[this.dialogState.strListObjURL]?this.dialogState.formData[this.dialogState.strListObjURL].filter(v=>(v)):[];
          return this.dialogState.formData[this.dialogState.strListObjURL] || [];
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
              
              //去重 & 合并
              // let list=res.data.concat(that.listObjURL);
              // list=[...new Set(list)];
              // that.listObjURL.splice(0,that.listObjURL.length,...list);
              let msg="";
              let listNew=res.data.filter(vNew=>{
                let isOld= (that.listObjURL.find(vOld=>(vNew.idURL==vOld.idURL)));
                if(isOld)msg+=vNew.name+","
                return !isOld;
              })
              msg="剔除重复"+listNew.length+"条V,新增:"+msg;
              that.listObjURL.unshift(...listNew);
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
              // 触发事件;
              if(that.listObjURL)that.$emit('list-changed',that.listObjURL);

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
  
      },
      // 手动更新到服务器
      submitUpload(){
        let that=this;
        let payload={
          _id:this.dialogState.formData._id,
          funUpdate:"updateList",
          [this.dialogState.strListObjURL]:this.listObjURL,
        }
        updateOne(payload,this.nameMod).then(result => {
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
        var index = this.listObjURL.findIndex((v,idx)=>(v.link==item.link))
        if (index !== -1) {
          this.listObjURL.splice(index, 1)
        }
        if(this.listObjURL)this.$emit('list-changed',this.listObjURL);

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
                if(that.listObjURL)that.$emit('list-changed',this.listObjURL);
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
        // if(typeSrc.indexOf("data:")==-1 && typeSrc.indexOf("blob:")==-1)
        if(img.naturalWidth!=targetWidth || img.naturalHeight!=targetHeight)
        imgFit(img,targetWidth,targetHeight).then(resSrc=>{
          img.src= resSrc;
          console.log("图片裁切完成",(new Date()-time),typeSrc)
        });//网易云MV图尺寸628,353
      },

    }
  }
</script>