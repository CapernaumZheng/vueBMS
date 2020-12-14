<template>
  <div id="app" @click="isDo()">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      lastTime: null, // 最后一次点击的时间
      currentTime: null, // 当前点击的时间
      timeOut: 30 * 60 * 1000 // 设置超时时间： 30分钟
    }
  },
  mounted() {
    // 关闭浏览器窗口的时候清空浏览器缓存在localStorage的数据
    /**
    window.onbeforeunload = function(e) {
      var storage = window.localStorage
      storage.clear()
    }
     */
  },
  methods: {
    isDo() {
      /**
       * 这里的超时退出交由后端，token会有时效，过期时接口返回511，代表token过期，强制退出
       *
       *
      this.currentTime = new Date().getTime() // 记录这次点击的时间
      if (this.currentTime - this.lastTime > this.timeOut) { // 判断上次最后一次点击的时间和这次点击的时间间隔是否大于30分钟
        // 这里写状态已过期后执行的操作
        if (location.hash.split('/').length === 2 && location.hash.split('/')[1] === 'login') {
        // 停留在登录页面操作超时
        } else {
          this.$store.dispatch('LogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        }
      } else {
        this.lastTime = new Date().getTime() // 如果在30分钟内点击，则把这次点击的时间记录覆盖掉之前存的最后一次点击的时间
      }
     **/
    }
  },
  created() {
    this.lastTime = new Date().getTime() // 网页第一次打开时，记录当前时间
  }
}
</script>
