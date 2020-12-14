<template>
  <div class="ip-out-input">
    <input class="ip-input input-first"
           ref="ipInputFirst"
           @input="checkIpVal(ipAdress.first, 'first')"
           @keyup="turnIpPOS(ipAdress.first, 'first',$event)"
           @blur="setDefaultVal()"
           v-model="ipAdress.first"/>
    <div class="dot dot-first"></div>
    <input class="ip-input input-second"
           ref="ipInputSecond"
           @input="checkIpVal(ipAdress.second, 'second')"
           @keyup="turnIpPOS(ipAdress.second, 'second',$event)"
           @blur="setDefaultVal()"
           v-model="ipAdress.second"/>
    <div class="dot dot-second"></div>
    <input class="ip-input input-third"
           ref="ipInputThird"
           @input="checkIpVal(ipAdress.third, 'third')"
           @keyup="turnIpPOS(ipAdress.third, 'third',$event)"
           @blur="setDefaultVal()"
           v-model="ipAdress.third"/>
    <div class="dot dot-third"></div>
    <input class="ip-input input-four"
           ref="ipInputFour"
           @input="checkIpVal(ipAdress.four, 'four')"
           @keyup="turnIpPOS(ipAdress.four, 'four',$event)"
           @blur="setDefaultVal()"
           v-model="ipAdress.four"/>
  </div>
</template>

<script type="text/javascript">
  export default {
    name: 'tableTitle',
    props: {
      ipValue: {
        type: String,
        default: '0.0.0.0'
      }
    },
    computed: {

    },
    mounted() {
      this.ip = this.ipValue
      this.ipAdress.first = this.ipValue.split('.')[0]
      this.ipAdress.second = this.ipValue.split('.')[1]
      this.ipAdress.third = this.ipValue.split('.')[2]
      this.ipAdress.four = this.ipValue.split('.')[3]
    },
    methods: {
      checkIpVal(val, attr) {
        val = parseInt(val, 10)
        if (isNaN(val)) {
          val = 0
        } else {
          val = val < 0 ? 0 : val
          val = val > 255 ? 255 : val
        }
        this.ipAdress[attr] = val
        if (((val + '').length) === 3) {
          if (attr === 'first') {
            this.$refs.ipInputSecond.focus()
          } else if (attr === 'second') {
            this.$refs.ipInputThird.focus()
          } else if (attr === 'third') {
            this.$refs.ipInputFour.focus()
          }
        }
      },
      turnIpPOS(val, attr, event) {
        const e = event || window.event
        if (e.keyCode === 37) {
          // 键盘左箭头
          if (attr === 'four') {
            this.$refs.ipInputThird.focus()
          } else if (attr === 'third') {
            this.$refs.ipInputSecond.focus()
          } else if (attr === 'second') {
            this.$refs.ipInputFirst.focus()
          }
        }
        if (e.keyCode === 8) {
          // BackSpace
          if (val === 0) {
            if (attr === 'four') {
              this.$refs.ipInputThird.focus()
            } else if (attr === 'third') {
              this.$refs.ipInputSecond.focus()
            } else if (attr === 'second') {
              this.$refs.ipInputFirst.focus()
            }
          }
        }
        if (e.keyCode === 39 || e.keyCode === 13 || e.keyCode === 32) {
          // 右箭头、回车键、空格键、冒号均向右跳转
          if (attr === 'first') {
            this.$refs.ipInputSecond.focus()
          } else if (attr === 'second') {
            this.$refs.ipInputThird.focus()
          } else if (attr === 'third') {
            this.$refs.ipInputFour.focus()
          }
        }
      },
      setDefaultVal() {
        this.ip = this.ipAdress.first + '.' + this.ipAdress.second + '.' + this.ipAdress.third + '.' + this.ipAdress.four
        this.$emit('loseFocus', this.ip)
      },
      resetIpInput(ip) {
        if (ip) {
          this.ip = ip
          this.ipAdress.first = ip.split('.')[0]
          this.ipAdress.second = ip.split('.')[1]
          this.ipAdress.third = ip.split('.')[2]
          this.ipAdress.four = ip.split('.')[3]
        } else {
          this.ip = '0.0.0.0'
          this.ipAdress.first = 0
          this.ipAdress.second = 0
          this.ipAdress.third = 0
          this.ipAdress.four = 0
        }
      }
    },
    data() {
      return {
        ipAdress: {
          first: 0,
          second: 0,
          third: 0,
          four: 0
        },
        ip: '0.0.0.0'
      }
    }
  }
</script>

<style rel="stylesheet/scss" type="text/scss" lang="scss" scoped>
  .ip-out-input{
    position: relative;
  }
  .ip-out-input:hover>.ip-input{
    border-color: #c0c4cc;
  }
  .ip-input{
    -webkit-appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    line-height: 40px;
    outline: 0;
    padding: 0 15px;
    -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width: 25%;
    float: left
  }
  .input-first{
    border-right: none;
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
  }
  .input-second{
    border-right: none;
    border-left: none;
    border-radius: 0px;
  }
  .input-third{
    border-right: none;
    border-left: none;
    border-radius: 0px;
  }
  .input-four{
    border-left: none;
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
  }
  .dot{
    position: absolute;
    top: 30px;
    border-radius: 50%;
    background: #333;
    width: 5px;
    height: 5px;
  }
  .dot-first{
    left: calc(25% - 15px);
  }
  .dot-second{
    left: calc(50% - 15px);
  }
  .dot-third{
    left: calc(75% - 15px);
  }
</style>
