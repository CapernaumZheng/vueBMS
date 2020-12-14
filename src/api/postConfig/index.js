// import request from '@/utils/requestTest'
import request from '@/utils/request'
import { postReq, aut } from '@/api/public'
import { assemblyParam } from '@/utils/index'

// export const postListPath = aut + '/postConfig/queryPostDetail'
export const postListPath = aut + '/authPost/findPostInfo'
export const postAddPath = aut + '/authPost/saveOrUpdatePost'
export const deletePath = aut + '/authPost/deletePostByParm'
export const updatePath = aut + '/authPost/saveOrUpdatePost'
export const departmentPath = aut + '/authDept/getAuthDeptByParm'
export const flipParam = { 'requestPath': postListPath, 'requestParams': { 'condition': { 'code': null, 'postName': null }}}

// 查询
export function queryPostList(formData, footerParam) {
  // const params = { 'condition': formData, 'pagger': null }
  if (footerParam === undefined) {
    footerParam = { 'size': 10, 'current': 1 }
  }
  if (formData.code === '') {
    formData.code = null
  }
  const param = {
    'condition':
      { 'code': formData.code, 'postName': formData.postName, 'selectMenuInfo': true },
    'pagger': footerParam
  }
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: postListPath,
    method: postReq,
    params: {},
    data: param
  })
}

// 新增
export function dicPostSubmit(params) {
  // const param = {
  //   pagger: {
  //     'current': '1',
  //     'size': '10'
  //   },
  //   condition: {
  //     'postCode': params.postCode,
  //     'postName': params.postName,
  //     'subsidiary': params.subsidiary,
  //     'leader': params.leader,
  //     'maintain': params.maintain,
  //     'authorization': params.authorization
  //   }
  // }
  const param = {
    'code': params.code,
    'postName': params.postName,
    'id': '',
    'multiple': params.multiple
  }
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: postAddPath,
    method: postReq,
    params: {},
    data: param
  })
}

// 更新
export function postUpdate(params) {
  const param = {
    'code': params.code,
    'postName': params.postName,
    'id': params.id,
    'multiple': params.multiple
  }
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: updatePath,
    method: postReq,
    params: {},
    data: param
  })
}

// 删除
export function postDelete(params) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: deletePath,
    method: postReq,
    data: assemblyParam(params, ['id'], ['id']).condition
  })
}

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
