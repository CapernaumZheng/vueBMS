<template>
  <div class="main-out" v-loading="listLoading" element-loading-text="加载中......" border fit highlight-current-row>
    <div class="page-name">文本信息搜索高亮展示</div>
    <div class="page-area">
      <el-form class="u-form" :rules="addRules" :model="formData" ref="formData">
        <el-form-item class="page-form-item" label="开始日期:" prop="startTime" style="width: calc((100% - 300px)/3)">
          <el-date-picker type="date"  v-model="formData.startTime" placeholder="请选择开始日期" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-form-item>
        <el-form-item class="page-form-item" label="结束日期:" prop="endTime" style="width: calc((100% - 300px)/3);">
          <el-date-picker type="date"  v-model="formData.endTime" placeholder="请选择结束日期" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-form-item>
        <el-form-item class="page-form-item" label="机器编号:" prop="nodeIds" :loading="loadingNodeId" element-loading-spinner="el-icon-loading" style="width: calc((100% - 300px)/3);">
          <el-select v-model="formData.nodeIds" multiple :filterable="true" reserve-keyword :remote="true" placeholder="请输入关键词"
                     :remote-method="DynamicQuery_NodeId" :loading="loading" style="width: 218px;">
            <el-option
              v-for="item in nodeId"
              :key="item.value"
              :label="item.label"
              :disabled="item.disabled"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <br/>
        <el-form-item class="page-form-item" label="日志信息:" prop="msg" style="width: calc((100% - 300px)/3);">
          <el-input v-model="formData.msg" placeholder="请输入查询关键字" style="width: 220px;"></el-input>
        </el-form-item>


        <!--<el-form-item class="page-form-item form-label-four" label="日志名称:" prop="file_name" :loading="loadingFileName" element-loading-spinner="el-icon-loading" style="width: calc((100% - 300px)/3);margin-left: 20px;">-->
          <!--<el-select v-model="formData.file_name" placeholder="请选择" @focus="queryFileName" style="width: 218px;">-->
            <!--<el-option-->
              <!--v-for="item in fileName"-->
              <!--:key="item.value"-->
              <!--:label="item.label"-->
              <!--:disabled="item.disabled"-->
              <!--:value="item.value">-->
            <!--</el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item  class="page-form-item" label="日志名称:" prop="fileName" style="width: calc((100% - 300px)/3);">
        <el-select v-model="formData.fileName" :filterable="true" :remote="true" placeholder="请输入关键词"
          :remote-method="DynamicQuery_FileName" :loading="loading" style="width: 220px;">
          <el-option
            v-for="item in filename"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        </el-form-item>


        <el-form-item class="page-form-item" label="机器类型:" prop="service" :loading="loadingApply" element-loading-spinner="el-icon-loading" style="width: calc((100% - 300px)/3);">
          <el-select v-model="formData.service" placeholder="请选择" @change="currentSel" @focus="" style="width: 218px;">
            <el-option
              v-for="item in apply"
              :key="item.value"
              :label="item.label"
              :disabled="item.disabled"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button  style="width: 80px" v-waves class="primary-btn" @click="queryLogData(formData)">
          查询
        </el-button>
      </el-form>
      <b style="margin-left: 10px">日志信息：</b>
      <vue-scroll style="height: calc(100% - 250px);margin-top: 7px;">
        <div class="result">
          <div class="miniresult" v-for="item in messages">
            message：<span v-html="highLight(item, formData.msg)"></span>
          </div>
        </div>
      </vue-scroll>
      <paging :flipParam="getFlipParams"
              ref="pagingData"
              @refreshUserList="refreshLogList"
              @loadingList="loadingLogList"
              style="text-align: right;"></paging>
    </div>
  </div>
</template>

<script type="text/javascript">
  import paging from '@/components/Paging'
  // import { getDict } from '@/api/public'
  import { historyLogSearch, flipParam } from '@/api/historyLog/index'
  import { query_ByMachineNumber } from '@/api/historyLog/code'
  import { query_ByLogName } from '@/api/historyLog/name'
  import { highLightTableMsg } from '@/filters/index'
  import { showMessage } from '@/utils/index'
  export default {
    name: 'historyLog',
    components: {
      paging
    },
    created() {
      // this.queryLogData(this.formData)
      this.listLoading = false
      // this.queryApply()
      // this.queryFileName()
    },
    data() {
      return {
        listLoading: false,
        loadingApply: false,
        loadingNodeId: false,
        // loadingFileName: false,
        loading: false,
        fileName_list: [],
        fileName_states: [],
        nodeid_list: [],
        nodeid_states: [],
        formData: {
          startTime: (new Date()).getFullYear() + '-' + (new Date()).getMonth() + '-' + (new Date()).getDate() + ' ' + (new Date()).getHours() + ':' + (new Date()).getMinutes() + ':' + (new Date()).getSeconds(),
          endTime: (new Date()).getFullYear() + '-' + ((new Date()).getMonth() + 1) + '-' + (new Date()).getDate() + ' ' + (new Date()).getHours() + ':' + (new Date()).getMinutes() + ':' + (new Date()).getSeconds(),
          service: '全部',
          nodeIds: null,
          fileName: null,
          msg: ''
        },
        nodeId: [],
        filename: [],
        messages: [],
        apply: [
          {
            'value': '前置机',
            'label': '前置机'
          },
          {
            'value': '异构前置机',
            'label': '异构前置机'
          },
          {
            'value': '交易主机',
            'label': '交易主机'
          },
          {
            'value': '日志中转机',
            'label': '日志中转机'
          },
          {
            'value': '全部',
            'label': '全部'
          }
        ],
        addRules: {
          startTime: [
            { required: true, message: '请选择开始日期', trigger: 'blur' }
          ],
          endTime: [
            { required: true, message: '请选择结束日期', trigger: 'blur' }
          ],
          service: [
            { required: true, message: '请选择应用', trigger: 'blur' }
          ],
          msg: [
            { required: true, message: '请输入查询的日志信息', trigger: 'blur' }
          ],
          fileName: [
            { required: true, message: '请输入日志名称', trigger: 'blur' }
          ],
          nodeIds: [
            { required: true, message: '请输入选择机器编号', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      getFlipParams: function() {
        flipParam.requestParams.condition.startTime = this.formData.startTime
        flipParam.requestParams.condition.endTime = this.formData.endTime
        flipParam.requestParams.condition.service = this.formData.service
        flipParam.requestParams.condition.msg = this.formData.msg
        flipParam.requestParams.condition.fileName = this.formData.fileName
        flipParam.requestParams.condition.nodeIds = this.formData.nodeIds
        return flipParam
      }
    },
    methods: {
      currentSel() {
        this.nodeId = []
        this.nodeid_states = []
        this.nodeid_list = []
      },
      DynamicQuery_NodeId(query) {
        this.queryNodeId(query)
        if (query !== '') {
          this.loading = true
          setTimeout(() => {
            this.loading = false
            this.nodeId = this.nodeid_list.filter(item => {
              return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          }, 200)
        } else {
          this.nodeId = []
        }
      },
      DynamicQuery_FileName(query) {
        this.queryFileName(query)
        if (query !== '') {
          this.loading = true
          setTimeout(() => {
            this.loading = false
            this.filename = this.fileName_list.filter(item => {
              return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          }, 200)
        } else {
          this.filename = []
        }
      },
      queryFileName(params) {
        const param = { 'value': params }
        query_ByLogName(param).then(response => {
          if (response.code === '20000') {
            this.fileName_states = []
            const parameters = response.result.records
            parameters.forEach((item, i) => {
              this.fileName_states[i] = item.value
              this.fileName_list = this.fileName_states.map(item => {
                return { value: item, label: item }
              })
            })
          } else {
            showMessage(response)
          }
        })
      },
      queryNodeId(params) {
        if (this.nodeid_states.length > 0) {
          //
        } else {
          const param = { 'code': params, 'machineType': this.formData.service }
          query_ByMachineNumber(param).then(response => {
            if (response.code === '20000') {
              this.nodeid_states = []
              const parameters = response.result.records
              parameters.forEach((item, i) => {
                // this.nodeid_states.push(item.code)
                this.nodeid_states[i] = (item.code + '')
                this.nodeid_list = this.nodeid_states.map(item => {
                  return { value: item, label: item }
                })
              })
            } else {
              showMessage(response)
            }
          })
        }
      },
      // queryApply() {
      //   if (this.apply.length > 0) {
      //     // 查过了，就不再调接口查询了
      //   } else {
      //     this.loadingApply = true
      //     getDict(applyPath, 'post', {}).then(response => {
      //       this.loadingApply = false
      //       if (response.code === '20000') {
      //         this.apply = response.datas
      //       } else {
      //         showMessage(response)
      //       }
      //     })
      //   }
      // },
      // ***************保留***********
      queryLogData(params) {
        this.listLoading = true
        historyLogSearch(params, undefined).then(response => {
          this.listLoading = false
          if (response.code === '20000') {
            showMessage(response)
            this.refreshLogList(response)
          } else {
            showMessage(response)
          }
        })
      },
      refreshLogList(res) {
        this.listLoading = false
        if (res.code === '20000') {
          this.messages = res.result.records
          const footerData = { 'current': res.result.current, 'size': res.result.size, 'total': res.result.total }
          this.$refs.pagingData.refreshPagingData(footerData)
        } else {
          showMessage(res)
        }
      },
      loadingLogList() {
        this.listLoading = true
      },
      highLight(item, highLight) {
        return highLightTableMsg(item, highLight)
      }
    }
  }
</script>

<style rel="stylesheet/scss" type="text/scss" lang="scss" scoped>
  .page-area {
    width: 100%;
    height: calc(100% - 30px);
    position: relative;
  }
  .u-form{
    margin-top: 10px;
    padding-left: 10px;
  }
  .result{
    background-color: #fff;
    width: 100%;
    margin: auto;
    padding: 20px;
  }
  .miniresult{
    border-top: 3px solid ghostwhite;
    background-color: white;
    padding-top: 10px;
    width: 100%;
    margin:10px auto;
  }
</style>
