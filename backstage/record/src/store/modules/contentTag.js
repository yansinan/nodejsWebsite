import * as types from '../types.js';
import {
  contentTagList,
  contentTagListOf,
} from '@/api/contentTag';
import _ from 'lodash';


const state = {

  tagList: {
    pageInfo: {},
    docs: []
  },
  formatTagList:{
    pageInfo:{},
    docs:[],
  }
}

const mutations = {
  [types.CONTENTTAG_LIST](state, tagList) {
    state.tagList = tagList
  },
  FORMAT_TAG_LIST(state, tagList) {
    state.formatTagList = tagList
  },
}

const actions = {

  getContentTagList({
    commit
  }, params = {}) {
    contentTagList(params).then((result) => {
      commit(types.CONTENTTAG_LIST, result.data)
    })
  },
  getFormatTagList({
    commit
  }, params = {}) {
    let paramsTmp=Object.assign(params,{query:{comments:"发行介质"}});
    contentTagListOf(paramsTmp).then((result) => {
      commit("FORMAT_TAG_LIST", result.data)
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}