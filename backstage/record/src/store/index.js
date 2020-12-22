import Vue from 'vue'
import Vuex from 'vuex'
//nameMod定义
import '@/set-public-path'
import mod from './modules/mod'
import contentCategory from './modules/contentCategory'
import contentTag from './modules/contentTag'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    [nameMod]:mod,
    contentCategory,
    contentTag
  },
  getters:{
    contentTagList: state => state.contentTag.tagList,
    formatTagList:state=>state.contentTag.formatTagList,
    getterListData: state => state[nameMod].dataList,
    getterDataMembers:state => state[nameMod].dataMembers,  
  }
})

export default store