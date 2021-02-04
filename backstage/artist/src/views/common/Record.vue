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

      <el-row :gutter="40">
          <el-col v-for="(domain, index) in listRecords" :key="domain.idURL" :md="11" style="margin-bottom:40px;">
            <el-card :body-style="{ padding: '0px' }" shadow="hover">
              <el-image :span="24" :src="domain.sImg" :fit="contain"/>
              <div class="titleVideo" style="">
                <span v-if="domain.name">{{domain.name}}</span>
                <el-button type="danger" plain slot="append" icon="el-icon-delete" @click.prevent="removeDomain(domain)"/>
              </div>
            </el-card>
          </el-col>
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
          }
        },
    },
    data() {
      return {
          listRecords:[],//本地数据库里专辑情况
          listRecordsNCM:[],//网易获取的专辑
      };
    },
    watch: {
        // 主要列表
        listRecordsNCM: function () {
            //有变化就去重合并            
            this.listRecords=this.listRecords.concat(this.listRecordsNCM);
            this.listRecords=[...new Set(this.listRecords)];
        }
    },
    methods: {
      // 手动同步网易云的乐队MV
        eBnSyncNCM(e){
          let that=this;
          if(!this.dialogState.formData.idNCM)return;
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
                  let isOld= (that.listRecordsNCM.find(vOld=>(vNew.idURL==vOld.idURL)));
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
          [this.dialogState.strListObjURL]:this.listRecords,
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
          this.listRecordsNCM=[];
          this.listRecords=[];
      },

    }
  }
</script>