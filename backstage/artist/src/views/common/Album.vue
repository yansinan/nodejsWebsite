<template>
  <el-form-item class="" :label="label" :prop="prop">
    <el-upload
        class=""
        ref="upload"
        multiple
        show-file-list="true"
        list-type="picture-card"
        accept="image/png,image/gif,image/jpeg"
        :auto-upload="false"
        :action="api"
        :file-list="listImages"
        :on-success="onSuccess"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :before-upload="beforeUpload"
        :data="{action:'uploadimage',nameMod:nameMod}"
    >
        <!-- <el-button slot="trigger" size="small" type="primary">选取文件</el-button> -->
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
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
    <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>    
  </el-form-item>
</template>
<style scoped>
/* 
.el-upload__text{
    position: absolute;
    top: 30%;
    width: 100%;
} 
*/

</style>
<script>
import '@/set-public-path'

export default {
    name: "Album",
    props: {
      api:{
        type:String,
        default:"/api/dr/uploadFiles",
      },
      prop:{
        type:String,
        default:"sImg"
      },
      label:{
        type:String,
        default:"主图"
      },
      listImages:{
          type:Array,
          default:[],
      },
      // 用户上传图片完成
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
            return (isJPG || isPNG || isGIF) && isLt2M;
        }
      },
    },
    watch: {

    },
    data () {
        return {
            dialogVisible:false,
            dialogImageUrl: '',
            disabled: false,
            nameMod:nameMod,
        }
    },
    mounted () {
    },
    methods: {
        handleRemove(file) {
            console.log(file);
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        handleClose(e){

        },
        submitUpload() {
            this.$refs.upload.submit();
        },
        // 上传
        uploadCropImg () {
            const _this = this;
            this.cropper.getCroppedCanvas(this.cropSetting).toBlob(async function(blob) {
                const params = new FormData()
                // 路径相关:
                params.append("nameMod",nameMod);

                params.append('upload_file', blob, _this.imgName)
                let uploadFileRequest = new Request(_this.api, {
                    method: 'post',
                    //指定header会eggjs接收不到multipart
                    // headers: {'Content-Type': 'multipart/form-data'},
                    body:params,
                })
                fetch(uploadFileRequest).then(response => {
                    debugger;
                    return response.text();
                }).then(res => {
                    // 在这个then里面我们能拿到最终的数据
                    let objData=JSON.parse(res);
                    if(objData.status==200){
                      console.log("resUpload::",objData);
                      _this.src=objData.data.path;
                      // if(objData.data.path)this.$emit('on-success',objData);
                      if(typeof _this["onSuccess"] === "function")_this["onSuccess"](objData)
                      _this.handleClose();
                    }
                })
            }, 'image/jpeg',1)
        },
    }
}
</script>