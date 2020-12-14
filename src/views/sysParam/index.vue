<template>
  <div class="main-out" v-loading="listLoading" element-loading-text="加载中......" border fit highlight-current-row>
    <div class="page-name">颜色选择器</div>
    <el-form class="u-form"  :model="formData" ref="formData">
      <el-form-item class="page-form-item form-label-four" label="参数代码：" style="width: calc((100% - 300px)/3)">
        <el-input v-model="formData.remark2" placeholder="请输入参数代码"></el-input>
      </el-form-item>
      <el-button  style="width: 80px" v-waves class="primary-btn" @click="queryCodeTable(formData)">
        查询
      </el-button>
      <el-button  style="width: 80px" v-waves plain class="plain-btn" @click="resetPage()">
        重置
      </el-button>
      <el-table
        class="table-norm"
        :data="tableData"
        style="width: 100%; ">
        <el-table-column
          type="index"
          prop="index"
          label="序号"
          width="50px"
        >
        </el-table-column>
        <el-table-column
          prop="remark2"
          label="参数代码"
        >
        </el-table-column>
        <el-table-column
          prop="subParms"
          label="参数键值"
          width="400px"
        >
          <template slot-scope="scope">
            <div v-if="!changingCurrent(scope.$index) && scope.row.subParms.length<5 "  >
              <div v-for="item in scope.row.subParms">
                {{item.remark}}<span v-show="item.remark!=='' && item.remark1!==''&& item.remark!==null && item.remark1!==null">，</span>{{item.remark1}}
                <span v-show="(item.remark === '' || item.remark === null) && (item.remark1 === '' || item.remark1 === null)">--</span>
              </div>
            </div>

            <div v-if="!changingCurrent(scope.$index) && scope.row.subParms.length===5" >
              <div v-for="item in scope.row.subParms">
                <div class="color-item" :style="'background-color: '+ item.remark"></div>
                <span>{{item.remark1 | NetSpeedFilter}}</span>
                <span v-show="(item.remark === '' || item.remark === null) && (item.remark1 === '' || item.remark1 === null)">--</span>
              </div>
            </div>


            <input type="text"  v-model="scope.row.subParms[0].remark" v-if="changingCurrent(scope.$index) && scope.$index !== 9 && !(scope.row.subParms.length > 1) && ifIsFirstInput(scope.$index, scope.row)"/>


            <div v-if="changingCurrent(scope.$index) && scope.$index !== 10 && scope.row.subParms.length > 1 && ifIsChoosed(scope.$index, scope.row)">
              <el-form :model="scope.row.subParms[0]" ref="colorFormOne" style="position:relative;" :rules="colorFormOneRules">
                <el-form-item class="color-input" prop="remark1" style="margin-bottom: 0px">
                  <el-color-picker class="color-picker" v-model="scope.row.subParms[0].remark" size="mini"></el-color-picker>
                  <el-input readonly="true" v-model="scope.row.subParms[0].remark" placeholder="请选择颜色"></el-input>
                </el-form-item>
                <span class="color-font"><=</span>
                <el-form-item prop="remark1" class="color-input">
                  <el-input  v-model="scope.row.subParms[0].remark1" placeholder="请输入速度值"></el-input>
                </el-form-item>
                <span class="speed-font">Kb/s</span>
              </el-form>
              <el-form :model="scope.row.subParms[1]" ref="colorFormTwo" style="position:relative;" :rules="colorFormOneRules">
                <el-form-item class="color-input" prop="remark" style="margin-bottom: 0px">
                  <el-color-picker class="color-picker" v-model="scope.row.subParms[1].remark" size="mini"></el-color-picker>
                  <el-input readonly="true" v-model="scope.row.subParms[1].remark" placeholder="请选择颜色"></el-input>
                </el-form-item>
                <span class="color-font"><=</span>
                <el-form-item prop="remark1" class="color-input">
                  <el-input v-model="scope.row.subParms[1].remark1" placeholder="请输入速度值"></el-input>
                </el-form-item>
                <span class="speed-font">Kb/s</span>
              </el-form>
              <el-form :model="scope.row.subParms[2]" ref="colorFormThree" style="position:relative;" :rules="colorFormOneRules">
                <el-form-item class="color-input" prop="remark1" style="margin-bottom: 0px">
                  <el-color-picker class="color-picker" v-model="scope.row.subParms[2].remark" size="mini"></el-color-picker>
                  <el-input readonly="true" v-model="scope.row.subParms[2].remark" placeholder="请选择颜色"></el-input>
                </el-form-item>
                <span class="color-font"><=</span>
                <el-form-item prop="remark1" class="color-input">
                  <el-input v-model="scope.row.subParms[2].remark1" placeholder="请输入速度值"></el-input>
                </el-form-item>
                <span class="speed-font">Kb/s</span>
              </el-form>
              <el-form :model="scope.row.subParms[3]" ref="colorFormFour" style="position:relative;" :rules="colorFormOneRules">
                <el-form-item class="color-input" prop="remark1" style="margin-bottom: 0px">
                  <el-color-picker class="color-picker" v-model="scope.row.subParms[3].remark" size="mini"></el-color-picker>
                  <el-input readonly="true" v-model="scope.row.subParms[3].remark" placeholder="请选择颜色"></el-input>
                </el-form-item>
                <span class="color-font"><=</span>
                <el-form-item prop="remark1" class="color-input">
                  <el-input v-model="scope.row.subParms[3].remark1" placeholder="请输入速度值"></el-input>
                </el-form-item>
                <span class="speed-font">Kb/s</span>
              </el-form>
              <el-form :model="scope.row.subParms[4]" ref="colorFormFive" style="position:relative;" :rules="colorFormOneRules">
                <el-form-item class="color-input" prop="remark1" style="margin-bottom: 0px">
                  <el-color-picker class="color-picker" v-model="scope.row.subParms[4].remark" size="mini"></el-color-picker>
                  <el-input readonly="true" v-model="scope.row.subParms[4].remark" placeholder="请选择颜色"></el-input>
                </el-form-item>
                <span class="color-font"><=</span>
                <el-form-item prop="remark1" class="color-input">
                  <el-input v-model="scope.row.subParms[4].remark1" placeholder="请输入速度值"></el-input>
                </el-form-item>
                <span class="speed-font">Kb/s</span>
              </el-form>
            </div>

            <div v-if="changingCurrent(scope.$index) && (scope.$index === (tableData.length-1)) && !(scope.row.subParms.length > 1) && ifIsFirstLine(scope.$index, scope.row)">
              <el-select v-model="scope.row.subParms[0].remark" filterable placeholder="操作频率"  style="width: 35%">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-time-picker
                v-model="scope.row.subParms[0].remark1"
                value-format="HH:mm"
                :picker-options="{
              format: 'HH:mm'
              }"
                placeholder="任意时间"
                style="width: 26%">
              </el-time-picker>
            </div>

          </template>
        </el-table-column>
        <el-table-column
          prop="value"
          label="描述"
        >
          <!--<template slot-scope="scope">-->
          <!--<span v-if="!changingCurrent(scope.$index)">{{scope.row.value}}</span>-->
          <!--<input type="text" v-model="scope.row.value" v-if="changingCurrent(scope.$index)"/>-->
          <!--</template>-->
        </el-table-column>
        <el-table-column
          prop="opration"
          label="操作"
          width="100px">
          <template slot-scope="scope">
            <div class="user-operate">
              <span :class="{ 'table-opration': true,'opration-disabled': changingOther(scope.$index)}" v-if="!changingCurrent(scope.$index)" @click="changingOther(scope.$index)===true?'':isChanging(scope.$index)">
               <svg-icon class="icon-space" icon-class="editIcon" style="color: #808080"/> 修改
              </span>
              <!--完成里面加入两个之后需要的修改参数-->
              <span class="table-opration"  v-if="changingCurrent(scope.$index)" @click="changeFinish(scope.row, scope.row.subParms)">
               <svg-icon class="icon-space" icon-class="editIcon" style="color: #808080"/> 完成
              </span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--<paging :flipParam="getFlipParams" ref="pagingData" @refreshUserList="refreshUserList" @loadingList="loadingCodeList" style="text-align: right;"></paging>-->
    </el-form>
  </div>
</template>

<script>
  import paging from '@/components/Paging'
  import { showMessage, clearFormData } from '@/utils/index'
  import { queryParamTable, submitChange } from '@/api/sysParam/index'

  export default {
    name: 'sysParam',
    components: {
      paging
    },
    created() {
      this.queryCodeTable(this.formData)
    },
    // computed: {
    //   getFlipParams: function() {
    //     flipParam.requestParams.condition.value = this.formData.value
    //     return flipParam
    //   }
    // },
    data() {
      return {
        listLoading: false,
        // identId: null,
        changeData: null,
        value2: null,
        oprateRate: null,

        colorFormOneRules: {
          remark: [
            { required: true, message: '必填', trigger: 'blur' }
          ],
          remark1: [
            { required: true, message: '必填', trigger: 'blur' }
          ]
        },
        options: [{
          value: '每日',
          label: '每日'
        }, {
          value: '每周',
          label: '每周'
        }],
        formData: {
          remark1: null,
          value: null
        },
        tableData: []
      }
    },
    methods: {
      loadingCodeList() {
        this.listLoading = false
      },
      isChanging(index) {
        this.changeData = index
      },

      refreshUserList(response) {
        this.listLoading = false
        if (response.code === '20000') {
          this.tableData = response.result
          // const footerData = { 'current': response.result.current, 'size': response.result.size, 'total': response.result.total }
          // this.$refs.pagingData.refreshPagingData(footerData)
        } else {
          showMessage(response)
        }
      },

      // 查询参数表格
      queryCodeTable(params) {
        this.changeData = null
        this.listLoading = true
        queryParamTable(params, undefined).then(response => {
          console.log(response)
          this.listLoading = false
          if (response.code === '20000') {
            this.refreshUserList(response)
          } else {
            showMessage(response)
          }
        })
      },
      // 重置按钮
      resetPage() {
        clearFormData(this, 'formData', this.formData)
        // this.refreshUserList(this.formData)
        queryParamTable(this.formData, undefined).then(response => {
          this.refreshUserList(response)
        })
      },
      // 完成修改
      // console.log(i)
      changeFinish(params, subParms) {
        this.changeData = null
        this.listLoading = true
        const subParams = []
        subParms.forEach((item, i) => {
          let paramObj = { 'identId': '', 'remark': '', 'remark1': '' }
          if (item && item.identId) {
            paramObj = { 'identId': item.identId, 'remark': item.remark, 'remark1': item.remark1 }
          } else {
            console.error('数据缺失identId！')
          }
          subParams.push(paramObj)
        })

        submitChange(params, subParams).then(response => {
          this.listLoading = false
          queryParamTable(this.formData, undefined).then(response => {
            this.listLoading = false
            if (response.code === '20000') {
              this.refreshUserList(response)
            } else {
              showMessage(response)
            }
          })
          showMessage(response)
        })
      },
      changingCurrent(index) {
        return this.changeData === index
      },
      changingOther(index) {
        return !this.changingCurrent(index) && this.changeData !== null
      },
      // 判断是否单独查询最后一个参数并修改
      ifIsFirstLine(index, tableRowData) {
        // debugger
        if (tableRowData.remark2 === '333' && index === 0) {
          return true
        } else if (this.formData.remark2 === undefined && index === 9) {
          return true
        } else if (this.formData.remark2 === null && index === 9) {
          return true
        }
      },
      // 判断是否单独查询速度参数并修改
      ifIsChoosed(index, tableRowData) {
        // debugger
        if (tableRowData.remark2 === '111' && index === 0) {
          return true
        } else if (tableRowData.remark2 === '111' && index === 8) {
          return true
        }
      },
      ifIsFirstInput(index, tableRowData) {
        // debugger
        if (index === 0 && tableRowData.remark2 !== '111' && tableRowData.remark2 !== '333') {
          return true
        } else if (index === 1 || index === 2 || index === 3 || index === 4 || index === 5 || index === 6 || index === 7 && this.formData.remark2 === undefined) {
          return true
        } else if (index === 1 || index === 2 || index === 3 || index === 4 || index === 5 || index === 6 || index === 7 && this.formData.remark2 === null) {
          return true
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" type="text/scss" lang="scss" scoped>
  .u-form{
    padding-top: 10px;
    padding-left: 10px;
  }
  .role-top{
    padding-left: 10px;
    border: 1px solid #d8dce5;
    border-top: none;
    line-height: 40px;
    background-color: #fff;
    .role-label{
      color: #606266;
    }
  }

  .table-opration{
    color:#01C9A7;
    font-size: 14px;
    cursor: pointer;
  }

  .opration-disabled{
    color: #cccccc;
    cursor: not-allowed;
  }

  .color-input{
    float:left;
    width: calc(50% - 50px);
  }
  .color-font{
    float:left;
    padding-top: 10px;
    width: 20px;
  }
  .speed-font{
    float:left;
    padding-top: 10px;
    width: 30px;
  }
  .color-picker{
    position: absolute;
    z-index: 100;
    left: calc(100% - 35px);
    top: 7px;
  }
  .color-item{
    display:inline-block;
    height: 5px;
    width: 50px;
  }
</style>
