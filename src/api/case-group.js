import request from '@/utils/request'

export function fetchCaseGroupList(data) {
  return request({
    url: '/caseGroup/user/queryByPage',
    method: 'get',
    params:data
  })
}
export function deleteCaseGroup(data) {
  return request({
    url: '/caseGroup/delete',
    method: 'post',
    data
  })
}
export function createCaseGroup(data) {
  return request({
    url: '/caseGroup/add',
    method: 'post',
    data
  })
}









