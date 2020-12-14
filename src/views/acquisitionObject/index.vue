<template>
  <div class="main-out" v-loading="listLoading" element-loading-text="加载中......" border fit highlight-current-row>
    <div class="page-name">可搜索树+树右键弹窗+可展开的表格</div>
    <div class="page-area">
      <div class="acquisition-tree">
        <el-input class="clear-icon"
                  style="padding:10px"
                  clearable
                  placeholder="请输入关键字"
                  v-model="filterText">
          <i slot="suffix" class="el-input__icon el-icon-search icon-search"></i>
        </el-input>
        <vue-scroll style="height: calc(100% - 70px)">
          <el-tree :props="defaultProps" ref="tree"
                   :data="treeData"
                   node-key="id"
                   :highlight-current="true"
                   accordion
                   @node-click="handleNodeClick"
                   @node-contextmenu="rightNodeClick"
                   :filter-node-method="filterNode"
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
        </vue-scroll>
      </div>
      <div class="acquisition-table">
        <el-form :model="formData" ref="formData" style="margin-left: 20px">
          <el-form-item class="page-form-item common-form-item-82" label="机器名称：" prop="name" style="width: calc((100% - 70px)/3)">
            <el-input v-model="formData.machineName" disabled placeholder="请选择左侧机器节点"></el-input>
          </el-form-item>
          <el-form-item class="page-form-item common-form-item-82" label="机器IP：" prop="name" style="width: calc((100% - 70px)/3)">
            <el-input v-model="formData.machineIP" disabled placeholder="请选择左侧机器节点"></el-input>
          </el-form-item>
          <el-form-item class="page-form-item common-form-item-82" label="机器类型：" prop="name" style="width: calc((100% - 70px)/3)">
            <el-input v-model="formData.machineType" disabled placeholder="请选择左侧机器节点"></el-input>
          </el-form-item>
        </el-form>
        <vue-scroll :style="templateTableHeight">
          <div class="template-table">
            <el-table
              class="expand-table"
              :data="tableData"
              style="width: 100%">
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-table
                    class="expand-inside"
                    :data="props.row.inTable"
                    border
                    style="width: 100%">
                    <el-table-column
                      prop="index_name"
                      label="指标名称">
                    </el-table-column>
                    <el-table-column
                      prop="index_source"
                      label="指标来源">
                    </el-table-column>
                    <el-table-column
                      prop="data_type"
                      label="数据类型">
                    </el-table-column>
                    <el-table-column
                      prop="index_unit"
                      label="指标单位">
                    </el-table-column>
                  </el-table>
                </template>
              </el-table-column>
              <el-table-column>
                <template slot-scope="scope">
                    <label>{{scope.row.title}}（{{scope.row.desc}}）</label>
                    <b class="index-number">【指标数：{{scope.row.inTable.length}}】</b>
                    <b class="alarm-events">【<span class="word" @click.stop="jumpToWarningEvent">告警事件：{{scope.row.inTable.length}}</span>】</b>
                    <span @click.stop="showDeleteDialog(scope.row)" style="float: right;cursor: pointer"><svg-icon class="icon-space" icon-class="deleteIcon" />删除</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </vue-scroll>
        <paging :flipParam="getFlipParams" ref="pagingData" @refreshUserList="refreshTemplateList" @loadingList="loadingMainTable" style="text-align: right;"></paging>
      </div>
    </div>

    <el-dialog title="删除" :visible.sync="deleteDialogVisible" width="25%">
      <div style="font-size: 25px;">确认要删除该模板吗？</div>
      <div slot="footer" class="dialog-footer">
        <el-button v-waves style="width: 100px;" type="primary" @click="deleteTemplateConfim">确 定</el-button>
        <el-button v-waves style="width: 100px;" @click="deleteDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-popover
      placement="top"
      :style="popoverStyle"
      width="350"
      trigger="manual"
      :visible-arrow="popoverArrow"
      :value="popoverVisible">
      <div class="tree-popper">
        <div class="page-name">添加模板<i class="el-icon-close" title="关闭" @click="closeTreePopover"></i></div>
        <div class="template-area">
          <el-input class="clear-icon"
                    style="padding:10px"
                    clearable
                    placeholder="请输入关键字"
                    v-model="filterText">
            <i slot="suffix" class="el-input__icon el-icon-search icon-search"></i>
          </el-input>
          <vue-scroll style="height: 300px">
            <el-tree :props="templateProps" ref="templateTree"
                     :data="tempalteTreeData"
                     node-key="id"
                     accordion
                     show-checkbox
                     @check-change="handleCheckChange"
                     :filter-node-method="filterNode"
            >
            <span slot-scope="{ node, data }">
              {{data.label}} {{data.desc}}
            </span>
            </el-tree>
          </vue-scroll>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
  import paging from '@/components/Paging'
  import { flipParam, queryTree, queryTable, queryTemplate } from '@/api/acquisitionObject/index'
  import { showMessage, constructTree, objectAssignment } from '@/utils/index'
  export default {
    name: 'acquisitionObject',
    components: {
      paging
    },
    data() {
      return {
        listLoading: false,
        filterText: '',
        defaultProps: {
          isLeaf: 'leaf',
          label: 'name',
          children: 'children'
        },
        templateProps: {
          isLeaf: 'leaf',
          label: 'label',
          children: 'children'
        },
        treeData: [],
        tableData: [],
        formData: {
          machineName: null,
          machineIP: null,
          machineType: null
        },
        selectedNode: null,
        deleteDialogVisible: false,
        tempalteTreeData: [],
        popoverStyle: null,
        popoverArrow: true,
        popoverVisible: false
      }
    },
    created() {
      this.queryAcquisitionTree()
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val)
      }
    },
    computed: {
      getFlipParams() {
        flipParam.requestParams.condition.name = this.formData.name
        flipParam.requestParams.condition.code = this.formData.code
        return flipParam
      },
      treeHeight() {
        return 'max-height:' + (window.innerHeight - 150) + 'px'
      },
      templateTableHeight() {
        return 'height:' + (window.innerHeight - 280) + 'px'
      }
    },
    methods: {
      queryAcquisitionTree() {
        queryTree().then(res => {
          if (res.code === '20000') {
            const rootTree = res.result.records
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
            this.treeData = constructTree(treeData, root)
          } else {
            showMessage(res)
          }
        })
      },
      filterNode(value, data) {
        if (!value) return true
        return data.value.indexOf(value) !== -1
      },
      handleNodeClick(data, node) {
        if (this.selectedNode && this.selectedNode.data) {
          if (this.selectedNode.data.identId === node.data.identId) {
            // 同一节点再次点击
          } else {
            this.selectedNode = node
            if (this.selectedNode.data.depth === 3 || this.selectedNode.data.depth === 4) {
              this.queryTemplateList(this.selectedNode)
              if (this.selectedNode.data.depth === 4) {
                objectAssignment(this, this.formData, ['machineName', 'machineIP'], this.selectedNode.data, ['value', 'ip'])
                objectAssignment(this, this.formData, ['machineType'], this.selectedNode.parent.data, ['value'])
              } else {
                objectAssignment(this, this.formData, ['machineName', 'machineIP', 'machineType'], {}, ['', '', ''])
              }
            }
          }
        } else {
          this.selectedNode = node
          if (this.selectedNode.data.depth === 3 || this.selectedNode.data.depth === 4) {
            this.queryTemplateList(this.selectedNode)
            if (this.selectedNode.data.depth === 4) {
              objectAssignment(this, this.formData, ['machineName', 'machineIP'], this.selectedNode.data, ['value', 'ip'])
              objectAssignment(this, this.formData, ['machineType'], this.selectedNode.parent.data, ['value'])
            } else {
              objectAssignment(this, this.formData, ['machineName', 'machineIP', 'machineType'], {}, ['', '', ''])
            }
          }
        }
      },
      refreshTemplateList(response) {
        this.listLoading = false
        if (response.code === '20000') {
          this.tableData = response.result.records
          const footerData = { 'current': response.result.current, 'size': response.result.size, 'total': response.result.total }
          this.$refs.pagingData.refreshPagingData(footerData)
        } else {
          showMessage(response)
        }
      },
      loadingMainTable() {
        this.listLoading = true
      },
      queryTemplateList(selectedNode) {
        this.listLoading = true
        queryTable(selectedNode).then(res => {
          this.refreshTemplateList(res)
        })
      },
      jumpToWarningEvent() {
        this.$router.push({
          path: '/collect_setting/collect',
          name: 'warning',
          params: {
            name: '测试传参一',
            dataObj: '测试传参二'
          }
          // query: {
          //   name: '',
          //   dataObj: ''
          // }
          // 接收参数 var routerParams = this.$route.params.dataObj
        })
      },
      showDeleteDialog(row) {
        this.deleteDialogVisible = true
      },
      deleteTemplateConfim() {
        this.deleteDialogVisible = false
      },
      rightNodeClick(event, data, node, component) {
        if (data.depth === 3 || data.depth === 4) {
          queryTemplate(data).then(res => {
            if (res.code === '20000') {
              this.tempalteTreeData = res.result.records
              this.popoverStyle = 'position:absolute;top:' + event.clientY + 'px;left:' + event.clientX + 'px'
              this.popoverVisible = true
            } else {
              showMessage(res)
            }
          })
        }
      },
      closeTreePopover() {
        this.popoverVisible = false
      },
      handleCheckChange() {

      }
    }
  }
</script>

<style rel="stylesheet/scss" type="text/scss" lang="scss" scoped>
  .page-area{
    width: 100%;
    position: relative;
    height: calc(100% - 30px);
    .acquisition-tree{
      width: 25%;
      height: 100%;
      position: absolute;
    }
    .acquisition-table{
      width: 75%;
      height: 100%;
      position: absolute;
      top: 10px;
      left: 25%;
    }
  }

  .expand-table{
    .index-number{
      margin-left: 50px;
    }
    .alarm-events{
      margin-left: 50px;
      .word{
        cursor: pointer;
      }
      &:hover{
        .word{
          text-decoration: underline
        }
      }
    }
  }

  .clear-icon{
    .icon-search{
      position: absolute;
      right: 20px;
      font-size: 20px
    }
  }

  .tree-popper{
    padding-bottom: 0px;
    .page-name{
      position: absolute;
      top: 0px;
      left: 0px;
      width: 100%;
      .el-icon-close{
        float: right;
        padding-top: 8px;
        padding-right: 10px;
        cursor: pointer;
      }
    }
    .template-area{
      margin-top: 20px;
    }
  }
</style>
