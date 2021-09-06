<template>
  <el-form-item class="" label="" :prop="prop">
      <el-card :body-style="{ padding: '0px' }" shadow="always">
        <div slot="header" class="clearfix">
          <!-- <span class="el-upload__tip">只能上传jpg/png文件，上传前自动裁切</span> -->
          <el-button @click="eClickOpenImg" type="primary" plain style="width:100%;">上传<i class="el-icon-upload el-icon--right"></i></el-button>
          <input v-show="false" type="file" multiple="" accept="image/png,image/gif,image/jpeg" @change="uploadImg" ref="inputFile"/>
        </div>
        <el-tooltip content="只能上传jpg/png文件，上传前自动裁切" placement="top" effect="light">
          <img v-if="srcPreview" :src="srcPreview" class="imgResult" style="" ref="imgPreview"/>
        </el-tooltip>

      </el-card>
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
            <div :src="src" class="avatar avatar-128" style="overflow:hidden;display: inline-block;" ></div>
            像素尺寸128px*128px
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
<style>

.avatar {
  position: relative;
  /* display: inline-block; */
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

.avatar-32 {
  max-height: 32px;
  width: 32px;
  height: 100%;
  font-size: 21px;
  line-height: 32px;
}

.avatar-64 {
  max-height: 64px;
  width: 64px;
  height: 100%;
  font-size: 43px;
  line-height: 64px;
}

.avatar-128 {
  max-height: 128px;
  width: 128px;
  height: 100%;
  font-size: 85px;
  line-height: 128px;
}

img{
  object-fit:contain;
}
.imgResult{
  position:relative;
  /* z-index:-1; */
  /* max-height:none; */
  height:auto;
  /* border-radius:4px;  */
  /* border: dashed #cacaca 1px; */
  /* padding:4px; */
  /* margin-top: 7px; */
  /* width:200px; */
  width:100%;
  max-height:100%;
}
.bnUpload{
  font-size:20px;
  color:#cacaca;
  width:200px;
  height:200px;
  display:flex;
  justify-content: center;
  align-items: center;
  line-height: 36px;
}
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
      subPath:{
        type:String,
        default:""
      },
      aspectRatio:{
        type:Number,
        default:1,
      },
      api:{
        type:String,
        default:"/manage/dr/uploadFiles",
      },
      prop:{
        type:String,
        default:"sImg"
      },
      label:{
        type:String,
        default:"主图"
      },
      value: {
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
        // 如果srcPreview是网络地址（网易地址），下载并上传;
        srcPreview(newV,oldV){
          // TODO分析非本域名下
          if(newV.indexOf("music.126.net")!=-1 || newV.indexOf("mp.weixin.qq.com")!=-1 || newV.indexOf("mmbiz.qpic.cn")!=-1){
            // 网易获取的图片
            this.fetchImgURL(newV,"");
          }
        }
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
    computed: {
      // 主要列表
      srcPreview: function () {  return this.value; }
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
                aspectRatio:this.aspectRatio,
                preview:".avatar"
            });
        },
        // 浏览
        eClickOpenImg() {
          this.$refs.inputFile.click();
        },
        // 文件加载，有效性检验，开启Cropper
        //blobImg= {  blob类型
        //   type:"image/jpeg",
        //   size:xxxx,
        //   name:"xxxx.jpeg",
        // }
        checkBlob(blobImg){
          let that=this;
          //外部验证数据有效性
          let resIfDialog=(typeof this["beforeCrop"] === "function")?this["beforeCrop"](blobImg):false;
          
          if(resIfDialog){
            // 显示对话框
            // this.dialogVisible=true;
            that.src = URL.createObjectURL(blobImg);
            that.imgName = blobImg.name || "unknow."+blobImg.type.split("/")[1];
          }else{
            that.handleClose.call(that);
          }
        },
        // 获取网络图片，相当于浏览网络文件;
        async fetchImgURL(url,name){
          let that=this;
          let image = new Image()
          image.setAttribute('crossOrigin', 'anonymous')
          image.src = url
          image.onload = () => {
            let canvas = document.createElement('canvas')
            canvas.width = image.width
            canvas.height = image.height
            let ctx = canvas.getContext('2d')
            ctx.drawImage(image, 0, 0, image.width, image.height)
            // canvas.toBlob(that.uploadBlob);
            // 这里缺少验证数据有效性
            canvas.toBlob(blob=>that.checkBlob(blob));
          }          
        },
        // 浏览文件
        uploadImg (event) {
          let that=this;
          const img = event.target.files[0]
          that.checkBlob(img);
        },
        // 上传blob到后台
        async uploadBlob(blob){
          let _this=this;
          const params = new FormData()
          // 路径相关:
          params.append("nameMod",_this.nameMod);
          params.append("subPath",_this.subPath);
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
                // if(typeof _this["onSuccess"] === "function")_this["onSuccess"](objData)
                if(_this.src)_this.$emit("input",_this.src);
                _this.handleClose.call(_this);
              }
          }).catch(e=>{
            debugger
          })
        },
        // 裁切后上传
        uploadCropImg () {
            const that = this;
            this.cropper.getCroppedCanvas(this.cropSetting).toBlob(that.uploadBlob, 'image/jpeg',1)
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