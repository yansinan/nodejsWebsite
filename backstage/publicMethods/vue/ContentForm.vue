<template>
  <div :class="classObj" class="dr-contentForm">
    <div class="main-container">
      <el-form
        :model="formState.formData"
        :rules="rules"
        ref="ruleForm"
        label-width="auto"
        class="demo-ruleForm"
        size="medium"
        :label-position="device == 'mobile' ? 'top' : 'top'"
      >
        <slot name="top"></slot> 
        <!-- 标题&缩略图 -->
        <el-row :gutter="40" type="flex" justify="space-between" style="flex-wrap: wrap;">
          <el-col :lg="12" :xl="14">
            <!-- 大标题 -->
            <slot name="leftTop">
              <el-form-item prop="name">
                <el-input v-model="formState.formData.name" maxlength="50" show-word-limit><template slot="suffix" style="color:red;">{{$t(nameMod + '.name')}}</template><!-- <label slot="suffix" class="el-form-item__label">{{$t(nameMod + '.name')}}</label> --></el-input>
              </el-form-item>
            </slot>
            <!-- 副标题 -->
            <el-form-item prop="alias">
              <el-autocomplete 
                v-model="formState.formData.alias" 
                maxlength="50" 
                show-word-limit 
                :placeholder="getPinYin(formState.formData.name)" 
                :fetch-suggestions="suggestAlias"
                ><template slot="suffix">{{$t(nameMod + '.nameAlias')}}</template>
              </el-autocomplete>
            </el-form-item>

            <slot name="leftMiddle"></slot>
            <!-- 作者 -->
            <SelectIds v-if="nameMod!='artist'" ref="selectArtists" :label="$t(nameMod+'.listArtists')" :allow-create="false" @change="eChangeArtist" :listIds="formState.formData.listRefs" :nameMode="nameMod" :apiAdd="false" apiFind="/manage/artist/getList" :initTag="false"/>

            <!-- 标签 -->
            <SelectIds :label="this.$t(nameMod+'.tags')" @change="eChangeTag" @loaded="eLoadedAllTags" :listIds="formState.formData.tags" :nameMode="nameMod" :initTag="createTag" />

            <el-form-item prop="discription">
              <el-input type="textarea" v-model="formState.formData.discription" maxlength="300" show-word-limit :autosize="{minRows: 10, maxRows: 18 }"></el-input>
              <div class="el-select-suffix el-input--small el-input__suffix"><span class=" el-input__suffix-inner">{{$t('contents.discription')}}</span></div>
            </el-form-item>

            <slot name="leftBottom"></slot>
          </el-col> 
          <el-col :lg="12" :xl="10">
            <Cropper 
            :nameMod="nameMod"
            :subPath="formState.formData._id || ''"
            :aspectRatio="aspectRatio"
            v-model="formState.formData.sImg" 
            :label="$t('contents.sImg')" 
            prop="sImg"></Cropper>
          </el-col> 
        </el-row>
        <!-- 详情 -->
        <el-form-item :label="$t('contents.comments')" prop="comments">
          <!-- <Ueditor @ready="editorReady" ref="ueditor"></Ueditor> -->
          <vue-ueditor-wrap
            class="editorForm"
            @ready="editorReady"
            v-model="formState.formData.comments"
            :config="editorConfig"
          ></vue-ueditor-wrap>
        </el-form-item>

        <el-row :gutter="40" type="flex" justify="space-between" style="flex-wrap: wrap;">
          <el-col :lg="18" style="min-width: min-content;">
            <!-- 关键词 -->
            <el-form-item label="" prop="keywords">
              <el-input v-model="formState.formData.keywords"><template slot="suffix">关键字</template></el-input>
            </el-form-item>
          </el-col> 
          <el-col style="min-width: min-content;max-width:max-content;text-align: right;">
            <!-- 日期 :label="$t('contents.date')" -->
            <el-form-item prop="date">
              <el-date-picker
                v-model="formState.formData.date"
                type="date"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                :placeholder="$t('contents.date')" >
              </el-date-picker>
              <div class="el-select-suffix el-input--small el-input__suffix"><span class=" el-input__suffix-inner">{{$t('contents.date')}}</span></div>

            </el-form-item>
          </el-col> 
        </el-row>

        <slot name="footer"></slot>

        <el-row :gutter="40" type="flex" justify="space-between" style="flex-wrap: wrap;">
          <el-col :lg="18" style="min-width: min-content;">
            <!-- <el-radio-group v-model="formState.formData.state">
              <el-radio border
                v-for="item in contentState"
                :key="'kw2_'+item.value"
                :label="item.value"
                :value="item.value">{{item.label}}</el-radio>
            </el-radio-group> -->
            <!-- 
            <el-form-item :label="$t('contents.enable')" prop="state">
              <el-select v-model="formState.formData.state" placeholder="审核文章">
                <el-option
                  v-for="item in contentState"
                  :key="'kw_'+item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="formState.formData.state == '3'" label="驳回原因" prop="dismissReason">
              <el-input v-model="formState.formData.dismissReason"></el-input>
            </el-form-item>
             -->
          </el-col> 
          <el-col style="min-width: min-content;max-width:max-content;text-align: right;">

          </el-col> 
        </el-row>
            <!-- 保存返回 -->
            <el-form-item class="" style="text-align:right;"><!-- dr-submitContent -->
              <el-button size="medium" @click="backToList">{{$t('main.back')}}</el-button>
              <el-button size="medium" type="info" plain @click="submitForm('ruleForm','0')">撤回</el-button>
              <!-- <el-button size="medium" type="primary" @click="submitForm('ruleForm','1')">{{formState.edit ? $t('main.form_btnText_update') : $t('main.form_btnText_save')}}</el-button> -->
              <el-button size="medium" type="primary" @click="submitForm('ruleForm','1')">存草稿</el-button>
              <el-button size="medium" type="success" @click="submitForm('ruleForm','2')">发布</el-button>
            </el-form-item>
      </el-form>

    </div>
  </div>

</template>
<style lang="scss">
    .el-select{
      width:100%;
    }
</style>
<style lang="scss">
@import "@root/publicMethods/sass/contentForm.scss";
</style>
<script>
  import { initEvent } from "@root/publicMethods/events";

  import {methods,initData,components,data,props,computed} from "@root/publicMethods/vue/contentForm";

  import _ from "lodash";
  // 别名的拼音
  import {getPinYin} from "@root/publicMethods/modPinYin";
    // v-model nameMod
  export default {
    props: {
        value:{
            type:Object,
            default:{}
        },
        nameMod:{
            type:String,
            default:"contents",
        },
        // sImg比例:
        aspectRatio:{
          type:Number,
          default:1,
        },
    },
    data() {
      return {
        ...data,
        editorConfig: {
            // 编辑器不自动被内容撑高
            autoHeightEnabled: true,
            scaleEnabled:true, //是否可以拉伸长高，默认true(当开启时，自动长高失效)
            minFrameHeight:300,
            // 初始容器高度
            initialFrameHeight: 500,
            // 初始容器宽度
            initialFrameWidth: "100%",
            // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
            serverUrl: "/api/upload/ueditor",
            // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
            UEDITOR_HOME_URL: this.$root.staticRootPath + "/plugins/ueditor/"
        },
        rules: {
            sImg: [
            {
                required: true,
                message: this.$t("validate.selectNull", {
                label: "缩略图"
                }),
                trigger: "blur"
            }
            ],
            name: [
            {
                required: true,
                message: this.$t("validate.inputNull", {
                label: this.$t("contents.name")
                }),
                trigger: "blur"
            },
            {
                min: 1,
                max: 50,
                message: this.$t("validate.rangelength", { min: 1, max: 50 }),
                trigger: "blur"
            }
            ],
            tags: [
            {
                validator: (rule, value, callback) => {
                if (_.isEmpty(value)) {
                    callback(
                    new Error(
                        this.$t("validate.selectNull", {
                        label: this.$t("contents.tags")
                        })
                    )
                    );
                } else {
                    callback();
                }
                },
                trigger: "change"
            }
            ],
            discription: [
            {
                required: true,
                message: this.$t("validate.inputNull", {
                label: this.$t("contents.discription")
                }),
                trigger: "blur"
            },
            {
                min: 5,
                max: 300,
                message: this.$t("validate.rangelength", { min: 5, max: 100 }),
                trigger: "blur"
            }
            ],
            comments: [
            {
                required: true,
                message: this.$t("validate.inputNull", {
                label: this.$t("contents.comments")
                }),
                trigger: "blur"
            },
            {
                min: 5,
                message: this.$t("validate.rangelength", { min: 5, max: 100000 }),
                trigger: "blur"
            }
            ],
        }
      };
    },
    components: {
        ...components,
        // VueUeditorWrap,
        // ListURL: () => import('@root/publicMethods/vue/ListURL.vue'),
        // LinkWX: () => import('@root/publicMethods/vue/LinkWX.vue'),//抓公众号文章
        // Cropper: () => import('@root/publicMethods/vue/Cropper.vue'),
        // SelectIds: () => import('@root/publicMethods/vue/SelectIds.vue'),
    },
    watch: {
        formState(nV,oV){            
            let that=this;
            Object.assign(this.value,nV);
            //触发
            if(this.value && this.value.formData) this.$emit('input',this.value);
            
        },
        //"formState.formData.name"(nV,oV){
        //    // 别名为空，自动填充拼音
        //    // if(this.formState.formData.alias=="")this.formState.formData.alias=getPinYin(this.formState.formData.name);
        //},
        // 提取关键字，自动填充listArtists            
        "formState.formData.comments"(nV,oV){
            let str=nV+" "+this.formState.formData.name+" "+this.formState.formData.alias;
            let reg=this.$refs.selectArtists ? this.$refs.selectArtists.regExpAll : false;//new RegExp(["晕盖","Gatsby","Daze","不优雅","养鸡"].join("|"),"g")
            let listAllArtists=this.$refs.selectArtists ? this.$refs.selectArtists.listAll || [] : [];
            if(reg){
              let listNameArtistsFind=str.match(reg);//晕盖|Gatsby|Daze|不优雅|养鸡
              listNameArtistsFind=[...(new Set(listNameArtistsFind))];//去重
              let listIdArtists= [];
              listNameArtistsFind.forEach(strNameFind=>{
                listAllArtists.forEach(artist=>{
                  if(artist.name==strNameFind)listIdArtists.push(artist._id);
                })
              })
              // 去重合并
              this.formState.formData.listRefs=[...new Set(this.formState.formData.listRefs.concat(listIdArtists))];
              console.info("提取关键字，自动填充listArtists,去重结果:",listNameArtistsFind,)
            }
        },
    },
    computed: {
        ...computed,
        formState(){return this.value},
        listAllArtists(){
          return this.$refs.selectArtists ? this.$refs.selectArtists.listAllArtists : [];
        },
        regExpArtists(){
          return this.$refs.selectArtists ? this.$refs.selectArtists.regExpAll : false;
        },
    },
    methods: {
        // ...methods,
        getPinYin:getPinYin,
        suggestAlias(queryString, cb) {
          var results = [ {"value":getPinYin(this.formState.formData.name)} ];
          // 调用 callback 返回建议列表的数据
          cb(results);
        },
        backToList:methods.backToList,
        updateKeywords:methods.updateKeywords,
        editorReady:methods.editorReady,
        submitForm:methods.submitForm,
        // submitForm(formName, type = "") {
        //     let that=this;
        //     this.$refs[formName].validate(valid => {
        //         if (valid && this.value && this.value.formData) {
        //             let params = Object.assign({}, that.formState.formData, {
        //                 comments: that.ueditorObj.getContent(),
        //                 simpleComments: that.ueditorObj.getPlainTxt()
        //             });
        //             Object.assign(this.value,this.formState);
        //             if (that.formState.edit) {
        //                 //触发更新
        //                 this.$emit("submit",params,'update',);
        //             } else {
        //                 //触发新增
        //                 this.$emit("submit",params,'addOne');
        //             }
        //         } else {
        //             console.log("提交格式审核不通过!valid",valid);
        //             return false;
        //         }
        //     });
        // },

        // SelectIds变化::Tags;
        // {
        //     listObjDiff:listObjDiff,
        //     listIds:listIds,
        //     strAction:(isAdd?"add":"delete")
        // }
        eChangeTag(e){
            this.formState.formData.tags=e.listIds;
            this.updateKeywords(e.listObjDiff,e.strAction=="delete");
        },
        // 读取了listAllTags
        eLoadedAllTags(e){
          this.listAllTags=e.listAllTags;
          this.$emit("loaded",{listAllTags:this.listAllTags});
        },
        // SelectIds变化::listRefs;
        eChangeArtist(e){
          this.formState.formData.listRefs=e.listIds;

          this.updateKeywords(e.listObjDiff,e.strAction=="delete");
          // 更新tags
          let listAllTags=this.listAllTags;//this.contentTagList;      
          if(listAllTags){
            this.formState.formData.listRefs.forEach(idArtist=>{
              let idTagFind=listAllTags.find(tag=>(tag.objRef && tag.objRef.id==idArtist));
              if(idTagFind){
                let idTagHave=this.formState.formData.tags.find(id=>(id==idTagFind._id))
                if(!idTagHave)this.formState.formData.tags.push(idTagFind._id);
              }
            })
          }
        },
    },
    mounted() {
      initEvent(this);
      // initVuex(this);
    }
  }
</script>