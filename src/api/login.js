// import request from '@/utils/requestTest'
import request from '@/utils/request'

import { aut } from '@/api/public'
export const loginPath = aut + '/authUser/userLogin'
export const logoutPath = aut + '/authUser/loginOut'
export const userInfoPath = aut + '/resMenu/findMenuInfoByUserInfo'

export function loginByUsername(code, password) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: loginPath,
    method: 'post',
    data: {
      code,
      password
    }
  })
}

export function getUserInfo(token) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: userInfoPath,
    method: 'post',
    data: { token }
  })
}

export function logout() {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: logoutPath,
    method: 'post'
  })
}
