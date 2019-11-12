import Cookies from 'js-cookie'
import * as types from '../types.js';
import services from '../services.js';
import _ from 'lodash';

const defautlFormData={
  targetUser: '',
  name: '',
  type: '1',
  keywords: '',
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

}

const app = {
  namespaced: true,
  state: {
    device: 'desktop',
    language: Cookies.get('language') || 'en',
    size: Cookies.get('size') || 'medium',
    count: 20,

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

    //StoreAppInitState
  },
  mutations: {

    // [types.INCREMENT](state) {
    //   state.count++
    // },
    // [types.DECREMENT](state) {
    //   state.count--
    // },
    FORMSTATE(state, formState) {
      state.formState.edit = formState.edit;
      state.formState.formData = Object.assign(defautlFormData, formState.formData);

    },
    GET_LIST(state, dataList) {
      state.dataList = dataList
    },
    // [types.CONTENT_LIST](state, contentList) {
    //   state.content.contentList = contentList
    // },
    // [types.CONTENT_ONE](state, content) {
    //   state.content.content = content
    // },
    // [types.DIRECTUSERFORMSTATE](state, formState) {
    //   state.directUser.formState.show = formState.show;
    //   state.directUser.formState.edit = formState.edit;
    //   state.directUser.formState.type = formState.type;
    //   state.directUser.formState.formData = Object.assign({
    //     name: '',
    //     alias: '',
    //     targetUser: ''
    //   }, formState.formData);
    // },
    //StoreAppMutations
  },
  actions: {
    // increment: ({
    //   commit
    // }) => {
    //   console.log(commit);
    //   commit(types.INCREMENT);
    // },
    // decrement: ({
    //   commit
    // }) => {
    //   console.log(commit);
    //   commit(types.DECREMENT);
    // },
    // handleOpen: ({
    //   commit
    // }) => {
    //   console.log(commit);
    // },
    // handleClose: ({
    //   commit
    // }) => {
    //   console.log(commit);
    // },
    // handleSelect: ({
    //   commit
    // }) => {
    //   console.log(commit);
    // },
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
    // showDirectUserForm: ({
    //   commit
    // }, params = {
    //   edit: false,
    //   formData: {}
    // }) => {
    //   commit(types.DIRECTUSERFORMSTATE, {
    //     show: true,
    //     edit: params.edit,
    //     formData: params.formData
    //   })
    // },
    // hideDirectUserForm: ({
    //   commit
    // }) => {
    //   commit(types.DIRECTUSERFORMSTATE, {
    //     show: false
    //   })
    // },
    getList({
      commit
    }, params = {mod:"content"}) {
      services[params.mod].list(params).then((result) => {
        commit("GET_LIST", result.data.data)
      })
    },
    // getOneContent({
    //   commit
    // }, params = {}) {
    //   services.contentInfo(params).then((result) => {
    //     commit(types.CONTENT_ONE, result.data.data)
    //   })
    // },
    // showContentTagForm: ({
    //   commit
    // }, params = {
    //   edit: false,
    //   formData: {}
    // }) => {
    //   commit(types.CONTENTTAG_FORMSTATE, {
    //     show: true,
    //     edit: params.edit,
    //     formData: params.formData
    //   })
    // },
    // hideContentTagForm: ({
    //   commit
    // }) => {
    //   commit(types.CONTENTTAG_FORMSTATE, {
    //     show: false
    //   })
    // },
    // getContentTagList({
    //   commit
    // }, params = {}) {
    //   services.contentTagList(params).then((result) => {
    //     commit(types.CONTENTTAG_LIST, result.data.data)
    //   })
    // },
    //StoreAppActions
  },
  getters:{
    getterListData: state => state.dataList,
  }
}

export default app