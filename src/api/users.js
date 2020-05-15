import request from '@/utils/request'

export function getUserList(data) {
  return request({
    url: '/user/queryUser',
    method: 'get',
    params:data
  })
}
export function getUser(data) {
  return request({
    url: '/user/getUserInfoById',
    method: 'get',
    params:data
  })
}
export function createUser(data) {
  return request({
    url: '/user/addUser',
    method: 'post',
    data
  })
}
export function updateUser(data) {
  return request({
    url: '/user/updateUser',
    method: 'post',
    data
  })
}
export function deleteUser(data) {
  return request({
    url: '/user/deleteUser',
    method: 'post',
    data
  })
}

export function getRoleGroupList(data) {
  return request({
    url: '/user/queryRoles',
    method: 'get',
    params:data
  })
}
