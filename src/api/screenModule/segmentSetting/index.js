import request from '@/utils/request'

import { postReq, mnr } from '@/api/public'
export const netPointUpdatePath = mnr + '/configureReport/insertAndUpdateReport'
export const netPointDeletePath = mnr + '/configureReport/deleteReport'
export const netPointListPath = mnr + '/configureReport/queryReportInfo'
export const netPointAddPath = mnr + '/configureReport/insertAndUpdateReport'
export const flipParam = { 'requestPath': netPointListPath, 'requestParams': { 'condition': { 'value': null, 'remark': null }}}

// 查询接入点列表
export function queryNetPointList(formData, footerParam) {
  const params = { 'condition': formData }
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: netPointListPath,
    method: postReq,
    params: {},
    data: params
  })
}

// 网段修改
export function netPointUpdate(params) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: netPointUpdatePath,
    method: postReq,
    data: {
      'id': params.id,
      'value': params.addFormValue,
      'netField': params.addFormRemark
    }
  })
}

// 网段新增
export function netPointAdd(params) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: netPointAddPath,
    method: postReq,
    data: {
      'value': params.addFormValue,
      'netField': params.addFormRemark
    }
  })
}

// 网段删除
export function netPointDelete(params) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: netPointDeletePath,
    method: postReq,
    data: {
      'identId': params
    }
  })
}

