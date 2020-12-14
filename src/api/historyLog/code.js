import request from '@/utils/request'

export const postRequest = 'post'
export const machineNumberPath = '/cfgmgr/cmNodeAttrElklog/query_ByMachineNumber'

export function query_ByMachineNumber(params) {
  const param = { 'pagger': { 'current': '1', 'size': '10' }, 'condition': params }
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: machineNumberPath,
    method: postRequest,
    params: {},
    data: param
  })
}
