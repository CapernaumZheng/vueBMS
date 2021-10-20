<template>
  <div class="main-out" v-loading="listLoading" element-loading-text="加载中......" border fit highlight-current-row>
    <div class="page-name">demo页面</div>

    <div style="margin-top: 20px">
      <label>Excel文件导出</label>
      <el-button style="float: right;margin-top: 10px;margin-bottom: 10px;margin-right: 50px" type="primary" icon="document" @click="handleDownload" :loading="downloadLoading">所有数据excel导出</el-button>
      <el-button style='margin-bottom:20px;' type="primary" icon="document" @click="handleDownloadZip" :loading="downloadZipLoading">导出zip</el-button>
      <el-table :data="list">
        <el-table-column align="center" label='序号' width="95">
          <template slot-scope="scope">
            {{scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column label="姓名" width="100">
          <template slot-scope="scope">
            {{scope.row.name}}
          </template>
        </el-table-column>
        <el-table-column label="地域" width="100" align="center">
          <template slot-scope="scope">
            <el-tag>{{scope.row.area}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="描述" align="center">
          <template slot-scope="scope">
            {{scope.row.desc}}
          </template>
        </el-table-column>
        <el-table-column label="牛逼程度" width="115" align="center">
          <template slot-scope="scope">
            {{scope.row.status}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="数据时间" width="220">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <hr>
    <div style="margin-top: 20px">
      <label>前端解析上传的Excel文件</label>
      <upload-excel-component :on-success='handleSuccess' :before-upload="beforeUpload"></upload-excel-component>
      <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
        <el-table-column v-for='item of tableHeader' :prop="item" :label="item" :key='item'>
        </el-table-column>
      </el-table>
    </div>
    <hr>
    <div style="height: 500px;">
      Websocket测试代码
      <el-input v-model="websocketMessage" placeholder="请输入消息"></el-input>
      <el-button type="primary" icon="document" @click="sendMessage">发送消息</el-button>
    </div>
  </div>
</template>

<script>
  import paging from '@/components/Paging'
  import UploadExcelComponent from '@/components/UploadExcel/index.vue'
  import { formatJson } from '@/utils/index'
  import { queryTableData } from '@/api/demo/index'
  import SockJS from 'sockjs-client'
  import Stomp from 'stompjs'
  export default {
    name: 'demo',
    components: {
      paging,
      UploadExcelComponent
    },
    mounted() {
      this.initWebSocket()
    },
    beforeDestroy() {
      // 页面离开时断开连接,清除定时器
      this.disconnect()
      clearInterval(this.timer)
    },
    created() {
      this.queryTable()
    },
    computed: {
    },
    data() {
      return {
        listLoading: false,
        downloadLoading: false,
        downloadZipLoading: false,
        list: [],
        tableData: [],
        tableHeader: [],
        websocketMessage: null
      }
    },
    methods: {
      queryTable() {
        queryTableData().then(response => {
          this.list = response.result.records
        })
      },
      // Excel文件下载
      handleDownload() {
        this.downloadLoading = true
        import('@/vendor/ExportExcel').then(excel => {
          const tHeader = ['id', '姓名', '地域', '描述', '牛逼程度', '数据时间', 'code']
          const filterVal = ['id', 'name', 'area', 'desc', 'status', 'createTime', 'code']
          const list = this.list
          const data = formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '著名武术家',
            autoWidth: this.autoWidth
          })
          this.downloadLoading = false
        })
      },

      // Zip文件下载
      handleDownloadZip() {
        this.downloadZipLoading = true
        import('@/vendor/ExportZip').then(zip => {
          const tHeader = ['Id', 'Title', 'Author', 'Readings', 'Date']
          const filterVal = ['id', 'title', 'author', 'pageviews', 'display_time']
          const list = this.list
          const data = formatJson(filterVal, list)
          zip.export_txt_to_zip(tHeader, data, '文本文件', '压缩包')
          this.downloadZipLoading = false
        })
      },

      // 上传Excel方法
      beforeUpload(file) {
        const isLt1M = file.size / 1024 / 1024 < 1

        if (isLt1M) {
          return true
        }

        this.$message({
          message: '文件需小于1M',
          type: 'warning'
        })
        return false
      },
      handleSuccess({ results, header }) {
        this.tableData = results
        this.tableHeader = header
      },
      sendMessage() {
        this.stompClient.send('/app/chat/' + '前端框架', {}, JSON.stringify({
          from: 'zackzheng',
          text: this.websocketMessage
        }))
      },

      initWebSocket() {
        this.connection()
        const self = this
        // 断开重连机制,尝试发送消息,捕获异常发生时重连
        this.timer = setInterval(() => {
          try {
            self.stompClient.send('test')
          } catch (err) {
            console.log('断线了: ' + err)
            self.connection()
          }
        }, 5000)
      },
      connection() {
        // 建立连接对象
        this.socket = new SockJS('http://localhost:9090/chat')// 连接服务端提供的通信接口，连接以后才可以订阅广播消息和个人消息
        // 获取STOMP子协议的客户端对象
        this.stompClient = Stomp.over(this.socket)
        // 定义客户端的认证信息,按需求配置
        var headers = {
          login: 'mylogin',
          passcode: 'mypasscode',
          // additional header
          'client-id': 'my-client-id'
        }
        // 向服务器发起websocket连接
        this.stompClient.connect(headers, (frame) => {
          this.stompClient.subscribe('/topic/messages', (msg) => { // 订阅服务端提供的某个topic
            console.log('服务端发给的消息：' + msg.body) // msg.body存放的是服务端发送给我们的信息
          })
        }, (err) => {
          console.log(err)
        })
      },
      disconnect() {
        if (this.stompClient != null) {
          this.stompClient.disconnect()
          console.log('失去连接')
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" type="text/scss" lang="scss" scoped>

</style>
