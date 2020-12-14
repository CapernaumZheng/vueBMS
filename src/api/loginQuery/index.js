import request from '@/utils/request'

import { aut, postReq } from '@/api/public'
export const loginOut = aut + '/logAndlogin/cancelLoginInfo'
export const tablePath = aut + '/logAndlogin/queryLoginInfo'
export const getUserList = aut + '/authUser/queryUsersDetail'
export const flipParam = { 'requestPath': tablePath, 'requestParams': { 'condition': { 'loginTime': null, 'loginTime2': null, 'loginUserName': null }}}

// 选择用户名
export function chooseUserName(footerParam) {
  const params = { 'condition': null, 'pagger': null }
  if (footerParam === undefined) {
    footerParam = { 'size': 2000000, 'current': 1 }
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
    url: getUserList,
    method: postReq,
    params: {},
    data: params
  })
}
// 查询表格
export function queryTable(formData, footerParam) {
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
    url: tablePath,
    method: postReq,
    params: {},
    data: params
  })
}

// 注销操作
export function submitChange(params) {
  const param = { 'condition': { 'token': params }}
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: loginOut,
    method: postReq,
    params: {},
    data: param
  })
}
