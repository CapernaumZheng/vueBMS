<template>
  <div class="main-out">
    <label>session</label>
    <el-button  v-waves plain class="primary-btn"
                @click="setSession">
      <svg-icon class="icon-space" icon-class="exportIcon" />
      session赋值
    </el-button>
        <el-button  v-waves plain class="primary-btn"
                @click="openWindow">
      <svg-icon class="icon-space" icon-class="exportIcon" />
      跳转
    </el-button>
    <div>{{test}}</div>
  </div>
</template>

<script>
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
      setSession() {
        this.aaa++
        sessionStorage.setItem('localSession', '本地session' + this.aaa)
      },
      openWindow() {
        const routeUrl = this.$router.resolve({
          path: '/report_monitor/session2',
          query: { id: 96 }
        })
        window.open(routeUrl.href, '_blank')
      }
    }
  }
</script>

<style rel="stylesheet/scss" type="text/scss" lang="scss" scoped>

</style>
