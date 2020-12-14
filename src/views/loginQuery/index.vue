<template>
  <div class="main-out" v-loading="listLoading" element-loading-text="加载中......" border fit highlight-current-row>
    <div class="page-name">登录查询</div>
    <el-form class="u-form" :rules="addRules" :model="formData" ref="formData">
      <el-form-item class="page-form-item common-form-item-82" label="登录时间：" prop="logTime" style="width: calc((100% - 300px)/3);margin-right: 0px">
        <el-date-picker
          :editable="timeEditable"
          v-model="formData.loginTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item class="page-form-item common-form-item-22" label="--" prop="logTime" style="width: calc((100% - 300px)/3);margin-right: 0px">
        <el-date-picker
          :editable="timeEditable"
          v-model="formData.loginTime2"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="任意结束时间点">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="用户名：" prop="region" class="page-form-item" label-width="123px">
        <el-select v-model="formData.loginUserName" filterable placeholder="请选择用户" >
          <el-option
            v-for="item in names"
            :key="index"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-button  style="width: 80px" :disabled="diabledQuery"
                  v-waves class="primary-btn" @click="queryLoginData(formData)">
        查询
      </el-button>
      <el-table
        class="table-norm"
        :data="tableData"
        style="width: 100%; border: 1px ">
        <el-table-column
          prop="index"
          type="index"
          label="序号"
          width="50">
        </el-table-column>
        <el-table-column
          prop="loginUserName"
          label="用户名"
        >
        </el-table-column>
        <el-table-column
          prop="ip"
          label="登录IP"
        >
        </el-table-column>
        <el-table-column
          prop="loginTime"
          label="登录时间"
        >
        </el-table-column>
        <el-table-column
          prop="opration"
          label="操作"
        >
          <template slot-scope="scope">
            <div class="user-operate" @click="">
              <span :class="{ 'table-opration': true }" v-if="true" @click="loginOut(scope.row.token)">
                注销
              </span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <paging :flipParam="getFlipParams" ref="pagingData" @refreshUserList="refreshUserList" @loadingList="loadingLoginList" style="text-align: right;"></paging>
    </el-form>
  </div>
</template>

<script>
  import paging from '@/components/Paging'
  import { showMessage } from '@/utils/index'
  import { queryTable, flipParam, chooseUserName, submitChange } from '@/api/loginQuery/index'
  export default {
    name: 'loginQuery',
    components: {
      paging
    },
    created() {
      this.queryLoginData(this.formData)
      this.names = []
    },
    mounted() {
      this.queryUserNameData()
    },
    computed: {
      getFlipParams: function() {
        flipParam.requestParams.condition.loginTime = this.formData.loginTime
        flipParam.requestParams.condition.loginTime = this.formData.loginTime2
        flipParam.requestParams.condition.loginUserName = this.formData.loginUserName
        return flipParam
      },
      diabledQuery() {
        if (this.formData.loginTime2) {
          if (this.formData.loginTime && this.formData.loginTime < this.formData.loginTime2) {
            return false
          } else {
            return true
          }
        } else {
          return false
        }
      }
    },
    data() {
      return {
        index: null,
        loginTime: null,
        listLoading: false,
        loginTime2: null,
        timeEditable: false,
        formData: {
          loginUserName: null,
          loginTime: null,
          loginTime2: null
        },
        addRules: {

        },
        tableData: [],
        names: []
      }
    },
    methods: {
      loadingLoginList() {
        this.listLoading = false
      },
      // 用户名下拉列表
      queryUserNameData(params) {
        this.listLoading = true
        chooseUserName(params).then(response => {
          this.listLoading = false
          if (response.code === '20000') {
            response.result.records.forEach(v => {
              for (const i in v) {
                if (v.hasOwnProperty(i)) {
                  if (i === 'name') {
                    //  this.names = []
                    this.names[i] = v[i]
                    this.names.push(v[i])
                  }
                }
              }
            })
            console.log(this.names)
            console.log(response)
          } else {
            showMessage(response)
          }
        })
      },
      // 翻页数据刷新(只刷到tableData)
      refreshUserList(response) {
        this.listLoading = false
        if (response.code === '20000') {
          this.tableData = response.result.records
          const footerData = { 'current': response.result.current, 'size': response.result.size, 'total': response.result.total }
          this.$refs.pagingData.refreshPagingData(footerData)
        } else {
          showMessage(response)
        }
      },
      // 查询表格
      queryLoginData(params) {
        this.listLoading = true
        queryTable(params, undefined).then(response => {
          this.listLoading = false
          if (response.code === '20000') {
            // console.log(response.result.records)
            this.refreshUserList(response)
            console.log(response)
          } else {
            showMessage(response)
          }
        })
      },
      // 注销
      loginOut(token) {
        this.listLoading = true
        submitChange(token).then(response => {
          this.listLoading = false
          showMessage(response)
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" type="text/scss" lang="scss" scoped>
  .u-form{
    margin-top: 10px;
    padding-left: 10px;
  }
  .table-opration{
    color:#01C9A7;
    font-size: 14px;
    cursor: pointer;
  }
</style>
