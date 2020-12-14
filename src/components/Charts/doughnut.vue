<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

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
    },
    chartData: {
      type: Object
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
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
    setOptions({ usedData, unuseData } = {}) {
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        series: [
          {
            name: 'CPU使用率',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {
                value: unuseData,
                name: '未使用',
                label: {
                  normal: {
                    show: false
                  }
                },
                itemStyle: {
                  color: '#E9E9E9'
                },
                emphasis: {
                  color: '#a4a4a4'
                }
              },
              {
                value: usedData,
                name: '已使用',
                itemStyle: {
                  color: '#0096FA'
                },
                label: {
                  normal: {
                    show: true,
                    position: 'center',
                    formatter: '{d}%',
                    textStyle: {
                      fontSize: '30',
                      fontWeight: 'bold'
                    }
                  }
                },
                emphasis: {
                  color: '#1d76fa'
                }
              }
            ]
          }
        ]
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    }
  }
}
</script>
