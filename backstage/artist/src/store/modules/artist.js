import * as types from '../types.js';
import {
  list,
  getOneContent,
  addUser,
  findArtists,
} from '@/api/artist';
import _ from 'lodash';

const defautlFormData={
  targetUser: '',
  name: '',
  type: '1',
  sortPath: '',
  tags: [],
  keywords: '',
  sImg: '/upload/images/defaultImg.jpg',
  discription: '',
  author: {},
  listMembers: [],
  markDownComments: '',
  state: '1',
  isTop: 0,
  roofPlacement: '0',
  clickNum: 0,
  comments: '',
  simpleComments: '',
  // commentNum: 0,
  // likeNum: 0,
  dismissReason: '',
  from:"",
  alias:"",
  listDateDur:[],
  listHotMusics:[],
  listLinks:[],
}

const state = {
  formState: {
    edit: false,
    formData: defautlFormData,
  },
  dataList: {
    pageInfo: {},
    docs: []
  },
  add: {
    state: '',
    err: {}
  },
  // directUser: {
  //   formState: {
  //     show: false,
  //     edit: false,
  //     formData: {
  //       name: '',
  //       alias: '',
  //       targetUser: ''
  //     }
  //   }
  // },
  dataMembers:{
    pageInfo:{},
    docs:[],
  }
}

const mutations = {
  FORMSTATE(state, formState) {
    state.formState.edit = formState.edit;
    state.formState.formData = Object.assign(defautlFormData, formState.formData);

  },
  GET_LIST(state, dataList) {
    state.dataList = dataList
  },
  // [types.CONTENT_ONE](state, content) {
  //   state.content = content
  // },
  FIND_ARTIST_BY_NAME(state,dataList){
    state.dataMembers=dataList;
    // console.log("FIND_ARTIST_BY_NAME",state,dataList)
  },
}

const actions = {

  showContentForm: ({
    commit
  }, params = {
    edit: false,
    formData: {}
  }) => {
    commit("FORMSTATE", {
      edit: params.edit,
      formData: params.formData
    })
  },
  getList({
    commit
  }, params = {mod:"content"}) {
    list(params).then((result) => {
      commit("GET_LIST", result.data)
    }).catch(error=>{
      console.log("artist.store.artist.actions.getList获取失败:fail",error);
    })
  },
  // 获取艺人列表
  getArtistList({
    commit
  }, params = {}) {
    findArtists(params).then((result) => {
      commit("FIND_ARTIST_BY_NAME", result.data)
    })
  },

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}