<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
  import echarts from 'echarts'
  require('echarts/theme/macarons') // echarts theme
  import { debounce } from '@/utils'

  const animationDuration = 3000

  export default {
    props: {
      className: {
        type: String,
        default: 'chart'
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '300px'
      }
    },
    data() {
      return {
        chart: null
      }
    },
    mounted() {
      this.initChart()
      this.__resizeHanlder = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100)
      window.addEventListener('resize', this.__resizeHanlder)
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      window.removeEventListener('resize', this.__resizeHanlder)
      this.chart.dispose()
      this.chart = null
    },
    methods: {
      initChart() {
        this.chart = echarts.init(this.$el, 'macarons')

        var userName = ['会员一', '会员二', '会员三', '会员四', '会员五']

        this.chart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            top: 10,
            left: '2%',
            right: '2%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [{
            type: 'value',
            show: false,
            splitLine: {
              show: false
            },
            axisTick: {
              alignWithLabel: true
            }
          }],
          yAxis: [{
            type: 'category',
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            data: ['5', '4', '3', '2', '1']
          }],
          series: [{
            name: '报单排行',
            type: 'bar',
            barWidth: '60%',
            data: [50, 80, 100, 150, 220],
            label: {
              normal: {
                position: 'right',
                formatter: function(params) {
                  return userName[params['dataIndex']]
                },
                show: true
              }
            },
            animationDuration
          }]
        })
      }
    }
  }
</script>
