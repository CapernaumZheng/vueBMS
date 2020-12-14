<template>
  <div class="main-out">
    <label>后端提供文件流，下载任意类型文件</label>
    <el-button  v-waves plain class="primary-btn"
                :loading="downloadLoading"
                @click="handleDownload">
      <svg-icon class="icon-space" icon-class="exportIcon" />
      后端导出数据
    </el-button>
    {{test}}
  </div>
</template>

<script>
  import { downloadTableList } from '@/api/reportQuery/index'
  export default {
    name: 'downloadFile',
    data() {
      return {
        downloadLoading: false,
        formData: {
          name: '参数'
        },
        test: ''
      }
    },
    mounted() {
      this.test = this.$store.getters.test1
    },
    methods: {
      handleDownload() {
        // 开始加载
        this.downloadLoading = true
        downloadTableList(this.formData).then(response => {
          this.downloadLoading = false
          this.download(response)
        })
      },
      download(data) {
        if (!data) {
          return
        }
        const blob = new Blob([data])
        if (window.navigator.msSaveOrOpenBlob) {
          // 兼容IE10
          navigator.msSaveBlob(blob, '系统容量.xlsx')
        } else {
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', '系统容量.xlsx')

          document.body.appendChild(link)
          link.click()
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" type="text/scss" lang="scss" scoped>

</style>
