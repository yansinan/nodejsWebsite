<template>
<el-form-item :label="头像" prop="sImg">    
    <div class="cropper" style="width: 750px; height: 500px; margin: 20px; border: dashed #cacaca 1px; text-align: center;">
        <img :src="src" style="max-width: 100%" ref="img">
        <input type="file" @change="uploadImg" />
    </div>
    <div class="cropperPreview" style="">
        <div :src="src" class="avatar avatar-32" style="overflow:hidden;display: inline-block;"></div>
        <div :src="src" class="avatar avatar-64" style="overflow:hidden;display: inline-block;" ></div>
        <div :src="src" class="avatar avatar-96" style="overflow:hidden;display: inline-block;" ></div>
        <div @click="uploadCropImg">上传</div>
    </div>

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
      src: {
          type:String,
          default:"",
      },
    },
    watch: {
        src(newV,oldV) {
            // do something
            console.log(newV,oldV);
            this.cropper.replace(newV);
        } 
    },
    data () {
        return {
            cropperImg: '',
            cropper: '',
            imgName: ''
        }
    },
    mounted () {
        this.initCropper()
    },
    methods: {
        initCropper () {
            this.cropper = new Cropper(this.$refs.img, {
                viewMode: 1,
                aspectRatio: 16/9,
                dragMode:"move",
                aspectRatio:1,
                preview:".avatar"
            });
        },
        uploadImg (event) {
            const img = event.target.files[0]
            this.src = URL.createObjectURL(img);
            this.imgName = img.name;
        },
        uploadCropImg () {
            const _this = this;
            this.cropper.getCroppedCanvas().toBlob(async function(blob) {
                const params = new FormData()
                params.append('upload_file', blob, _this.imgName)

                let uploadFileRequest = new Request(`/api/dr/uploadFiles`, {
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
                    }
                })
            }, 'image/jpeg')
        },
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