import request from '@/utils/request'


export function getCaseList(data) {
  return request({
    url: '/case/user/queryByPage',
    method: 'get',
    params:data
  })
}

export function getCase(data) {
  return request({
    url: '/case/user/queryById',
    method: 'get',
    params:data
  })
}
export function createCase(data) {
  return request({
    url: '/case/add',
    method: 'post',
    data
  })
}
export function updateCase(data) {
  return request({
    url: '/case/update',
    method: 'post',
    data
  })
}
export function deleteCase(data) {
  return request({
    url: '/case/delete',
    method: 'post',
    data
  })
}


export function getCaseGroupList(data) {
  return request({
    url: '/case/user/queryCaseGroup',
    method: 'get',
    params:data
  })
}

