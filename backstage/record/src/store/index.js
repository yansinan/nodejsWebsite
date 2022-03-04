import Vue from 'vue'
import Vuex from 'vuex'
//nameMod定义
const nameMod="record";
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
  }
})

export default store