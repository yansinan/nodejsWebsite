<template>
  <el-form-item class="" :label="label" :prop="prop">
      <input v-show="false" type="file" multiple="" accept="image/png,image/gif,image/jpeg" @change="uploadImg" ref="inputFile"/>
      <el-button @click="eClickOpenImg" type="primary" icon="el-icon-upload2" style="width:200px;"> 选择文件</el-button>

      <img v-if="srcPreview" :src="srcPreview" class="avatar" style="position:relative;z-index:-1;max-height:none;height:auto;border-radius:4px; border: dashed #cacaca 1px;padding:4px;margin-top: 7px;"/>
      <div class="el-upload__tip">只能上传jpg/png文件，上传前自动裁切</div>

    <el-dialog
      :xs="20"
      title="上传图片"
      width="80%"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      @opened="initCropper">
      <div class="cropper" style="width: 100%; height: auto; border: dashed #cacaca 1px; text-align: center;">
          <img :src="src" style="max-width: 100%" ref="img">
      </div>
      <div class="cropperPreview" style="display: flex;align-items: center;justify-content: space-around;">
          <div>
            <div :src="src" class="avatar avatar-96" style="overflow:hidden;display: inline-block;" ></div>
            像素尺寸96px*96px
          </div>
          <div>
            <div :src="src" class="avatar avatar-64" style="overflow:hidden;display: inline-block;" ></div>
            像素尺寸64px*64px
          </div>
          <div>
            <div :src="src" class="avatar avatar-32" style="overflow:hidden;display: inline-block;"></div>
            像素尺寸32px*32px
          </div>
          
          
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="uploadCropImg">上 传</el-button>
      </span>
    </el-dialog>
  </el-form-item>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.avatar {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  margin: 0;
  padding: 0;
  text-align: center;
  text-transform: uppercase;
  font-weight: normal;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  max-height: 32px;
  width: 32px;
  height: 100%;
  font-size: 21px;
  line-height: 32px;
  border-radius: 50%;
}
.avatar.img-thumbnail {
  padding: 4px;
  max-width: none;
}
.avatar > img {
  width: 100%;
}

.avatar-16 {
  max-height: 16px;
  width: 16px;
  height: 100%;
  font-size: 11px;
  line-height: 16px;
}

.avatar-24 {
  max-height: 24px;
  width: 24px;
  height: 100%;
  font-size: 16px;
  line-height: 24px;
}

.avatar-32 {
  max-height: 32px;
  width: 32px;
  height: 100%;
  font-size: 21px;
  line-height: 32px;
}

.avatar-48 {
  max-height: 48px;
  width: 48px;
  height: 100%;
  font-size: 32px;
  line-height: 48px;
}

.avatar-64 {
  max-height: 64px;
  width: 64px;
  height: 100%;
  font-size: 43px;
  line-height: 64px;
}

.avatar-96 {
  max-height: 96px;
  width: 96px;
  height: 100%;
  font-size: 64px;
  line-height: 96px;
}

.avatar-128 {
  max-height: 128px;
  width: 128px;
  height: 100%;
  font-size: 85px;
  line-height: 128px;
}

@media (min-width: 576px) {
  .avatar-sm-16 {
    max-height: 16px;
    width: 16px;
    height: 100%;
    font-size: 11px;
    line-height: 16px;
  }

  .avatar-sm-24 {
    max-height: 24px;
    width: 24px;
    height: 100%;
    font-size: 16px;
    line-height: 24px;
  }

  .avatar-sm-32 {
    max-height: 32px;
    width: 32px;
    height: 100%;
    font-size: 21px;
    line-height: 32px;
  }

  .avatar-sm-48 {
    max-height: 48px;
    width: 48px;
    height: 100%;
    font-size: 32px;
    line-height: 48px;
  }

  .avatar-sm-64 {
    max-height: 64px;
    width: 64px;
    height: 100%;
    font-size: 43px;
    line-height: 64px;
  }

  .avatar-sm-96 {
    max-height: 96px;
    width: 96px;
    height: 100%;
    font-size: 64px;
    line-height: 96px;
  }

  .avatar-sm-128 {
    max-height: 128px;
    width: 128px;
    height: 100%;
    font-size: 85px;
    line-height: 128px;
  }
}
@media (min-width: 768px) {
  .avatar-md-16 {
    max-height: 16px;
    width: 16px;
    height: 100%;
    font-size: 11px;
    line-height: 16px;
  }

  .avatar-md-24 {
    max-height: 24px;
    width: 24px;
    height: 100%;
    font-size: 16px;
    line-height: 24px;
  }

  .avatar-md-32 {
    max-height: 32px;
    width: 32px;
    height: 100%;
    font-size: 21px;
    line-height: 32px;
  }

  .avatar-md-48 {
    max-height: 48px;
    width: 48px;
    height: 100%;
    font-size: 32px;
    line-height: 48px;
  }

  .avatar-md-64 {
    max-height: 64px;
    width: 64px;
    height: 100%;
    font-size: 43px;
    line-height: 64px;
  }

  .avatar-md-96 {
    max-height: 96px;
    width: 96px;
    height: 100%;
    font-size: 64px;
    line-height: 96px;
  }

  .avatar-md-128 {
    max-height: 128px;
    width: 128px;
    height: 100%;
    font-size: 85px;
    line-height: 128px;
  }
}
@media (min-width: 992px) {
  .avatar-lg-16 {
    max-height: 16px;
    width: 16px;
    height: 100%;
    font-size: 11px;
    line-height: 16px;
  }

  .avatar-lg-24 {
    max-height: 24px;
    width: 24px;
    height: 100%;
    font-size: 16px;
    line-height: 24px;
  }

  .avatar-lg-32 {
    max-height: 32px;
    width: 32px;
    height: 100%;
    font-size: 21px;
    line-height: 32px;
  }

  .avatar-lg-48 {
    max-height: 48px;
    width: 48px;
    height: 100%;
    font-size: 32px;
    line-height: 48px;
  }

  .avatar-lg-64 {
    max-height: 64px;
    width: 64px;
    height: 100%;
    font-size: 43px;
    line-height: 64px;
  }

  .avatar-lg-96 {
    max-height: 96px;
    width: 96px;
    height: 100%;
    font-size: 64px;
    line-height: 96px;
  }

  .avatar-lg-128 {
    max-height: 128px;
    width: 128px;
    height: 100%;
    font-size: 85px;
    line-height: 128px;
  }
}
@media (min-width: 1200px) {
  .avatar-xl-16 {
    max-height: 16px;
    width: 16px;
    height: 100%;
    font-size: 11px;
    line-height: 16px;
  }

  .avatar-xl-24 {
    max-height: 24px;
    width: 24px;
    height: 100%;
    font-size: 16px;
    line-height: 24px;
  }

  .avatar-xl-32 {
    max-height: 32px;
    width: 32px;
    height: 100%;
    font-size: 21px;
    line-height: 32px;
  }

  .avatar-xl-48 {
    max-height: 48px;
    width: 48px;
    height: 100%;
    font-size: 32px;
    line-height: 48px;
  }

  .avatar-xl-64 {
    max-height: 64px;
    width: 64px;
    height: 100%;
    font-size: 43px;
    line-height: 64px;
  }

  .avatar-xl-96 {
    max-height: 96px;
    width: 96px;
    height: 100%;
    font-size: 64px;
    line-height: 96px;
  }

  .avatar-xl-128 {
    max-height: 128px;
    width: 128px;
    height: 100%;
    font-size: 85px;
    line-height: 128px;
  }
}
@media (min-width: 1400px) {
  .avatar-xxl-16 {
    max-height: 16px;
    width: 16px;
    height: 100%;
    font-size: 11px;
    line-height: 16px;
  }

  .avatar-xxl-24 {
    max-height: 24px;
    width: 24px;
    height: 100%;
    font-size: 16px;
    line-height: 24px;
  }

  .avatar-xxl-32 {
    max-height: 32px;
    width: 32px;
    height: 100%;
    font-size: 21px;
    line-height: 32px;
  }

  .avatar-xxl-48 {
    max-height: 48px;
    width: 48px;
    height: 100%;
    font-size: 32px;
    line-height: 48px;
  }

  .avatar-xxl-64 {
    max-height: 64px;
    width: 64px;
    height: 100%;
    font-size: 43px;
    line-height: 64px;
  }

  .avatar-xxl-96 {
    max-height: 96px;
    width: 96px;
    height: 100%;
    font-size: 64px;
    line-height: 96px;
  }

  .avatar-xxl-128 {
    max-height: 128px;
    width: 128px;
    height: 100%;
    font-size: 85px;
    line-height: 128px;
  }
}

/*# sourceMappingURL=avatar.css.map */

</style>
<script>
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.min.css'
 
export default {
    name: "ImgCropper",
    props: {
      nameMod:{
        type:String,
        default:"rubyeyes"
      },
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
      srcPreview: {
          type:String,
          default:"",
      },
      cropSetting:{
        type:Object,
        default:{
          width: 512,
          height: 512,
          minWidth: 256,
          minHeight: 256,
          maxWidth: 1024,
          maxHeight: 1024,
          fillColor: '#fff',
          imageSmoothingEnabled: false,
          imageSmoothingQuality: 'high',
        }
      },
      // 用户浏览图片，外部验证
      "before-crop":{
        type:Function,
        default:function(file) {
          const isJPG = file.type === "image/jpeg";
          const isPNG = file.type === "image/png";
          const isGIF = file.type === "image/gif";
          if (!isJPG && !isPNG && !isGIF) {
            this.$message.error(this.$t("validate.limitUploadImgType"));
          }
          return (isJPG || isPNG || isGIF);
        },
      },
      // 用户上传图片完成
      "on-success":{
        type:Function,
        default:null,
      },

    },
    watch: {
        src(newV,oldV) {
            // 先控制显示/隐藏
            this.dialogVisible=(this.src=='')?false:true;
            if(this.cropper)this.cropper.replace(newV);
        },
    },
    data () {
        return {
            cropperImg: '',
            cropper: '',
            src:"",
            imgName: '',
            dialogVisible:false,
        }
    },
    mounted () {
        // this.initCropper()
    },
    methods: {

        handleClose(e){
          this.src = "";
          this.cropper.reset();
          //用inputFile.value同步，否则同一个文件不能再次上传;
          this.$refs.inputFile.value=this.src;
        },
        initCropper () {
            if(!this.cropper)this.cropper = new Cropper(this.$refs.img, {
                viewMode: 1,
                // aspectRatio: 16/9,
                dragMode:"move",
                aspectRatio:1,
                preview:".avatar"
            });
        },
        // 浏览
        eClickOpenImg() {
          this.$refs.inputFile.click();
        },
        uploadImg (event) {
          let that=this;
          const img = event.target.files[0]
          //外部验证数据有效性
          let resIfDialog=(typeof this["beforeCrop"] === "function")?this["beforeCrop"](img):false;
          
          if(resIfDialog){
            // 显示对话框
            // this.dialogVisible=true;
            that.src = URL.createObjectURL(img);
            that.imgName = img.name;
          }else{
            that.handleClose();
          }
        },
        // 上传
        uploadCropImg () {
            const _this = this;
            this.cropper.getCroppedCanvas(this.cropSetting).toBlob(async function(blob) {
                const params = new FormData()
                // 路径相关:
                params.append("nameMod",_this.nameMod);

                params.append('upload_file', blob, _this.imgName)
                let uploadFileRequest = new Request(_this.api, {
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
                      _this.src=objData.data.path;
                      // if(objData.data.path)this.$emit('on-success',objData);
                      if(typeof _this["onSuccess"] === "function")_this["onSuccess"](objData)
                      _this.handleClose();
                    }
                })
            }, 'image/jpeg',1)
        },
        //另存裁切后的图片
        saveCropImg () {
            const _this = this
            this.cropper.getCroppedCanvas().toBlob(function(blob) {
                const href = window.URL.createObjectURL(blob);
                const downloadElement = document.createElement('a');
                downloadElement.href = href;
                downloadElement.download = _this.imgName
                document.body.appendChild(downloadElement);
                downloadElement.click();
                document.body.removeChild(downloadElement);
                window.URL.revokeObjectURL(href);
            }, 'image/jpeg')
        },
    }
}
</script>