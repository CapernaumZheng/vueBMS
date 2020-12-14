import { deepClone, compareUp, objectAssignment } from '@/utils/index'
// 选择叶子节点，追加到另一棵树中
export function moveTreeNode(data, node, treeData, treeRef) {
  if (node.childNodes.length === 0) {
    let hadNode = false
    for (var value of treeData) {
      if (value.id === data.id) {
        hadNode = true
        break
      } else {
        continue
      }
    }
    if (!hadNode) {
      const dataLenth = treeData.length
      treeRef.insertAfter(data, treeData[dataLenth - 1])
    }
  }
}

// 全量加载树的方法
// 移除树上的节点
export function removeTreeNode(theTree, node, data) {
  if (theTree && data) {
    theTree.remove(data)
  }
}

// 全量加载树的方法
// 追加子节点
// 接收三个参数，1.树链  2. 要追加的子节点的 data 3. 子节点的 parent 的 data、key 或者 node
export function appendChildTreeNode(theTree, data, parentNode) {
  if (theTree && data && parentNode) {
    theTree.append(data, parentNode)
  } else {
    console.error('无法执行追加子节点的操作，请检查传参格式！')
  }
}

// 全量加载树的方法
// 向节点前追加兄弟节点
// 接收三个参数，1.树链 2. 要增加的节点的 data 3. 要增加的节点的后一个节点的 data、key 或者 node
export function insertBeforeTreeNode(theTree, data, refNode) {
  if (theTree && data && refNode) {
    theTree.insertBefore(data, refNode)
  } else {
    console.error('无法执行追加兄弟节点的操作，请检查传参格式！')
  }
}

// 全量加载树的方法
// 向节点后追加兄弟节点
// 接收三个参数，1.树链 2. 要增加的节点的 data 3. 要增加的节点的前一个节点的 data、key 或者 node
export function insertAfterTreeNode(theTree, data, refNode) {
  if (theTree && data && refNode) {
    theTree.insertAfter(data, refNode)
  } else {
    console.error('无法执行追加兄弟节点的操作，请检查传参格式！')
  }
}

// 树的checkbox，将选中的节点push到数组中返回
// matchArray为数组，过滤掉不需要的节点
// matchArray：[{'attr':'type','value':'4'}]
// data为check-change方法触发（当前选中节点变化时触发的事件，当前节点的数据）
// indeterminate预留，暂无用
// 已通过其他方法实现，该方法暂无用
export function addToCheckedArray(matchArray, data, checked, indeterminate, selectArray) {
  if (matchArray && matchArray instanceof Array) {
    let matched = false
    matchArray.forEach((item, i) => {
      if (data[item['attr']] === item['value']) {
        matched = true
      } else {
        matched = false
      }
    })
    if (matched && checked) {
      selectArray.push(data)
    }
  } else {
    if (checked) {
      selectArray.push(data)
    }
  }
  return selectArray
}

// 树的checkbox,将取消勾选的节点从选中的数组中移除
// matchArray为数组，过滤掉需要的节点
// matchArray：[{'attr':'type','value':'4'}]
// removeAttr: 'id' 以何字段为标准来匹配选中的节点
// indeterminate预留，暂无用
// 已通过其他方法实现，该方法暂无用
export function removeFromCheckedArray(matchArray, removeAttr, data, checked, indeterminate, selectArray) {
  if (matchArray && matchArray instanceof Array) {
    let matched = false
    matchArray.forEach((item, i) => {
      if (data[item['attr']] === item['value']) {
        matched = true
      } else {
        matched = false
      }
    })
    if (matched && !checked) {
      try {
        selectArray.forEach(function(item, index) {
          if (item[removeAttr] === data[removeAttr]) {
            selectArray.splice(index, 1)
            throw new Error('EndIterative')
          }
        })
      } catch (e) {
        if (e.message !== 'EndIterative') throw e
      }
    }
  } else {
    if (!checked) {
      try {
        selectArray.forEach(function(item, index) {
          if (item[removeAttr] === data[removeAttr]) {
            selectArray.splice(index, 1)
            throw new Error('EndIterative')
          }
        })
      } catch (e) {
        if (e.message !== 'EndIterative') throw e
      }
    } else {
      console.log('无法移除！该节点为选中操作！')
    }
  }
}

// 懒加载树动态更新
export function refreshLazyTree(node, children) {
  var theChildren = node.childNodes
  theChildren.splice(0, theChildren.length)
  node.doCreateChildren(children)
}

// 全量加载树节点编辑-动态更新
// 树：this.$refs.treeOut
// 更新过的树节点data
// 选中的节点
export function refreshAllLoadTree(theTree, data, selectNode) {
  if (theTree && selectNode && data) {
    if (selectNode.nextSibling) {
      const nextNode = selectNode.nextSibling
      removeTreeNode(theTree, selectNode, selectNode.data)
      insertBeforeTreeNode(theTree, data, nextNode)
    } else if (selectNode.previousSibling) {
      const beforeNode = selectNode.previousSibling
      removeTreeNode(theTree, selectNode, selectNode.data)
      insertAfterTreeNode(theTree, data, beforeNode)
    } else {
      const parentNode = selectNode.parent
      removeTreeNode(theTree, selectNode, selectNode.data)
      appendChildTreeNode(theTree, data, parentNode)
    }
  } else {
    console.error('全量加载树节点的编辑，未传入树及选中节点！')
  }
}

// 清空树的数据
export function clearTree(theTree, hasHide) {
  if (theTree) {
    if (hasHide) {
      // 有隐藏条目的树，除了第一条隐藏，其他删除
      while (theTree.data.length > 1) {
        theTree.remove(theTree.data[theTree.data.length - 1])
      }
    } else {
      if (theTree.lazy) {
        // 是懒加载的树 暂未提供清空的方法
      } else {
        while (theTree.data.length > 0) {
          theTree.remove(theTree.data[theTree.data.length - 1])
        }
      }
    }
  }
}

// 手动收起树中所有展开的节点
export function collapseTree(theTree, isRoot) {
  if (isRoot) {
    if (theTree && theTree.root && theTree.root.childNodes[0]) {
      const node = theTree.root.childNodes[0]
      if (node.expanded) {
        node.collapse()
      }
      if (node.childNodes.length > 0) {
        collapseTree(node.childNodes, false)
      }
    }
  } else {
    const nodeArray = theTree
    for (var value of nodeArray) {
      if (value.expanded) {
        value.collapse()
        if (value.childNodes.length > 0) {
          collapseTree(value.childNodes, false)
        }
      } else {
        continue
      }
    }
  }
}

// 根据后端扁平化的数据生成树的数据格式
export function constructTree(data, rootTree) {
  var map = new Map()
  // 1、数据分割，按层级分割
  if (data) {
    for (var value of data) {
      // 这里的depth是后端数据库里的字段，里面会有其他写死的参数
      // depth为0的是根节点，1是第一层数据，2是第二层数据，3是第三层数据，依次类推
      if (value.depth) {
        if (map.get((value.depth + ''))) {
          map.get((value.depth + '')).push(value)
        } else {
          map.set((value.depth + ''), [])
          map.get((value.depth + '')).push(value)
        }
      } else {
        continue
      }
    }
    // 多塞一层空数据
    // 否则全量树同级最子节点拖拽排序的时候
    // 放置节点内删除拖拽节点会莫名其妙的不触发视图更新
    map.set((map.size + 1 + ''), [])
  } else {
    console.error('您未传入树的节点数据，无法绘制！')
    return []
  }

  if (treeProgressive(map)) {
    // 树的数据格式不正确
    return []
  } else {
    // 2、对map的数据再进行切割，按相同父级再次切割
    var treeLevel = map.size
    for (var i = 2; i <= treeLevel; i++) {
      var levelAttr = map.get((i + ''))
      var levelMap = new Map()
      for (var levelValue of levelAttr) {
        if (levelValue.parentIdent) {
          if (levelMap.get(levelValue.parentIdent)) {
            levelMap.get(levelValue.parentIdent).push(levelValue)
          } else {
            levelMap.set(levelValue.parentIdent, [])
            levelMap.get(levelValue.parentIdent).push(levelValue)
          }
        } else {
          continue
        }
      }
      map.set((i + ''), levelMap)
    }

    // 3、对map内数组元素进行排序
    map.forEach(function(value, key, mapObj) {
      if (value instanceof Array) {
        if (value.length > 1) {
          value.sort(compareUp(value, 'orderr', true))
        }
      } else if (value instanceof Map) {
        value.forEach(function(inValue, key, mapObj) {
          if (inValue instanceof Array) {
            if (inValue.length > 1) {
              inValue.sort(compareUp(inValue, 'orderr', true))
            }
          } else {
            console.error('不是数组，无法排序！')
          }
        })
      } else {
        console.error('既不是Map也不是数组，无法排序！')
      }
    })

    // 4、按层级拼装树
    // 一、先画第一层，第一层是数组，在根节点下，直接塞到根节点的children中
    if (rootTree && rootTree[0]) {
      rootTree[0].children = deepClone(map.get(('1')))
    } else {
      console.error('您未传入树的根节点！请您传入一个根节点')
      return []
    }
    // 二、循环已经画好的第一层数据，由每个节点依次纵深向下画，直到画到根节点为止
    var drawingLevel = '2'
    drawToLeaf(drawingLevel, rootTree[0].children, map)
  }
  return rootTree
}
// 根据后端扁平化的数据生成树的数据格式
function drawToLeaf(nowLevel, nowAttr, map) {
  if (nowAttr instanceof Array) {
    nowAttr.forEach((item, i) => {
      if (map.get(nowLevel)) {
        if (map.get(nowLevel).get(item.identId)) {
          nowAttr[i].children = deepClone(map.get(nowLevel).get(item.identId))
          if ((nowLevel * 1 + 1) > map.size) {
            //
          } else {
            drawToLeaf((nowLevel * 1 + 1 + ''), nowAttr[i].children, map)
          }
        } else {
          nowAttr[i].children = []
        }
      } else {
        console.log('树已经绘制完毕！')
      }
    })
  } else {
    console.error('子节点下的数据束必须是一个数组')
  }
}
// 判断树的数据是否出现层级跳跃
function treeProgressive(map) {
  let leapfrog = false
  var treeLevel = map.size
  for (var i = 1; i <= treeLevel; i++) {
    if (map.get((i + ''))) {
      // 递进取树层级
    } else {
      if (i !== map.size) {
        leapfrog = true
        console.error('树的层级出现越级！无法绘制树！')
      }
    }
  }
  return leapfrog
}

// 判断拖拽节点和放置的节点是否是同级，同级返回true，不同级返回false
// 这个方法依然是硬编码的方法，不具有通用性，根据parent_ident也就是父节点id来判断是否是同一层级
// 适用范围：树相同层级的节点可以拖拽排序
export function ifSameLevel(draggingNode, dropNode, type) {
  if (draggingNode && dropNode) {
    if (draggingNode.data && dropNode.data) {
      if (draggingNode.data.parentIdent === dropNode.data.parentIdent) {
        return true
      } else {
        return false
      }
    } else {
      console.error('获取不到节点数据，无法判断！')
      return false
    }
  } else {
    console.error('需要传入拖拽的节点和放置的节点！')
    return false
  }
}

// 树节点拖拽完成，根据dropType来判断节点放置的位置
export function tidyTreeDataByDropType(treeData, draggingNode, dropNode, dropType) {
  if (draggingNode) {
    // 交换拖拽节点和放置节点的排序字段值
    // var searchedObj = findNodeFromTreeData(treeData, 'ident_id', draggingNode.data.parent_ident, (draggingNode.level-1), 1)
    // 以上方法可以找到拖拽节点的父分支  -- 弃用
    if (dropType === 'inner') {
      // 节点被拖拽到同级节点内部
      // 1、默认为被拖拽的节点要放置在放置节点之前
      // 2、删除放置节点内的拖拽节点
      insertBeforeTreeNode(treeData, draggingNode.data, dropNode)
      dropNode.removeChild(draggingNode)
    } else if (dropType === 'before') {
      // 正常排序，拖拽节点放在放置节点之前
    } else if (dropType === 'after') {
      // 正常排序，拖拽节点放在放置节点之后
    }
    let parentNode = null
    if (draggingNode.parent) {
      parentNode = draggingNode.parent
    } else {
      if (dropNode.parent) {
        parentNode = dropNode.parent
      } else {
        console.error('找不到父节点')
      }
    }
    if (parentNode && parentNode.childNodes) {
      parentNode.childNodes.forEach((childrenNode, i) => {
        if (childrenNode && childrenNode.data) {
          childrenNode.data.orderr = i + 1
        }
      })
    }
  }
}

// 在全量加载的树数据中找到相应的分支数据
// 接受树全量数据、待找的树属性，目标值，待找目标的层级, 1
// 返回找到的分支数据
export function findNodeFromTreeData(treeData, attr, target, level, searchLevel) {
  var searchedObj
  let cloneTree = deepClone(treeData)
  if (level) {
    if (level === 1) {
      for (var fidItemOne of cloneTree) {
        if (fidItemOne[attr]) {
          if (fidItemOne[attr] === target) {
            searchedObj = fidItemOne
            break
          } else {
            continue
          }
        } else {
          searchedObj = fidItemOne
          break
        }
      }
    } else {
      for (searchLevel; searchLevel <= level; searchLevel++) {
        var arr = []
        cloneTree.forEach((item, i) => {
          if (item.children && item.children.length > 0) {
            item.children.forEach((childItem, j) => {
              arr.push(childItem)
            })
          }
        })
        cloneTree = arr
        searchLevel++
        if (searchLevel === level) {
          for (var fidItem of cloneTree) {
            if (fidItem[attr]) {
              if (fidItem[attr] === target) {
                searchedObj = fidItem
                break
              } else {
                continue
              }
            } else {
              searchedObj = fidItem
              break
            }
          }
        }
      }
    }
  } else {
    console.error('没有传层级')
    // 如果没传待找的树的层级，遍历整个树来查找，代码待完善
  }
  return searchedObj
}

// 手动点击选中树节点（非checkbox选中）
export function manualClickChecked(theTree, manualNode) {
  var store = theTree.store
  store.setCurrentNode(manualNode)
  theTree.$emit('current-change', store.currentNode ? store.currentNode.data : null, store.currentNode)
  if (theTree.expandOnClickNode) {
    theTree.currentNode.handleExpandIconClick()
  }
  theTree.$emit('node-click', manualNode.data, manualNode, theTree)
}

// 定制方法：寻找树中第一个机器节点
export function findFirstMachineNode(treeData) {
  var machineMap = new Map()
  for (var data of treeData) {
    if (data && data.depth === 4) {
      if (machineMap.get(data.parentIdent)) {
        if (data.orderr < machineMap.get(data.parentIdent)[0].orderr) {
          machineMap.get(data.parentIdent).splice(0, 1)
          machineMap.get(data.parentIdent).push(data)
        }
      } else {
        machineMap.set(data.parentIdent, [])
        machineMap.get(data.parentIdent).push(data)
      }
    } else {
      continue
    }
  }
  if (machineMap.size > 0) {
    if (machineMap.size === 1) {
      for (var [, value] of machineMap) {
        return value[0]
      }
    } else {
      const machineArray = []
      for (var [, machineValue] of machineMap) {
        machineArray.push(machineValue[0])
      }
      return contrastMachineNode(machineArray, treeData)
    }
  } else {
    return null
  }
}

function contrastMachineNode(machineArray, treeData) {
  var first = machineArray[0]
  var second = machineArray[1]
  var firstAncestor = null
  var secondAncestor = null
  for (var treeItem of treeData) {
    if (treeItem.identId === first.parentIdent) {
      firstAncestor = treeItem
    } else if (treeItem.identId === second.parentIdent) {
      secondAncestor = treeItem
    } else {
      continue
    }
  }
  if (firstAncestor.parentIdent === secondAncestor.parentIdent) {
    if (firstAncestor.orderr < secondAncestor.orderr) {
      machineArray.splice(1, 1)
    } else {
      machineArray.splice(0, 1)
    }
    if (machineArray.length !== 1) {
      contrastMachineNode(machineArray, treeData)
    } else {
      return machineArray[0]
    }
  } else {
    findSameAncestor(firstAncestor, secondAncestor, treeData)
    if (firstAncestor.orderr < secondAncestor.orderr) {
      machineArray.splice(1, 1)
    } else {
      machineArray.splice(0, 1)
    }
    if (machineArray.length !== 1) {
      contrastMachineNode(machineArray, treeData)
    } else {
      return machineArray[0]
    }
  }
}

function findSameAncestor(firstAncestor, secondAncestor, treeData) {
  for (var sameTreeItem of treeData) {
    if (sameTreeItem.identId === firstAncestor.parentIdent) {
      firstAncestor = sameTreeItem
    } else if (sameTreeItem.identId === secondAncestor.parentIdent) {
      secondAncestor = sameTreeItem
    } else {
      continue
    }
  }
  if (firstAncestor.parentIdent === secondAncestor.parentIdent) {
    return [firstAncestor, secondAncestor]
  } else {
    findSameAncestor(firstAncestor, secondAncestor, treeData)
  }
}

// 设置树的checkbox不可选
export function setDisabledKeys(current, theTree, disabledKeys) {
  if (theTree && disabledKeys instanceof Array) {
    disabledKeys.forEach((item, i) => {
      objectAssignment(current, theTree.getNode(item).data, ['disabled'], { 'disabled': true }, ['disabled'])
    })
  } else {
    return
  }
}

// 设置树的checkbox可选
export function removeDisabledKeys(current, theTree, removeKeys) {
  if (theTree && removeKeys instanceof Array) {
    removeKeys.forEach((item, i) => {
      objectAssignment(current, theTree.getNode(item).data, ['disabled'], { 'disabled': false }, ['disabled'])
    })
  } else {
    return
  }
}
