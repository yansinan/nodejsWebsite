<template>
  <div class="dash-box">
    <h2 class="dash-title">最新更新</h2>
    <div class="dash-content message-pannel">
        <div v-if="listDocs && listDocs.length > 0">
            <div class="direct-chat-msg" v-for="msg in listDocs" :key="msg._id" @click="!hasEditPower?'':$router.push('/admin/'+msg.doc.toLowerCase()+'/edit/'+msg.id)">
               <!-- <random-avatar :user="msg"/> -->
              <svg-icon :icon-class="msg.doc.toLowerCase()" :class-name="'card-panel-icon direct-chat-img '+ msg.doc.toLowerCase()"/>
              <div class="direct-chat-text" v-html="msg.name+'@'+msg.dateFull"></div>
            </div>
        </div>
        <div v-else>{{$t('main.noMessages')}}</div>
      </div>
  </div>
  
</template>

<script>
import RandomAvatar from "@/components/RandomAvatar";

export default {
  props: ["listDocs","hasEditPower"],
  filters: {},
  data() {
    return {
      list: null
    };
  },
  components: {
    RandomAvatar
  }
};
</script>
<style lang="scss">
.message-pannel {
  font-size: 14px;
  position: relative;
  overflow: hidden;
  color: #666;
}
.direct-chat-msg {
  margin-bottom: 20px;
  a:link,
  a:visited {
    color: #409eff;
  }
  .direct-chat-contentTitle {
    font-size: 14px;
  }
  .direct-chat-contentTitle:link,
  .direct-chat-contentTitle:visited {
    color: #878d99;
    font-style: italic;
  }
  .direct-chat-info {
    margin-bottom: 10px;
  }
  .direct-chat-timestamp {
    color: #b4bccc;
    font-size: 12px;
  }
  .card-panel-icon.direct-chat-img {
    border-radius: 50%;
    width: 35px;
    height: 35px;
    float: left;
  }
  .card-panel-icon.video{color: #00FFFE;}
  .card-panel-icon.goods{color: #00FF2E;}
  .card-panel-icon.artist{color: #40c9c6;}
  .card-panel-icon.content{color: #FF4D3E;}
  .direct-chat-text {
    border-radius: 5px;
    position: relative;
    padding: 10px;
    margin: 5px 0 0 50px;
    color: #5a5e66;
    background-color: #edf2fc;
    font-size: 13px;

    text-overflow: ellipsis;
    overflow: hidden;
  }
  .direct-chat-text:after,
  .direct-chat-text:before {
    position: absolute;
    right: 100%;
    top: 15px;
    border: solid transparent;
    border-right-color: #edf2fc;
    content: " ";
    height: 0;
    width: 0;
    pointer-events: none;
    box-sizing: border-box;
  }
  .direct-chat-text:before {
    border-width: 6px;
    margin-top: -6px;
  }
  .direct-chat-text:after {
    border-width: 5px;
    margin-top: -5px;
  }
}
</style>
