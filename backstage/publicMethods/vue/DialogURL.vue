<template>
  <div>
        <el-dialog
        :xs="20"
        title="图集"
        width="80%"
        :close-on-click-modal="false"
        :visible.sync="dialogState.isShow"
        :before-close="handleClose">
        <div slot="title" class="el-dialog__title">
            <el-avatar :src="dialogState.formData.sImg" fit="cover"/>{{dialogState.formData.name}}的{{label}}
        </div>
        <ListURL v-model="listObjURL" :label="lablel" @loading="eLoading" @input="eChange"/>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="success" @click="submitUpload" :disabled="!isEdited">更 新</el-button>
        </span>
    </el-dialog>

  </div>
</template>

<script>
  import { updateOne } from "@root/publicMethods/apiGeneral";
  
  import ListURL from "./ListURL.vue";
  // import request from '@root/publicMethods/request'
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
            strListObjURL:"listLinks",
          }
        },
    },
    data() {
      return {
        objToAdd:Object.assign({},objURLDefault),
        strErrorAdd:"",
        strErrorUpdate:"",
        // 组件等待
        isLoading:false,
      };
    },
    computed: {
      // 主要列表
      listObjURL: function () {
          return this.dialogState.formData[this.dialogState.strListObjURL] || [];
      },
      isEdited:function(){
        return !this.isLoading && this.dialogState.isEdited;
      }
    },
    components: {
      ListURL
    },
    methods: {
      // 更新到服务器
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
          console.error(that.nameMod,"更新:fail,",error);
          that.$message.error(that.nameMod+"服务器返回失败:"+result.status+","+error);
        });
      },
      // 弹窗关闭
      handleClose(e){

          this.$emit('complete',this.listObjURL);

          this.dialogState.isShow=false;
          // 清空数据
          this.dialogState.formData={};
          this.dialogState.isEdited=false;
      },
      // 组件正在处理，等待
      eLoading(e){
        this.isLoading=e;
      },
      // 数据产生了合理的变化才允许更新；防止读取网易过程中，更新无效
      eChange(e){
        this.dialogState.isEdited=true;
      }
    }
  }
</script>