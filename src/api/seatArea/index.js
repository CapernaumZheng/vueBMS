import request from '@/utils/request'

import { postReq, mnr } from '@/api/public'
export const tablePath = mnr + '/mnSeatConfig/selectSeat'
export const seatAreaAddPath = mnr + '/mnSeatConfig/insertSeat'
export const seatAreaUpdatePath = mnr + '/mnSeatConfig/updateSeat'
export const membersPath = mnr + '/mnSeatConfig/getAllMember'
export const deletePath = mnr + '/mnSeatConfig/deleteSeat'// '/seat_area/query/delete'
export const uploadExcelPath = process.env.BASE_API + mnr + '/mnSeatConfig/uploadExcel'

// 查询所有席位区域
export function queryTable(formData) {
  const params = { 'condition': formData }
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

// 远程模糊匹配会员号
export function queryMembersCode(params) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: membersPath,
    method: postReq,
    params: {},
    data: params
  })
}

// 删除一个席位
export function deleteSeat(params) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: deletePath,
    method: postReq,
    data: {
      'seatNumber': params
    }
  })
}

// 新增一个席位
export function seatAreaAdd(params) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: seatAreaAddPath,
    method: postReq,
    data: {
      'seatIP': params.seatIP,
      'seatNumber': params.seatNumber,
      'member': params.member,
      'province': params.province,
      'city': params.city
    }
  })
}

// 席位修改
export function seatAreaUpdate(params) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [function(data) {
      data = JSON.stringify(data)
      return data
    }],
    url: seatAreaUpdatePath,
    method: postReq,
    data: {
      'seatIP': params.seatIP,
      'seatNumber': params.seatNumber,
      'member': params.member,
      'province': params.province,
      'city': params.city
    }
  })
}
