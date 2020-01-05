import request from '@root/publicMethods/request'
let reqJsonData =function(url,params,method="post"){
  return request({
    url: "/"+url,
    params:params,
    method: method
  })
  
};
export function artistList(params) {
      return reqJsonData('manage/artist/getList', params, 'get')
  }
export function list(params) {
    return request({
        url: '/manage/artist/getList',
        // url: '/manage/content/getList',    
        params:params,
        method: 'get'
    })
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

// export function addContent(data) {
//     return request({
//         url: '/manage/content/addOne',
//         data,
//         method: 'post'
//     })
// }
export function addOne(data) {
    return request({
        url: 'manage/artist/addOne',
        // url: '/manage/content/getList',    
        data,
        method: 'post'
    })
}
export function updateContent(data) {
    // return reqJsonData('manage/artist/updateOne', params)
    return request({
        url: '/manage/artist/updateOne',//"/manage/artist/updateOne"
        // url: '/manage/content/getList',    
        data,
        method: 'post'
    })
}
// 添加用户
export function addUser(params) {
    return reqJsonData('manage/regUser/addOneName', params)
}
// 查找乐手
export function findArtists(params){
    return reqJsonData("manage/regUser/findByName",params,"get");
}

export function getRandomContentImg(params) {
    return request({
      url: '/api/content/getRandomContentImg',
      params,
      method: 'get'
    })
  }