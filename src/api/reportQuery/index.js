import request from '@/utils/request'

import { postReq, mnr } from '@/api/public'
export const downLoadPath = mnr + '/MnReportDaily/exportSystemCap'

export function downloadTableList(param) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    responseType: 'blob',
    // responseType: 'arraybuffer',
    url: downLoadPath,
    method: postReq,
    params: { 'condition': param },
    data: { 'condition': param }
  })
}

