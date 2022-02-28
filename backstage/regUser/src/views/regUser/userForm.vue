<template>
  <div class="dr-regUserForm">
    <el-dialog
      :xs="20"
      :sm="20"
      :md="16"
      :lg="16"
      :xl="16"
      width="65%"
      :title="$t('regUser.form_title')+' : '+dialogState.formData._id"
      :visible.sync="dialogState.show"
      :close-on-click-modal="false"
    >
      <el-form
        :model="dialogState.formData"
        :rules="rules"
        ref="ruleForm"
        label-width="auto"
        class="demo-ruleForm"
        :label-position="device == 'mobile' ? 'top' : 'right'"
      >
        <el-form-item prop="name">
          <el-input size="small" v-model="dialogState.formData.name" maxlength="30" show-word-limit><template slot="suffix" style="color:red;">{{$t('regUser.name')}}</template></el-input>
        </el-form-item>

        <el-form-item prop="dateInOut">
          <el-row :gutter="5" type="flex" justify="space-around"  align="middle" style="flex-wrap: nowrap;min-width: min-content;max-width: fit-content;">
            <el-col :span="11">
                <el-date-picker
                  v-model="dialogState.formData.dateIn"
                  type="date"
                  :span="12"
                  placeholder="加入日期">
                </el-date-picker>
            </el-col> 
            <el-col :span="1" style="min-width: min-content;">
              <icon class="el-icon-minus"/>
            </el-col> 
            <el-col :span="11">
              <el-date-picker
                v-model="dialogState.formData.dateOut"
                :span="12"
                type="date"
                placeholder="退出日期">
              </el-date-picker>
            </el-col> 
          </el-row>
        </el-form-item>

        <el-row :gutter="20" type="flex" justify="space-between"  align="start" style="flex-wrap: nowrap;min-width: min-content;">
          <el-col :span="12">
            <el-form-item prop="group">
              <!-- <el-radio class="radio" v-model="dialogState.formData.group" label="0">普通用户</el-radio> -->
              <el-select
                v-model="dialogState.formData.group"
                filterable
                allow-create
                default-first-option
                :placeholder="$t('regUser.group')">
                <el-option
                  v-for="item in groups"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="phoneNum">
              <el-input size="small" v-model="dialogState.formData.phoneNum"><template slot="suffix">{{$t('regUser.phoneNum')}}</template></el-input>
            </el-form-item>
            <el-form-item prop="email">
              <el-input size="small" v-model="dialogState.formData.email"><template slot="suffix">{{$t('regUser.email')}}</template></el-input>
            </el-form-item>
            <el-form-item prop="userName">
              <el-input size="small" v-model="dialogState.formData.userName" maxlength="30" show-word-limit><template slot="suffix" style="color:red;">{{$t('regUser.userName')}}</template></el-input>
            </el-form-item>
            <el-form-item prop="enable">
              <el-switch
                active-text="激活"
                inactive-text=""
                v-model="dialogState.formData.enable"
              ></el-switch>
            </el-form-item>
          </el-col> 

          <el-col :span="12">
            <!-- <el-form-item label="头像" prop="logo"> -->
              <!-- 
              <el-upload
                class="avatar-uploader"
                action="/api/upload/files"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :data="{action:'uploadimage'}"
              >
                <img v-if="dialogState.formData.logo" :src="dialogState.formData.logo" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
               -->
              <Cropper 
                nameMod="regUser"
                :subPath="dialogState.formData._id || ''"
                :aspectRatio="1"
                v-model="dialogState.formData.logo" 
                :label="头像"
                prop="logo"
                isInnerDialog="false"></Cropper>
            <!-- </el-form-item> -->
          </el-col> 
        </el-row>

        <el-form-item prop="comments">
          <el-input size="small" type="textarea" v-model="dialogState.formData.comments" maxlength="300" show-word-limit :autosize="{minRows: 4, maxRows: 10 }"></el-input>
          <div class="el-select-suffix el-input--small el-input__suffix"><span class=" el-input__suffix-inner">{{$t('regUser.comments')}}</span></div>

        </el-form-item>
        <el-form-item>
          <el-button
            size="medium"
            type="primary"
            @click="submitForm('ruleForm')"
          >{{dialogState.edit ? $t('main.form_btnText_update') : $t('main.form_btnText_save')}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { updateRegUser } from "@/api/regUser";
import { checkPhoneNum, isRegularCharacter } from "@/utils/validate";
import _ from "lodash";
export default {
  props: {
    dialogState: Object,
    groups: Array,
    device: String
  },
  data() {
    return {
      rules: {
        userName: [
          {
            required: true,
            message: this.$t("validate.inputNull", {
              label: this.$t("regUser.userName")
            }),
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              if (!isRegularCharacter(value)) {
                callback(
                  new Error(
                    this.$t("validate.rangelength", { min: 1, max: 30 })
                  )
                );
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        name: [
          {
            message: this.$t("validate.inputNull", {
              label: this.$t("regUser.name")
            }),
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              if (!isRegularCharacter(value)) {
                callback(
                  new Error(
                    this.$t("validate.rangelength", { min: 1, max: 30 })
                  )
                );
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        phoneNum: [
          {
            // required: false,
            message: this.$t("validate.inputNull", {
              label: this.$t("regUser.phoneNum")
            }),
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              if (value && !checkPhoneNum(value)) {
                callback(
                  new Error(
                    this.$t("validate.inputCorrect", {
                      label: this.$t("regUser.phoneNum")
                    })
                  )
                );
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        comments: [
          {
            message: this.$t("validate.inputNull", {
              label: this.$t("main.comments_label")
            }),
            trigger: "blur"
          },
          {
            min: 2,
            max: 100,
            message: this.$t("validate.ranglengthandnormal", {
              min: 2,
              max: 100
            }),
            trigger: "blur"
          }
        ]
      }
    };
  },
  components:{
    Cropper: () => import('@root/publicMethods/vue/Cropper.vue'),
  },
  methods: {
    handleAvatarSuccess(res, file) {
      let imageUrl = res.data.path;
      this.$store.dispatch("regUser/showRegUserForm", {
        edit: this.dialogState.edit,
        formData: Object.assign({}, this.dialogState.formData, {
          logo: imageUrl
        })
      });
    },
    beforeAvatarUpload(file) {
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
    },
    confirm() {
      this.$store.dispatch("regUser/hideRegUserForm");
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // console.log("---formdatas--", this);
          let params = this.dialogState.formData;
          // 更新(只更新基础信息)
          if (this.dialogState.edit) {
            let {
              userName,
              name,
              logo,
              group,
              category,
              enable,
              phoneNum,
              email,
              comments,
              _id,
              dateIn,
              dateOut,
            } = params;
            let currentParams = {
              _id,
              userName,
              logo,
              name,
              group,
              category,
              enable,
              phoneNum,
              email,
              comments,
              dateIn,
              dateOut,
            };
            updateRegUser(currentParams).then(result => {
              if (result.status === 200) {
                this.$store.dispatch("regUser/hideRegUserForm");
                this.$store.dispatch("regUser/getRegUserList");
                this.$message({
                  message: this.$t("main.updateSuccess"),
                  type: "success"
                });
              } else {
                this.$message.error(result.message);
              }
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  computed: {}
};
</script>

<style lang="scss">
.el-select{
  width:100%;
}
/*
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  line-height: 150px !important;
  text-align: center;
}
.avatar {
  width: 150px;
  height: 158px;
  display: block;
}
*/
</style>