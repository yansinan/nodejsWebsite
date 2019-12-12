import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import artist from './modules/artist'
import contentCategory from './modules/contentCategory'
import contentTag from './modules/contentTag'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    artist,
    contentCategory,
    contentTag
  },
  getters
})

export default store