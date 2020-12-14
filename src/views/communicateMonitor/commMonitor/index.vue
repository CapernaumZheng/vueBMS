<template>
  <div class="main-out" v-loading="listLoading" element-loading-text="加载中......" border fit highlight-current-row>
    <div class="page-name">通信监控图</div>
      <jellyfish @showInfoModal="ifShowModal" id='jellyfish' height='calc(100% - 130px)' width='calc(100% - 250px)' style="margin-top: -10px"></jellyfish>
      <div class="left-area">
        <div class="area-top">
          <div>
            <span class="font-color">实线</span>
            <hr class="line solid-line">
            <span>TCP</span>
          </div>
          <div style="margin-top: 5px">
            <span class="font-color">虚线</span>
            <hr class="line dashed-line">
            <span>UDP</span>
          </div>
        </div>
        <div class="area-mid">
          <div class="line-item">
            <hr class="line m10-line">
            <span>10m/s</span>
          </div>
          <div class="line-item">
            <hr class="line m5-line">
            <span>5m/s</span>
          </div>
          <div class="line-item">
            <hr class="line k5-line">
            <span>5k/s</span>
          </div>
          <div class="line-item">
            <hr class="line k4-line">
            <span>4k/s</span>
          </div>
          <div class="line-item">
            <hr class="line k3-line">
            <span>3k/s</span>
          </div>
        </div>
        <div class="area-bottom">
          <div class="block-item">
            <div class="block block-connect"></div>
            <div class="text-mes">会员连接数</div>
          </div>
          <div class="block-item">
            <div class="block block-req"></div>
            <div class="text-mes">请求数</div>
          </div>
          <div class="block-item">
            <div class="block block-res"></div>
            <div class="text-mes">应答数</div>
          </div>
          <div class="block-item">
            <div class="block block-delay"></div>
            <div class="text-mes">时延</div>
          </div>
        </div>
      </div>
      <div class="bottom-area">
        <tentacle height='100%' id='keyboard' width='calc(100% - 330px)'></tentacle>
      </div>



    <el-popover
      placement="top"
      :style="popoverStyle"
      width="200"
      trigger="manual"
      visible-arrow="true"
      :value="machineVisible">
      <div class="jellyfish-popper">
        <i class="el-icon-close" title="关闭" @click="closePopover"></i>
        <div class="item"><label>机器类型：</label>日志中转机</div>
        <div class="item"><label>机器编号：</label>1</div>
        <div class="item"><label>机器名称：</label>日志中转机</div>
        <div class="item"><label>机器位置：</label>A机房01机柜</div>
        <div class="item"><label style="padding-left: 28px;">TCP：</label>50kb/s</div>
      </div>
    </el-popover>
    <el-popover
      placement="top"
      :style="popoverStyle"
      width="200"
      trigger="manual"
      visible-arrow="true"
      :value="popoverVisible">
      <div class="jellyfish-popper">
        <i class="el-icon-close" title="关闭" @click="closeLinePopover"></i>
        <div class="item"><label>TCP上行：</label>3.6kb/s</div>
        <div class="item"><label>TCO下行：</label>3kb/s</div>
      </div>
    </el-popover>
  </div>
</template>

<script>
  import jellyfish from '@/components/Charts/jellyfish'
  import tentacle from '@/components/Charts/tentacle'
  export default {
    name: 'commMonitor',
    components: { jellyfish, tentacle },
    data() {
      return {
        listLoading: false,
        popoverVisible: false,
        machineVisible: false,
        popoverStyle: null
      }
    },
    mounted() {
    },
    methods: {
      ifShowModal(params) {
        if (params.type === 'line') {
          this.popoverVisible = params.showModal
          this.popoverStyle = 'position:absolute;top:' + params.position.offsetY + 'px;left:' + params.position.offsetX + 'px'
        } else {
          this.machineVisible = params.showModal
          this.popoverStyle = 'position:absolute;top:' + params.position.offsetY + 'px;left:' + params.position.offsetX + 'px'
        }
      },
      closePopover() {
        this.machineVisible = false
      },
      closeLinePopover() {
        this.popoverVisible = false
      }
    }
  }
</script>

<style rel="stylesheet/scss" type="text/scss" lang="scss" scoped>
.main-out{
  position: relative;
  .left-area{
    position: absolute;
    top: 40px;
    right: 10px;
    width: 250px;
    height: calc(100% - 130px);
    .area-top{
      border: 1px solid #dcdfe6;
      width: 100%;
      height: 85px;
      padding: 20px 10px;
      box-shadow: 0px 0px 5px 0px #dcdfe6;
      .font-color{
        color: #3399FF
      }
      .line{
        height: 2px;
        border-right: none;
        border-bottom: none;
        border-left: none;
        border-image: initial;
        display: inline-block;
        width: 140px;
        margin-left: 5px;
        margin-right: 5px;
        vertical-align: middle;
      }
      .solid-line{
        border-top: 2px solid #3399FF;
      }
      .dashed-line{
        border-top: 2px dashed #3399FF;
      }
    }
    .area-mid{
      border: 1px solid #dcdfe6;
      width: 100%;
      height: 185px;
      box-shadow: 0px 0px 5px 0px #dcdfe6;
      margin-top: 15px;
      padding: 20px 10px;
      .line-item{
        margin-bottom: 10px;
      }
      .line{
        height: 2px;
        border-right: none;
        border-bottom: none;
        border-left: none;
        border-image: initial;
        display: inline-block;
        width: 160px;
        margin-left: 5px;
        margin-right: 5px;
        vertical-align: middle;
      }
      .m10-line{
        border-top: 2px solid #87DDF5;
      }
      .m5-line{
        border-top: 2px solid #3399FF;
      }
      .k5-line{
        border-top: 2px solid #186CC0;
      }
      .k4-line{
        border-top: 2px solid #FFCC33;
      }
      .k3-line{
        border-top: 2px solid #FF3300;
      }
    }
    .area-bottom{
      border: 1px solid #dcdfe6;
      width: 100%;
      height: 225px;
      margin-top: 15px;
      box-shadow: 0px 0px 5px 0px #dcdfe6;
      padding: 20px 20px;
      .block-item{
        margin-bottom: 10px;
      }
      .block{
        display: inline-block;
        width: 8px;
        height: 35px;
      }
      .block-connect{
        background-color: #FF6600
      }
      .block-req{
        background-color: #3399FF
      }
      .block-res{
        background-color: #66CC33
      }
      .block-delay{
        background-color: #FFCC33
      }
      .text-mes{
        display: inline-block;
        vertical-align: top;
        padding-top: 10px;
        margin-left: 10px;
      }
    }
  }
  .bottom-area{
    height: 130px;
    width: 100%;
    position: absolute;
    top: calc(100% - 130px);
  }
}
.jellyfish-popper{
  padding: 10px;
  padding-bottom: 0px;
  .el-icon-close{
    position: absolute;
    cursor: pointer;
    top: 10px;
    right: 10px;
  }
  .item{
    padding-bottom: 10px;
  }
}
</style>
