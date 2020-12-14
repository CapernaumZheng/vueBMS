<template>
  <div class="main-out" v-loading="listLoading" element-loading-text="加载中......" border fit highlight-current-row>
    <div class="page-name">树+Tab切换+表格数据上移下移</div>
    <div class="page-area">
      <div class="com-setting-tree">
        <vue-scroll :style="treeHeight"  style="margin-top: 20px">
          <el-tree :props="defaultProps" ref="tree"
                 :data="treeData"
                 node-key="identId"
                 show-checkbox
                 @check-change="handleCheckChange"
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
      <div class="move-right">
        <el-button v-waves class="plain-btn" @click="queryRightTable">
          <svg-icon class="icon-space" icon-class="coarseArrowR" />
        </el-button>
      </div>
      <div class="com-setting-table">
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
          <el-tab-pane label="添加交易主机/日志中转机" name="tradingHost">
            <el-table
                class="table-norm"
                :height="tableHeight"
                :data="tradingHostTableData"
                style="width: 100%">
                <el-table-column
                  width="80"
                  type="index"
                  label="位置编号">
                </el-table-column>
                <el-table-column
                  prop="position"
                  label="机房位置">
                </el-table-column>
                <el-table-column
                  prop="number"
                  label="机器编号">
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="机器名称">
                </el-table-column>
                <el-table-column
                  prop="type"
                  label="机器类型">
                </el-table-column>
                <el-table-column
                  prop="rack"
                  label="所属机架">
                </el-table-column>
                <el-table-column
                  width="200"
                  label="操作">
                  <template slot-scope="scope">
                    <div class="icon-operate" @click="moveUpOneStep(tradingHostTableData,scope.$index)">
                      <svg-icon class="icon-space" icon-class="singleArrowTop"/>
                      <span class="not-selected" style="cursor: pointer">上移</span>
                    </div>
                    <div class="icon-operate" @click="moveDownOneStep(tradingHostTableData,scope.$index)">
                      <svg-icon class="icon-space" icon-class="singleArrowBot"/>
                      <span class="not-selected" style="cursor: pointer">下移</span>
                    </div>
                    <div class="icon-operate" @click="deleteOneFromTable(tradingHostTableData,scope.$index)">
                      <svg-icon class="icon-space" icon-class="deleteIcon"/>
                      <span class="not-selected" style="cursor: pointer">删除</span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
          </el-tab-pane>
          <el-tab-pane label="添加前置机/异构前置机" name="preposed">
            <el-table
                class="table-norm"
                :height="tableHeight"
                :data="preposedTableData"
                style="width: 100%">
                <el-table-column
                  width="80"
                  type="index"
                  label="位置编号">
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="机房位置">
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="机器编号">
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="机器名称">
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="机器类型">
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="所属机架">
                </el-table-column>
                <el-table-column
                  prop="name"
                  width="200"
                  label="操作">
                  <template slot-scope="scope">
                    <div class="icon-operate" @click="moveUpOneStep(preposedTableData,scope.$index)">
                      <svg-icon class="icon-space" icon-class="singleArrowTop"/>
                      <span class="not-selected" style="cursor: pointer">上移</span>
                    </div>
                    <div class="icon-operate" @click="moveDownOneStep(preposedTableData,scope.$index)">
                      <svg-icon class="icon-space" icon-class="singleArrowBot"/>
                      <span class="not-selected" style="cursor: pointer">下移</span>
                    </div>
                    <div class="icon-operate" @click="deleteOneFromTable(preposedTableData,scope.$index)">
                      <svg-icon class="icon-space" icon-class="deleteIcon"/>
                      <span class="not-selected" style="cursor: pointer">删除</span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
  import { queryTree } from '@/api/sysTree/index'
  import { showMessage, constructTree, moveUpTable, moveDownTable, deleteFromTable } from '@/utils/index'
  import { queryTable } from '@/api/computerSetting/index'
  export default {
    name: 'computerSetting',
    computed: {
      treeHeight() {
        return 'height:' + (window.innerHeight - 160) + 'px'
      },
      tableHeight() {
        return (window.innerHeight - 200)
      }
    },
    created() {
      this.queryTree()
    },
    methods: {
      queryTree() {
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
      handleTabClick() {

      },
      handleCheckChange() {
        var checkedArray = this.$refs.tree.getCheckedNodes()
        this.selectedMachine = []
        for (const checkedNode of checkedArray) {
          if (checkedNode.depth === 4) {
            this.selectedMachine.push(checkedNode)
          }
        }
      },
      queryRightTable() {
        queryTable(this.selectedMachine).then(response => {
          if (response.code === '20000') {
            if (this.activeName === 'tradingHost') {
              this.tradingHostTableData = response.result.records
            } else {
              this.preposedTableData = response.result.records
            }
          } else {
            showMessage(response)
          }
        })
      },
      moveUpOneStep(tableData, index) {
        moveUpTable(tableData, index)
      },
      moveDownOneStep(tableData, index) {
        moveDownTable(tableData, index)
      },
      deleteOneFromTable(tableData, index) {
        deleteFromTable(this, tableData, index)
      }
    },
    data() {
      return {
        listLoading: false,
        tradingHostTableData: [],
        preposedTableData: [],
        treeData: [],
        activeName: 'tradingHost',
        defaultProps: {
          isLeaf: 'leaf',
          label: 'name',
          children: 'children'
        },
        selectedMachine: []
      }
    }
  }
</script>

<style rel="stylesheet/scss" type="text/scss" lang="scss" scoped>
  .page-area{
    width: 100%;
    position: relative;
    height: calc(100% - 30px);
    .com-setting-tree{
      width: calc(25% - 50px);
      height: 100%;
      float: left;
    }
    .move-right{
      width: 100px;
      margin-top: 55px;
      float: left;
    }
    .com-setting-table{
      width: calc(75% - 50px);
      height: 100%;
      float: left;
    }
  }
</style>
