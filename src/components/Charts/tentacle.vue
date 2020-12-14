<template>
  <div :class="className" :id="id" :style="{height:height,width:width}"></div>
</template>

<script>
  import echarts from 'echarts'
  import resize from './mixins/resize'

  export default {
    mixins: [resize],
    props: {
      className: {
        type: String,
        default: 'chart'
      },
      id: {
        type: String,
        default: 'chart'
      },
      width: {
        type: String,
        default: '200px'
      },
      height: {
        type: String,
        default: '200px'
      }
    },
    data() {
      return {
        chart: null
      }
    },
    mounted() {
      this.initChart()
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    },
    methods: {
      initChart() {
        this.chart = echarts.init(document.getElementById(this.id))

        this.chart.setOption({
          color: ['#FF6600', '#3399FF', '#66CC33', '#FFCC33'],
          grid: {
            show: false,
            top: 0,
            left: '20%',
            bottom: 0
          },
          xAxis: [
            {
              show: false,
              type: 'category',
              axisTick: { show: false },
              data: ['下节点1', '下节点2', '下节点3', '下节点4', '下节点5', '下节点6', '下节点7']
            }
          ],
          yAxis: [
            {
              show: false,
              inverse: true,
              type: 'value'
            }
          ],
          series: [
            {
              name: 'connect',
              type: 'bar',
              barWidth: '5px',
              data: [320, 332, 301, 334, 200, 180, 340]
            },
            {
              name: 'request',
              type: 'bar',
              barWidth: '5px',
              data: [220, 182, 191, 234, 100, 50, 300]
            },
            {
              name: 'response',
              type: 'bar',
              barWidth: '5px',
              data: [150, 232, 201, 154, 100, 300, 150]
            },
            {
              name: 'delay',
              type: 'bar',
              barWidth: '5px',
              data: [98, 77, 101, 99, 50, 40, 30]
            }
          ]
        })
      }
    }
  }
</script>
