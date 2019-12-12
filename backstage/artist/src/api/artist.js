import request from '@root/publicMethods/request'
let reqJsonData =function(url,params,method="post"){
  return request({
    url: url,
    params:params,
    method: method
  })
  
};
export function artistList(params) {
      return reqJsonData('manage/artist/getList', params, 'get')
  }
  export function list(params) {
      return reqJsonData('manage/artist/getList', params, 'get')
  }
  export function updateToTop(params) {
      return reqJsonData('manage/artist/top', params)
  }

  export function roof(params) {
      return reqJsonData('manage/artist/roof', params)
  }

  export function remove(params) {
      return reqJsonData('manage/artist/delete', params, 'get')
  }

  export function getOneContent(params) {
      return reqJsonData('manage/artist/getContent', params, 'get')
  }

  export function addContent(params) {
      return reqJsonData('manage/artist/addOne', params)
  }

  export function updateContent(params) {
      return reqJsonData('manage/artist/updateOne', params)
  }
  // 添加用户
  export function addUser(params) {
      return reqJsonData('manage/user/addOne', params)
  }
  // 查找乐手
  export function findArtists(params){
      return reqJsonData("manage/artist/findByName",params,"get");
  }
  export function getRandomContentImg(params) {
    return request({
      url: '/api/content/getRandomContentImg',
      params,
      method: 'get'
    })
  }
