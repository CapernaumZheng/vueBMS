// 两个数组求并集，交集，差集
// 接受三个参数，第一个数组，第二个数组，处理类型type：union，intersect，difference
export function subtractArray(arryFirst, arrySecond, type) {
  const a = new Set(arryFirst)
  const b = new Set(arrySecond)
  let handleArray = new Set([])

  if (type && type === 'union') {
    // 并集
    handleArray = new Set([...a, ...b])
  } else if (type && type === 'intersect') {
    // 交集
    handleArray = new Set([...a].filter(x => b.has(x)))
  } else if (type && type === 'difference') {
    // 差集
    handleArray = new Set([...a].filter(x => !b.has(x)))
  } else {
    console.error('处理类型需为union，intersect，difference之一，错误的处理类型！无法处理')
  }
  return Array.from(handleArray) // set转数组
}

// 数组升序排序, transNum是否要转化为数字
export function compareUp(array, propertyName, transNum) { // 升序排序
  if (transNum) {
    return function(object1, object2) { // 属性值为数字
      var value1 = object1[propertyName] * 1
      var value2 = object2[propertyName] * 1
      return value1 - value2
    }
  } else {
    if ((typeof array[0][propertyName]) !== 'number') { // 属性值为非数字
      return function(object1, object2) {
        var value1 = object1[propertyName]
        var value2 = object2[propertyName]
        return value1.localeCompare(value2)
      }
    } else {
      return function(object1, object2) { // 属性值为数字
        var value1 = object1[propertyName]
        var value2 = object2[propertyName]
        return value1 - value2
      }
    }
  }
}

// 数组降序排序
export function compareDown(array, propertyName, transNum) { // 降序排序
  if (transNum) {
    return function(object1, object2) { // 属性值为数字
      var value1 = object1[propertyName] * 1
      var value2 = object2[propertyName] * 1
      return value2 - value1
    }
  } else {
    if ((typeof array[0][propertyName]) !== 'number') { // 属性值为非数字
      return function(object1, object2) {
        var value1 = object1[propertyName]
        var value2 = object2[propertyName]
        return value2.localeCompare(value1)
      }
    } else {
      return function(object1, object2) { // 属性值为数字
        var value1 = object1[propertyName]
        var value2 = object2[propertyName]
        return value2 - value1
      }
    }
  }
}

// 匹配数组中对象，返回索引
export function findMatchIndex(arr, element, value) {
  var results = []
  var len = arr.length
  var i = 0
  while (i <= len - 1) {
    if (arr[i][element] === value) {
      results.push(i)
    }
    i += 1
  }
  return results
}

// 获取数字型数组中最大值或最小值
export function getMaximin(arr, maximin) {
  if (maximin === 'max') {
    return Math.max.apply(Math, arr)
  } else if (maximin === 'min') {
    return Math.min.apply(Math, arr)
  }
}

// 数组去重，数字数组
export function numberArrayUnique(arr) {
  // 通过Set对象，对数组去重，结果又返回一个Set对象
  // 通过from方法，将Set对象转为数组
  return Array.from(new Set(arr))
}

// 数组去重，对象数组
// 参数一：对象数组，参数二：按对象的哪一个属性去重
export function objectArrayUnique(arr, objAttr) {
  var hash = {}
  var newArr = arr.reduceRight((item, next) => {
    hash[next[objAttr]] ? '' : hash[next[objAttr]] = true && item.push(next)
    return item
  }, [])
  return newArr
}
