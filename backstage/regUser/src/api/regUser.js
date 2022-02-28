import request from '@root/publicMethods/request'


export function regUserList(params) {
  return request({
    url: '/manage/regUser/getList',
    method: 'get',
    params
  })
}

export function getOneRegUser(params) {
  return request({
    url: '/manage/regUser/getOne',
    method: 'get',
    params
  })
}

export function updateRegUser(data) {
  return request({
    url: '/manage/regUser/updateOne',
    method: 'post',
    data
  })
}
// 按姓名增加
export function addRegUserByName(data) {
  return request({
    url: '/manage/regUser/addOneName',
    method: 'post',
    data
  })
}
export function deleteRegUser(params) {
  return request({
    url: '/manage/regUser/deleteUser',
    method: 'get',
    params
  })
}