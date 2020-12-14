import request from '@/utils/request'
export const tablePath = '/test/table'

import { postReq } from '@/api/public'

export function queryTableData(params) {
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
    data: params
  })
}
