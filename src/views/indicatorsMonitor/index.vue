<template>
  <div class="main-out" v-loading="listLoading" element-loading-text="加载中......" border fit highlight-current-row>
    <div class="page-name">树+Echart展示+可展开勾选表格+定制组件（下拉框表格）</div>
    <div class="page-area">
      <div class="indicators-tree">
        <el-input class="clear-icon"
                  style="padding:10px"
                  clearable
                  placeholder="请输入关键字"
                  v-model="filterText">
          <i slot="suffix" class="el-input__icon el-icon-search icon-search"></i>
        </el-input>
        <vue-scroll style="height: calc(100% - 70px)">
          <el-tree :props="defaultProps" ref="tree"
                   :data="indicatorsTreeData"
                   node-key="id"
                   :highlight-current="true"
                   accordion
                   @node-click="handleNodeClick"
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
      <div class="indicators-echart">
        <div class="echart-title">
          <el-row :gutter="20" v-if="!machineNode">
            <el-col :span="24">
              <svg-icon class="icon-space" icon-class="warnYellow" style=""/>
              选择左侧机器查看
            </el-col>
          </el-row>
          <el-row :gutter="20" v-if="machineNode">
            <el-col :span="6">
              机器名：{{machineInfo.name}}
            </el-col>
            <el-col :span="6">
              IP：{{machineInfo.ip}}
            </el-col>
            <el-col :span="6">
              交易中心：{{machineInfo.belong}}
            </el-col>
            <el-col :span="6">
              机器类型：{{machineInfo.type}}
            </el-col>
          </el-row>
        </div>
        <div style="margin-top: 10px">
          <el-button v-waves plain class="plain-btn" @click="customChart">
            <svg-icon class="icon-space" icon-class="pie" style=""/>
            定制图表
          </el-button>
          <el-form class="indicators-form" :model="formData" ref="formData">
            <el-form-item class="page-form-item common-form-item-none" label="" prop="name">
              <el-input style="width: 100%" v-model="formData.name" placeholder="请输入要搜索的指标/图表名称"></el-input>
            </el-form-item>
            <el-button  style="width: 80px" v-waves class="primary-btn" @click="">
              查询
            </el-button>
          </el-form>
        </div>
        <vue-scroll style="height:calc(100% - 140px)">
          <div>
            <div class="page-name">CPU利用率</div>
            <div style="height: 300px">
              <linechart height='100%' :chart-data="lineChartData" id='linechart'></linechart>
            </div>
          </div>
          <div>
            <div class="page-name">CPU信息-CPU利用率</div>
            <div style="height: 300px">
              <div style="display:inline-block;width: 30%;height: 300px">
                <doughnut height='100%' :chart-data="cpuUserData" id='doughnut'></doughnut>
              </div>
              <div style="display:inline-block;width: 69%;height: 300px">
                <linechart height='100%' :chart-data="lineChartData" id='linechartTwo'></linechart>
              </div>
            </div>
          </div>
          <div>
            <div class="page-name">
              <div style="float:left;width: 20%">CPU信息-USER占用率</div>
              <div style="float:left;width: 20%">CPU信息-NICE占用率</div>
              <div style="float:left;width: 20%">CPU信息-SYS占用率</div>
              <div style="float:left;width: 20%">CPU信息-WAITR占用率</div>
              <div style="float:left;width: 20%">CPU信息-IDLE占用率</div>
            </div>
            <div style="height: 300px">
              <div style="float:left;width: 20%;height: 300px;">
                <doughnut height='100%' :chart-data="cpuUserData" id='doughnutUser'></doughnut>
              </div>
              <div style="float:left;width: 20%;height: 300px;">
                <doughnut height='100%' :chart-data="cpuNiceData" id='doughnutNice'></doughnut>
              </div>
              <div style="float:left;width: 20%;height: 300px;">
                <doughnut height='100%' :chart-data="cpuSysData" id='doughnutSys'></doughnut>
              </div>
              <div style="float:left;width: 20%;height: 300px;">
                <doughnut height='100%' :chart-data="cpuWaitrData" id='doughnutWaitr'></doughnut>
              </div>
              <div style="float:left;width: 20%;height: 300px;">
                <doughnut height='100%' :chart-data="cpuUserData" id='doughnutIdle'></doughnut>
              </div>
            </div>
          </div>
        </vue-scroll>
      </div>
    </div>

    <el-dialog title="定制图表" :visible.sync="customChartDialog" width="80%" top="20px">
      <div>
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
          <el-tab-pane label="默认图表" name="default">
            <vue-scroll :style="defaultTableHeight">
              <el-table
                class="expand-table"
                :data="defaultTableData"
                style="width: 100%">
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <el-table
                      key="1"
                      class="expand-inside"
                      header-row-class-name="hide-header-checkbox"
                      :data="props.row.inTable"
                      border
                      style="width: 100%">
                      <el-table-column width="55">
                        <template slot-scope="scope">
                          <el-checkbox v-model="scope.row.checked" @change="handleInsideCheckedChange(props.$index, scope.$index)"></el-checkbox>
                        </template>
                      </el-table-column>
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
                      <el-table-column
                        label="图表展示">
                        <template slot-scope="scope">
                          <el-form :model="scope.row">
                            <el-form-item style="display: inline-block;" prop="chartType">
                              <el-select v-model="scope.row.chartType" placeholder="请选择">
                                <el-option
                                  :key="'1'"
                                  :label="'柱状图'"
                                  :value="'1'">
                                </el-option>
                                <el-option
                                  :key="'2'"
                                  :label="'折线图'"
                                  :value="'2'">
                                </el-option>
                                <el-option
                                  :key="'3'"
                                  :label="'饼状图'"
                                  :value="'3'">
                                </el-option>
                              </el-select>
                            </el-form-item>
                          </el-form>
                        </template>
                      </el-table-column>
                    </el-table>
                  </template>
                </el-table-column>
                <el-table-column>
                  <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.checked" :indeterminate="scope.row.isIndeterminate" @change="handleOutsideCheckedChange(scope.$index)">
                      <b class="header">{{scope.row.title}}</b>
                      <b class="header" v-if="scope.row.desc!=null">（{{scope.row.desc}}）</b>
                    </el-checkbox>
                    <b class="header index-count">【指标数：{{scope.row.inTable.length}} 个】</b>
                  </template>
                </el-table-column>
              </el-table>
            </vue-scroll>
          </el-tab-pane>
          <el-tab-pane label="定制图表" name="custom">
            <el-table :class="{'table-norm': true, 'hide-y-scroll': hideCustomScroll}"
                      :data="customTableData"
                      :height="customTableHeight"
                      key="2"
                      border>
              <el-table-column
                label="图表名称">
                <template slot-scope="scope">
                  <el-form :model="scope.row" :rules="customTableRules" :ref="'customTableForm'+ scope.$index">
                    <span v-show="editCustomIndex !== scope.$index || editCustomIndex===null">{{scope.row.tableName}}</span>
                    <el-form-item prop="tableName" v-show="editCustomIndex===scope.$index">
                      <el-input v-model="scope.row.tableName" placeholder="请输入图表名称"></el-input>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column
                label="包含指标">
                <template slot-scope="scope" style="position:relative;">
                    <span v-for="(item, index) in scope.row.indicator" v-show="editCustomIndex !== scope.$index || editCustomIndex===null">
                      {{item.indicatorName}}
                      <span v-if="index!==scope.row.indicator.length - 1">,</span>
                    </span>
                  <el-form :model="scope.row" v-show="editCustomIndex===scope.$index">
                    <el-form-item style="float: left;width: calc(50% - 5px);margin-right: 5px" prop="templateType">
                      <el-select v-model="scope.row.templateType"
                                 placeholder="请选择" style=""
                                 @change="changeTemplateType(scope.$index)"
                                 :loading="loadingTemplates">
                        <el-option
                          v-for="item in templates"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <selecttable :ref="'selecttable' + scope.$index"
                                 @changeYScroll="changeCustomScroll"
                                 @queryTable="queryIndicatorsByTemplate(scope.row.templateType)"
                                 @affirmSelect="affirmSelectIndicators"
                                 :dataIndex="scope.$index"
                                 :selectedIndicator="scope.row.configItemList===undefined?[]:scope.row.configItemList"
                                 :tableData="customIndicators"
                                 :loading="indicatorsLoading"
                                 style="float: left;width: calc(50% - 5px);">
                    </selecttable>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column
                label="图表展示">
                <template slot-scope="scope">
                  <el-form :model="scope.row">
                    <el-form-item style="display: inline-block;" prop="chartType">
                      <el-select :disabled="editCustomIndex !== scope.$index" v-model="scope.row.chartType" placeholder="请选择">
                        <el-option
                          :key="'1'"
                          :label="'柱状图'"
                          :value="'1'">
                        </el-option>
                        <el-option
                          :key="'2'"
                          :label="'折线图'"
                          :value="'2'">
                        </el-option>
                        <el-option
                          :key="'3'"
                          :label="'饼状图'"
                          :value="'3'">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                width="120">
                <template slot-scope="scope">
                  <div v-show="editCustomIndex !== scope.$index || editCustomIndex===null"
                       :class="{'table-operate':editCustomIndex !== scope.$index || editCustomIndex===null,
                         'table-operate-disabled':editCustomIndex !== scope.$index && editCustomIndex!==null}"
                       title="修改"
                       @click="(editCustomIndex !== scope.$index && editCustomIndex!==null)===true?'':editCustomTable(scope.$index)">
                    <svg-icon class="icon-space" icon-class="editIcon" style="margin-right: 5px"/>
                  </div>
                  <div v-show="editCustomIndex !== scope.$index || editCustomIndex===null"
                       :class="{'table-operate':editCustomIndex !== scope.$index || editCustomIndex===null,
                         'table-operate-disabled':editCustomIndex !== scope.$index && editCustomIndex!==null}"
                       title="添加"
                       @click="(editCustomIndex !== scope.$index && editCustomIndex!==null)===true?'':addCustomTable(scope.$index)">
                    <svg-icon class="icon-space" icon-class="plusIcon" style="margin-right: 5px"/>
                  </div>
                  <div v-show="editCustomIndex !== scope.$index || editCustomIndex===null"
                       :class="{'table-operate':editCustomIndex !== scope.$index || editCustomIndex===null,
                         'table-operate-disabled':editCustomIndex !== scope.$index && editCustomIndex!==null}"
                       title="删除"
                       @click="(editCustomIndex !== scope.$index && editCustomIndex!==null)===true?'':deleteCustomTable(scope.$index)"
                       style="display: inline-block">
                    <svg-icon class="icon-space" icon-class="deleteIcon"/>
                  </div>
                  <div v-show="editCustomIndex===scope.$index"
                       title="完成" @click="completeCustomTable(scope.$index)" class="table-operate" style="display: inline-block">
                    <svg-icon class="icon-space" icon-class="pigeon"/>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div slot="footer" class="dialog-footer" v-if="activeName === 'default'">
        <el-button v-waves style="width: 100px;" type="primary" @click="">确 定</el-button>
        <el-button v-waves style="width: 100px;" @click="customChartDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { showMessage, constructTree, objectAssignment, deleteFromTable, addToTableByIndex } from '@/utils/index'
  import { queryTree, queryDefaultTable, queryCustomTable, queryAllTemplates, queryAllIndicators } from '@/api/indicatorsMonitor/index'
  import linechart from '@/components/Charts/LineChart'
  import doughnut from '@/components/Charts/doughnut'
  import selecttable from '@/components/SelectTable'
  export default {
    name: 'indicatorsMonitor',
    components: {
      linechart,
      doughnut,
      selecttable
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val)
      }
    },
    computed: {
      getFlipParams() {

      },
      defaultTableHeight() {
        return 'height:' + (window.innerHeight - 280) + 'px'
      },
      customTableHeight() {
        return (window.innerHeight - 200)
      },
      machineNode() {
        return (this.selectedNode !== null && this.selectedNode.data.depth === 4)
      }
    },
    created() {
      this.queryIndicatorTree()
    },
    data() {
      return {
        listLoading: false,
        indicatorsLoading: false,
        indicatorsTreeData: [],
        selectedNode: null,
        filterText: '',
        defaultProps: {
          isLeaf: 'leaf',
          label: 'name',
          children: 'children'
        },
        customTableRules: {
          tableName: [
            { required: true, message: '请填写图表名称', trigger: 'blur' }
          ]
        },
        machineInfo: {
          name: null,
          ip: null,
          belong: null,
          type: null
        },
        formData: {
          name: null
        },
        lineChartData: {
          expectedData: [50, 140, 120, 113, 145, 150, 90],
          actualData: [20, 82, 91, 154, 102, 50, 130]
        },
        cpuUserData: {
          usedData: 80,
          unuseData: 20
        },
        cpuNiceData: {
          usedData: 45,
          unuseData: 55
        },
        cpuSysData: {
          usedData: 35,
          unuseData: 65
        },
        cpuWaitrData: {
          usedData: 15,
          unuseData: 85
        },
        customChartDialog: false,
        activeName: 'default',
        defaultTableData: [],
        customTableData: [],
        customIndicators: [],
        editCustomIndex: null,
        templates: [],
        indicators: null,
        loadingTemplates: true,
        hideCustomScroll: false
      }
    },
    methods: {
      queryIndicatorTree() {
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
            this.indicatorsTreeData = constructTree(treeData, root)
          } else {
            showMessage(res)
          }
        })
      },
      handleNodeClick(data, node) {
        if (this.selectedNode && this.selectedNode.data) {
          if (this.selectedNode.data.identId === node.data.identId) {
            // 同一个节点点，再次点击
          } else {
            // 切换到其他节点
            this.selectedNode = node
            if (this.selectedNode.data.depth === 4) {
              this.echartTitleAssign()
            }
          }
        } else {
          // 第一次选中节点
          this.selectedNode = node
          if (this.selectedNode.data.depth === 4) {
            this.echartTitleAssign()
          }
        }
      },
      filterNode(value, data) {
        if (!value) return true
        return data.value.indexOf(value) !== -1
      },
      echartTitleAssign() {
        objectAssignment(this, this.machineInfo, ['name', 'ip', 'belong', 'type'], this.selectedNode.data, ['value', 'ip'])
        objectAssignment(this, this.machineInfo, ['belong'], this.selectedNode.parent.parent.data, ['value'])
        objectAssignment(this, this.machineInfo, ['type'], this.selectedNode.parent.data, ['value'])
      },
      customChart() {
        this.activeName = 'default'
        queryDefaultTable().then(res => {
          if (res.code === '20000') {
            this.customChartDialog = true
            this.defaultTableData = res.result.records
            this.defaultTableData.forEach((defaultItem, i) => {
              this.$set(defaultItem, 'checked', true)
              this.$set(defaultItem, 'isIndeterminate', false)
              defaultItem['inTable'].forEach((insideItem, i) => {
                this.$set(insideItem, 'checked', true)
              })
            })
          } else {
            showMessage(res)
          }
        })
      },
      handleTabClick(tab, event) {
        if (tab.index === '1') {
          this.editCustomIndex = null
        }
        if (this.customTableData.length === 0 && tab.index === '1') {
          queryCustomTable().then(res => {
            if (res.code === '20000') {
              this.customTableData = res.result.records
            } else {
              showMessage(res)
            }
          })
        }
      },
      handleOutsideCheckedChange(index) {
        if (this.defaultTableData[index].checked) {
          this.$set(this.defaultTableData[index], 'isIndeterminate', false)
          this.defaultTableData[index].inTable.forEach((insideItem, i) => {
            this.$set(insideItem, 'checked', true)
          })
        } else {
          this.$set(this.defaultTableData[index], 'isIndeterminate', false)
          this.defaultTableData[index].inTable.forEach((insideItem, i) => {
            this.$set(insideItem, 'checked', false)
          })
        }
      },
      handleInsideCheckedChange(outIndex, insideIndex) {
        let checkAll = true
        let checkNone = true
        if (this.defaultTableData[outIndex].inTable[insideIndex].checked) {
          this.defaultTableData[outIndex].inTable.forEach((insideItem, i) => {
            if (!insideItem.checked) {
              checkAll = false
            }
          })
          checkNone = false
        } else {
          checkAll = false
          this.defaultTableData[outIndex].inTable.forEach((insideItem, i) => {
            if (insideItem.checked) {
              checkNone = false
            }
          })
        }

        if (checkAll) {
          this.$set(this.defaultTableData[outIndex], 'isIndeterminate', false)
          this.$set(this.defaultTableData[outIndex], 'checked', true)
        } else if (checkNone) {
          this.$set(this.defaultTableData[outIndex], 'isIndeterminate', false)
          this.$set(this.defaultTableData[outIndex], 'checked', false)
        } else {
          this.$set(this.defaultTableData[outIndex], 'isIndeterminate', true)
          this.$set(this.defaultTableData[outIndex], 'checked', false)
        }
      },
      editCustomTable(index) {
        this.editCustomIndex = index
        this.loadingTemplates = true
        this.$refs['selecttable' + index].hideTable()
        if (this.templates.length > 0) {
          this.loadingTemplates = false
        } else {
          queryAllTemplates().then(res => {
            this.loadingTemplates = false
            if (res.code === '20000') {
              this.templates = res.result
            } else {
              showMessage(res)
            }
          })
        }
      },
      completeCustomTable(index) {
        this.$refs['customTableForm' + index].validate((valid) => {
          if (valid) {
            this.editCustomIndex = null
            this.hideCustomScroll = false
          } else {
            console.log('校验失败')
          }
        })
      },
      deleteCustomTable(index) {
        deleteFromTable(this, this.customTableData, index)
      },
      addCustomTable(index) {
        addToTableByIndex(this.customTableData, { 'tableName': '', 'chartType': '1' }, index)
        this.editCustomIndex = index + 1
      },
      changeCustomScroll(status) {
        this.hideCustomScroll = status
      },
      queryIndicatorsByTemplate(index) {
        this.indicatorsLoading = true
        queryAllIndicators(this.customTableData[index]).then(res => {
          this.indicatorsLoading = false
          if (res.code === '20000') {
            this.customIndicators = res.result
          } else {
            showMessage(res)
          }
        })
      },
      affirmSelectIndicators(select, index) {
        const selectArray = []
        for (var i = 0; i < select.length; i++) {
          const obj = { 'indicatorId': select[i].id, 'indicatorName': select[i].name }
          selectArray.push(obj)
        }
        this.$set(this.customTableData[index], 'indicator', selectArray)
      },
      changeTemplateType(index) {
        this.queryIndicatorsByTemplate(index)
      }
    }
  }
</script>

<style rel="stylesheet/scss" type="text/scss" lang="scss" scoped>
  .page-area{
    width: 100%;
    position: relative;
    height: calc(100% - 30px);
    .indicators-tree{
      width: 25%;
      height: 100%;
      position: absolute;
    }
    .indicators-echart{
      width: 75%;
      height: 100%;
      position: absolute;
      top: 10px;
      left: 25%;
      .echart-title{
        height: 50px;
        line-height: 50px;
        padding-left: 10px;
        background-color: #01C9A7;
        color: #fff;
      }
      .indicators-form{
        display: inline-block;
        width: calc(100% - 133px);
        .page-form-item{
          width: calc(100% - 120px);
          margin-left: 10px
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

  .expand-table{
    .header{
      font-size: 16px;
      position: relative;
      top: 1px;
    }
    .index-count{
      right: 50%;
      position: absolute;
      top: 13px;
    }
  }

  .table-operate{
    display: inline-block;
    color: #333;
    .svg-icon{
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
  }

  .table-operate-disabled{
    display: inline-block;
    color: #ccc;
    .svg-icon{
      width: 20px;
      height: 20px;
      cursor: not-allowed;
    }
  }
</style>
