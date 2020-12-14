// import request from '@/utils/requestTest'
import request from '@/utils/request'

import { postReq, aut } from '@/api/public'
import { assemblyParam } from '@/utils/index'
export const departmentPath = aut + '/authDept/getAuthDeptByParm'
export const userListPath = aut + '/authUser/queryUsersDetail' + '?t=' + new Date().getTime()
export const positionPath = aut + '/authPost/findPostInfo'
export const userAddPath = aut + '/authUser/replaceUser'
export const userUpdatePath = aut + '/authUser/replaceUser'
export const userDeletePath = aut + '/authUser/deleteUsers'
export const userFrozenPath = aut + '/authUser/lockUsers'
export const userUnFrozenPath = aut + '/authUser/untieUsers'
export const userResetPath = aut + '/authUser/resetUsersPassword'
export const flipParam = { 'requestPath': userListPath, 'requestParams': { 'condition': { 'code': null, 'name': null }}}

// 查询部门列表（无用）
export function getDepartment(portPath, requestType, params) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: portPath,
    method: requestType,
    params: {},
    data: params
  })
}
// 查询用户列表
export function queryUserList(formData, footerParam) {
  const params = { 'condition': formData, 'pagger': null }
  if (footerParam === undefined) {
    footerParam = { 'size': 10, 'current': 1 }
  }
  params.pagger = footerParam
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: userListPath,
    method: postReq,
    params: {},
    data: params
  })
}
// 查询职位信息（无用）
export function queryPosition() {
  const param = {
    'condition': { 'selectMenuInfo': true },
    'pagger': { 'size': 1024, 'current': 1 }
  }
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: positionPath,
    method: postReq,
    data: param
  })
}
// 用户新增
export function userAdd(params) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: userAddPath,
    method: postReq,
    data: {
      'code': params.code,
      'name': params.name,
      'mail': params.email,
      'dept': params.departmentId,
      'mobile': params.phone,
      'post': params.position,
      'phone': '',
      'remark': '',
      'isAdmin': params.isAdmin,
      'password': params.loginPwd
    }
  })
}
// 用户更新
export function userUpdate(params) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: userUpdatePath,
    method: postReq,
    data: {
      'id': params.id,
      'code': params.code,
      'name': params.name,
      'mail': params.email,
      'dept': params.departmentId,
      'mobile': params.phone,
      'post': params.position,
      'phone': '',
      'remark': '',
      'isAdmin': params.isAdmin,
      'password': params.loginPwd
    }
  })
}
// 用户删除
export function userDelete(params) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: userDeletePath,
    method: postReq,
    data: assemblyParam(params, ['id'], ['id'])
  })
}
// 用户冻结
export function frozenUsers(selectUsers) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: userFrozenPath,
    method: postReq,
    data: assemblyParam(selectUsers, ['id'], ['id'])
  })
}
// 用户解冻
export function unFrozenUsers(selectUsers) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: userUnFrozenPath,
    method: postReq,
    data: assemblyParam(selectUsers, ['id'], ['id'])
  })
}
// 用户密码重置（无用）
export function resetUsers(selectUsers) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: userResetPath,
    method: postReq,
    data: assemblyParam(selectUsers, ['id'], ['id'])
  })
}
