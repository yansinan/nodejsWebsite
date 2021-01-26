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
        <el-upload
            class=""
            ref="upload"
            multiple
            show-file-list="true"
            list-type="picture-card"
            accept="image/png,image/gif,image/jpeg"
            v-loading="infoImageUploading.isLoading"
            :element-loading-text="'正在'+infoImageUploading.name"
            :auto-upload="false"
            :action="api"
            :file-list="dialogState.formData.listImages"
            :on-success="handleSuccess"
            :on-progress="handleProgress"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :before-remove="handleBeforeRemove"
            :before-upload="beforeUpload"
            :data="getObjField()"
        >
            <!-- <el-button slot="trigger" size="small" type="primary">选取文件</el-button> -->
            <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload" ref="bnUpload">上传到服务器</el-button> -->
            <i slot="trigger" class="el-icon-plus"></i>
            <!-- 
            <div slot="file" slot-scope="{file}">
                <img
                    class="el-upload-list__item-thumbnail"
                    :src="file.url" alt=""
                >
                <span class="el-upload-list__item-actions">
                    <span
                    class="el-upload-list__item-preview"
                    @click="handlePictureCardPreview(file)"
                    >
                    <i class="el-icon-zoom-in"></i>
                    </span>
                    <span
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click="handleDownload(file)"
                    >
                    <i class="el-icon-download"></i>
                    </span>
                    <span
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click="handleRemove(file)"
                    >
                    <i class="el-icon-delete"></i>
                    </span>
                </span>
            </div>
            -->
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过2M</div>
        </el-upload>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="success" @click="submitUpload">上 传</el-button>
        </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogPreviewVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
</div>
</template>
<style lang="scss">
/* 
.el-upload__text{
    position: absolute;
    top: 30%;
    width: 100%;
} 
*/
.el-dialog__title{
    display:flex;
    align-items: center;
    .el-avatar{
      margin-right:5px;
      margin-left:5px;
      min-width: 40px;
    }
}
.el-upload-list__item-thumbnail{
    object-fit: cover;
}
</style>
<script>
import '@/set-public-path'
import request from '@root/publicMethods/request'

export default {
    name: "Album",
    props: {
      api:{
        type:String,
        default:"/manage/artist/updateAlbum",
      },
      label:{
        type:String,
        default:"主图"
      },
      dialogState:{
          type:Object,
          default:{
            isShow:false,
            isEdited:false,
            formData:{},
          }
      },
      // 每张图片上传成功后都触发
      "on-success":{
        type:Function,
        default:null,
      },
      "before-upload":{
        type:Function,
        default:function(file) {// 相册上传前检查文件类型和大小
            const isJPG = file.type === "image/jpeg";
            const isPNG = file.type === "image/png";
            const isGIF = file.type === "image/gif";
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG && !isPNG && !isGIF) {
                this.$message.error(this.$t("validate.limitUploadImgType"));
            }
            if (!isLt2M) {
                this.$message.error(
                this.$t("validate.limitUploadImgSize", { size: 2 })
                );
            }
            let isValidate=(isJPG || isPNG || isGIF) && isLt2M;
            // if(!isValidate)Object.assign(this.infoImageUploading,file,{isLoading:false,progress:0,});
            // else Object.assign(this.infoImageUploading,file,{isLoading:true,progress:0,});
            return isValidate;
        }
      },
      // 所有合规的图片都上传完成
      "on-complete":{
        type:Function,
        default:null,
      },
    },
    watch: {

    },
    data () {
        return {
            dialogPreviewVisible:false,
            dialogImageUrl: '',
            disabled: false,
            nameMod:nameMod,
            infoImageUploading:{
                isLoading:false,
                name:"",
                progress:0,
            },
        }
    },
    mounted () {
    },
    methods: {
        handleSuccess(res, file,fileList){
            let _this=this;
            //传一个更新一遍,在服务器端完成;
            //服务器返回路径，返回listImages么？
            // res.data._doc是文档最新数据

            if(typeof _this["onSuccess"] === "function")_this["onSuccess"](res,file,fileList)
            // 
            if(!fileList.find(v=>(v.status!="success"))){//合规的图片已全部上传完成                
                // if(typeof _this["onComplete"] === "function")_this["onComplete"](res, file,fileList);
                _this.handleClose();
                _this.infoImageUploading.isLoading=false;

                // 上传按钮变浏览?
            }
        },

        handleRemove(file,fileList) {
            this.infoImageUploading.isLoading=false;
        },
        handleBeforeRemove(file,fileList){
            const _this = this;
            return new Promise((resolve, reject) => {
                // 已经上传过的文件删除
                if(file.status=="success"){
                    const params = {
                        "url":file.url,
                        "_id":_this.dialogState.formData.id
                    }
                    let removeFileRequest = new Request("/manage/artist/removeAlbum", {
                        method: 'post',
                        //指定header会eggjs接收不到multipart
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body:JSON.stringify(params),
                    })
                    //loading显示
                    _this.infoImageUploading.isLoading=true;
                    _this.infoImageUploading.name="移除";
                    fetch(removeFileRequest).then(response => {
                        return response.text();
                    }).then(res => {
                        // 在这个then里面我们能拿到最终的数据
                        let objData=JSON.parse(res);
                        if(objData.status==200){
                            console.log("resDelete::",objData);
                            Object.assign(_this.dialogState.formData,objData._doc);
                            // if(objData.data.path)this.$emit('on-success',objData);
                            // if(typeof _this["onSuccess"] === "function")_this["onSuccess"](objData)
                            // artist被编辑过
                            // _this.dialogState.isEdited=true;
                            resolve(objData);
                        }else reject(objData);
                    })
                }else if(file.status=="ready"){ //预览删除,可能是不合规
                    resolve();
                }

            });
            // console.log(file);
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogPreviewVisible = true;
        },
        handleClose(e){
            if(typeof this["onComplete"] === "function")this["onComplete"]();
            this.dialogState.isShow=false;
            // 清空数据
            this.dialogState.formData.listImages=[];
        },
        handleProgress(e,file,fileList){
            // console.log(e,file,fileList)
            this.infoImageUploading.progress=e.percent;
            this.infoImageUploading.isLoading=file.isLoading || e.percent;
            this.infoImageUploading.name="上传:"+file.name;

            // this.infoImageUploading=Object.assign(file.raw,{isLoading:(e.type=="progress"),progress:e.percent,});
        },
        // 服务器端接收文件&艺术家更新listImages
        submitUpload() {
            this.$refs.upload.submit();
        },
        // 生成上传数据
        getObjField(){
            return {
                action:'uploadimage',
                nameMod:this.nameMod,
                subPath:this.dialogState.formData.id,
                _id:this.dialogState.formData.id,
            }
        },
    }
}
</script>