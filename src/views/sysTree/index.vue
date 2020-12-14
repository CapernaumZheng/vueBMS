<template>
  <div class="main-out" v-loading="listLoading" element-loading-text="加载中......" border fit highlight-current-row>
    <div class="page-name">树任一节点的同级节点拖拽排序</div>
    <!--
    <div v-if="false">
      <el-form class="tree-form" :model="formData" ref="formData">
        <el-form-item class="page-form-item form-label-three" label="树名称：" prop="name" style="width: calc((100% - 300px)/3)">
          <el-input v-model="formData.name" placeholder="请输入要查询的树名称"></el-input>
        </el-form-item>
        <el-button  style="width: 80px" v-waves class="primary-btn" @click="queryTreeInfo(formData)">
          查询
        </el-button>
        <el-button  style="width: 80px" v-waves plain class="plain-btn" @click="resetPage">
          重置
        </el-button>
        <el-button v-waves style="width: 100px" plain class="plain-btn" @click="addNewTree">
          <svg-icon class="icon-space" icon-class="plusIcon" />
          新增
        </el-button>
      </el-form>
      <div>
        <el-table class="table-norm"
                  :data="tableData"
                  border
                  :height="tableHeight"
                  style="width: 100%">
          <el-table-column
            type="index"
            width="55"
            label="序号">
          </el-table-column>
          <el-table-column
            prop="id"
            label="ID">
          </el-table-column>
          <el-table-column
            prop="remark"
            label="树名称">
          </el-table-column>
          <el-table-column
            prop="remark1"
            label="说明">
          </el-table-column>
          <el-table-column
            label="创建日期">
            <template slot-scope="scope">
              <span v-if="scope.row.createTime!=null">{{scope.row.createTime | parseTime('{y}-{m}-{d}')}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="createId"
            label="创建人">
          </el-table-column>
          <el-table-column
            label="操作"
            width="80">
            <template slot-scope="scope">

              <div class="user-operate" @click="addTreeSubmit1">
                <svg-icon class="icon-space" icon-class="checkEye" :class="{ 'icon-disabled': scope.row.status === 2 }" style="margin-right: 5px"/>
              </div>
              <div class="user-operate" @click="modifyTree">
                <svg-icon class="icon-space" icon-class="editIcon" :class="{ 'icon-disabled': scope.row.status === 2 }" style="margin-right: 5px"/>
              </div>

            </template>
          </el-table-column>
        </el-table>
        <paging :flipParam="getFlipParams" ref="pagingData" @refreshUserList="refreshMainPage" @loadingList="loadingUserList" style="text-align: right;"></paging>
      </div>
    </div>
    -->
    <div class="page-area">
        <div class="dic-tree">
          <el-scrollbar wrapClass="scrollbar-wrapper">
            <div :style="treeHeight">
              <el-input class="clear-icon"
                style="padding:10px"
                clearable
                placeholder="输入节点名称进行过滤"
                v-model="filterText">
                <i slot="suffix" style="position: absolute;right: 20px;font-size: 20px" class="el-input__icon el-icon-search"></i>
              </el-input>
              <el-tree :props="defaultProps" ref="tree"
                       :data="sysTreeData"
                       draggable
                       node-key="ident_id"
                       :highlight-current="true"
                       @node-click="handleNodeClick"
                       :filter-node-method="filterNode"
                       @node-drop="handleDrop"
                       :allow-drop="allowDrop"
                       style="min-height: 200px"
              >
                <span slot-scope="{ node, data }">
                  <svg-icon class="icon-space" style="width: 20px;height: 20px;" icon-class="c_trade" v-if="data.depth === 0" />
                  <svg-icon class="icon-space" style="width: 20px;height: 20px;" icon-class="c_sys" v-if="data.depth === 1" />
                  <svg-icon class="icon-space" style="width: 20px;height: 20px;" icon-class="c_system" v-if="data.depth === 2" />
                  <svg-icon class="icon-space" style="width: 20px;height: 20px;" icon-class="c_host" v-if="data.depth === 3" />
                  <svg-icon class="icon-space" style="width: 20px;height: 20px;" icon-class="c_comupter" v-if="data.depth === 4" />
                  {{data.value}}
                </span>
              </el-tree>
            </div>
          </el-scrollbar>
        </div>
        <div class="dic-table">
          <el-button v-waves style="width: 100px" class="primary-btn" @click="refreshTreeSubmit()">
            <svg-icon class="icon-space" icon-class="refresh" />
            刷新
          </el-button>
          <el-button v-waves style="width: 100px" @click="addTreeNode" v-if="increase"
                     :class="{ 'btn-disabled': selectedNode==null || selectedNode.data.type=='1','primary-btn': selectedNode!=null && selectedNode.data.type!='1'}"
                     :disabled="selectedNode==null || selectedNode.data.type=='1'">
            <svg-icon class="icon-space" icon-class="plusIcon" />
            新增
          </el-button>
          <!--
          <el-button v-waves style="width: 100px" plain class="plain-btn" @click="showTablePage=true">
            <svg-icon class="icon-space" icon-class="return" />
            返回
          </el-button>
          -->
          <el-button v-if="cutOff !=0 && (selectedNode!=null && selectedNode.data.depth != 0)"
                     v-waves style="width: 100px"
                     plain class="plain-btn"
                     @click="deleteTreeNode">
            <svg-icon class="icon-space" icon-class="deleteIcon" />
            删除
          </el-button>
          <el-popover
            placement="top-start"
            title="温馨提示"
            width="250"
            trigger="click"
            >
            <p>1、硬件树根节点不能删除。</p>
            <p>2、有子项的节点不能删除。</p>
            <p>3、选中节点进行新增、编辑、删除</p>
            <p>4、叶子节点，不能新增</p>
            <p>5、点击刷新，刷新整个硬件树。</p>
            <i title="温馨提示" slot="reference" class="warm-prompt el-icon-question"></i>
          </el-popover>
          <div class="form-area">
            <div class="page-name">节点信息</div>
            <el-form v-if="showEdit" class="edit-form" :model="addEditform" ref="addEditform" :rules="addEditRules">
              <el-form-item class="common-form-item-92" label="节点名称：" prop="name" style="width:calc(100% - 50px);">
                <el-input ref="input" :disabled="selectedNode==null" v-model="addEditform.name" placeholder="请输入节点名称" style="width: 50%"></el-input>
              </el-form-item>
              <el-form-item class="common-form-item-92" label="说明：" prop="desc" style="width:calc(100% - 50px);position: relative;left: 37px;">
                <el-input :disabled="selectedNode==null" class="textarea-height" maxlength="80" type="textarea" style="width: 50%" v-model="addEditform.desc"></el-input>
                <span>已输入：<span v-if="addEditform.desc!=null">{{ addEditform.desc.length }}</span><span v-else>0</span> \ 80 个字</span>
              </el-form-item>
              <div style="padding-left: 92px;" v-if="selectedNode!=null">
                <el-button  style="width: 80px" v-waves class="primary-btn" @click="saveNodeSubmit()">
                  保存
                </el-button>
              </div>
            </el-form>
            <div class="tip-text" v-if="!showEdit">
              <svg-icon class="icon-space" icon-class="c_smile" />
              温馨提示：选中左侧节点操作
            </div>
          </div>
        </div>
      </div>

    <el-dialog class="add-modal" title="新增" :visible.sync="addDialogVisible" width="30%">
      <el-form :model="addForm" :rules="addRules" ref="addForm">
        <el-form-item class="common-form-item-78" label="树名称：" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入树的名称"></el-input>
        </el-form-item>
        <el-form-item class="add-form-last common-form-item-78" label="说明：" prop="desc">
          <el-input class="textarea-height" maxlength="20" type="textarea" v-model="addForm.desc"></el-input>
          <span>已输入：<span v-if="addForm.desc!=null">{{ addForm.desc.length }}</span><span v-else>0</span> \ 20 个字</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-waves style="width: 100px;" type="primary" @click="addTreeSubmit(addEditform)">确 定</el-button>
        <el-button v-waves style="width: 100px;" @click="addDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="删除" :visible.sync="deleteDialogVisible" width="30%">
      <div class="delete-tip">{{ deleteTip }}</div>
      <div slot="footer" class="dialog-footer">
        <el-button v-waves style="width: 100px;"
                   v-if="selectedNode==null || selectedNode.childNodes.length > 0"
                   type="primary" @click="deleteDialogVisible = false">知道了</el-button>
        <el-button v-waves style="width: 100px;"
                   v-if="selectedNode!=null && selectedNode.childNodes.length == 0" type="primary"
                   @click="deleteTreeNodeAffirm(addEditform)">确 定</el-button>
        <el-button v-waves style="width: 100px;"
                   v-if="selectedNode!=null && selectedNode.childNodes.length == 0"
                   @click="deleteDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="leaveDialogVisible" width="30%">
      <div class="delete-tip">检测到新增操作尚未完成，离开将失去数据，是否离开？</div>
      <div slot="footer" class="dialog-footer">
        <el-button v-waves style="width: 100px;"
                   @click="addTreeSubmit">离开</el-button>
        <el-button v-waves style="width: 100px;"
                   @click="deleteDialogVisible = false">留下</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import paging from '@/components/Paging'
  import { showMessage, clearFormData, constructTree, objectAssignment, ifSameLevel, tidyTreeDataByDropType, appendChildTreeNode, manualClickChecked } from '@/utils/index'
  import { queryTree, addNode, editNode, deleteChild, refreshTree, refreshDropTree, editMachineType } from '@/api/sysTree/index'
  export default {
    name: 'sysTree',
    components: {
      paging
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val)
      }
    },
    data() {
      return {
        listLoading: false,
        showTablePage: true,
        filterText: '',
        // formData: {
        //   name: ' '
        // },
        showEdit: false,
        increase: true,
        cutOff: 0,
        isdisabled: false,
        sysTreeData: [],
        defaultProps: {
          isLeaf: 'leaf',
          label: 'name',
          children: 'children'
        },
        // tableData: [],
        addDialogVisible: false,
        deleteDialogVisible: false,
        leaveDialogVisible: false,
        deleteTip: null,
        addForm: {
          name: null,
          desc: null
        },
        addEditform: {
          name: '',
          desc: null
        },
        addRules: {
          name: [
            { required: true, message: '请填写树的名称', trigger: 'blur' },
            { max: 10, message: '名字最长不超过10个字符', trigger: 'blur' }
          ]
        },
        addEditRules: {
          name: [
            { required: true, message: '请填写节点的名称', trigger: 'blur' },
            { max: 50, message: '名字最长不超过50个字符', trigger: 'blur' }
          ]
        },
        selectedNode: null
      }
    },
    created() {
      this.querySysTree()
    },
    computed: {
      /**
      getFlipParams() {
        flipParam.requestParams.condition.remark = this.formData.name
        return flipParam
      },
      tableHeight() {
        return (window.innerHeight - 270)
      },
       **/
      treeHeight() {
        return 'max-height:' + (window.innerHeight - 150) + 'px'
      }
    },
    methods: {
      /**
      queryTreeInfo(formData) {
        this.listLoading = true
        querySysTreeInfo(formData, undefined).then(response => {
          this.listLoading = false
          if (response.code === '20000') {
            this.tableData = response.result.records
            const footerData = { 'current': response.result.current, 'size': response.result.size, 'total': response.result.total }
            this.$refs.pagingData.refreshPagingData(footerData)
          } else {
            showMessage(response)
          }
        })
      },**/
      querySysTree() {
        queryTree().then(response => {
          this.listLoading = false
          if (response.code === '20000') {
            // this.showTablePage = false
            const rootTree = response.result.records
            var treeData = []
            var root = []
            if (rootTree && rootTree.length > 0) {
              rootTree.forEach((item, i) => {
                if (item && item['depth'] !== 0) {
                  treeData.push(item)
                } else {
                  root.push(item)
                }
              })
            }
            this.sysTreeData = constructTree(treeData, root)
          } else {
            showMessage(response)
          }
        })
      },
      /**
      loadingUserList() {
        this.listLoading = true
      },
      refreshMainPage(response) {
        this.listLoading = false
        if (response.code === '20000') {
          this.tableData = response.result.records
          const footerData = { 'current': response.result.current, 'size': response.result.size, 'total': response.result.total }
          this.$refs.pagingData.refreshPagingData(footerData)
        } else {
          showMessage(response)
        }
      },
      resetPage() {
        clearFormData(this, 'formData', this.formData)
        this.listLoading = true
        querySysTreeInfo(this.formData, undefined).then(response => {
          this.listLoading = false
          if (response.code === '20000') {
            this.tableData = response.result.records
          } else {
            showMessage(response)
          }
        })
      },
      addNewTree() {
        clearFormData(this, 'addForm', this.addForm)
        this.cutOff = 1
        this.addDialogVisible = true
      },
       **/
      addTreeSubmit() {
        this.showEdit = true
        this.increase = true
        this.$refs['addForm'].validate((valid) => {
          if (valid) {
            this.addDialogVisible = false
            this.listLoading = true
            queryTree().then(response => {
              this.listLoading = false
              if (response.code === '20000') {
                // this.showTablePage = false
                const rootTree = response.result.records
                var treeData = []
                var root = []
                if (rootTree && rootTree.length > 0) {
                  rootTree.forEach((item, i) => {
                    if (item && item['relationship'] !== '0') {
                      treeData.push(item)
                    } else {
                      root.push(item)
                    }
                  })
                }
                this.sysTreeData = constructTree(treeData, root)
              } else {
                showMessage(response)
              }
            })
          } else {
            return false
          }
        })
      },

      // 点击操作---查看---查看系统树
      /**
      addTreeSubmit1() {
        // 进入此页面后，只可查看系统树而不可编辑系统树，所以页面相关元素都需要隐藏
        this.showEdit = false
        this.increase = false
        this.addDialogVisible = false
        this.listLoading = true
        this.cutOff = 0
        queryTree().then(response => {
          this.listLoading = false
          if (response.code === '20000') {
            // this.showTablePage = false
            const rootTree = response.result.records
            var treeData = []
            var root = []
            if (rootTree && rootTree.length > 0) {
              rootTree.forEach((item, i) => {
                if (item && item['relationship'] !== '0') {
                  treeData.push(item)
                } else {
                  root.push(item)
                }
              })
            }
            this.sysTreeData = constructTree(treeData, root)
          } else {
            showMessage(response)
          }
        })
      },
      // 点击操作---修改---修改系统树
      modifyTree() {
        this.addDialogVisible = false
        this.listLoading = true
        this.increase = true
        this.showEdit = true
        this.cutOff = 1
        queryTree().then(response => {
          this.listLoading = false
          if (response.code === '20000') {
            // this.showTablePage = false
            const rootTree = response.result.records
            var treeData = []
            var root = []
            if (rootTree && rootTree.length > 0) {
              rootTree.forEach((item, i) => {
                if (item && item['relationship'] !== '0') {
                  treeData.push(item)
                } else {
                  root.push(item)
                }
              })
            }
            this.sysTreeData = constructTree(treeData, root)
          } else {
            showMessage(response)
          }
        })
      },
       **/

      handleNodeClick(data, node) {
        this.cutOff = 1
        this.showEdit = true
        objectAssignment(this, this.addEditform, ['name', 'desc'], node.data, ['value', 'remark1'])
        if (this.selectedNode && this.selectedNode.data) {
          if (this.selectedNode.data.identId === node.data.identId) {
            // 同一个节点点,不做任何操作
          } else {
            this.selectedNode = node
          }
        } else {
          this.selectedNode = node
        }
      },
      filterNode(value, data) {
        if (!value) return true
        return data.value.indexOf(value) !== -1
      },

      // 删除节点提示语判断
      deleteTreeNode() {
        this.deleteDialogVisible = true
        if (this.selectedNode) {
          if (this.selectedNode.childNodes.length > 0) {
            console.log(this.selectedNode.childNodes)
            this.deleteTip = '该节点下有子项，不能删除。若要删除该节点，请先删除该节点下所有子节点'
          } else {
            this.deleteTip = '确定要删除（ ' + this.selectedNode.data.value + ' ）这个节点么？'
          }
        } else {
          this.deleteTip = '选中节点才能删除，没有选中节点'
        }
      },
      // 新增节点
      addTreeNode() {
        let name = ''
        if (this.selectedNode && this.selectedNode.data) {
          if (this.selectedNode.data.depth === 0) {
            name = '未命名'
          } else if (this.selectedNode.data.depth === 1) {
            name = '未命名'
          } else if (this.selectedNode.data.depth === 2) {
            name = '未命名'
          } else if (this.selectedNode.data.depth === 3) {
            name = '未命名'
          }
        }
        addNode(this.selectedNode, name).then(response => {
          if (response.code === '20000') {
            showMessage(response)
            const newNodeIdentId = response.result.identId
            appendChildTreeNode(this.$refs.tree, response.result, this.selectedNode)
            this.$refs.input.focus()
            // 中心节点新增成功后需在返回中调用此接口一次，使后台知道“使用中间件”的时机
            if (this.selectedNode && this.selectedNode.data.depth === 2) {
              editMachineType(newNodeIdentId).then(response => {
              })
            }
          }
        })
        manualClickChecked(this.$refs.tree, this.selectedNode.childNodes[this.selectedNode.childNodes.length - 1])
      },

      // 刷新树节点
      refreshTreeSubmit() {
        refreshTree().then(response => {
          this.listLoading = false
          if (response.code === '20000') {
            // this.showTablePage = false
            const rootTree = response.result.records
            var treeData = []
            var root = []
            if (rootTree && rootTree.length > 0) {
              rootTree.forEach((item, i) => {
                if (item && item['depth'] !== 0) {
                  treeData.push(item)
                } else {
                  root.push(item)
                }
              })
            }
            this.sysTreeData = constructTree(treeData, root)
          } else {
            showMessage(response)
          }
        })
      },

      // 点击保存--修改树的子节点
      saveNodeSubmit() {
        this.$refs['addEditform'].validate((valid) => {
          if (valid) {
            editNode(this.selectedNode, this.addEditform).then(response => {
              showMessage(response)
              if (response.code === '20000') {
                this.selectedNode.data.value = response.result[0].value
                this.selectedNode.data.remark1 = response.result[0].remark1
              }
            })
          }
        })
      },
      handleDrop(draggingNode, dropNode, dropType, ev) {
        // 如果可以运行到这里，说明同级拖拽节点成功了，但是有可能将同级节点嵌套了，根据dropType操作下节点数据
        tidyTreeDataByDropType(this.$refs.tree, draggingNode, dropNode, dropType)
        refreshDropTree(dropNode).then(response => {
          this.listLoading = false
          if (response.code === '20000') {
            showMessage(response)
          } else {
            showMessage(response)
          }
        })
      },
      allowDrop(draggingNode, dropNode, dropType) {
        return ifSameLevel(draggingNode, dropNode, dropType)
      },
      deleteTreeNodeAffirm(addEditForm) {
        // 注意！！！
        // 这里删除节点没有调用公共方法removeTreeNode
        // 调用了element原生移除子项的方法removeChild
        // 原因是：
        // 当该项inner排序后，调用removeTreeNode该节点无法删除
        // 这个bug很怪异，也许是因为inner排序方法内调用element原生removeChild及insertBeforeTreeNode方法的原因
        // removeTreeNode(this.$refs.tree, this.selectedNode, this.selectedNode.data)  这里不用公共方法删除
        deleteChild(this.selectedNode).then(response => {
          showMessage(response)
          if (response.code === '20000') {
            this.selectedNode.parent.removeChild(this.selectedNode)
            clearFormData(this, 'addEditform', this.addEditform)
            this.showEdit = false
            this.selectedNode = null
          }
        })
        this.deleteDialogVisible = false
      }
    }
  }
</script>

<style rel="stylesheet/scss" type="text/scss" lang="scss" scope>
.tree-form{
  padding-top: 10px;
  padding-left: 10px;
}
.edit-form{
  padding-top: 10px;
  padding-left: 25%;
}

.user-operate{
  display: inline-block;
  .svg-icon{
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
}

.add-modal{
  .add-form-last{
    position: relative;
    left: 24px;
    margin-bottom: 0px
  }
}

.page-area{
  width: 100%;
  position: relative;
  height: calc(100% - 30px);
  .dic-tree{
    width: 25%;
    height: 100%;
    position: absolute;
  }
  .dic-table{
    width: 75%;
    height: 100%;
    position: absolute;
    top: 10px;
    left: 25%;
    .form-area{
      margin-top: 10px;
    }
  }
}

.warm-prompt{
  cursor: pointer;
  color: #FF9800;
  &:focus {
    outline: none;
  }
}

.delete-tip{
  font-size: 16px;
}

.tip-text{
  text-align: center;
  top: 40%;
  font-size: 20px;
}
</style>
