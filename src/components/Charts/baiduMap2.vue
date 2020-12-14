<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
  import echarts from 'echarts'
  require('echarts/theme/macarons') // echarts theme
  require('echarts/extension/bmap/bmap')
  import provincialCapital from '../../../static/json/provincialCapital.json'
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

        var startPoint = {
          x: 104.114129,
          y: 37.550339
        }
        // 地图自定义样式
        var bmap = {
          center: [startPoint.x, startPoint.y],
          zoom: 5,
          roam: true,
          mapStyle: {
            styleJson: [{
              'featureType': 'water',
              'elementType': 'all',
              'stylers': {
                'color': '#044161'
              }
            }, {
              'featureType': 'land',
              'elementType': 'all',
              'stylers': {
                'color': '#004981'
              }
            }, {
              'featureType': 'boundary',
              'elementType': 'geometry',
              'stylers': {
                'color': '#064f85'
              }
            }, {
              'featureType': 'railway',
              'elementType': 'all',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'highway',
              'elementType': 'geometry',
              'stylers': {
                'color': '#004981'
              }
            }, {
              'featureType': 'highway',
              'elementType': 'geometry.fill',
              'stylers': {
                'color': '#005b96',
                'lightness': 1
              }
            }, {
              'featureType': 'highway',
              'elementType': 'labels',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'arterial',
              'elementType': 'geometry',
              'stylers': {
                'color': '#004981'
              }
            }, {
              'featureType': 'arterial',
              'elementType': 'geometry.fill',
              'stylers': {
                'color': '#00508b'
              }
            }, {
              'featureType': 'poi',
              'elementType': 'all',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'green',
              'elementType': 'all',
              'stylers': {
                'color': '#056197',
                'visibility': 'off'
              }
            }, {
              'featureType': 'subway',
              'elementType': 'all',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'manmade',
              'elementType': 'all',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'local',
              'elementType': 'all',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'arterial',
              'elementType': 'labels',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'boundary',
              'elementType': 'geometry.fill',
              'stylers': {
                'color': '#029fd4'
              }
            }, {
              'featureType': 'building',
              'elementType': 'all',
              'stylers': {
                'color': '#1a5787'
              }
            }, {
              'featureType': 'label',
              'elementType': 'all',
              'stylers': {
                'visibility': 'off'
              }
            }]
          }
        }

        var geoCoordMap = provincialCapital

        var ZZData = [
          [{
            name: '郑州市'
          }, {
            name: '上海市',
            value: 95
          }],
          [{
            name: '郑州市'
          }, {
            name: '北京市',
            value: 100
          }],
          [{
            name: '郑州市'
          }, {
            name: '重庆市',
            value: 10
          }],
          [{
            name: '郑州市'
          }, {
            name: '广东省',
            value: 90
          }],
          [{
            name: '郑州市'
          }, {
            name: '辽宁省',
            value: 80
          }],
          [{
            name: '郑州市'
          }, {
            name: '江西省',
            value: 60
          }],
          [{
            name: '郑州市'
          }, {
            name: '吉林省',
            value: 40
          }]
        ]

        var planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z'

        var convertData = function(data) {
          var res = []
          for (var i = 0; i < data.length; i++) {
            var dataItem = data[i]
            var fromCoord = geoCoordMap[dataItem[0].name]
            var toCoord = geoCoordMap[dataItem[1].name]
            if (fromCoord && toCoord) {
              res.push({
                fromName: dataItem[0].name,
                toName: dataItem[1].name,
                coords: [fromCoord, toCoord]
              })
            }
          }
          return res
        }

        var color = ['#a6c84c', '#ffa022', '#46bee9']
        var series = [];
        [
          ['郑州市', ZZData]
        ].forEach(function(item, i) {
          series.push({
            name: item[0],
            type: 'effectScatter',
            coordinateSystem: 'bmap',
            zlevel: 2,
            rippleEffect: {
              brushType: 'stroke'
            },
            label: {
              normal: {
                show: true,
                position: 'right',
                formatter: '{b}'
              }
            },
            symbolSize: function(val) {
              return val[2] / 4
            },
            showEffectOn: 'render',
            itemStyle: {
              normal: {
                color: color[i]
              }
            },
            data: [{
              name: item[0],
              value: geoCoordMap[item[0]].concat([100])
            }]
          }, {
            name: item[0],
            type: 'lines',
            coordinateSystem: 'bmap',
            zlevel: 1,
            effect: {
              show: true,
              period: 6,
              trailLength: 0.7,
              color: '#fff',
              symbolSize: 3
            },
            lineStyle: {
              normal: {
                color: color[i],
                width: 0,
                curveness: 0.2
              }
            },
            data: convertData(item[1])
          }, {
            name: item[0],
            type: 'lines',
            coordinateSystem: 'bmap',
            zlevel: 2,
            effect: {
              show: true,
              period: 6,
              trailLength: 0,
              symbol: planePath,
              symbolSize: 15
            },
            lineStyle: {
              normal: {
                color: color[i],
                width: 1,
                opacity: 0.4,
                curveness: 0.2
              }
            },
            data: convertData(item[1])
          }, {
            name: item[0],
            type: 'effectScatter',
            coordinateSystem: 'bmap',
            zlevel: 2,
            rippleEffect: {
              brushType: 'stroke'
            },
            label: {
              normal: {
                show: true,
                position: 'right',
                formatter: '{b}'
              }
            },
            symbolSize: function(val) {
              return val[2] / 4
            },
            showEffectOn: 'render',
            itemStyle: {
              normal: {
                color: color[i]
              }
            },
            data: item[1].map(function(dataItem) {
              return {
                name: dataItem[1].name,
                value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
              }
            })
          })
        })

        this.chart.setOption({
          bmap: bmap,
          color: ['gold', 'aqua', 'lime'],
          tooltip: {
            trigger: 'item',
            formatter: function(params) {
              if (params.seriesType === 'lines') {
                return params.data.toName
              } else {
                return params.data.name + ' 成交量：' + params.data.value[2]
              }
            }
          },
          geo: {
            map: 'bmap',
            polyline: true,
            progressiveThreshold: 500,
            progressive: 200,
            label: {
              emphasis: {
                show: false
              }
            },
            roam: true,
            itemStyle: {
              normal: {
                areaColor: '#323c48',
                borderColor: '#404a59'
              },
              emphasis: {
                areaColor: '#2a333d'
              }
            }
          },
          series: series
        })
      }
    }
  }
</script>
