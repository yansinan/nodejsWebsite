<template>
<el-form-item :label="label" prop="listIdTags">
    <el-select
        size="medium"
        v-model="listIdTags"
        multiple
        filterable
        allow-create
        :loading="userLoading"
        :placeholder="$t('validate.selectNull', {label: this.label})"
        @change="eChangeTags"
    >
        <el-option
        v-for="item in listAllTags"
        :key="item._id"
        :label="item.name"
        :value="item._id"
        ></el-option>
    </el-select>
</el-form-item> 
</template>

<script>
    import request from '@root/publicMethods/request';
    // 有add事件
  export default {
    props: {
        nameMod:{
          type:String,
          default:"rubyeyes"
        },
        label: {
            type:String,
            default:"标签",
        },
        // formData.tags,id数组
        listIdTags:{
          type:Array,
          default:[],
        },
        // // 所有tags列表
        // listAllTags:{
        //   type:Array,
        //   default:[],
        // },
    },
    data() {
      return {
        userLoading:false,
        listAllTags:[],
        // listIdTagsLast:[],
      };
    },
    watch: {
        listIdTags(newV,oldV) {
            newV=newV || [];
            oldV=oldV || [];
            let listIdDiff = (newV).concat(oldV).filter(v=>(oldV.indexOf(v)===-1 || newV .indexOf(v)===-1))
            let isChange=listIdDiff.length>0;
            let isAdd=isChange && newV.length>oldV.length;

            // 是否触发事件给外部
            let isReadyEmit=true;

            let listObjDiff=listIdDiff.map(id=>{
                let findOldTag=this.listAllTags.find(tag=>(tag._id==id));
                // 手动添加了一个string ,或者删除一个未能更新的 string
                if(!findOldTag){
                    debugger
                    // 删除一个未能更新的 string，赶紧删了
                    if(!isAdd)return false;
                    else isReadyEmit=false;
                };
                return findOldTag;
            })
            listObjDiff=listObjDiff.filter(v=>(v));
            if(isChange && isReadyEmit){
                //关键词里同步，触发更新事件，比如用于：通知同步关键字
                if(isAdd)this.$emit('add',{listTagDiff:listObjDiff,listIdTags:newV});
                if(!isAdd)this.$emit('delete',{listTagDiff:listObjDiff,listIdTags:newV});
                this.$emit('change',{
                    listTagDiff:listObjDiff,
                    listIdTags:newV,
                    strAction:(isAdd?"add":"delete")
                });
            }

        },
    },
    computed: {

    },
    methods: {
        //标签变化e=[id0,id1]当前选中 or string created
        eChangeTags(e){
            let that=this;
            // 如果是删除的情况
            // let isAdd=this.listIdTags.find(v=>(v==e));
            // if(!isAdd){
            //     that.$emit('delete',e);
            //     that.$emit('change',that.listIdTags);
            //     debugger;
            // }
            //检查 是否有没在列表里的值e=[idTag1,idTag2...text]
            this.listIdTags.forEach((v,idx,arr) => {        
                console.log("添加标签e,v,tags:",e,v,that.listIdTags);
                if(!v){
                    that.$message.error("标签undefined：",v);
                    return;
                }
                let tagFound=that.listAllTags.find(tag=>(tag._id==v));
                let isTagFound = tagFound?true:false;
                if(!isTagFound){
                    //loading停止操作
                    that.loadingTag=true;
                    //创建标签 // 新增
                    let formDataTag={
                        name:v,
                        comments:"即时创建",
                        alias:v,
                    }
                    //添加contentTag标签
                    that.addTag(formDataTag);               
                }else{
                    // // 保存上一次操作，用于判断取消选择;
                    // listIdTagsLast=that.listIdTags.map(v=>(v));
                    // 添加到标签;
                    if(v && v!="")that.listIdTags.push(tagFound._id);
                    that.listIdTags = [...(new Set(that.listIdTags))];
                }
            });            
        },
        // 添加新tag
        addTag(objTag){
            let that=this;
            request({
                url: '/manage/contentTag/addOne',
                data:objTag,
                method: 'post'
            }).then(result => {
                console.log("添加标签返回的result:",result);
                if (result.status === 200 && result.data._id) {
                    //更新tag检索资源
                    that.getAllTags();

                    //替换文字为idTag//可以在返回结果中获得result.data._id{}
                    let idx=that.listIdTags.indexOf(objTag.name);
                    debugger
                    if(idx!=-1)that.listIdTags[idx]=result.data._id;
                    else that.listIdTags=that.clearListIdTags();
                    // //关键词里同步，触发更新事件，比如用于：通知同步关键字
                    // that.$emit('add',result.data);
                    // that.$emit('change',that.listIdTags);

                    that.$message({
                        message: that.$t("main.addSuccess"),
                        type: "success"
                    });
                } else {
                    that.$message.error("添加标签错误："+result.message,objTag);
                }
                //恢复操作
                that.loadingTag=false;
            }).catch(error=>{
                debugger;
                that.$message.error("添加标签错误："+error,objTag);
                console.error("SlectTags addTag erro:",error,objTag)
            })
        },
        // 刷新标签库
        getAllTags(){
            let that=this;
            request({
                url: '/manage/contentTag/getList',
                params: { pageSize: 2000 },
                method: 'get'
            }).then(res=>{
                that.listAllTags=res.data.docs;
            }).catch(e=>{
                debugger;
                console.error("SlectTags addTag erro:",e)
            });
        },
        // 强制清理未能找到的string
        clearListIdTags(){
            //检查 是否有没在列表里的值e=[idTag1,idTag2...text]
            return this.listIdTags.filter((v,idx,arr) => { 
                let tagFound=this.listAllTags.find(tag=>(tag._id==v));
                let isTagFound = tagFound?true:false;
                if(!isTagFound){
                    
                }else{

                }
                return isTagFound;
            });
        }
    },
    mounted() {
        // 获取全部标签
        this.getAllTags();
    },
  }
</script>