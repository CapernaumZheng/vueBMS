import request from '@/utils/request'

import { postReq } from '@/api/public'
export const templateListPath = '/template_setting/template_list'
export const indicatorsLibrary = '/template_setting/indicators_library'
export const flipParam = { 'requestPath': templateListPath, 'requestParams': { 'condition': { 'code': null, 'name': null }}}

// 查询模板列表
export function queryTemplateList(params) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: templateListPath,
    method: postReq,
    params: {},
    data: params
  })
}

// 查询模板列表
export function queryIndicatorsLibrary(params) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: indicatorsLibrary,
    method: postReq,
    params: {},
    data: params
  })
}

