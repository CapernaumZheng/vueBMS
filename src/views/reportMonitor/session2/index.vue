<template>
  <div class="main-out">
    <label>session</label>
    <el-button  v-waves plain class="primary-btn">
      <svg-icon class="icon-space" icon-class="exportIcon" />
      跳转
    </el-button>
    <div>{{test}}</div>
  </div>
</template>

<script>
  import { downloadTableList } from '@/api/reportQuery/index'
  export default {
    name: 'downloadFile',
    data() {
      return {
        test: '',
        aaa: 0
      }
    },
    mounted() {
      debugger
      this.test = this.$store.getters.test1
    },
    methods: {
    }
  }
</script>

<style rel="stylesheet/scss" type="text/scss" lang="scss" scoped>

</style>
