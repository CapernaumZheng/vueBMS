import request from '@/utils/request'

export const postRequest = 'post'
export const getRequest = 'get'
export const modelListPath = '/reportModel/report_list'
export const positionPath = '/reportModel/positions'
export const modelAddPath = '/reportModel/report_add'
export const modelUpdatePath = '/reportModel/report_update'
export const modelDeletePath = '/reportModel/report_delete'
export const flipParam = { 'requestPath': modelListPath, 'requestParams': { 'modelName': null, 'reportType': null }}

// 查询模型列表
export function queryModelList(formData, footerParam) {
  if (footerParam === undefined) {
    footerParam = { 'pageSize': 10, 'pageIndex': 1 }
  }
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      // data = Qs.stringify(data)
      data = JSON.stringify(data)
      return data
    }],
    url: modelListPath,
    method: postRequest,
    params: {},
    data: Object.assign(formData, footerParam)
  })
}
// 查询职位信息
export function queryPosition(mechanism) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: modelListPath,
    method: postRequest,
    params: {}
  })
}
// 模型新增
export function modelAdd(params) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: modelAddPath,
    method: postRequest,
    params: {
      'mechanism': params.mechanism,
      'role_name': params.role_name,
      'eng_name': params.eng_name,
      'role_type': params.role_type,
      'system_data ': params.system_data,
      'use': params.use,
      'data_field': params.data_field,
      'role_power': params.role_power,
      'desc': params.desc
    }
  })
}
// 用户更新
export function modelUpdate(params) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: modelUpdatePath,
    method: postRequest,
    params: {
      'mechanism': params.mechanism,
      'role_name': params.role_name,
      'eng_name': params.eng_name,
      'role_type': params.role_type,
      'system_data ': params.system_data,
      'use': params.use,
      'data_field': params.data_field,
      'role_power': params.role_power,
      'desc': params.desc
    }
  })
}
// 用户删除
export function modelDelete(params) {
  let param = ''
  params.forEach((item, i) => {
    if (i === params.length - 1) {
      param += item.job_code
    } else {
      param += item.job_code + ','
    }
  })
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: modelDeletePath,
    method: postRequest,
    params: {
      'mechanism': param
    }
  })
}

