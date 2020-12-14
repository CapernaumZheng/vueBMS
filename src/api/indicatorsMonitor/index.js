import request from '@/utils/request'

import { postReq } from '@/api/public'
export const treePath = '/indicators_monitor/query/indicators_tree'
export const defaultTablePath = '/indicators_monitor/query/default_table'
export const customTablePath = '/indicators_monitor/query/custom_table'
export const allTemplatesPath = '/indicators_monitor/query/custom_table/all_templates'
export const indicatorsPath = '/indicators_monitor/query/custom_table/all_indicators'
export const flipParam = { 'requestPath': defaultTablePath, 'requestParams': { 'condition': { 'startDate': null, 'endDate': null, 'eventType': null, 'warningLevel': null, 'machineName': null, 'machineType': null }}}

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

// 定制图表 查询默认表格
export function queryDefaultTable() {
  return request({
    headers: {
      'content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: defaultTablePath,
    method: postReq,
    params: {},
    data: {}
  })
}

// 定制图表 查询定制表格
export function queryCustomTable() {
  return request({
    headers: {
      'content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: customTablePath,
    method: postReq,
    params: {},
    data: {}
  })
}

// 定制图表 查询所有模板
export function queryAllTemplates() {
  return request({
    headers: {
      'content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: allTemplatesPath,
    method: postReq,
    params: {},
    data: {}
  })
}

// 定制图表 查询该模板下的所有指标
export function queryAllIndicators(template) {
  return request({
    headers: {
      'content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: indicatorsPath,
    method: postReq,
    params: {},
    data: template
  })
}
