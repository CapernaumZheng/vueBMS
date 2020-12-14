// import request from '@/utils/requestName'
import request from '@/utils/request'

export const postRequest = 'post'
export const logNamePath = '/dictionary/common/query_ByPage'

export function query_ByLogName(params) {
  const param = { 'pagger': { 'current': '1', 'size': '10' }, 'condition': params }
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: logNamePath,
    method: postRequest,
    params: {},
    data: param
  })
}
