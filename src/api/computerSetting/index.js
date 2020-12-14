import request from '@/utils/request'

import { postReq } from '@/api/public'
export const tablePath = '/computer_setting/query_right_table'

// 向右添加数据
export function queryTable(selectedMachine) {
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
    data: {}
  })
}
