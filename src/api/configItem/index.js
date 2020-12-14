import request from '@/utils/request'
// import request from '@/utils/requestTest'
// import request2 from '@/utils/requestTest2'

import { ssh, postReq } from '@/api/public'
import { queryTreePath } from '../sysTree'
export const tablePath = ssh + '/cfgmgr/cmNodeAttr/getNodeAttributes' // 点击左侧节点编辑右侧表格
export const updateTech = ssh + '/cfgmgr/cmNodeAttr/replaceNodeAttributes' // 修改主中心子网提交接口
export const updateMachineType = ssh + '/cfgmgr/cmNodeAttr/replaceNodeAttributes' // 修改机器类型
export const updateMachine = ssh + '/cfgmgr/cmNodeAttr/replaceNodeAttributes' // 修改机器节点
// export const machinePath = dic + '/dictionary/common/query_ByPage' // 机器类型
export const machineInfo = ssh + '/cfgmgr/cmNodeAttr/getNodeAttributes' // 点击机器编辑右侧表格
export const updateSSH = ssh + '/cfgmgr/cmNodeAttr/updateSSH' // 批量传输
export const flipParam = { 'requestPath': tablePath, 'requestParams': { 'condition': { 'depth': '0', 'dataStatus': '1', 'remark': '设备配置树' }}}

// 请求树--渲染树
export function queryTree(node) {
  const params = {
    'condition': {
      'treeGroup': '8fd9b0bf7e4f417793f10e1d3bc590a6'
    },
    'pagger': { }
  }
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: queryTreePath,
    method: postReq,
    params: {},
    data: params
  })
}

// 点击左侧节点，右侧编辑表格
export function queryTable(params) {
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
    data: { 'nodeId': params.identId }
  })
}

// 机器类型select
/* export function queryMachineType(selectedNode) {
  const params = {
    'pagger': {
      'current': 1,
      'size': 20
    },
    'condition': {
      'nodeId': ''
    }
  }
  params.condition.nodeId = selectedNode.data.identId
  /!* params.condition.parentIdent = selectedNode.data.parentIdent
  params.condition.treeGroup = selectedNode.data.treeGroup*!/
  /!* params.condition.dataStatus = selectedNode.data.dataStatus*!/
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: machinePath,
    method: postReq,
    params: {},
    data: params
  })
}*/

// 添加子网之后点击“确认”
export function editTechCenter(formData, selectedNode, tableData) {
  const params = {
    'nodeId': '',
    'note': '',
    'code': ' ',
    'subNetPojos': [
      {
        'ack': '',
        'netIpAddr': '',
        'subNetId': '',
        'tcp': '',
        'udp': '',
        'udpAutoSwitch': ''
      }
    ]
  }
  params.nodeId = selectedNode.data.identId
  params.note = selectedNode.data.remark1
  params.code = formData.code
  params.subNetPojos = tableData
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: updateTech,
    method: postReq,
    data: params
  })
}

// 修改机器类型后点击“确认”
export function editMachineType(formData, node) {
  const params = {
    'nodeId': '',
    'note': '',
    'isMiddleware': ''
  }
  params.nodeId = node.data.identId
  params.note = node.data.remark1
  params.isMiddleware = formData.middleware
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

// 修改机器节点后点击“确认”
export function editMachine(formData, node, machineNodeTable) {
  const params = {
    'nodeId': '',
    'code': '',
    'note': '',
    'nodeIpPojos': [],
    'user': '',
    'pwd': '',
    'ip': '',
    'port': '',
    'tradeUser': '',
    'tradePwd': '',
    'machineType': '', // 机器类型
    'selfMachineType': '', // 自定类型
    'selfCode': '', // 自定索引
    'isSpare': '', // 是否备用
    'machineLocation': '' // 机器位置
  }
  machineNodeTable.forEach((item, i) => {
    const obj = {
      'ip': '',
      'ipAddr': '',
      'nodeId': '',
      'subNetId': ''
    }

    if (!item.ip) {
      obj.ipAddr = ''
    } else {
      obj.ipAddr = item.ip // ip地址
    }
    obj.ip = item.netIpAddr // 子网ip
    obj.nodeId = node.data.id // 节点id
    obj.subNetId = item.subNetId // 子网编号
    params.nodeIpPojos.push(obj)
  })

  params.nodeId = node.data.identId
  params.code = formData.machine_code
  params.note = node.data.remark1
  params.user = formData.name
  params.pwd = formData.password
  params.ip = formData.ip
  params.port = formData.port
  params.tradeUser = formData.deal_account
  params.tradePwd = formData.deal_password
  params.machineType = formData.machine_type
  params.selfMachineType = formData.custom_type
  params.selfCode = formData.custom_index
  params.isSpare = formData.reserve
  params.machineLocation = formData.machine_position
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: updateMachine,
    method: postReq,
    data: params
  })
}

// 点击机器编辑右侧表格
export function queryMachineInfo(node) {
  const params = {
    'nodeId': ''
  }
  params.nodeId = node.data.identId
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: machineInfo,
    method: postReq,
    data: params
  })
}

// 批量传输管理
export function updateSSHSubmit(transform, selectedMachine) {
  const params = {
    'condition': {
      'username': '',
      'password': '',
      'cMNodeList': []
    }
  }
  selectedMachine.forEach((item, i) => {
    const obj = {}
    obj.nodeId = item.identId
    params.condition.cMNodeList.push(obj)
  })
  params.condition.username = transform.name
  params.condition.password = transform.password
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: updateSSH,
    method: postReq,
    data: params
  })
}

