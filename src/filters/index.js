// set function parseTime,formatTime to filter
export { parseTime, formatTime } from '@/utils'

function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

// 将事件戳转化为日期
export function timestampToTime(timestamp) {
  var date = new Date(timestamp)
  var Y = date.getFullYear() + '-'
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  var D = date.getDate() + ' '
  var h = date.getHours() + ':'
  var m = date.getMinutes() + ':'
  var s = date.getSeconds()
  return Y + M + D + h + m + s
}

// 将2018/11/16格式时间转化为时间戳
export function formatSlashTime(time) {
  time = time.split('/')[0] + '-' + time.split('/')[1] + '-' + time.split('/')[2]
  time = time.substring(0, 19)
  time = time.replace(/-/g, '/')
  var timestamp = new Date(time).getTime()
  return timestamp
}

export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/* 数字 格式化*/
export function numberFormatter(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

export function toThousandslsFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

export function NetSpeedFilter(num) {
  if (num >= 1024) {
    return (Math.round(num / 1024)).toString() + 'Mb/s'
  } else if (num < 1024) {
    return (num.toString() + 'Kb/s')
  }
}

export function highLightTableMsg(msg, highLightStr) {
  if (msg == null) {
    msg = ''
  }
  if (highLightStr == null) {
    highLightStr = ''
  }
  if (msg instanceof Object) {
    msg = JSON.stringify(msg)
  }
  if (highLightStr instanceof Object) {
    highLightStr = JSON.stringify(highLightStr)
  }
  if (!(msg instanceof String)) {
    msg = msg.toString()
  }
  if (!(highLightStr instanceof String)) {
    highLightStr = highLightStr.toString()
  }
  var htmlStr = ''
  if (highLightStr.length > 0) {
    if (msg.indexOf(highLightStr) !== -1) {
      assemblyStr(msg, highLightStr)
    } else {
      htmlStr = '<span>' + msg + '</span>'
    }
  } else {
    htmlStr = '<span>' + msg + '</span>'
  }
  function assemblyStr(msgAssembly, highLightAssembly) {
    if (msgAssembly.indexOf(highLightAssembly) !== -1) {
      var length = highLightAssembly.length
      var start = msgAssembly.indexOf(highLightAssembly)
      htmlStr = htmlStr + '<span>' + msgAssembly.substring(0, start) + '</span>' + '<span class="log-hight-light">' + highLightAssembly + '</span>'
      msgAssembly = msgAssembly.substring(start + length, msgAssembly.length)
      assemblyStr(msgAssembly, highLightAssembly)
    } else {
      htmlStr = htmlStr + '<span>' + msgAssembly + '</span>'
    }
  }
  return htmlStr
}
