import request from '@root/publicMethods/request'
const strMod="artist"
let reqJsonData =function(url,params,method="post"){
  return request({
    url: "/"+url,
    params:params,
    data:params,
    method: method
  })
  
};

export function list(params) {
    return request({
        url: '/manage/'+strMod+'/getList',
        // url: '/manage/content/getList',    
        params:params,
        data:params,
        method: 'get'
    })
}
export function updateToTop(data) {
    return reqJsonData('manage/'+strMod+'/top', data)
}

export function roof(params) {
    return reqJsonData('manage/'+strMod+'/roof', params)
}

export function remove(params) {
    return reqJsonData('manage/'+strMod+'/delete', params, 'get')
}

export function getOneContent(params) {
    return reqJsonData('manage/'+strMod+'/getContent', params, 'get')
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
        url: '/manage/'+strMod+'/addOne',
        // url: '/manage/content/getList',    
        data,
        method: 'post'
    })
}
export function updateContent(data) {
    // return reqJsonData('manage/artist/updateOne', params)
    return request({
        url: '/manage/'+strMod+'/updateOne',//"/manage/artist/updateOne"
        // url: '/manage/content/getList',    
        data,
        method: 'post'
    })
}
// 添加用户
export function addUser(data) {
    // return reqJsonData('manage/artist/updateOne', params)
    return request({
        url: '/manage/regUser/addOneName',//"/manage/artist/updateOne"
        // url: '/manage/content/getList',    
        data,
        params:data,
        method: 'post',
    })
}
// export function addUser(params) {
//     return reqJsonData('manage/regUser/addOneName', params)
// }
// 查找乐手
export function findArtists(data) {
    // return reqJsonData('manage/artist/updateOne', params)
    return request({
        url: '/manage/regUser/findByName',//"/manage/artist/updateOne"
        // url: '/manage/content/getList',    
        data:data,
        method: 'get'
    })
}
// export function findArtists(params){
//     return reqJsonData("manage/regUser/findByName",params,"get");
// }

export function getRandomContentImg(params) {
    return request({
      url: '/api/content/getRandomContentImg',
      params,
      method: 'get'
    })
  }