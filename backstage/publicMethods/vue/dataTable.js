import { remove, roof, updateToTop } from "../apiGeneral";
import '@/set-public-path'

export let props={
    nameMod:String,
    dataList: Array,
    pageInfo: Object
}

export let data={
    loading: false,
    multipleSelection: [],
    yellow: {
      color: "#F7BA2A"
    },
    gray: {
      color: "#CCC"
    },
    green: { color: "#13CE66" },
    red: { color: "#FF4949" },
    // 编辑相关链接弹窗
    dialogStateLink:{
    isShow:false,
    isEdited:false,
    formData:{},
    strListObjURL:"listLinks"
    },
}

export let methods={
    // 从mod获取列表更新
    getList(){
        this.pageInfo.mod=this.nameMod;
        this.$store.dispatch(this.nameMod+"/getList", this.pageInfo);
      },
      handleContentSelectionChange(val) {
        if (val && val.length > 0) {
          let ids = val.map((item, index) => {
            return item._id;
          });
          this.multipleSelection = ids;
          this.$emit("changeContentSelectList", ids);
        }
      },
      //编辑按钮
      editContentInfo(index, rows) {
        let rowData = rows[index];
        this.$router.push(this.nameMod+"/edit/" + rowData._id);
      },
      //推荐
      topContent(index, rows) {
        let contentData = rows[index];
        let targetParams = {
          _id: contentData._id,
          isTop: contentData.isTop == 1 ? 0 : 1
        };
        updateToTop(targetParams,this.nameMod).then(result => {
          if (result.status === 200) {
            this.getList();
          } else {
            this.$message.error(result.data.message || result.message);
          }
        });
      },
      // 置顶
      roofContent(index, rows) {
        let contentData = rows[index];
        // 推荐的才允许置顶
        if (contentData.isTop != 1) {
          return false;
        }
        let targetParams = {
          _id: contentData._id,
          roofPlacement: contentData.roofPlacement == "1" ? "0" : "1"
        };
        roof(targetParams,this.nameMod).then(result => {
          if (result.status === 200) {
            this.getList();
          } else {
            this.$message.error(result.data.message || result.message);
          }
        });
      },
      deleteContent(index, rows) {
        this.$confirm(
          this.$t("main.del_notice"),
          this.$t("main.scr_modal_title"),
          {
            confirmButtonText: this.$t("main.confirmBtnText"),
            cancelButtonText: this.$t("main.cancelBtnText"),
            type: "warning"
          }
        )
          .then(() => {
            return remove({
              ids: rows[index]._id,
              draft: "1"
            },this.nameMod);
          })
          .then(result => {
  
            if (result.status === 200) {
              Object.assign(this.pageInfo);
              this.getList();
              this.$message({
                message: this.$t("main.scr_modal_del_succes_info"),
                type: "success"
              });
            } else {
              this.$message.error(result.data.message || result.message);
            }
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: this.$t("main.scr_modal_del_error_info")
            });
          });
      },
      // 编辑相关链接;
      eListLinksEdit(index,rows){
        this.dialogStateLink = {
          isShow:true,
          isEdited:false,
          formData:rows[index],
          strListObjURL:"listLinks",
        };
      },
      // 新开页面（预览）
      eLink(url,target){window.open(url,target);},
  
}

export let computed={
  isMobile(){
    return document.body.clientWidth<768;
  },
}