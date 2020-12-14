<template>
  <div style="width: 100%;text-align: center;">
    <div class="card" :style="cardStyle">
      <svg-icon class="icon-space" :icon-class="iconClass"/>
      {{title}}
    </div>
  </div>
</template>

<script>
    export default {
      name: 'bigScreenTitle',
      props: {
        title: {
          type: String,
          default: ''
        },
        iconClass: {
          type: String,
          default: 'editIcon'
        },
        cardStyle: {
          type: String,
          default: 'width:100px;height:25px;padding-top:6px;background-color:#07658B;color:#fff;font-size:13px;text-align:center'
        }
      },
      data() {
        return {
        }
      },
      computed: {
      },
      methods: {
      }
    }
</script>

<style rel="stylesheet/scss"  type="text/scss" lang="scss" scoped>
.card{
  position:  absolute;
  border-radius: 25px;
}
.icon-space{
  margin-left: 5px;
}
</style>
