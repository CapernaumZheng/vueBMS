// import request from '@/utils/requestTest'
import request from '@/utils/request'

import { postReq, aut } from '@/api/public'
import { assemblyParam } from '@/utils/index'
import { postListPath } from '../postConfig'
// import { positionPath, userListPath } from '../peopleManage '
export const userListPath = aut + '/authPostDeptMap/queryDeptPositionUsers'
export const treePath = aut + '/authPostDeptMap/findDeptPostAysTreeByParentId'
// export const leftTablePath = '/authPostDeptMap/queryDeptPositionUsers'
export const rightTablePath = aut + '/authUser/queryUsersDetail'
export const addPath = aut + '/authPostDeptMap/replaceDeptPositionUsers'
export const deletePath = aut + '/authPostDeptMap/deletePositionDeptMappings'
export const flipParam = { 'requestPath': userListPath, 'requestParams': { 'condition': { 'dept': null }}}
export const rightParam = { 'requestPath': rightTablePath, 'requestParams': { 'condition': { 'name': null }}}
// export const leftParam = { 'requestPath': leftTablePath, 'requestParams': { 'condition': { 'dept': null, 'position': null }}}
// 树查询
export function queryTree(params) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: treePath,
    method: postReq,
    params: {},
    data: { 'id': params.id, 'type': params.type }
  })
}

// 如果点击的节点是部门，查询右侧表格数据
export function queryTable(params, footerParam, inside) {
  const param = { 'pagger': null, 'condition': {}}
  if (inside) {
    param.condition.post = params.post
  } else {
    param.condition.dept = params.id
  }
  if (footerParam === undefined) {
    footerParam = { 'size': 10, 'current': 1 }
  }
  param.pagger = footerParam
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: userListPath,
    method: postReq,
    params: {},
    data: param
  })
}

// 查询职位信息
export function queryPosition(footerParam) {
  const param = {
    'condition':
      { 'code': null, 'postName': '', 'selectMenuInfo': true },
    'pagger': { 'size': 1024, 'current': 1 }
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
    data: param
  })
}

// 查询员工信息
export function queryUsers(formData) {
  const params = { 'pagger': { 'size': 10, 'current': 1 }, 'condition': formData }
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: rightTablePath,
    method: postReq,
    params: {},
    data: params
  })
}

// 岗位部门维护新增及更新
export function sectorAddSubmit(params) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: addPath,
    method: postReq,
    params: {
    },
    data: assemblyParam(params, ['deptId', 'postId', 'id'], ['deptId', 'postId', 'userId'])
  })
}

// 岗位部门删除
export function sectorDeleteSubmit(params) {
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
    params: {},
    data: assemblyParam(params, ['dept', 'post', 'password'], ['deptId', 'postId', 'id'])
  })
}
