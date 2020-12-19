import request from '@root/publicMethods/request'
let reqJsonData =function(url,params,method="post"){
  return request({
    url: "/"+url,
    params:params,
    data:params,
    method: method
  })
  
};

export function list(params,strMod="artist") {
    return request({
        url: '/manage/'+strMod+'/getList',
        params:params,
        data:params,
        method: 'get'
    })
}
export function updateToTop(data,strMod="artist") {
    return reqJsonData('manage/'+strMod+'/top', data)
}

export function roof(params,strMod="artist") {
    return reqJsonData('manage/'+strMod+'/roof', params)
}

export function remove(params,strMod="artist") {
    return reqJsonData('manage/'+strMod+'/delete', params, 'get')
}

export function getOne(params,strMod="artist") {
    return reqJsonData('manage/'+strMod+'/getOne', params, 'get')
}

export function addOne(data,strMod="artist") {
    return request({
        url: '/manage/'+strMod+'/addOne',
        data,
        method: 'post'
    })
}
export function updateOne(data,strMod="artist") {
    return request({
        url: '/manage/'+strMod+'/updateOne',
        data,
        method: 'post'
    })
}
// 添加用户
export function addUser(data) {
    return request({
        url: '/manage/regUser/addOneName',  
        data,
        params:data,
        method: 'post',
    })
}

// 查找乐手
export function findMembers(data) {
    return request({
        url: '/manage/regUser/findByName',
        data:data,
        method: 'get'
    })
}


export function getRandomContentImg(params) {
    return request({
      url: '/api/content/getRandomContentImg',
      params,
      method: 'get'
    })
}