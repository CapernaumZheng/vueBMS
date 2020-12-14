<template>
  <div class="dashboard-container">
    <div class="dashboard-text hide">姓名:{{name}}</div>
    <div class="dashboard-text hide">角色:<span v-for='role in roles' :key='role'>{{role}}</span></div>
    <div style="width: 100%;height: 100%;">
      <dashcard :cardTitle="'信息提示'">
        <div slot="context" class="dashcard-top">
          <div class="left-area">
            <span class="context-font">待处理消息</span>
            <div class="hand-num" @click="jumpToRealTime">{{onHandNum}}</div>
          </div>
          <div class="mid-area"></div>
          <div class="right-area">
            <el-row style="height: 100%;" :gutter="15">
              <el-col :span="4">
                <div class="event-pic">
                  <span class="context-font">微博消息：<span style="color: #FF0000;cursor:pointer;text-decoration: underline" @click="jumpToRealTime">{{eventNum}}</span></span>
                  <div class="context-font server">微信消息：<span style="cursor: pointer" @click="jumpToRealTime">{{serEventNum}}</span></div>
                </div>
              </el-col>
              <el-col :span="5">
                <div class="grid-content">
                  <div class="color-box color-box-serious">
                    <svg-icon class="icon-space" icon-class="exclamation"/>
                  </div>
                  <div class="font-number">
                    <span class="context-font">紧急</span>
                    <div class="context-number" @click="jumpToRealTime">{{seriousNum}}</div>
                  </div>
                </div>
              </el-col>
              <el-col :span="5">
                <div class="grid-content">
                  <div class="color-box color-box-import">
                    <svg-icon class="icon-space" icon-class="star"/>
                  </div>
                  <div class="font-number">
                    <span class="context-font">重要</span>
                    <div class="context-number" @click="jumpToRealTime">{{importantNum}}</div>
                  </div>
                </div>
              </el-col>
              <el-col :span="5">
                <div class="grid-content">
                  <div class="color-box color-box-warning">
                    <svg-icon class="icon-space" icon-class="warnIcon"/>
                  </div>
                  <div class="font-number">
                    <span class="context-font">一般</span>
                    <div class="context-number" @click="jumpToRealTime">{{warningNum}}</div>
                  </div>
                </div>
              </el-col>
              <el-col :span="5">
                <div class="grid-content">
                  <div class="color-box color-box-tip">
                    <svg-icon class="icon-space" icon-class="dashTip"/>
                  </div>
                  <div class="font-number">
                    <span class="context-font">忽略</span>
                    <div class="context-number" @click="jumpToRealTime">{{tipsNum}}</div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </dashcard>
      <dashcard :cardTitle="'柱形图'" :contextHeight="'calc(100% - 45px)'" class="dashcard-bottom-left">
        <div slot="context" style="height: 100%">
          <barchart height='100%' id='keyboard'></barchart>
        </div>
      </dashcard>
      <dashcard :cardTitle="'我的工作'" :contextHeight="'calc(100% - 45px)'" class="dashcard-bottom-right">
        <div class="context" slot="context">
          <el-row class="context-row" :gutter="15">
            <el-col :span="12" class="right-card">
              <div @click="switchTab('monitorOverview')" style="height: 100%;">
                <router-link to="/indicators_monitor/service_indicators">
                  <div class="right-card-content purple-card">
                    <svg-icon class="icon-space" icon-class="server"/>
                    CPU监控
                  </div>
                </router-link>
              </div>
            </el-col>
            <el-col :span="12" class="right-card">
              <div @click="switchTab('monitorOverview')" style="height: 100%;">
                <router-link to="/screen_monitor/screen_monitor">
                  <div class="right-card-content blue-card">
                    <svg-icon class="icon-space" icon-class="bigScreen"/>
                    大屏图表
                   </div>
                </router-link>
              </div>
            </el-col>
          </el-row>
          <el-row class="context-row" :gutter="15">
            <el-col :span="12" class="right-card">
              <div @click="switchTab('monitorOverview')" style="height: 100%;">
                <router-link to="/communicate_monitor/communicate">
                  <div class="right-card-content green-card">
                    <svg-icon class="icon-space" icon-class="acaleph"/>
                    关系图展示
                  </div>
                </router-link>
              </div>
            </el-col>
            <el-col :span="12" class="right-card">
              <div @click="switchTab('monitorOverview')" style="height: 100%;">
                <router-link to="/log_monitor/historyLog">
                  <div class="right-card-content purple-card">
                    <svg-icon class="icon-space" icon-class="log"/>
                    文本高亮
                  </div>
                </router-link>
              </div>
            </el-col>
          </el-row>
          <el-row class="context-row" :gutter="15">
            <el-col :span="12" class="right-card">
              <div @click="switchTab('monitorOverview')" style="height: 100%;">
                <router-link to="/seat_number/ranking">
                  <div class="right-card-content blue-card">
                    <svg-icon class="icon-space" icon-class="ranking"/>
                    404页面展示
                  </div>
                </router-link>
              </div>
            </el-col>
            <el-col :span="12" class="right-card">
              <div @click="switchTab('monitorReport')" style="height: 100%;">
                <router-link to="/report_monitor/take_position">
                  <div class="right-card-content green-card">
                    <svg-icon class="icon-space" icon-class="take"/>
                    404页面展示
                  </div>
                </router-link>
              </div>
            </el-col>
          </el-row>
        </div>
      </dashcard>
      <!--
            <el-row :gutter="12">
              <el-col :span="9" style="cursor: pointer">
                <div @click="switchTab('userPrivilege')">
                  <router-link to="/organization_managing/people_manage">
                    <el-card shadow="hover" class="note-manage back-img">
                      <svg-icon class="icon-space" icon-class="userMana" style="width: 62px;height: 62px;;"/>
                      <div style="margin-top: 15px">人员管理</div>
                    </el-card>
                  </router-link>
                </div>
              </el-col>
              <el-col :span="8" style="cursor: pointer">
                  <div @click="switchTab('monitorReport')">
                    <router-link to="/report_monitor/take_position">
                      <el-card shadow="hover" class="note-manage" style="background-color: #FFC132">
                        <svg-icon class="icon-space" icon-class="reportQuery" style="width: 62px;height: 62px;"/>
                        <div class="not-selected" style="margin-top: 15px">成交情况</div>
                      </el-card>
                    </router-link>
                  </div>
                </el-col>
              <el-col :span="7" style="cursor: pointer">
                <div @click="switchTab('monitorOverview')">
                  <router-link to="/event_monitor/real_time">
                    <el-card shadow="hover" class="note-manage" style="background-color: #5CBCEF">
                      <svg-icon class="icon-space" icon-class="monitorM" style="width: 62px;height: 62px;"/>
                      <div style="margin-top: 15px">实时监控</div>
                    </el-card>
                  </router-link>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="12" style="margin-top: 10px">
              <el-col :span="6" style="cursor: pointer">
                <div @click="switchTab('monitorOverview')">
                  <router-link to="/screen_monitor/screen_monitor">
                    <el-card shadow="hover" class="note-manage" style="background-color: #8D86E3">
                      <svg-icon class="icon-space" icon-class="computer" style="width: 62px;height: 62px;"/>
                      <div style="margin-top: 15px">大屏监控</div>
                    </el-card>
                  </router-link>
                </div>
              </el-col>
              <el-col :span="6" style="cursor: pointer">
                <div @click="switchTab('monitorOverview')">
                  <router-link to="/communicate_monitor/communicate">
                    <el-card shadow="hover" class="note-manage" style="background-color: #40CF89">
                      <svg-icon class="icon-space" icon-class="acaleph" style="width: 62px;height: 62px;"/>
                      <div style="margin-top: 15px">通信监控</div>
                    </el-card>
                  </router-link>
                </div>
              </el-col>
              <el-col :span="6" style="cursor: pointer">
                <div @click="switchTab('monitorSetting')">
                  <router-link to="/template_setting/template">
                    <el-card shadow="hover" class="note-manage" style="background-color: #3FD4DA">
                      <svg-icon class="icon-space" icon-class="temSetting" style="width: 62px;height: 62px;"/>
                      <div style="margin-top: 15px">监控模板</div>
                    </el-card>
                  </router-link>
                </div>
              </el-col>
              <el-col :span="6" style="cursor: pointer">
                <div @click="switchTab('configUpgrade')">
                  <router-link to="/auto_update/update">
                    <el-card shadow="hover" class="note-manage" style="background-color: rgb(251, 151, 96)">
                      <svg-icon class="icon-space" icon-class="upgradeArrow" style="width: 62px;height: 62px;"/>
                      <div style="margin-top: 15px">系统升级</div>
                    </el-card>
                  </router-link>
                </div>
              </el-col>
            </el-row>
      -->

    </div>
  </div>
</template>

<script>
import dashcard from '@/components/dashCard'
import barchart from '@/components/Charts/BarChart'
import { mapGetters } from 'vuex'

export default {
  name: 'dashboard',
  data() {
    return {
      onHandNum: 15,
      eventNum: '！未开启',
      serEventNum: 15,
      seriousNum: 2,
      importantNum: 2,
      warningNum: 10,
      tipsNum: 1
    }
  },
  components: {
    dashcard,
    barchart
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  methods: {
    switchTab(tabName) {
      this.$store.dispatch('SelectTab', { select: tabName })
    },
    jumpToRealTime() {
      this.$router.push({
        path: '/communicate_monitor/communicate',
        name: 'communicateMonitor',
        params: {
          name: '测试传参一',
          dataObj: '测试传参二'
        }
        // query: {
        //   name: '',
        //   dataObj: ''
        // }
        // 接收参数 var routerParams = this.$route.params.dataObj
      })
    }
  }
}
</script>

<style rel="stylesheet/scss"  type="text/scss" lang="scss" scoped>
.hide{
  display: none;
}

.dashboard {
  &-container {
    margin: 10px;
    height: calc(100% - 20px);
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.dashcard-top{
  height: 100px;
  .context-font{
    font-weight: 600;
    font-size: 15px;
  }
  .left-area{
    display: inline-block;
    width: 15%;
    display: inline-block;
    vertical-align: top;
    text-align: center;
    margin-top: 15px;
    .hand-num{
      font-weight: 600;
      font-size: 25px;
      margin-top: 15px;
      cursor: pointer;
    }
  }
  .mid-area{
    display: inline-block;
    width: 1px;
    height: 70px;
    background: rgb(204, 204, 204);
    margin-top: 15px;
  }
  .right-area{
    display: inline-block;
    width: calc(85% - 10px);
    height: 100%;
    vertical-align: top;
    .grid-content{
      margin-top: 15px;
      position: relative;
      .color-box{
        display:inline-block;
        height: 70px;
        width: 70px;
        border-radius: 5px;
        .icon-space{
          width: 40px;
          height: 40px;
          margin-top: 13px;
          margin-left: 16px;
          color: #fff;
        }
      }
      .color-box-serious{
        background-color: #EF504D;
      }
      .color-box-import{
        background-color: #FFB54D;
      }
      .color-box-warning{
        background-color: #FDE84F;
      }
      .color-box-tip{
        background-color: #41B340;
      }
      .font-number{
        display: inline-block;
        position: absolute;
        padding-top: 5px;
        left: 90px;
        .context-number{
          font-size: 25px;
          font-weight: 600;
          left: 90px;
          margin-top: 15px;
          cursor: pointer;
        }
      }
    }
    .event-pic{
      margin-top: 25px;
      margin-left: 10px;
      .server{
        margin-top: 15px;
      }
    }
  }
}

.dashcard-bottom-left{
  float: left;
  width: calc(60% - 5px);
  height: calc(100% - 155px);
  margin-right: 10px;
  margin-top: 10px;
}

.dashcard-bottom-right{
  float: left;
  width: calc(40% - 10px);
  height: calc(100% - 155px);
  margin-top: 10px;
  .context{
    height: 100%;
    padding: 15px;
    .context-row{
      height: calc(33% - 10px);
      margin-bottom: 10px;
    }
    .right-card{
      height: 100%;
      .right-card-content{
        height: 100%;
        border-radius: 5px;
        display: flex;
        justify-content: center;
        align-items: Center;
        font-size: 20px;
        color: #fff;
        .icon-space{
          margin-right: 20px;
        }
      }
      .purple-card{
        background-color: #B9A5E2;
      }
      .blue-card{
        background-color: #8D86E3;
      }
      .green-card{
        background-color: #31CACC;
      }
    }
  }
}
</style>
