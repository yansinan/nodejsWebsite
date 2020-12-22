import * as types from '../types.js';
import {
  list,
} from '@root/publicMethods/apiGeneral';
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
  listArtists:[],
  listDateDur:[Date.now()],
  location:"",
  listTicketLink:[],
  alias:"",
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
  dataArtists:{
    pageInfo:{},
    docs:[],
  }
}

const mutations = {
  FORMSTATE(state, formState) {
    state.formState.edit = formState.edit;
    state.formState.formData = Object.assign({},defautlFormData, formState.formData);
  },
  GET_LIST(state, dataList) {
    state.dataList = dataList
  },
  FIND_ARTIST_BY_NAME(state,dataList){
    state.dataArtists=dataList;
  },
}

const actions = {

  showContentForm: ({
    commit
  }, params = {
    edit: false,
    formData: defautlFormData
  }) => {
    commit("FORMSTATE", {
      edit: params.edit || false,
      formData: params.isInit?defautlFormData:params.formData
    })
  },
  getList({
    commit
  }, params = {mod:"content"}) {
    list(params,params.mod).then((result) => {
      commit("GET_LIST", result.data)
    }).catch(error=>{
      console.log("xxxx.store.xxxx.actions.getList获取失败:fail",error);
    })
  },
  // 获取艺人列表
  getArtistsList({
    commit
  }, params = { pageSize : 200, }) {
    list(params,"artist").then((result) => {
      commit("FIND_ARTIST_BY_NAME", result.data)
    }).catch(error=>{
      console.log("xxxx.store.xxxx.actions.getList获取失败:fail",error);
    })
  },

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}