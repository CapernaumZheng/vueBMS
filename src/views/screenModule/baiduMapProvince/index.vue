<template>
  <div class="big-screen" v-loading="listLoading" element-loading-text="加载中......" border fit highlight-current-row>
    <div :class="[classA, classB]">
      <div class="echart-mid">
          <div class="echart-card" style="width: 100%;position: relative">
            <numbercard :number="dealNumber+''"></numbercard>
            <bigScreenTitle
              title="成交走势图"
              iconClass="map"
              cardStyle="width:120px;
                height:25px;
                padding-top:6px;
                background-color:#07658B;
                color:#fff;
                font-size:13px;
                text-align:center;
                left: calc(50% - 60px);
                top: -10px;
                z-index:100">
            </bigScreenTitle>
            <baidumap height='100%' id='baidumap'></baidumap>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Screenfull from '@/components/Screenfull'
  import linechart from '@/components/Charts/LineChart'
  import singlebar from '@/components/Charts/singleBar'
  import horizontalbar from '@/components/Charts/horizontalBar'
  import piechart from '@/components/Charts/PieChart'
  import baidumap from '@/components/Charts/baiduMapProvince'
  import bigScreenTitle from '@/components/bigScreenTitle'
  import numbercard from '@/components/numberCard'
  export default {
    name: 'baiduMapProvince',
    components: {
      Screenfull,
      linechart,
      singlebar,
      piechart,
      horizontalbar,
      baidumap,
      bigScreenTitle,
      numbercard
    },
    created() {
      this.systemTime = new Date()
      setInterval(() => {
        this.systemTime = new Date()
        this.dealNumber = this.dealNumber + 18
      }, 1000)
    },
    computed: {
    },
    data() {
      return {
        dealNumber: 98790,
        listLoading: false,
        classA: 'full-screen',
        classB: '',
        fullScreen: null,
        systemTime: null,
        lineChartData: {
          expectedData: [50, 140, 120, 113, 145, 150, 90],
          actualData: [20, 82, 91, 154, 102, 50, 130]
        }
      }
    },
    methods: {
      isFullscreen(isFullscreen) {
        if (isFullscreen) {
          this.classB = 'full'
        } else {
          this.classB = ''
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" type="text/scss" lang="scss" scoped>
  .big-screen{
    width: 100%;
    height: calc(100% - 1px);
    position: relative;
    .full-screen{
      width: 100%;
      height: 100%;
      background-color: #081832;
    }
    .full{
      position: fixed;
      top: 0px;
      left: 0px;
      z-index: 9999;
    }
    .sys-time{
      height: 40px;
      width: 100%;
      color: #fff;
      background-color: #04425F;
      position: relative;
      &:after{
        content:'';
        width:0;
        height:100%;
        display:inline-block;
        vertical-align:middle;
      }
      .calendar-icon{
        vertical-align: middle;
        display: inline-block;
        margin-left: 10px;
      }
      .fullScreen{
        position: absolute;
        cursor: pointer;
        top: 11px;
        right: 10px;
        font-size: 20px;
      }
      .time-text{
        vertical-align: middle;
        display: inline-block;
        margin-top: 5px;
        margin-left: 5px;
      }
    }
  }

  .screen-card{
    height: 100px;
    width: 99.99%;
    margin-top: 15px;
    .card-row{
      height: 100%;
      .card-col{
        height: 100%;
      }
      .card-area{
        width: 100%;
        height: 100%;
        background-color: #034C6A;
        .border-red{
          border: 1px solid #FF4E4E;
        }
        .color-red{
          color: #FF4E4E;
        }
        .border-blue{
          border: 1px solid #21E2D9;
        }
        .color-blue{
          color: #21E2D9;
        }
        .screen-upload{
          width: 40px;
          height: 40px;
          float: left;
          border-radius: 25px;
          padding: 4px;
          margin: 30px 25px 0px 15px;
          .icon-space{
            width: 30px;
            height: 30px;
          }
        }
        .font-area{
          float: left;
          margin-top: 15px;
          width: calc(100% - 80px);
          text-align: center;
          .font-desc{
            color: #fff;
            margin-left: -70px;
          }
          .font-speed{
            margin-top: 10px;
            .speed-pic{
              float: left;
              width: 49%;
              text-align: left;
              .speed{
                font-size: 25px;
                span{
                  font-size: 15px;
                }
              }
              .machine-name{
                margin-top: 5px;
                color: #fff;
                font-size: 15px;
                span{
                  font-size: 10px;
                  margin-right: 5px;
                }
              }
            }
          }
        }
      }
    }
  }

  .echart-card{
    width: 100%;
    height: 100%;
    background-color: #081832;
    box-shadow: 3px 0px 50px 4px #4f89b3 inset;
  }

  .echart-mid{
    height: calc(100% - 40px);
    width: 99.99%;
    margin-top: 25px;
    .echart-mid-left{
      .echart-mid-pic{
        height: 33.3%;
        text-align: center;
        display: flex;
        align-items: center;
        .pic-title-yellow{
          color: #CC8849;
        }
        .pic-title-blue{
          color: #31D0C7;
        }
        .pic-title-red{
          color: #D04348;
        }
        .pic-left{
          width: 50%;
          float: left;
          .count{
            font-size: 25px;
            color: #0382B0;
          }
          .desc{
            font-size: 10px;
            color: #fff;
            margin-top: 5px;
          }
        }
        .pic-right{
          width: 50%;
          float: left;
          .count{
            font-size: 25px;
            color: #0382B0;
          }
          .desc{
            font-size: 10px;
            color: #fff;
            margin-top: 5px;
          }
        }
      }
    }
  }

  .echart-bottom{
    height: calc(40% - 90px);
    width: 99.99%;
    margin-top: 25px
  }
</style>
