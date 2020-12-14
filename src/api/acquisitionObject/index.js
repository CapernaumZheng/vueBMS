import request from '@/utils/request'

import { postReq } from '@/api/public'
export const tablePath = '/acquisition_object/query/query_template'
export const treeInfoPath = '/acquisition_object/query/query_tree'
export const templatePath = '/acquisition_object/query/template_by_node'
export const flipParam = { 'requestPath': tablePath, 'requestParams': { 'condition': { 'code': null, 'name': null }}}

// 查询树
export function queryTree() {
  const params = {
    'condition': {
      'treeGroup': '8fd9b0bf7e4f417793f10e1d3bc590a6'
    },
    'pagger': {
      'size': 10000,
      'current': 1 }
  }
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: treeInfoPath,
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
    data: {}
  })
}
// 查询模板
export function queryTemplate(params) {
  return request({
    headers: {
      'content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: templatePath,
    method: postReq,
    params: {},
    data: params
  })
}
