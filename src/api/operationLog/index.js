import request from '@/utils/request'

import { aut, postReq } from '@/api/public'
export const passwordChangePath = aut + '/authUser/queryUsersDetail'
export const tablePath = aut + '/logAndlogin/queryLogInfo'
export const searchPath = aut + ''
export const flipParam = { 'requestPath': tablePath, 'requestParams': { 'condition': { 'startTime': null, 'endTime': null, 'explainMsg': null, 'createUserName': null }}}

// 选择用户名
export function chooseUserName(footerParam) {
  const params = { 'condition': null, 'pagger': null }
  if (footerParam === undefined) {
    footerParam = { 'size': 200000, 'current': 1 }
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
    url: passwordChangePath,
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

// 模糊查询 (无用)
export function querySelect(params) {
  const param = { 'condition': null }
  return request({
    headers: {
      'content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: searchPath,
    method: postReq,
    params: {},
    data: param
  })
}
