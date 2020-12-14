import request from '@/utils/request'
// import request from '@/utils/requestTest'

import { aut, postReq } from '@/api/public'
// export const passwordChangePath = aut + '/changePassword'
export const submitUserChange = aut + '/authUser/changePassword'

// 选择用户名
// export function queryTable(params) {
//   const param = { 'condition': null }
//   return request({
//     headers: {
//       'content-Type': 'application/json'
//     },
//     transformRequest: [function(data) {
//       data = JSON.stringify(data)
//       return data
//     }],
//     url: passwordChangePath,
//     method: postReq,
//     params: {},
//     data: param
//   })
// }

// 提交修改
export function submitChange(params) {
  const param = {
    'oldPassword': params.oldPassword,
    'newPassword': params.newPassword,
    'confirmPassword': params.confirmPassword
  }
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: submitUserChange,
    method: postReq,
    params: {},
    data: param
  })
}

// // 密码更新
// export function updatePass(params) {
//   return request({
//     headers: {
//       'content-Type': 'application/json'
//     },
//     transformRequest: [function(data) {
//       data = JSON.stringify(data)
//       return data
//     }],
//     url: submitUserChange,
//     method: postReq,
//     params: {},
//     data: {
//       'password': params.password,
//       'checkPass': params.checkPass
//     }
//   })
// }
