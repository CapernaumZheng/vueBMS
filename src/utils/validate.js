export function isvalidUsername(str) {
  // const valid_map = ['admin', 'editor']
  // return valid_map.indexOf(str.trim()) >= 0
  // 用户登录名验证，暂无验证，直接返回true
  return true
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/* 含0的正整数*/
export function validatPositiveInt(str) {
  const reg = /^([1-9]\d*|[0]{1,1})$/
  return reg.test(str)
}

/* 不含0的正整数*/
export function validatInt(str) {
  const reg = /^[1-9]+\d*$/
  return reg.test(str)
}

/* 校验手机号码*/
export function validateMobile(str) {
  var mobile = /^1[3|5|8|7]\d{9}$/
  return mobile.test(str)
}

/* 校验座机号码*/
export function validatePhone(str) {
  var phone = /^0\d{2,3}-?\d{7,8}$/
  return phone.test(str)
}

/* 校验值唯一*/
export function validateUnique(str, strArray, uniqueId) {
  // 本身这个值应该已经在strArray这个数组中了，str的值找到两次代表不唯一
  let unique = true
  let findNum = 0
  for (var value of strArray) {
    if (value[uniqueId] === str) {
      findNum++
      if (findNum >= 2) {
        unique = false
        break
      } else {
        continue
      }
    } else {
      continue
    }
  }
  return unique
}

/* 网段验证*/
export function validateIP(str) {
  var ipAddress = /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/
  return ipAddress.test(str)
}

/* 合法文件路径校验 */
export function validatePath(str) {
  var pattern = /^[a-zA-Z]:(((\\(?! )[^/:*?<>\""|\\]+)+\\?)|(\\)?)\s*$/
  return pattern.test(str)
}

/* 是否含有中文*/
export function containChinese(str) {
  if (/.*[\u4e00-\u9fa5]+.*/.test(str)) {
    return true
  } else {
    return false
  }
}
