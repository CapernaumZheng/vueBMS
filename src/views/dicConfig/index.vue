<template>
  <div class="main-out" v-loading="listLoading" element-loading-text="加载中....." border fit highlight-current-row>
      <div class="page-name">设置数据字典</div>
      <div class="page-area">
        <div class="dic-tree">
          <el-input class="clear-icon"
                    style="padding:10px"
                    clearable
                    placeholder="请输入关键字"
                    v-model="filterText">
            <i slot="suffix" class="el-input__icon el-icon-search icon-search"></i>
          </el-input>
          <vue-scroll style="height: calc(100% - 60px)">
            <el-tree :props="defaultProps"
                     :data="treeData"
                     :filter-node-method="filterNode"
                     ref="tree"
                     node-key="identId"
                     :highlight-current="true"
                     @node-click="handleNodeClick">
            </el-tree>
          </vue-scroll>
        </div>
        <div class="dic-table" style="margin-top: 10px;">
          <div class="btn-area">
            <el-button v-waves plain
                       :class="{ 'btn-disabled': addShow==false, 'plain-btn': addShow==true }"
                       :disabled="addShow==false"
                       @click="dicAdd('addForm')">
              <svg-icon class="icon-space" icon-class="plusIcon" />
              增加
            </el-button>
            <el-button v-waves plain
                       :class="{ 'btn-disabled': editShow==false, 'plain-btn': editShow==true }"
                       :disabled="editShow==false"
                       @click="dicEdit('addForm')">
              <svg-icon class="icon-space" icon-class="editIcon" />
              修改
            </el-button>
            <!--<el-button v-waves plain-->
                        <!--:class="{ 'btn-disabled': searchShow==false, 'plain-btn': searchShow==true }"-->
                        <!--:disabled="searchShow==false"-->
                        <!--@click="queryRightTable()">-->
              <!--查询-->
            <!--</el-button>-->
          </div>
          <el-table class="table-norm"
                    :data="tableData"
                    border
                    :height="tableHeight"
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              :selectable='disabledFirst'
              width="55">
            </el-table-column>
            <el-table-column
              prop="parentCode"
              label="条目名称(字典大类)">
            </el-table-column>
            <el-table-column
              prop="code"
              label="子项代码(字典单元代码)">
            </el-table-column>
            <el-table-column
              prop="value"
              label="子项名称(字典单元内容)">
            </el-table-column>
            <el-table-column
              prop="depth"
              label="depth" v-if="false">
            </el-table-column>
          </el-table>
          <paging :flipParam="getFlipParams" ref="pagingData" @refreshUserList="refreshDicTable" @loadingList="loadingDicList" style="text-align: right;"></paging>
        </div>
      </div>

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="addForm" :rules="addRules" ref="addForm">
        <el-form-item class="common-form-item-120" label="字典大类：" prop="dicCode" style="position: relative;left: 36px;">
          <el-input v-model="addForm.dicCode" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item class="common-form-item-120" label="字典单元代码：" prop="dicValue" style="">
          <el-input v-model="addForm.dicValue" :disabled="operateType===1"></el-input>
        </el-form-item>
        <el-form-item class="common-form-item-120" label="字典单元内容：" prop="dicContent" style="">
          <el-input v-model="addForm.dicContent"></el-input>
        </el-form-item>
        <el-form-item label="depth" prop="depth" v-if="false">
          <el-input v-model="addForm.depth"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-waves style="width: 100px;" type="primary" @click="submitDicAdd('addForm')">提 交</el-button>
        <el-button v-waves style="width: 100px;" @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
  import paging from '@/components/Paging'
  import { showMessage, emptyForm, selectable, refreshLazyTree } from '@/utils/index'
  import { queryDicTree, queryDicTable, dicAddSubmit, dicUpdate, flipParam, queryUniqueCode } from '@/api/dicConfig/index'
export default {
    name: 'dicConfig',
    components: {
      paging
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val)
      }
    },
    data() {
      const uniqueCode = (rule, value, callback) => {
        if (this.operateType === 1) {
          callback()
        } else {
          queryUniqueCode(this.selectedNode, value).then(response => {
            if (response.code === '0') {
              callback(new Error(response.msg))
            } else {
              callback()
            }
          })
        }
      }
      return {
        editShow: false,
        selectId: null,
        searchShow: false,
        nodeResult: null,
        dialogVisible: false,
        fileList: [],
        addShow: false,
        dialogTitle: null,
        selectedNode: null,
        toDelete: null,
        listLoading: true,
        dialogFormVisible: false,
        deleteDialogVisible: false,
        operateType: null,
        multipleSelection: [],
        tableData: null,
        datas: null,
        defaultProps: {
          isLeaf: 'leaf',
          label: 'value',
          children: 'children'
        },
        filterText: '',
        treeData: [{ value: '所有条目', identId: '0', children: [] }],
        addForm: {
          dicCode: null,
          dicValue: null,
          dicContent: null
        },
        storage: null,
        addRules: {
          dicValue: [
            { required: true, message: '请填写字典单元代码', trigger: 'blur' },
            { max: 10, message: '最长不超过10个字符', trigger: 'blur' },
            { validator: uniqueCode, trigger: 'blur' }
          ],
          dicContent: [
            { required: true, message: '请填写字典单元内容', trigger: 'blur' },
            { max: 10, message: '最长不超过10个字符', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.queryDicTree()
    },
    computed: {
      getFlipParams: function() {
        if (this.storage) {
          flipParam.requestParams.condition.parentIdent = this.storage.identId
        }
        return flipParam
      },
      tableHeight: function() {
        return (window.innerHeight - 280)
      }
    },
    methods: {
      queryDicTree(node) {
        queryDicTree(node).then(response => {
          this.listLoading = false
          if (response.code === '20000') {
            const resArray = response.result.records
            resArray.forEach((item, i) => {
              resArray[i].value = resArray[i].code + '-' + resArray[i].value
            })
            for (var value of resArray) {
              if (value.type === '1') {
                // type为1时 是叶子结点
                // value.identId = value.parent.identId
                value.leaf = true
                this.nodeResult = node
              } else {
                value.leaf = false
              }
            }
            this.treeData[0].children = resArray
          } else {
            showMessage(response)
          }
        })
      },
      handleNodeClick(data, node) {
        this.searchShow = true
        this.storage = data
        this.selectedNode = node
        if (node.level === 2) {
          this.addShow = true
        } else {
          this.addShow = false
        }
        this.queryRightTable()
      },
      filterNode(value, data) {
        if (!value) return true
        return data.value.indexOf(value) !== -1
      },
      queryRightTable() {
        this.listLoading = true
        queryDicTable(this.storage).then(response => {
          this.listLoading = false
          if (response.code === '20000') {
            this.refreshDicTable(response)
          } else {
            showMessage(response)
          }
        })
      },
      clearFormData(formName) {
        if (this.$refs[formName]) {
          this.$refs[formName].resetFields()
        }
      },
      resetPage(formName) {
        this.clearFormData(formName)
      },
      dicAdd(formName) {
        this.fileList = []
        this.dialogTitle = '字典配置新增'
        this.dialogFormVisible = true
        this.clearFormData(formName)
        emptyForm(this.addForm)
        this.addForm.dicCode = this.selectedNode.data.code
        this.operateType = 0
      },
      dicEdit(formName) {
        this.selectId = this.addForm.code
        this.dialogFormVisible = true
        this.dialogTitle = '字典配置修改'
        this.clearFormData(formName)
        emptyForm(this.addForm)
        this.addForm.dicCode = this.multipleSelection[0].parentCode
        this.addForm.dicValue = this.multipleSelection[0].code
        this.addForm.dicContent = this.multipleSelection[0].value
        this.addForm.depth = this.multipleSelection[0].depth
        this.operateType = 1
      },
      submitDicAdd(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.dialogFormVisible = false
            this.listLoading = true
            if (this.operateType === 0) {
              dicAddSubmit(this.nodeResult, this.storage, this.addForm).then(response => {
                showMessage(response)
                this.queryRightTable()
                queryDicTree(this.selectedNode).then(response => {
                  if (response.code === '20000') {
                    const responseArray = response.result.records
                    for (var value of responseArray) {
                      if (value.type === '1') {
                        value.leaf = true
                      } else {
                        value.leaf = false
                      }
                    }
                    refreshLazyTree(this.selectedNode, responseArray, this.defaultProps)
                  } else {
                    showMessage(response)
                  }
                })
              }).catch(function(error) {
                console.log(error)
              })
            } else if (this.operateType === 1) {
              dicUpdate(this.multipleSelection, this.storage, this.addForm).then(response => {
                showMessage(response)
                this.queryRightTable()
                queryDicTree(this.selectedNode).then(response => {
                  if (response.code === '20000') {
                    const responseArray = response.result.records
                    for (var value of responseArray) {
                      if (value.type === '1') {
                        value.leaf = true
                      } else {
                        value.leaf = false
                      }
                    }
                    refreshLazyTree(this.selectedNode, responseArray, this.defaultProps)
                  } else {
                    showMessage(response)
                  }
                })
              })
            } else {
              // 出错了
              this.listLoading = false
            }
          } else {
            return false
          }
        })
      },
      deleteDics(param) {
        this.deleteDialogVisible = true
        this.toDelete = param
      },
      singleDelete(index, row) {
        this.deleteDialogVisible = true
        const array = []
        array.push(row)
        this.toDelete = array
      },
      deleteConfim() {
        this.listLoading = true
        this.deleteDialogVisible = false
      },
      loadingDicList() {
        this.listLoading = true
      },
      refreshDicTable(response) {
        this.listLoading = false
        this.tableData = response.result.records
        const footerData = { 'current': response.result.current, 'size': response.result.size, 'total': response.result.total }
        this.$refs.pagingData.refreshPagingData(footerData)
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
        if (this.multipleSelection.length !== 1) {
          this.editShow = false
        } else {
          this.editShow = true
        }
      },
      disabledFirst(row, index) {
        if (row.depth === 1) {
          const rowindex = index
          return selectable(row, index, rowindex)
        } else {
          return true
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" type="text/scss" lang="scss" scoped>
.page-area{
    width: 100%;
    height: calc(100% - 30px);
    position: relative;
    .dic-tree{
      width: 15%;
      height: 100%;
      position: absolute;
    }
    .dic-table{
      width: 85%;
      height: calc(100% - 10px);
      position: absolute;
      left: 15%;
    }
  }

.btn-area{
  margin-bottom: 10px;
}

.clear-icon{
  .icon-search{
    position: absolute;
    right: 20px;
    font-size: 20px
  }
}
</style>
