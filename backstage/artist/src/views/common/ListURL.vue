<template>
    <!-- <div > -->
    <el-form :inline="true" label-width="100px">
        <el-form-item
            v-for="(domain, index) in listObjURL"
            :label="index +'.' "
            :key="domain.key"
            :prop="'listObjURL[' + index +']'"
            :rules="{
            required: true, message: label+'不能为空', trigger: 'blur'
            }"
        >
            <el-col :span="8">
                <el-input v-model="domain.name">
                    <template slot="prefix" style="">{{label+': '}}</template>
                </el-input>
            </el-col>
            <el-col :span="16">
                <el-input v-model="domain.url">
                    <template slot="prepend">Https://</template>
                    <el-button slot="append" icon="el-icon-delete" @click.prevent="removeDomain(domain)"/>
                </el-input>
            </el-col>

        </el-form-item>
        <el-button @click="addDomain">增加</el-button>

        <!-- <el-form-item :label="title"> -->
            <!-- <el-button type="primary" @click="submitForm('dynamicListForm')">提交</el-button> -->
            <!-- <el-button @click="resetForm('dynamicListForm')">重置</el-button> -->
        <!-- </el-form-item> -->
    </el-form>
    <!-- </div> -->
</template>

<script>
  const objURLDefault={
      name: '',
      url:'',
      icon:'',
  }
  export default {
    props: {
        title:{
            type:String,
            default:"名称",
        },
        label: String,
        listObjURL: {
            type:Array,
            default:()=>([Object.assign({},objURLDefault)]),
        },
    },
    data() {
      return {
        modalURL: {
          listObjURL: this.listObjURL
        },
        //()=>(),
        // res: {
        //   listObjURL: ()=>{
        //     if(this.listObjURL.length>0 && this.listObjURL[this.listObjURL.length-1] && this.listObjURL[this.listObjURL.length-1].url==''){
        //         this.listObjURL.pop();
        //     }
        //     if(!this.listObjURL.length || this.listObjURL.length==0 )return false;
        //     else return this.listObjURL;
        //   }
        // },
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.listObjURL)this.$emit('list-changed',this.listObjURL);
            
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        if(this.listObjURL)this.$emit('list-changed',this.listObjURL);

      },
      removeDomain(item) {
        var index = this.modalURL.listObjURL.findIndex((v,idx)=>(v.url==item.url))
        if (index !== -1) {
          this.modalURL.listObjURL.splice(index, 1)
        }
        if(this.listObjURL)this.$emit('list-changed',this.listObjURL);

      },
      addDomain() {
        this.listObjURL.push(Object.assign({},objURLDefault));
        if(this.listObjURL)this.$emit('list-changed',this.listObjURL);
      }
    }
  }
</script>