import request from '@root/publicMethods/request'


export function contentTagList(params) {
  return request({
    url: '/manage/contentTag/getList',
    params: Object.assign(params,{
      pageSize: 2000
    }),
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