import Vue from 'vue'
import Vuex from 'vuex'
//nameMod定义
const nameMod="good";
import mod from './modules/mod'
import contentCategory from './modules/contentCategory'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    [nameMod]:mod,
    contentCategory,
  },
  getters:{
    getterListData: state => state[nameMod].dataList,
    getterDataMembers:state => state[nameMod].dataMembers,  
  }
})

export default store