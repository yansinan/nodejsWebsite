import request from '@root/publicMethods/request'


export function contentTagList(params) {
  return request({
    url: '/manage/contentTag/getList',
    params,
    method: 'get'
  })
}
export function addContentTag(data) {
  return request({
    url: '/manage/contentTag/addOne',
    data,
    method: 'post'
  })
}
export function contentTagListOf(data) {
  return request({
    url: '/manage/contentTag/getListOf',
    data,
    method: 'post'
  })
}