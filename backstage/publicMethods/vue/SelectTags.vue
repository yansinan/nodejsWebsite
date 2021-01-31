<template>
<el-form-item :label="label" prop="listIds">
    <el-select
        size="medium"
        v-model="listIds"
        multiple
        filterable
        allow-create
        default-first-option
        remote
        :remote-method="findTags"
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
    // 有add事件，delete事件，change事件；TODO：loading事件
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
        listIds:{
          type:Array,
          default:[],
        },//
        apiFind:{
            type:String,
            default:'/manage/contentTag/getList',
        },//默认用Tags
        apiAdd:{
            type:String,
            default:'/manage/contentTag/addOne',
        },//默认用Tags
        initTag:{
            type:Function,
            default:function(v){
                return {
                    name:v,
                    comments:"即时创建",
                    alias:v,
                }
            }
        }//默认用Tags
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
      };
    },
    watch: {
        listIds(newV,oldV) {
            newV=newV || [];
            oldV=oldV || [];
            let that=this;
            let listIdDiff = (newV).concat(oldV).filter(v=>(oldV.indexOf(v)===-1 || newV .indexOf(v)===-1))
            let isChange=listIdDiff.length>0;
            let isAdd=isChange && newV.length>oldV.length;

            // 是否触发事件给外部
            let isReadyEmit=true;
            let listObjDiff=listIdDiff.map(id=>{
                
                let findOldTag=that.listAllTags.find(tag=>(tag._id==id));
                // 手动添加了一个string ,或者删除一个未能更新的 string
                if(!findOldTag){
                    // debugger
                    // 删除一个未能更新的 string，赶紧删了
                    if(!isAdd)return false;
                    else isReadyEmit=false;
                };
                return findOldTag;
            })
            listObjDiff=listObjDiff.filter(v=>(v));
            if(isChange && isReadyEmit){
                //关键词里同步，触发更新事件，比如用于：通知同步关键字
                if(isAdd)this.$emit('add',{listObjDiff:listObjDiff,listIds:newV});
                if(!isAdd)this.$emit('delete',{listObjDiff:listObjDiff,listIds:newV});
                this.$emit('change',{
                    listObjDiff:listObjDiff,
                    listIds:newV,
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
            //检查 是否有没在列表里的值e=[idTag1,idTag2...text]
            this.listIds.forEach((v,idx,arr) => {        
                // console.log("添加标签e,v,tags:",e,v,that.listIds);
                if(!v){
                    that.$message.error("标签undefined：",v);
                    return;
                }
                let tagFound=that.listAllTags.find(tag=>(tag._id==v));
                let isTagFound = tagFound?true:false;
                if(!isTagFound){
                    //添加contentTag标签
                    that.addTag(that.initTag(v));
                }else{
                    // 添加到标签;
                    if(v && v!="")that.listIds.push(tagFound._id);
                    that.listIds = [...(new Set(that.listIds))];
                }
            });            
        },
        // 添加新tag
        addTag(objTag){
            let that=this;
            //loading停止操作
            that.loadingTag=true;
            request({
                url: that.apiAdd,
                data:objTag,
                method: 'post'
            }).then(result => {
                console.log("添加标签返回的result:",result);
                if (result.status === 200 && result.data._id) {
                    //更新tag检索资源
                    // that.findTags();
                    if(result.data)that.listAllTags.unshift(result.data);
                    //替换文字为idTag//可以在返回结果中获得result.data._id{}
                    let idx=that.listIds.indexOf(objTag.name);
                    if(idx!=-1)that.listIds[idx]=result.data._id;//确认找到则替换string为_id
                    else that.listIds=that.clearListIdTags();//没找到，奇怪的问题，先清空不在tag库的字符

                    // //关键词里同步，触发更新事件，比如用于：通知同步关键字
                    this.$emit('change',{
                        listObjDiff:[result.data],
                        listIds:that.listIds,
                        strAction:"add",
                    });
                    that.$message({
                        message: that.$t("main.addSuccess"),
                        type: "success"
                    });
                } else {
                    that.$message.error("添加标签错误："+result.message,objTag);
                }
            }).catch(error=>{
                debugger;
                that.$message.error("添加标签错误："+error,objTag);
                console.error("SlectTags添加标签erro:",error,objTag)
            }).finally(()=>{
                //恢复操作
                that.loadingTag=false;
            })
        },
        // 刷新标签库,query=false全部，否则按string搜索
        findTags(strToSearch=false){
            let that=this;
            this.userLoading = true;
            request({
                url: that.apiFind,
                params: { pageSize: 0,isPaging:"0",searchkey: strToSearch?strToSearch:null, },
                method: 'get'
            }).then(res=>{
                if(res.status==200){
                    let resList=res.data.docs || res.data || [];//isPaging==0 时返回res.data=listAll
                    if(resList.length>0){
                        // 去重合并
                        that.listAllTags=[...new Set(that.listAllTags.concat(resList))];
                    }else if(strToSearch && resList.length==0){//检索，但是没找到数据，则认为是输入一半，或者没找到，不用处理。等用户进一步操作

                    }
                }else{//连接错误
                    debugger;
                    that.$message.error("检索标签错误：status="+res.status,res);
                    console.error("SlectTags检索标签库erro:",res);
                } 
            }).catch(e=>{
                debugger;
                console.error("SlectTags检索标签库erro:",e)
            }).finally(()=>{
                this.userLoading = false;
            });
        },

        // 强制清理未能找到的string
        clearListIdTags(){
            //检查 是否有没在列表里的值e=[idTag1,idTag2...text]
            return this.listIds.filter((v,idx,arr) => { 
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
        this.findTags();
    },
  }
</script>