import { subtractArray } from '@/utils/index'
// table数据追加
export function addToTable(current, tableData, obj, unique) {
  if (obj && tableData) {
    if (unique && unique.length > 0 && tableData.length > 0) {
      let exist = false
      for (var value of tableData) {
        if (value[unique] === obj[unique]) {
          exist = true
          break
        } else {
          continue
        }
      }
      if (!exist) {
        current.$set(tableData, tableData.length, obj)
      }
    } else {
      current.$set(tableData, tableData.length, obj)
    }
  }
}

// table数据按索引增加
export function addToTableByIndex(tableData, obj, index) {
  tableData.splice(index + 1, 0, obj)
}

// table数据按索引删除
export function deleteFromTable(current, tableData, index) {
  tableData.splice(index, 1)
}

// table数据批量删除
export function batchDeleteTable(current, tableData, batchArray) {
  const leaveArray = subtractArray(tableData, batchArray, 'difference')
  const tableLength = tableData.length
  for (var i = 0; i < tableLength; i++) {
    deleteFromTable(current, tableData, 0)
  }
  leaveArray.forEach((item, i) => {
    addToTable(current, tableData, item)
  })
}

// table数据上移
export function moveUpTable(tableData, index) {
  if (index === 0) {
    // 数据已经置顶
  } else {
    tableData.splice(index - 1, 1, ...tableData.splice(index, 1, tableData[index - 1]))
  }
}
// table数据下移
export function moveDownTable(tableData, index) {
  if (index === tableData.length - 1) {
    // 数据已经置底
  } else {
    tableData.splice(index + 1, 1, ...tableData.splice(index, 1, tableData[index + 1]))
  }
}
// checkbox设置某一条不可选
export function selectable(row, index, disabledIndex) {
  if (index === disabledIndex) {
    return false
  } else {
    return true
  }
}
