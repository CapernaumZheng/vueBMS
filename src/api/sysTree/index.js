import request from '@/utils/request'
// import request from '@/utils/requestTest'

import { dic, ssh, postReq } from '@/api/public'
import { assemblyParam } from '@/utils/index'
export const treeInfoPath = dic + '/dictionary/tree/query_ByPage'
export const queryTreePath = dic + '/dictionary/tree/query_ByPage'
export const modifyTreeNodePath = dic + '/dictionary/tree/update'
export const addTreeNodePath = dic + '/dictionary/tree/add'
export const deleteTreePath = dic + '/dictionary/tree/delete'
export const updateTreeNodePath = dic + '/dictionary/tree/updateBath'
export const updateMachineType = ssh + '/cfgmgr/cmNodeAttr/replaceNodeAttributes' // 修改机器类型(该接口为了解决‘中间件使用’问题)
export const flipParam = { 'requestPath': treeInfoPath, 'requestParams': { 'condition': { 'depth': '0', 'dataStatus': '1', 'remark': '设备配置树' }}}

// 查询系统树信息(已弃！暂不需要)
export function querySysTreeInfo(formData, footerParam) {
  const params = {
    'condition': { 'depth': '0', 'dataStatus': '0', 'remark': '' },
    'pagger': { }
  }
  if (footerParam === undefined) {
    footerParam = { 'size': 1024, 'current': 1 }
  }
  params.pagger = footerParam
  params.condition.remark = formData.name
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

// 查询树的子节点（画树）
export function queryTree(node) {
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

// 新增树的子节点
export function addNode(selectedNode, name) {
  let params = Object.assign(selectedNode.data, { 'addNodeName': name, 'addNodeDepth': selectedNode.data.depth + 1 })
  console.log(params)
  params = assemblyParam(params, ['type', 'code', 'addNodeName', 'addNodeDepth', 'identId', 'code'], ['type', 'code', 'value', 'depth', 'parentIdent', 'parentCode'])
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: addTreeNodePath,
    method: postReq,
    params: {},
    data: params
  })
}

// 点击保存--修改树的子节点名称
export function editNode(selectedNode, addEditform) {
  const params = {
    'condition': {
      'value': '', // 名称
      'remark1': '', // 说明
      'identId': '', // 当前节点的identId
      'id': ''
    }
  }
  params.condition.value = addEditform.name
  params.condition.remark1 = addEditform.desc
  params.condition.identId = selectedNode.data.identId
  params.condition.id = selectedNode.data.id
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: modifyTreeNodePath,
    method: postReq,
    params: {},
    data: params
  })
}

// 删除子节点
export function deleteChild(selectedNode) {
  const params = {
    'condition': [
      {
        'id': '',
        'identId': ''
      }
    ],
    'pagger': {}
  }
  params.condition[0].id = selectedNode.data.id
  params.condition[0].identId = selectedNode.data.identId
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: deleteTreePath,
    method: postReq,
    params: {},
    data: params
  })
}

// 拖拽子节点后刷新
export function refreshDropTree(dropNode) {
  const params = {
    'condition': []
  }
  dropNode.parent.childNodes.forEach((item, i) => {
    const obj = {}
    obj.id = item.data.id
    obj.orderr = item.data.orderr
    params.condition.push(obj)
  })
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: updateTreeNodePath,
    method: postReq,
    params: {},
    data: params
  })
}

// 刷新树节点
export function refreshTree() {
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

// 中心节点新增成功后需在返回中调用此接口一次，使后台知道“使用中间件”的时机
export function editMachineType(newNodeIdentId) {
  const params = {
    'nodeId': '',
    'note': '',
    'isMiddleware': '5fc1229fd66c11e8a05800505698e995'
  }
  params.nodeId = newNodeIdentId
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: updateMachineType,
    method: postReq,
    data: params
  })
}
