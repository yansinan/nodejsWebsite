<template>
  <div style="text-align: left;">
    <el-tooltip content="输入公众号文章链接" placement="top" effect="light">
        <el-input size="small" v-model="strURLWX" ref="inputURL" @change="eInputURL" v-loading="isLoading">
            <span slot="prepend">https://</span>
            <el-button  slot="append" type="success" plain icon="el-icon-cloudy" @click.prevent="eInputURL">读 取</el-button>
        </el-input>
    </el-tooltip>
    <div v-if="strErrMsg" class="el-upload__tip">{{strErrMsg}}</div>
    <el-dialog
        :xs="20"
        title="读取结果"
        width="80%"
        top="5vh"
        :close-on-click-modal="true"
        :visible.sync="isDialog"
        :before-close="handleClose">
        <div slot="title" class="el-dialog__title">
            <h2>{{objRes.title}}</h2><em> {{objRes.date}} </em>
        </div>
        <div v-html="objRes.comments" class="article">
        </div>
        <el-divider content-position="left">请选择主形象图</el-divider>

        <div class="groupSelectorImg" style="">
            <div v-for="(src,idx) in listSrcImgWX" :key="idx" class="selectorImg" :class="objRes.sImg==src?'selected':''" @click="eClickSImg" :data-src="src">
                <el-tooltip effect="dark" :content="objRes.sImg==src?'作为主图':''" :value="objRes.sImg==src" placement="top" manual>
                    <img :src="objRes.listSrcImg[idx]" class="imgSelectSImg" fit="cover" @load="eImgLoaded"/>
                </el-tooltip>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="success" @click="submitUpload">使 用</el-button>
        </span>
    </el-dialog>

  </div>
</template>
<style scoped>
.article{
    max-height: 50vh;
    overflow-y: scroll;
    /* overflow: auto; */
    overflow-x: hidden;
    border: 1px dashed #909399;
    border-radius: 0.5em;
    padding: 10px 20px;
    margin-bottom:60px;
}
.el-upload__tip{
    color:#F56C6C;
}
.el-divider__text{
    color:#67C23A;
}
.groupSelectorImg{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 20px;
    border: 1px dashed #909399;
    border-radius: 0.5em;
    padding: 20px 10px;
}
.selectorImg{
    display: flex;
    padding:10px;
    border:1px dashed #909399;
    width:120px;
    height:120px;
    margin:5px 5px;
    border-radius: 0.25em;
}
.selectorImg.selected{
    border:2px solid #409EFF;
}
.selectorImg .imgSelectSImg{
    width:100px;
    height:100px;
}
</style>

<script>
  import { imgFit } from "@root/publicMethods/imgFit";
export default {
    props: {
        value:{
            type:Object,
            default:{}
        },
    },
    data() {
        return {
            strURLWX:"",
            objRes:{sImg:"",title:"",date:"",comments:""},
            objResDefault:{sImg:"",title:"",date:"",comments:""},
            isDialog:false,
            isLoading:false,
            listSrcImgWX:[],//用于存放图片的微信原始链接
        };
    },
    computed: {
        // isDialog:function(){
        //     return this.objRes.title && this.objRes.comments;
        // }
    },
    components: {
    },
    methods: {
        // 选择主图
        eClickSImg(e){
            this.$set(this.objRes,"sImg",e.currentTarget.attributes["data-src"].value);
        },
        // 链接错误的处理
        errURL(strMsg){
            let that=this;    
            that.strErrMsg=strMsg;
            that.isLoading=false;            
            if(!strMsg)return;//清空提示信息;
            console.error(strMsg)
            that.$message.error(that.strErrMsg);
        },
        // 输入链接文本框
        eInputURL(){
            let that=this;
            let url=that.$refs.inputURL.value;
            if(!url){
                that.errURL("");
                return
            }
            let strSearch= url.split("mp.weixin.qq.com/s?")[1];
            // 拆分链接
            if(!strSearch)that.errURL("文章地址不正确");
            else{
                that.isLoading=true;
                // debugger
                // Fetch会返回Promise 所以我们可以使用then 拿到请求成功的结果
                fetch("/api/content/fetchWX?"+strSearch)
                .then((data)=>data.text())
                .then(resJson=> {
                    // 在这个then里面我们能拿到最终的数据
                    that.isLoading=false;         
                    // debugger
                    let res=JSON.parse(resJson) || {};
                    if( res && res.status==200 && res.data && res.data.title && res.data.comments){
                        that.$message({
                            message: "找到公帐号文章，自动填充："+res.data.title,
                            type: "success"
                        });
                        Object.assign(that.objRes,res.data);
                        that.objRes.name=that.objRes.name || that.objRes.title;
                        // 副标题默认用主标题，便于编辑
                        that.objRes.alias=res.data.name || res.data.title;
                        that.objRes.stitle=that.objRes.alias;
                        that.objRes.discription=res.data.name || res.data.title;
                        // 先缓存下面要canvas的图
                        // that.$set(that.objRes,"comments","");
                        that.listSrcImgWX=res.data.listSrcImg;
                        that.objRes.listSrcImg=res.data.listSrcImg.map(src=>{
                            return src.replace("https://mmbiz.qpic.cn","/getWXImg");//http://wx.z-core.cn:8791/
                        })
                        // 默认选择第一张图做sImg
                        that.$set(that.objRes,"sImg",that.objRes.listSrcImg[0]);

                        that.isDialog=true;
                    }else{
                        // 返回无效的处理：红色input提示
                        // "message":"puppeteer服务:无数据;status==500
                        // if(res.message=="puppeteer服务:无数据")
                        that.errURL(res.message)
                    }
                    // console.log(res.songs[0].name);         
                }).catch(e=>{
                    debugger
                    // reject(e)
                    that.errURL(e.message)
                    
                })
            }
        },
        // 更新到服务器
        submitUpload(){
            let that=this;
            Object.assign(this.value,this.objRes);
            //触发
            if(this.value && this.value.title && this.value.comments) this.$emit('input',this.value);
            //关闭
            this.handleClose();
        },
        // 弹窗关闭
        handleClose(e){
            this.isLoading=false;
            this.strErrMsg="";
            // 清空数据
            // this.objRes={};
            Object.assign(this.objRes,this.objResDefault);
            this.isDialog=false;
        },
        // 图片读取完成，开始裁切、缩小
        eImgLoaded(e){
            let that=this;

            let img=e.target;
            img.removeEventListener("load",that.eImgLoaded);
            let targetWidth=img.naturalWidth;
            let targetHeight=img.naturalHeight;
            let typeSrc=img.src.substring(0,7);
            if(typeSrc.indexOf("blob")!=-1)return;
            let time=new Date();
            let srcOrg=img.src;
            img.type='image/jpeg';
            // return;
            // img.crossOrigin = "Anonymous";
            imgFit(img,targetWidth,targetHeight).then(resSrc=>{
                img.srcOrg=img.src;
                img.crossOrigin=undefined;
                img.src=resSrc.src;
                img.blob=resSrc.blob;
                // objToChange.blob=resSrc.blob;
                // objToChange.isFitted=true;
                // img.src= resSrc;
                // debugger;
                console.log("图片裁切完成",img.src,(new Date()-time),typeSrc)
            });//网易云MV图尺寸628,353
            
        },
        // eImgErr(e){
        //     let that=this;
        //     let img=e.target;
        //     let src=img.src;
        //     // img.crossorigin=undefine;
        //     // img.src=img.src+"&nocrossorigin";
        // },    
    }
}
</script>