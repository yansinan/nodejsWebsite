<template>
  <el-row :gutter="40" class="panel-group">
    <!-- 工作人员 -->
    <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col" :class="dicSourceRoot['regUser'] ? '':'disable'">
      <div class="card-panel" @click="!dicSourceRoot['regUser'] ? '' : $router.push('/admin/regUser')" >
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="staff" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{$t('main.totalStaffs')}}</div>
          <count-to :start-val="0" :end-val="basicInfo.listStaffs.length" :duration="3000" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <!-- 乐队 -->
    <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col" :class="dicSourceRoot['artist'] ? '':'disable'">
      <div class="card-panel" @click="!dicSourceRoot['artist'] ? '' : $router.push('/admin/artist')">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="artist" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{$t('main.totalArtists')}}</div>
          <count-to :start-val="0" :end-val="basicInfo.listArtists.length" duration="3000" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <!-- 专辑总数 -->
    <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col" :class="dicSourceRoot['record'] ? '':'disable'">
      <div class="card-panel" @click="!dicSourceRoot['record'] ? '' : $router.push('/admin/record')">
        <div class="card-panel-icon-wrapper icon-shoppingCard">
          <svg-icon icon-class="record" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{$t('main.totalRecords')}}</div>
          <count-to :start-val="0" :end-val="basicInfo.totalRecords" duration="3000" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <!-- 视频总数 -->
    <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col" :class="dicSourceRoot['artist'] ? '':'disable'">
      <div class="card-panel" @click="!dicSourceRoot['artist'] ? '' : $router.push('/admin/artist')">
        <div class="card-panel-icon-wrapper icon-shoppingCard">
          <svg-icon icon-class="video" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{$t('main.totalVideos')}}</div>
          <count-to :start-val="0" :end-val="basicInfo.totalVideos" duration="3000" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <!-- 周边总数 -->
    <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col" :class="dicSourceRoot['good'] ? '':'disable'">
      <div class="card-panel" @click="!dicSourceRoot['good'] ? '' : $router.push('/admin/good')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="good" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{$t('main.totalGoods')}}</div>
          <count-to :start-val="0" :end-val="basicInfo.totalGoods" duration="3000" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <!-- 文档总数 -->
    <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col" :class="dicSourceRoot['content'] ? '':'disable'">
      <div class="card-panel" @click="!dicSourceRoot['content'] ? '' : $router.push('/admin/content')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="content" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{$t('main.contentsTotalNum')}}</div>
          <count-to :start-val="0" :end-val="basicInfo.contentCount" duration="3000" class="card-panel-num"/>
        </div>
      </div>
    </el-col>

  </el-row>
</template>

<script>
import CountTo from "vue-count-to";

export default {
  props: ["basicInfo","dicSourceRoot"],
  components: {
    CountTo
  },
  methods: {}
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col {
    margin-bottom: 32px;
  }
  .card-panel-col.disable {
    pointer-events:none;
    filter: saturate(0.1);
    opacity: 0.5;
  }
    .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
        background: #40c9c6;
      }
      .icon-message {
        background: #36a3f7;
      }
      .icon-money {
        background: #FF4D3E;
      }
      .icon-shoppingCard {
        background: #34bfa3;
      }
    }
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      color: #FF4D3E;
    }
    .icon-shoppingCard {
      color: #34bfa3;
    }
    .card-panel-icon-wrapper {
      float: left;
      margin-top: 14px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
      @media only screen and (min-width: 768px) {
        margin: 14px 0 0 14px;
        padding: 16px;
      }
    }
    .card-panel-icon {
      float: left;
      font-size: 5rem;
      @media only screen and (min-width: 768px) {
        font-size: 48px;
      }
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
