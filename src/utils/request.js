import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken, removeToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['Authorization'] = getToken()
    //  config.headers['token'] = getToken() // 后台对接时或交付后台时再启用
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
  /**
  * code为非20000是抛错 可结合自己业务进行修改
  */
    const res = response.data
    if (res.code !== '20000') {
      let message = '接口非正常返回！'
      if (res.code === '0') {
        if (res.msg) {
          message = res.msg
        }
        Message({
          showClose: true,
          message: message,
          type: 'error',
          duration: 5 * 1000
        })
      }
      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload()// 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      // return Promise.reject('error')
      if (response.data instanceof Blob) {
        return response
      } else {
        return response.data
      }
    } else {
      if (response.data instanceof Blob) {
        return response
      } else {
        return response.data
      }
    }
  },
  error => {
    console.log('err' + error)// for debug
    let message = '未知的错误！'
    if (error.msg) {
      message = error.msg
    }
    if (error.response.status === 504 || error.response.status === 404) {
      message = '服务器未启动或崩溃！'
    } else if (error.response.status === 403 || error.response.status === 401) {
      message = '您无权限访问！'
    } else if (error.response.status === 511) {
      setTimeout(function() { removeToken(); location.href = location.origin }, 5000)
      MessageBox.confirm('您的登录已经过期，5秒后自动退出登录，给您带来的不便，敬请谅解', '温馨提示', {
        confirmButtonText: '了解，立即退出',
        showCancelButton: false,
        closeOnClickModal: false,
        showClose: false,
        type: 'warning'
      }).then(() => {
        removeToken()
        location.href = location.origin
      })
    } else {
      message = '未知的错误！'
    }
    if (error.response.status !== 511) {
      Message({
        showClose: true,
        message: message,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service
