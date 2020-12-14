<template>
  <div ref="footerParam">
    <div class="block">
      <el-pagination style="margin-top: 20px"
                     :small="ifSmall"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="footerParam.current"
                     :page-sizes="[10, 20, 30, 40]"
                     :page-size="footerParam.size"
                     background
                     layout="sizes, prev, pager, next, total, jumper"
                     :total="footerParam.total">
      </el-pagination>
    </div>
  </div>
</template>

<script type="text/javascript">
  import request from '@/utils/request'
  export default {
    name: 'paging',
    props: ['flipParam', 'small'],
    computed: {
      ifSmall() {
        if (this.small !== undefined) {
          return this.small
        } else {
          return false
        }
      }
    },
    methods: {
      // 每页显示【10】条
      handleSizeChange(val) {
        this.footerParam.size = val
        this.footerParam.current = 1
        const pageParams = { 'pagger': { 'size': val, 'current': 1, 'total': this.footerParam.total }}
        const params = Object.assign(pageParams, this.flipParam.requestParams)
        this.$emit('loadingList')
        return request({
          headers: {
            'Content-Type': 'application/json'
          },
          transformRequest: [function(data) {
            data = JSON.stringify(data)
            return data
          }],
          url: this.flipParam.requestPath,
          method: 'post',
          params: {},
          data: params
        }).then(response => {
          this.$emit('refreshUserList', response)
        })
      },
      handleCurrentChange(val) {
        this.footerParam.current = val
        const pageParams = { 'pagger': { 'size': this.footerParam.size, 'current': this.footerParam.current, 'total': this.footerParam.total }}
        const params = Object.assign(pageParams, this.flipParam.requestParams)
        this.$emit('loadingList')
        return request({
          headers: {
            'Content-Type': 'application/json'
          },
          transformRequest: [function(data) {
            data = JSON.stringify(data)
            return data
          }],
          url: this.flipParam.requestPath,
          method: 'post',
          params: {},
          data: params
        }).then(response => {
          this.$emit('refreshUserList', response)
        })
      },
      // 刷新翻页控件数据
      refreshPagingData(data) {
        this.footerParam = data
      }
    },
    data() {
      return {
        footerParam: { 'current': 1, 'size': 10, 'total': 0 }
      }
    }
  }
</script>

<style scoped>

</style>
