<template>
  <div class="main-out" v-loading="listLoading" element-loading-text="加载中......" border fit highlight-current-row>
    <div class="page-name">树+表格+时间选择30天内+表格超长显示</div>
    <div class="page-area">
      <div class="history-tree">
        <div class="stop-warning">
          <el-button v-waves plain class="plain-btn" @click="">
            停止
          </el-button>
          <span class="warning-text">屏蔽：<span class="warning-number">3</span>台</span>
        </div>
        <el-input class="clear-icon"
           style="padding:10px"
           clearable
           placeholder="请输入关键字"
           v-model="filterText">
          <i slot="suffix" class="el-input__icon el-icon-search icon-search"></i>
        </el-input>
        <vue-scroll style="height: calc(100% - 110px)">
          <el-tree :props="defaultProps" ref="tree"
                   :data="hisTreeData"
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
      <div class="history-table">
        <tabletitle height="50px" tableTitle="历史告警信息查询"
                    seriousNum="1"
                    importantNum="10"
                    warningNum="8"
                    tipNum="6"
                    @refreshClick="refreshTable"
                    @inforLevel="operationByType">
        </tabletitle>
        <el-form class="history-form" :model="formData" ref="formData">
          <el-form-item class="page-form-item common-form-item-82" label="开始日期：" prop="name" style="width: calc((100% - 170px)/3)">
            <el-date-picker
              v-model="formData.startDate"
              type="date"
              placeholder="选择开始日期"
              >
            </el-date-picker>
          </el-form-item>
          <el-form-item class="page-form-item common-form-item-82" label="结束日期：" prop="code" style="width: calc((100% - 170px)/3)">
            <el-date-picker
              v-model="formData.endDate"
              min="formData.startDate"
              type="date"
              placeholder="选择结束日期"
              :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
          <el-form-item class="page-form-item common-form-item-82" label="事件类型：" prop="status" style="width: calc((100% - 170px)/3)">
            <el-select v-model="formData.eventType" placeholder="请选择">
            <el-option
              :key="''"
              :label="'全部'"
              :value="''">
            </el-option>
            <el-option
              :key="'1'"
              :label="'正常'"
              :value="'1'">
            </el-option>
            <el-option
              :key="'2'"
              :label="'冻结'"
              :value="'2'">
            </el-option>
          </el-select>
          </el-form-item>
          <el-form-item class="page-form-item common-form-item-82" label="告警级别：" prop="status" style="width: calc((100% - 170px)/3)">
            <el-select v-model="formData.warningLevel" placeholder="请选择">
              <el-option
                :key="''"
                :label="'全部'"
                :value="''">
              </el-option>
              <el-option
                :key="'1'"
                :label="'正常'"
                :value="'1'">
              </el-option>
              <el-option
                :key="'2'"
                :label="'冻结'"
                :value="'2'">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="page-form-item common-form-item-82" label="机器名称：" prop="name" style="width: calc((100% - 170px)/3)">
            <el-input v-model="formData.machineName" placeholder="请输入机器名称"></el-input>
          </el-form-item>
          <el-form-item class="page-form-item common-form-item-82" label="机器类型：" prop="status" style="width: calc((100% - 170px)/3)">
            <el-select v-model="formData.machineType" placeholder="请选择">
              <el-option
                :key="''"
                :label="'全部'"
                :value="''">
              </el-option>
              <el-option
                :key="'1'"
                :label="'正常'"
                :value="'1'">
              </el-option>
              <el-option
                :key="'2'"
                :label="'冻结'"
                :value="'2'">
              </el-option>
            </el-select>
          </el-form-item>
          <el-button  style="width: 80px" v-waves class="primary-btn" @click="queryUserData(formData)">
            查询
          </el-button>
        </el-form>
        <el-table class="table-norm"
                  :data="tableData"
                  border
                  :height="tableHeight"
                  style="width: 100%"
        >
          <el-table-column
            prop="acquisitionTime"
            label="采集时间"
            width="150">
            <template slot-scope="scope">
              {{scope.row.acquisitionTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}
            </template>
          </el-table-column>
          <el-table-column
            prop="eventId"
            width="100"
            label="事件ID">
          </el-table-column>
          <el-table-column
            prop="alarmLevel"
            label="告警级别">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.alarmLevel == '1'" color="#FF0000" style="color: #333;">严重</el-tag>
              <el-tag v-if="scope.row.alarmLevel == '2'" color="#FF9933" style="color: #333;">重要</el-tag>
              <el-tag v-if="scope.row.alarmLevel == '3'" color="#FFFF33" style="color: #333;">警告</el-tag>
              <el-tag v-if="scope.row.alarmLevel == '4'" color="#66FF00" style="color: #333;">提示</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="machineName"
            label="机器名称">
          </el-table-column>
          <el-table-column
            prop="machineType"
            label="机器类型">
          </el-table-column>
          <el-table-column
            prop="ip"
            width="150"
            label="IP">
          </el-table-column>
          <el-table-column
            prop="indicator"
            width="100"
            label="指标">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="warningMes"
            width="150"
            label="告警信息">
          </el-table-column>
          <el-table-column
            prop="source"
            label="事件来源">
          </el-table-column>
          <el-table-column
            prop="strategy"
            label="策略">
          </el-table-column>
          <el-table-column
            prop="eventNum"
            label="事件数">
          </el-table-column>
          <el-table-column
            prop="suggestion"
            label="处理意见">
          </el-table-column>
        </el-table>
        <paging :flipParam="getFlipParams" ref="pagingData" @refreshUserList="refreshTable" @loadingList="loadingPage" style="text-align: right;"></paging>
      </div>
    </div>
  </div>
</template>

<script>
  import { showMessage, constructTree } from '@/utils/index'
  import { queryTree, queryTable } from '@/api/historyQuery/index'
  import tabletitle from '@/components/TableTitle'
  import paging from '@/components/Paging'
  export default {
    name: 'historyQuery',
    components: {
      tabletitle,
      paging
    },
    computed: {
      getFlipParams() {

      },
      tableHeight() {
        return (window.innerHeight - 400)
      }
    },
    created() {
      this.queryHisTree()
      this.queryHisTable(this.formData, undefined)
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val)
      }
    },
    data() {
      return {
        pickerOptions: {
          disabledDate: (time) => {
            const thirty = 30 * 24 * 3600 * 1000
            if (this.formData.startDate != null) {
              return time.getTime() < this.formData.startDate || time.getTime() > this.formData.startDate.getTime() + thirty
            } else {
              return true
            }
          }
        },
        listLoading: false,
        showOverFlow: true,
        filterText: '',
        defaultProps: {
          isLeaf: 'leaf',
          label: 'name',
          children: 'children'
        },
        hisTreeData: [],
        formData: {
          startDate: null,
          endDate: null,
          eventType: '',
          warningLevel: '',
          machineName: '',
          machineType: ''
        },
        tableData: []
      }
    },
    methods: {
      queryHisTree() {
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
            this.hisTreeData = constructTree(treeData, root)
          } else {
            showMessage(res)
          }
        })
      },
      queryHisTable(formData, footerParam) {
        queryTable(formData, footerParam).then(res => {
          if (res.code === '20000') {
            this.refreshTable(res)
          } else {
            showMessage(res)
          }
        })
      },
      handleNodeClick() {

      },
      filterNode(value, data) {
        if (!value) return true
        return data.value.indexOf(value) !== -1
      },
      refreshTable(res) {
        this.tableData = res.result.records
        const footerData = { 'current': res.result.current, 'size': res.result.size, 'total': res.result.total }
        this.$refs.pagingData.refreshPagingData(footerData)
      },
      loadingPage() {

      },
      operationByType(type) {
        console.log(type)
      }
    }
  }
</script>

<style rel="stylesheet/scss" type="text/scss" lang="scss" scoped>
  .page-area{
    width: 100%;
    position: relative;
    height: calc(100% - 30px);
    .history-tree{
      width: 25%;
      height: 100%;
      position: absolute;
      .stop-warning{
        margin-top: 5px;
        margin-left: 10px;
        .warning-text{
          margin-left: 10px
        }
        .warning-number{
          color: red;
          margin-right: 5px
        }
      }
    }
    .history-table{
      width: 75%;
      height: 100%;
      position: absolute;
      top: 10px;
      left: 25%;
      .history-form{
        margin-left: 10px;
        margin-top: 10px;
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
</style>
