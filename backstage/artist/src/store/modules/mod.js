import * as types from '../types.js';
import {
  list,
  // findMembers,
} from '@root/publicMethods/apiGeneral';
import _ from 'lodash';

const defautlFormData={
  targetUser: '',
  name: '',
  type: '1',
  sortPath: '',
  tags: [],
  keywords: '',
  sImg: '',///static/upload/images/defaultImg.jpg
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
  listVideos:[],
  listImages:[],
}
function initDefautlFormData(){
  return Object.assign({},defautlFormData,{
    listDateDur:[],
    listHotMusics:[],
    listLinks:[],
    listVideos:[],
    listImages:[],    
  })
}
const state = {
  formState: {
    edit: false,
    formData: initDefautlFormData(),
  },
  dataList: {
    pageInfo: {},
    docs: []
  },
  add: {
    state: '',
    err: {}
  },
  // dataMembers:{
  //   pageInfo:{},
  //   docs:[],
  // }
}
const mutations = {
  FORMSTATE(state, formState) {
    state.formState.edit = formState.edit;
    state.formState.formData = Object.assign(initDefautlFormData(), formState.formData);
  },
  GET_LIST(state, dataList) {
    state.dataList = dataList
  },
  // FIND_MEMBER_BY_NAME(state,dataList){
  //   state.dataMembers=dataList;
  // },
}

const actions = {

  showContentForm: ({
    commit
  }, params = {
    edit: false,
    formData: initDefautlFormData()
  }) => {
    commit("FORMSTATE", {
      edit: params.edit || false,
      formData: params.isInit?initDefautlFormData():params.formData
    })
  },
  getList({
    commit
  }, params = {mod:"content"}) {
    list(params,params.mod).then((result) => {
      result.data.docs.forEach(v=>{
        if(!v.listRecords)v.listRecords=[]
      })
      commit("GET_LIST", result.data)
    }).catch(error=>{
      console.log("xxxx.store.xxxx.actions.getList获取失败:fail",error);
    })
  },
  // // 获取艺人列表
  // getMemberList({
  //   commit
  // }, params = {}) {
  //   findMembers(params).then((result) => {
  //     commit("FIND_MEMBER_BY_NAME", result.data)
  //   }).catch(error=>{
  //     console.log("xxxx.store.xxxx.actions.getList获取失败:fail",error);
  //   })
  // },

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}