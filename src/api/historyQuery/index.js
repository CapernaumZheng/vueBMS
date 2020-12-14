import request from '@/utils/request'

import { postReq } from '@/api/public'
export const treePath = '/event_monitoring/history/history_tree'
export const tablePath = '/event_monitoring/history/history_table'
export const flipParam = { 'requestPath': tablePath, 'requestParams': { 'condition': { 'startDate': null, 'endDate': null, 'eventType': null, 'warningLevel': null, 'machineName': null, 'machineType': null }}}

// 查询树
export function queryTree(params) {
  return request({
    headers: {
      'content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: treePath,
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
      'content-Type': 'application/json'
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
