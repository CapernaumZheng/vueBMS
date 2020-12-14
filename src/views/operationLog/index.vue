<template>
  <div class="main-out" v-loading="listLoading" element-loading-text="加载中......" border fit highlight-current-row>
    <div class="page-name">操作日志</div>
    <el-form class="u-form" :rules="addRules" :model="formData" ref="formData">
      <div class="top_div">
        <div>
          <el-form-item class="page-form-item" label="开始日期:" prop="startTime" style="width: calc((100% - 300px)/3)">
            <el-date-picker
              v-model="formData.startTime"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="用户名：" prop="createUserName" class="page-form-item" label-width="123px">
            <el-select v-model="formData.createUserName" filterable placeholder="请选择用户" >
              <el-option
                v-for="item in names"
                :key="index"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div>
        <el-form-item class="page-form-item" label="结束日期:" prop="endTime" style="width: calc((100% - 300px)/3)">
          <el-date-picker
            v-model="formData.endTime"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="page-form-item" label="按功能描述匹配：" prop="explainMsg" >
            <el-input v-model="formData.explainMsg" placeholder="请输入功能描述"></el-input>
        </el-form-item>
          <el-button  style="width: 80px" v-waves class="primary-btn" @click="queryOperationData(formData)">
            查询
          </el-button>
            <el-button  v-waves style="width: 120px" plain class="primary-btn" @click="handleDownload" :loading="downloadLoading">
              <svg-icon class="icon-space" icon-class="exportIcon"/>
              导出数据
            </el-button>
        </div>
      </div>
      <el-table
        class="table-norm"
        :data="tableData"
        style="width: 100%; border: 1px ">
        <el-table-column
          type="index"
          prop="index"
          label="序号"
          width="50">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="操作日期"
          >
        </el-table-column>
        <el-table-column
          prop="id"
          label="流水号"
          >
        </el-table-column>
        <el-table-column
          prop="businessType"
          label="模块名"
          >
        </el-table-column>
        <!--<el-table-column-->
          <!--prop="functionName"-->
          <!--label="功能名称"-->
        <!--&gt;-->
        <!--</el-table-column>-->
        <el-table-column
          prop="explainMsg"
          label="描述"
        width="250px">
        </el-table-column>
      </el-table>
      <paging :flipParam="getFlipParams" ref="pagingData" @refreshUserList="refreshUserList" @loadingList="loadingLoginOperationList" style="text-align: right;"></paging>
    </el-form>
  </div>
</template>

<script>
  import paging from '@/components/Paging'
  import { showMessage, formatJson } from '@/utils/index'
  import { chooseUserName, flipParam, queryTable } from '@/api/operationLog/index'
  export default {
    name: 'operationLog',
    components: {
      paging
    },
    created() {
      // this.querySearchData(this.formData)
      // this.queryUserNameData(this.formData)
      this.queryOperationData(this.formData)
      this.names = []
    },
    computed: {
      getFlipParams: function() {
        flipParam.requestParams.condition.createUserName = this.formData.createUserName
        flipParam.requestParams.condition.startTime = this.formData.startTime
        flipParam.requestParams.condition.endTime = this.formData.endTime
        flipParam.requestParams.condition.explainMsg = this.formData.explainMsg
        return flipParam
      }
    },
    data() {
      return {
        listLoading: false,
        downloadLoading: false,
        index: null,
        names: [],
        formData: {
          createUserName: null,
          startTime: null,
          endTime: null,
          explainMsg: null
        },
        tableData: [],
        addRules: {}
      }
    },
    methods: {
      loadingLoginOperationList() {
        this.listLoading = false
      },
      // 用户名下拉列表
      queryUserNameData(params) {
        this.listLoading = true
        chooseUserName(params).then(response => {
          this.listLoading = false
          if (response.code === '20000') {
            // debugger
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
          } else {
            showMessage(response)
          }
        })
      },
      // 翻页数据刷新
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
      // 查询数据
      queryOperationData(params) {
        this.listLoading = true
        queryTable(params, undefined).then(response => {
          this.listLoading = false
          if (response.code === '20000') {
            this.refreshUserList(response)
            console.log(response)
          } else {
            showMessage(response)
          }
        })
      },
      // 导出数据
      handleDownload() {
        this.downloadLoading = true
        import('@/vendor/ExportExcel').then(excel => {
          const tHeader = ['序号', '操作日期', '流水号', '模块名称', '描述']
          const filterVal = ['index', 'createTime', 'id', 'businessType', 'explainMsg']
          const list = this.tableData
          const data = formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '操作日志',
            autoWidth: this.autoWidth
          })
          this.downloadLoading = false
        })
      }
    },
    mounted() {
      this.queryUserNameData()
    }
  }
</script>

<style rel="stylesheet/scss" type="text/scss" lang="scss" scoped>
.u-form{
  margin-top: 10px;
  padding-left: 10px;
}
</style>
