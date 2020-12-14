import request from '@/utils/request'
export const postReq = 'post'
export const getReq = 'get'
export const aut = '/baseAuth'
export const dic = '/baseDictionary'
export const ssh = '/cfgmgr'
export const upg = '/upgrade'
export const mnr = '/mnReport'
export const alm = '/alarmmgr'
export const mss = '/messagesubscribe'
export function getDict(portPath, requestType, params) {
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
