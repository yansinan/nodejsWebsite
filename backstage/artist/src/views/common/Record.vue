<template>
  <div>
    <el-dialog
    :xs="20"
    title="发行"
    width="80%"
    :close-on-click-modal="false"
    :visible.sync="dialogState.isShow"
    :before-close="handleClose"
    @open="eDialogOpen">
    <div slot="title" class="el-dialog__title">
        <el-avatar :src="dialogState.formData.sImg" fit="cover"/>{{dialogState.formData.name}}的{{label}}
    </div>

      <el-divider content-position="left">已保存的专辑</el-divider>
      <div class="listGrid local">
          <div  v-for="(domain, index) in listRecords" :key="domain.idAlbumNCM">
            <el-card :body-style="{ padding: '0px' }" shadow="hover" v-loading="domain.isLoading">
              <el-image :span="24" :src="domain.sImg" :fit="contain" crossOrigin="Anonymous" />
              <div class="titleVideo" style="">
                <span v-if="domain.name">{{domain.name}}</span>
                <el-tooltip content="编辑专辑内容" placement="top" effect="light">
                  <el-button type="primary" plain icon="el-icon-edit" @click.prevent="eEditRecord(domain)"/>
                </el-tooltip>
              </div>
            </el-card>
          </div>
      </div>
      <!-- 网易云抓取 -->
      <el-divider content-position="left">网易云音乐数据</el-divider>
      <div class="listGrid">
          <div v-for="(domain, index) in listRecordsNCM" :key="domain.idAlbumNCM">
            <el-card :body-style="{ padding: '0px' }" shadow="hover" v-loading="domain.isLoading">
              <el-image :span="24" :src="domain.sImg" :fit="contain" @load="eImgLoaded" v-loading="!domain.isFitted" crossOrigin="Anonymous" />
              <div class="titleVideo" style="">
                <span v-if="domain.name">{{domain.name}}</span>
                <el-tooltip content="复制到本站" placement="top" effect="light">
                  <el-button type="success" plain :disabled="!domain.isFitted" icon="el-icon-document-copy" @click.prevent="addRecord(domain)"/>
                </el-tooltip>
              </div>
            </el-card>
          </div>
      </div>      
      <span slot="footer" class="dialog-footer">
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
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto;
  grid-gap: 1rem;
  margin: 0rem 1rem;
}
.listGrid.local{
  margin-bottom:4rem;
}
</style>
<script>
  import { updateOne } from "@root/publicMethods/apiGeneral";
  import { imgFit } from "@root/publicMethods/imgFit";
  import request from '@root/publicMethods/request'

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
          }
        },
    },
    data() {
      return {
          listRecords:[],//本地数据库里专辑情况
          listRecordsNCM:[],//网易获取的专辑
          strNoticeListNCM:"",//全部同步的提示

      };
    },
    watch: {
        // 主要列表
        listRecordsNCM: function (newV,oldV) {
            // //有变化就去重合并            
            // this.listRecords=this.listRecords.concat(this.listRecordsNCM);
            // this.listRecords=[...new Set(this.listRecords)];
            if(newV.length==0)this.strNoticeListNCM="网易云音乐MV已全部同步完成"
            else this.strNoticeListNCM=""

        }
    },
    methods: {
      // 手动同步网易云的乐队MV
        eBnSyncNCM(e){
          let that=this;
          if(!this.dialogState.formData.idNCM)return Promise.reject({err:"fail",msg:"no idNCM"});
          return new Promise((resolve,reject)=>{
            fetch("/api/artist/fetchNCMArtistAlbums?idNCM="+this.dialogState.formData.idNCM+"&_id="+this.dialogState.formData._id)
            .then((data)=>data.json())
            .then((res)=> {
                // 在这个then里面我们能拿到最终的数据
                if(res.status==200 && res.data.length>0){
                
                  //去重 & 合并
                  // let list=res.data.concat(that.listRecordsNCM);
                  // list=[...new Set(list)];
                  // that.listRecordsNCM.splice(0,that.listRecordsNCM.length,...list);
                  let msg="";
                  let listNew=res.data.filter(vNew=>{
                    //同name或者同idAlbumNCM的都不要
                    let isOld= (that.listRecordsNCM.find(vOld=>(vNew.idAlbumNCM==vOld.idAlbumNCM)) || that.listRecordsNCM.find(vOld=>(vNew.name==vOld.name)) || that.listRecords.find(vOld=>(vNew.idAlbumNCM==vOld.idAlbumNCM)) || that.listRecords.find(vOld=>(vNew.name==vOld.name)) );
                    if(isOld)msg+=vNew.name+","
                    return !isOld;
                  })
                  msg="剔除重复"+listNew.length+"条V,新增:"+msg;
                  that.listRecordsNCM.unshift(...listNew);

                  that.$message({
                    message: "找到网易"+res.data.length+"条。"+msg,
                    type: "success"
                  });
                  // 去空数据
                  // that.listRecordsNCM=that.listRecordsNCM.filter(v=>(v));
                  // 触发事件;
                  // if(that.listRecords)that.$emit('list-changed',that.listRecords);
                  resolve(res);
                }else{
                  that.$message.error(
                    that.$t("validate.inputCorrect", { label: "网易云音乐获取MV" })
                  );
                  reject(e);
                }
            }).catch(e=>{
              debugger
              that.$message.error(
                that.$t("validate.inputCorrect", { label: "网易云音乐获取MV" })
              );
              console.error(e);
              reject(e);
            })
          })


        },
      //读取数据库专辑信息
      getListRecords(){
        let that=this;
        return request({
          url: '/api/artist/listRecords',
          method: 'get',
          params:{_id:that.dialogState.formData._id},
        })
      },
      // 弹窗打开时
      eDialogOpen(e){
        let that=this;
        this.getListRecords().then(resListRecord=>{
          console.log("数据库内专辑信息",resListRecord);
          if(resListRecord.status==200 && resListRecord.data && resListRecord.data.length>0){
            that.listRecords=resListRecord.data;
          }
          // 读取NCM并去重
          return this.eBnSyncNCM(e)
        }).then(res=>{
            
        }).catch(e=>{
          console.error("Record组件初始化读取数据错误:",e);
          debugger
        });
      },

      // 弹窗关闭
      handleClose(e){
          this.$emit('complete',this.listRecords);
          this.dialogState.isShow=false;
          // 清空数据
          this.dialogState.formData={};
          this.dialogState.isEdited=false;
          this.listRecordsNCM=[];
          this.listRecords=[];
      },
      // 上传blob到后台//subPath upload_file需要修改
      uploadBlob(blob){
        let _this=this;
        return new Promise((resolve,reject)=>{
          const params = new FormData()
          // 路径相关:
          params.append("nameMod",_this.nameMod);
          params.append("subPath","records");
          params.append('upload_file', blob, "imgRecord.jpg")
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
            idAlbumNCM: item.idAlbumNCM,
            name:item.name,
            alias:item.alias,
            dateRelease:item.dateRelease,
            sImg:item.sImg,
            discription:item.discription,
            comments:item.comments,
            // type:item.type,//"EP/Single",
            // link:item.link,
            listRefs:item.listRefs,
        }
        return data;
      },
      // 添加到本地,检查图片是否已修正，上传图片+数据
      addRecord(item){
        let that=this;
        item.isLoading=true;
        that.uploadBlob(item.blob).then(resSrc=>{
          item.sImg=resSrc;
          return request({
            url: '/manage/record/addOne',
            method: 'post',
            data:that.getPushDataToUpdate(item),
          })
        }).then(result => {
          if (result.status === 200) {
            that.$message({
              message: that.$t("main.addContents"),
              type: "success"
            });
            return request({
              url:"/manage/record/getOne",
              method:"get",
              params:{idAlbumNCM:item.idAlbumNCM},
            })
          } else {
            that.$message.error(result.message);
            return Promise.reject(result);
          }         
        }).then(resQuery=>{
          if (resQuery.status === 200 && resQuery.data) {
            that.$message({
              message: that.$t("main.seeDetails"),
              type: "success"
            });
            item.isLoading=false;
            Object.assign(item,resQuery.data);
            // 从网易云列表中移除，添加到listVideos
            let idxNCM=that.listRecordsNCM.findIndex(v=>(v.idAlbumNCM==item.idAlbumNCM));
            that.listRecords.push(...that.listRecordsNCM.splice(idxNCM,1));
          } else {
            that.$message.error(resQuery.message);
            return Promise.reject(resQuery);
          }   

        }).catch(error=>{
          debugger
          console.error(that.nameMod,"更新:fail,",error);
          that.$message.error(JSON.stringify(error));
        });    
            
      },
      // 跳转唱片编辑页
      eEditRecord(objRecord){
        this.$router.push(this.$root.adminBasePath + "/record/edit/"+objRecord._id);
      },

      // 图片读取完成，开始裁切、缩小
      eImgLoaded(e){
        let that=this;
        let targetWidth=512;
        let targetHeight=512;

        let img=e.target;
        let typeSrc=img.src.substring(0,7);
        let time=new Date();
        let srcOrg=img.src;
        let objToChange=this.listRecordsNCM.find(v=>(v.sImg==srcOrg));
        // if(typeSrc.indexOf("data:")==-1 && typeSrc.indexOf("blob:")==-1)
        if(img.naturalWidth!=targetWidth || img.naturalHeight!=targetHeight){
          if(objToChange){
            img.type='image/jpeg';
            imgFit(img,targetWidth,targetHeight).then(resSrc=>{
              objToChange.sImg=resSrc.src;
              objToChange.blob=resSrc.blob;
              objToChange.isFitted=true;
              // img.src= resSrc;
              console.log("图片裁切完成",(new Date()-time),typeSrc)
            });//网易云MV图尺寸628,353
          }
        }else{
          if(objToChange)objToChange.isFitted=true;
          else{
            objToChange=this.listRecords.find(v=>(v.sImg==srcOrg));
            if(objToChange)objToChange.isFitted=true;
          }
        }
      },
    }
  }
</script>