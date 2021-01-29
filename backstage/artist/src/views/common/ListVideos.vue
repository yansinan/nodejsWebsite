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

        <el-form :model="listObjURL" ref="formUpdate" status-icon inline-message="true" label-width="0px" @validate="eValidate">
            <el-form-item
                v-for="(domain, index) in listObjURL"
                :key="domain.idURL"
                :prop="'['+index+'].link'"
                :rules="{
                required: true, type: 'url', message: '请输入有效链接', trigger: 'blur'
                }"
                :error="strErrorUpdate"
            >
            <span v-if="domain.name" style="">{{domain.name}}</span>
              <el-input v-model="domain.link" @input="eChangeURL({index,objLink:domain})">
                  <template slot="prepend" >
                    <el-image :src="domain.urlImg" :fit="contain" style="width:132px"/>
                  </template>
                  <el-button slot="append" icon="el-icon-delete" @click.prevent="removeDomain(domain)"/>
              </el-input>
            </el-form-item>  
        </el-form>
        <el-form :model="objToAdd" ref="formAdd" status-icon label-width="0px" @validate="eValidate">
            <el-form-item
                inline-message="true"
                :key="'add'"
                :prop="link"
                :rules="{
                required: true, type: 'url', message: '请输入有效链接', trigger: 'blur'
                }"
                :error="strErrorAdd"
            >
              <el-input v-model="objToAdd.link" @input="eAddURL">
                  <template slot="prepend" style=""><span style="width:32px;text-align:center;" >其他</span></template>
              </el-input>
            </el-form-item>     
        </el-form>
        
        <span slot="footer" class="dialog-footer">
            <el-button v-if="dialogState.formData.idNCM" type="warning" @click="eBnSyncNCM">同步网易云音乐</el-button>
            <el-button type="success" @click="submitUpload">保 存</el-button>
            <el-button @click="handleClose">取 消</el-button>
        </span>
    </el-dialog>

  </div>
</template>

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
        eBnSyncNCM(e){
          let that=this;
          fetch("/api/artist/fetchNCMMV?id="+this.dialogState.formData._id)
          .then((data)=>data.text())
          .then((data)=> {
              // 在这个then里面我们能拿到最终的数据
              let res=JSON.parse(data);
              if(res.status==200 && res.data.length>0){
                that.$message({
                  message: "找到网易云音乐MV信息，自动填充",
                  type: "success"
                });
                
                //去重 & 合并
                // let list=res.data.concat(that.listObjURL);
                // list=[...new Set(list)];
                // that.listObjURL.splice(0,that.listObjURL.length,...list);
                let msg="剔除重复MV：";
                let listNew=res.data.filter(vNew=>{
                  let isOld= (that.listObjURL.find(vOld=>(vNew.idNCM==vOld.idNCM)));
                  if(isOld)msg+=vNew.name+","
                  return !isOld;
                })
                that.listObjURL.unshift(...listNew);
                if(listNew.length<res.data.length)that.$message({
                  message: msg,
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
              // console.log(res.songs[0].name);
              
          })

        },
        // 弹窗打开时
        eDialogOpen(e){
   
        },
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
        if(objLink.link.indexOf("music.163.com")!=-1){

        }else{

        }
        return objLink;
      },
      eChangeURL(e){
        let {index,objLink}=e;
        // console.log("更新链接：",e);
        // 处理http
        // if((objLink.link.toLowerCase()).indexOf("http://")==0){
        //   objLink.urlHead="Http://";
        //   objLink.link=(objLink.link.toLowerCase()).split("http://")[1];
        // }
        // if((objLink.link.toLowerCase()).indexOf("https://")==0){
        //   objLink.urlHead="Https://";
        //   objLink.link=(objLink.link.toLowerCase()).split("https://")[1];
        // }        
        this.getURLData(objLink,"formUpdate");

      },
      eAddURL(link){
        this.objToAdd.link=link;

        this.getURLData(this.objToAdd,"formAdd");
        // 验证表单
        this.$refs["formAdd"].validate((valid) => {
          if (valid) {
            this.listObjURL.push(this.objToAdd);
            this.objToAdd=Object.assign({},objURLDefault);
            // console.log("增加链接：",this.objToAdd);
            if(this.listObjURL)this.$emit('list-changed',this.listObjURL);
            
          } else {
            // console.log('新增链接表单验证失败');
            this.$message.error(
              this.$t("validate.inputCorrect", { label: this.label })
            );
            return false;
          }
        });

      },
      eValidate(prop,res){
        // console.debug("链接验证结果：this.listObjURL",prop,res);//表单项 prop 值，校验是否通过
        debugger
        if(res){
          // 如果是新增验证通过
          // if(prop=="link"){
          //   this.listObjURL.push(this.objToAdd);
          //   this.objToAdd=Object.assign({},objURLDefault);
          // }
          this.$emit('list-changed',this.listObjURL);
        }else {
            // console.error('新增链接表单验证失败',this.listObjURL[prop],prop,res);
            this.$message.error(
              this.$t("validate.inputCorrect", { label: this.label })
            );
            this.$emit('list-changed',false);
            return false;
        }
      }
    }
  }
</script>