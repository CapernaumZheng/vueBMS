import request from '@/utils/request'

import { postReq, dic } from '@/api/public'
export const submitTableChange = dic + '/dictionary/updateSystemParms'
export const tablePath = dic + '/dictionary/querySystemParms'
export const flipParam = { 'requestPath': tablePath, 'requestParams': { 'condition': { 'remark2': null }}}

// 查询表格
export function queryParamTable(formData, footerParam) {
  const params = { 'condition': formData }
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

// 提交修改
export function submitChange(params, subParms) {
  const param = {
    'value': params.value,
    'identId': params.identId,
    'subParms': subParms
  }
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: submitTableChange,
    method: postReq,
    params: {},
    data: param
  })
}
