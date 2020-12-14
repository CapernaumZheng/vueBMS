<template>
  <div style="width: 100%">
      <div v-for="item in number.length"
           :style="'left:calc(50% - '+ (distance - (item-1)*35) +'px)'"
           class="number-card"
        >{{number[item-1]}}</div>
  </div>
</template>

<script>
  export default {
    name: 'numberCard',
    props: {
      number: {
        type: String,
        default: '0'
      }
    },
    data() {
      return {
        distance: null
      }
    },
    created() {
      this.distance = 17.5 * this.number.length - 2.5
    },
    computed: {
    },
    methods: {
    }
  }
</script>

<style rel="stylesheet/scss"  type="text/scss" lang="scss" scoped>
.number-card{
  text-align:center;
  padding-top: 5px;
  height: 35px;
  border-radius: 5px;
  width: 30px;
  font-size: 20px;
  background-color: rgb(4, 62, 86);
  position: absolute;
  top: 25px;
  z-index: 100;
  color: rgb(255, 255, 255);
}
</style>
