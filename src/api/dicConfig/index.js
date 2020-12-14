import request from '@/utils/request'
// import request from '@/utils/requestTest'

import { dic, postReq } from '@/api/public'
export const treePath = dic + '/dictionary/common/query_ByPage'
export const tablePath = dic + '/dictionary/common/query_DicByPage'
export const dicAddPath = dic + '/dictionary/common/add'
export const dicUpdatePath = dic + '/dictionary/common/update'
export const dicDeletePath = dic + 'dictionary/ab/delete'
export const flipParam = { 'requestPath': tablePath, 'requestParams': { 'condition': { 'parentIdent': null, 'treeGroup': 'dic', 'dataStatus': '1' }}}

// 查询字典配置管理  展开树查询
export function queryDicTree(node) {
  let param = {
    'pagger': {
      'current': 1,
      'size': 1024
    },
    'condition': {
      'parentIdent': '0',
      'dataStatus': '2'
    }
  }
  if (node && node.data) {
    param = { 'pagger': {
      'current': 1,
      'size': 1024
    },
    'condition': {
      'parentIdent': node.data.identId === undefined ? '0' : node.data.identId,
      'dataStatus': '2'
    }}
  }
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
    data: param
  })
}

// 校验查询
export function queryUniqueCode(node, value) {
  let param = {
    'pagger': {
      'current': 1,
      'size': 1024
    },
    'condition': {
      'parentIdent': null,
      'dataStatus': '2',
      'treeGroup': null,
      'code': null

    }
  }
  if (node && node.data) {
    param = { 'pagger': {
      'current': 1,
      'size': 1024
    },
    'condition': {
      'parentIdent': node.data.identId === undefined ? '0' : node.data.identId,
      'dataStatus': '2',
      'treeGroup': node.data.treeGroup,
      'code': value
    }}
  }
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
    data: param
  })
}

// 如果点击节点，查询右侧表格数据
export function queryDicTable(params) {
  const param = {
    'pagger': {
      'current': 1,
      'size': 10
    },
    'condition': {
      'parentIdent': params !== null ? params.identId : null,
      'treeGroup': 'dic',
      'dataStatus': '1'
    }
  }
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
    data: param
  })
}

// 字典新增
export function dicAddSubmit(node, result, params) {
  const param = {
    'pagger': {
      'current': 1,
      'size': 10
    },
    'condition': {
      'parentCode': params.dicCode,
      'code': params.dicValue,
      'value': params.dicContent,
      'treeGroup': 'dic',
      'parentIdent': result.identId,
      'depth': result.depth,
      'relationship': result.relationship,
      'type': '1'
    }
  }
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: dicAddPath,
    method: postReq,
    params: {},
    data: param
  })
}

// 字典修改
export function dicUpdate(mul, result, params) {
  const param = {
    'pagger': {
      'current': 1,
      'size': 10
    },
    'condition': {
      'id': mul[0].id,
      'value': params.dicContent,
      'dataStatus': result.dataStatus + '',
      'depth': params.depth
    }
  }
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: dicUpdatePath,
    method: postReq,
    params: {},
    data: param
  })
}

// 字典删除
export function dicDelete(params) {
  const splicing = {
    'pagger': {
      'current': '1',
      'size': '5'
    },
    'condition': []
  }
  params.forEach((item, i) => {
    const obj = { 'id': item.id }
    splicing.condition.push(obj)
  })
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: dicDeletePath,
    method: postReq,
    params: {},
    data: splicing
  })
}

