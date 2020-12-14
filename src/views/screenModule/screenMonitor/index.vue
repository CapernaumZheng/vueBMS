<template>
  <div class="big-screen" v-loading="listLoading" element-loading-text="加载中......" border fit highlight-current-row>
    <div :class="[classA, classB]">
      <div class="sys-time">
        <svg-icon class="icon-space calendar-icon" icon-class="calendar"/>
        <span class="time-text">{{systemTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
        <screenfull @isFullscreen="isFullscreen" class="fullScreen"></screenfull>
      </div>
      <div class="screen-card">
        <el-row :gutter="15" class="card-row" style="margin-left: 0px;margin-right: 0px;">
          <el-col :span="6" class="card-col" style="padding-left: 0px">
            <div class="card-area">
              <div class="screen-upload border-red">
                <svg-icon class="icon-space color-red" icon-class="screenUpload"/>
              </div>
              <div class="font-area">
                <span class="font-desc">前置机上行速度</span>
                <div class="font-speed">
                  <div class="speed-pic">
                    <span class="speed color-red">3.6 <span>Mbit/s</span></span>
                    <div class="machine-name"><span class="color-red">最大</span>机器名称</div>
                  </div>
                  <div class="speed-pic">
                    <span class="speed color-red">384 <span>Kbit/s</span></span>
                    <div class="machine-name"><span class="color-red">最小</span>机器名称</div>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="12" class="card-col">
            <div class="card-area">
              <div style="width: 46%;float: left">
                <div class="screen-upload border-blue">
                  <svg-icon class="icon-space color-blue" icon-class="balance" style=""/>
                </div>
                <div class="font-area">
                  <span class="font-desc">平均时延</span>
                  <div class="font-speed">
                    <div class="speed-pic" style="width: calc(49% - 5px)">
                      <span class="speed color-blue">10 <span>s</span></span>
                      <div class="machine-name"><span class="color-blue">最大</span>机器名称</div>
                    </div>
                    <div class="speed-pic" style="width: 1%;margin-right: 10px">
                      <span class="speed color-blue">/</span>
                    </div>
                    <div class="speed-pic" style="width: calc(49% - 5px)">
                      <span class="speed color-blue">1.19 <span>ms</span></span>
                      <div class="machine-name"><span class="color-blue">最小</span>机器名称</div>
                    </div>
                  </div>
                </div>
              </div>
              <div style="width: 27%;float: left">
                <div class="screen-upload border-blue">
                  <svg-icon class="icon-space color-blue" icon-class="stopwatch" style=""/>
                </div>
                <div class="font-area">
                  <span class="font-desc">最大时延</span>
                  <div class="font-speed" style="margin-left:-15px">
                    <div class="speed-pic" style="width: 100%">
                      <span class="speed color-blue">10 <span>s</span></span>
                      <div class="machine-name">机器名称</div>
                    </div>
                  </div>
                </div>
              </div>
              <div style="width: 27%;float: left">
                <div class="screen-upload border-blue">
                  <svg-icon class="icon-space color-blue" icon-class="stopwatch" style=""/>
                </div>
                <div class="font-area">
                  <span class="font-desc">最小时延</span>
                  <div class="font-speed" style="margin-left:-15px">
                    <div class="speed-pic" style="width: 100%">
                      <span class="speed color-blue">1.192 <span>ms</span></span>
                      <div class="machine-name">机器名称</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="6" class="card-col" style="padding-right: 0px">
            <div class="card-area">
              <div class="screen-upload border-red">
                <svg-icon class="icon-space color-red" icon-class="screenDownload" style=""/>
              </div>
              <div class="font-area">
                <span class="font-desc">前置机下行速度</span>
                <div class="font-speed">
                  <div class="speed-pic">
                    <span class="speed color-red">1.2 <span>Mbit/s</span></span>
                    <div class="machine-name"><span class="color-red">最大</span>机器名称</div>
                  </div>
                  <div class="speed-pic">
                    <span class="speed color-red">87 <span>Kbit/s</span></span>
                    <div class="machine-name"><span class="color-red">最小</span>机器名称</div>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="echart-mid">
        <el-row :gutter="15" style="height: 100%;margin-left: 0px;margin-right: 0px;">
          <el-col :span="6" style="height: 100%;padding-left: 0px">
            <div class="echart-mid-left echart-card" style="position: relative;padding-top: 15px;">
              <bigScreenTitle
                title="实时数据"
                iconClass="monitor"
                cardStyle="width:100px;
                height:25px;
                padding-top:6px;
                background-color:#07658B;
                color:#fff;
                font-size:13px;
                text-align:center;
                left: calc(50% - 50px);
                top: -10px;">
              </bigScreenTitle>
              <div class="echart-mid-pic" style="border-bottom: 1px solid #052D61;">
                <div style="width: 100%">
                  <span class="pic-title-yellow">报单数据</span>
                  <div style="width: 100%">
                    <div class="pic-left">
                      <span class="count">14500</span>
                      <div class="desc">报单量</div>
                    </div>
                    <div class="pic-right">
                      <span class="count">10000</span>
                      <div class="desc">报单笔数</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="echart-mid-pic" style="border-bottom: 1px solid #052D61;">
                <div style="width: 100%">
                  <span class="pic-title-blue">成交数据</span>
                  <div style="width: 100%">
                    <div class="pic-left">
                      <span class="count">12000</span>
                      <div class="desc">报单量</div>
                    </div>
                    <div class="pic-right">
                      <span class="count">9900</span>
                      <div class="desc">报单笔数</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="echart-mid-pic">
                <div style="width: 100%">
                  <span class="pic-title-red">撤单数据</span>
                  <div style="width: 100%">
                    <div class="pic-left">
                      <span class="count">11000</span>
                      <div class="desc">报单量</div>
                    </div>
                    <div class="pic-right">
                      <span class="count">1020</span>
                      <div class="desc">报单笔数</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="12" style="height: 100%;">
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
          </el-col>
          <el-col :span="6" style="height: 100%;padding-right: 0px">
            <div class="echart-card" style="width: 100%;height: calc(50% - 12.5px);margin-bottom: 25px;padding-top: 15px;position: relative">
              <bigScreenTitle
                title="报单排行"
                iconClass="rankingList"
                cardStyle="width:100px;
                height:25px;
                padding-top:6px;
                background-color:#07658B;
                color:#fff;
                font-size:13px;
                text-align:center;
                left: calc(50% - 50px);
                top: -10px;">
              </bigScreenTitle>
              <horizontalbar height='100%' id='horizontalbar'></horizontalbar>
            </div>
            <div class="echart-card" style="width: 100%;height: calc(50% - 12.5px);padding-top: 15px;position: relative">
              <bigScreenTitle
                title="各接入点成交占比"
                iconClass="pie"
                cardStyle="width:160px;
                height:25px;
                padding-top:6px;
                background-color:#07658B;
                color:#fff;
                font-size:13px;
                text-align:center;
                left: calc(50% - 80px);
                top: -10px;">
              </bigScreenTitle>
              <piechart height='100%' id='piechart'></piechart>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="echart-bottom">
        <el-row :gutter="15" style="height: 100%;margin-left: 0px;margin-right: 0px;">
          <el-col :span="12" style="height: 100%;padding-left: 0px">
            <div class="echart-card" style="padding-top: 15px;position: relative">
              <bigScreenTitle
                title="报单/成交处理速度"
                iconClass="report"
                cardStyle="width:160px;
                height:25px;
                padding-top:6px;
                background-color:#07658B;
                color:#fff;
                font-size:13px;
                text-align:center;
                left: calc(50% - 80px);
                top: -10px;">
              </bigScreenTitle>
              <linechart height='100%' :chart-data="lineChartData" id='linechart'></linechart>
            </div>
          </el-col>
          <el-col :span="12" style="height: 100%;padding-right: 0px">
            <div class="echart-card" style="padding-top: 15px;position: relative">
              <bigScreenTitle
                title="前置机席位监控"
                iconClass="reportQuery"
                cardStyle="width:160px;
                height:25px;
                padding-top:6px;
                background-color:#07658B;
                color:#fff;
                font-size:13px;
                text-align:center;
                left: calc(50% - 80px);
                top: -10px;">
              </bigScreenTitle>
              <singlebar height='100%' id='singlebarchart'></singlebar>
            </div>
          </el-col>
        </el-row>
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
  import baidumap from '@/components/Charts/baiduMap'
  import bigScreenTitle from '@/components/bigScreenTitle'
  import numbercard from '@/components/numberCard'
  export default {
    name: 'screenMonitor',
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
    height: calc(60% - 120px);
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
