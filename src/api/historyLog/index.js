import request from '@/utils/request'

export const postRequest = 'post'
export const applyPath = '/dictionary/application'
// export const machineNumberPath = '/cfgmgr/cmNodeAttrElklog/query_ByMachineNumber'
// export const logNamePath = '/ElkLog/query_ByLogName'
export const historyLogListPath = '/elksearch/historyLogSearch'
export const flipParam = { 'requestPath': historyLogListPath, 'requestParams': { 'condition': { 'startTime': null, 'endTime': null, 'service': null, 'msg': null, 'nodeIds': null, 'fileName': null }}}

export function historyLogSearch(formData, footerParam) {
  const param = { 'condition': formData, 'pagger': null }
  if (footerParam === undefined) {
    footerParam = { 'current': 1, 'size': 10 }
  }
  if (param.condition.fileName === '' || param.condition.fileName === null) {
    param.condition.fileName = 'ALL'
  } else if (param.condition.nodeIds.length === 0) {
    param.condition.nodeIds = ['1']
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
    url: historyLogListPath,
    method: postRequest,
    params: {},
    data: param
  })
}
