import request from '@/utils/request'

export function getWarning(username, password) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: '/system/warning',
    method: 'post',
    data: {}
  })
}
