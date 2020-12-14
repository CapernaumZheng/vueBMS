<template>
  <div ref="selectTable" class="select-table">
    <el-input
      class="select-input"
      @focus="showSelectTable"
      clearable
      :placeholder="selectTip"
      v-model="searched">
      <i slot="suffix" :class="[classA, icon]" style="cursor: pointer" @click.stop="changIcon"></i>
    </el-input>
    <div class="table-area" v-show="showTable" :style="tablePosition" v-loading.body="loading" @click.stop>
      <el-table class="table-norm not-selected"
                ref="multipleTable"
                :data="tableListData"
                height="300"
                border
                style="width: 100%">
        <el-table-column
          width="55">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.checked"
                         :disabled="disabledTableRow(scope.row, multipleSelection)"
                         @change="handleCheckedChange(scope.row)">
            </el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="指标名称">
        </el-table-column>
        <el-table-column
          prop="type"
          label="数据类型">
        </el-table-column>
        <el-table-column
          prop="unit"
          label="指标单位">
        </el-table-column>
      </el-table>
      <div style="width: 100%;background-color: #fff">
        <el-button  style="width: 80px;margin-top: 5px;margin-bottom: 5px;" v-waves class="primary-btn" @click="confimTable">
          确认
        </el-button>
        <el-button  style="width: 80px" v-waves plain class="plain-btn" @click="hideTable">
          取消
        </el-button>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
  import { deepClone } from '@/utils/index'
  export default {
    name: 'selectTable',
    props: {
      tableData: {
        type: Array,
        default: []
      },
      selectedIndicator: {
        type: Array,
        default: []
      },
      loading: {
        type: Boolean,
        default: []
      },
      dataIndex: {
        type: Number,
        default: null
      }
    },
    watch: {
      tableData(val) {
        this.tableTemData = deepClone(val)
        this.setChecked()
        this.getSelected()
      },
      searched(val) {
        this.filterTheTable(val)
      }
    },
    computed: {
      selectTip() {
        if (this.multipleSelection.length > 0) {
          return '已选择' + this.multipleSelection.length + '条'
        } else {
          return '请选择'
        }
      }
    },
    data() {
      return {
        classA: 'el-input__icon',
        icon: 'el-icon-arrow-down',
        tableListData: [],
        tableTemData: [],
        searched: '',
        showTable: false,
        tablePosition: null,
        multipleSelection: []
      }
    },
    methods: {
      showSelectTable() {
        this.calculatePosition()
        this.$emit('changeYScroll', true)
        this.icon = 'el-icon-arrow-up'
        this.$emit('queryTable')
        this.showTable = true
      },
      changIcon() {
        if (this.icon === 'el-icon-arrow-down') {
          this.calculatePosition()
          this.$emit('changeYScroll', true)
          this.icon = 'el-icon-arrow-up'
          this.$emit('queryTable')
          this.showTable = true
        } else {
          this.$emit('changeYScroll', false)
          this.icon = 'el-icon-arrow-down'
          this.showTable = false
        }
      },
      calculatePosition() {
        const x = this.$el.getBoundingClientRect().x
        let y = this.$el.getBoundingClientRect().y + this.$el.clientHeight
        if (window.innerHeight - y < 350) {
          y = this.$el.getBoundingClientRect().y - 360
        }
        this.tablePosition = 'left: ' + x + 'px;top: ' + y + 'px'
      },
      hideTable() {
        this.searched = ''
        this.showTable = false
        this.icon = 'el-icon-arrow-down'
      },
      confimTable() {
        this.$emit('affirmSelect', this.multipleSelection, this.dataIndex)
        this.searched = ''
        this.showTable = false
        this.icon = 'el-icon-arrow-down'
      },
      filterTheTable(searched) {
        if (searched) {
          var newArray = this.tableTemData.filter(item => item.name.indexOf(searched) !== -1)
          this.tableListData = newArray
        } else {
          this.tableListData = deepClone(this.tableTemData)
        }
      },
      setChecked() {
        if (this.selectedIndicator.length > 0) {
          this.tableTemData.forEach((outItem, i) => {
            var index = 0
            for (var value of this.selectedIndicator) {
              index++
              if (outItem.identId === value.monitItemId) {
                this.$set(outItem, 'checked', true)
                break
              } else {
                if (index === this.selectedIndicator.length) {
                  this.$set(outItem, 'checked', false)
                } else {
                  continue
                }
              }
            }
          })
        } else {
          if (this.tableTemData.length > 0) {
            this.tableTemData.forEach((item, i) => {
              this.$set(item, 'checked', false)
            })
          }
        }
        this.tableListData = deepClone(this.tableTemData)
      },
      getSelected() {
        this.multipleSelection = []
        if (this.tableTemData.length > 0) {
          this.tableTemData.forEach((item, i) => {
            if (item.checked) {
              this.multipleSelection.push(item)
            }
          })
        }
      },
      handleCheckedChange(row) {
        if (row.checked) {
          this.multipleSelection.push(row)
        } else {
          this.multipleSelection.forEach((item, i) => {
            if (item.identId === row.identId) {
              this.multipleSelection.splice(i, 1)
            }
          })
        }
      },
      disabledTableRow(row, multipleSelection) {
        if (multipleSelection.length > 0) {
          return row.unit !== multipleSelection[0].unit
        } else {
          return false
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" type="text/scss" lang="scss" scoped>
  .select-table{
    .table-area{
      width: 500px;
      position: fixed;
      z-index: 999;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }
  }
</style>
