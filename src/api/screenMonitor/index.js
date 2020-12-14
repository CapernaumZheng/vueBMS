import request from '@/utils/request'

import { postReq, mss } from '@/api/public'
export const userResetPath = mss + '/MonitorOrder/queryMemberOrder'
export const ReportListCountPath = mss + '/Monitorlogin/queryLogin'
export const frontEndCountPath = mss + '/Monitorlogin/queryLoginTrade'
export const frontEndUpLoadSpeedPath = mss + '/StreamSpeed/queryUpstream'
export const frontEndDownLoadSpeedPath = mss + '/StreamSpeed/queryDownstream'
export const timeDelayNubmerPath = mss + '/StreamSpeed/querydelay'
export const realTimeDataPath = mss + '/MonitorOrder/queryOrder'

// 查询报单排行
export function getReportList() {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: userResetPath,
    method: postReq,
    params: {},
    data: {}
  })
}

// 在线会员席位数
export function getReportListCount() {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: ReportListCountPath,
    method: postReq,
    params: {},
    data: {}
  })
}

// 查询前置机席位数
export function frontEndCount() {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: frontEndCountPath,
    method: postReq,
    params: {},
    data: {}
  })
}

// 获取上行最大最小速度

export function frontEndUpLoadSpeed() {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: frontEndUpLoadSpeedPath,
    method: postReq,
    params: {},
    data: {}
  })
}

// 下行最大最小速度
export function frontEndDownLoadSpeed() {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: frontEndDownLoadSpeedPath,
    method: postReq,
    params: {},
    data: {}
  })
}

// 时延最大最小平均速值
export function timeDelayNubmer() {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: timeDelayNubmerPath,
    method: postReq,
    params: {},
    data: {}
  })
}

// 报单笔数，保单量，成交笔数，成交量，撤单笔数，撤单量
export function realTimeData() {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: realTimeDataPath,
    method: postReq,
    params: {},
    data: {}
  })
}
