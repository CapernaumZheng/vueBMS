<template>
  <div>
    <el-menu class="navbar" mode="horizontal">
      <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
      <vue-scroll style="width: calc(100% - 200px)" :ops="ops">
        <el-tabs class="navbar-tab not-selected" v-model="selectTab" @tab-click="handleClick">
        <el-tab-pane name="monitorOverview">
          <span slot="label">
            <svg-icon class="icon-space" icon-class="monitor"/>
            Echart展示
          </span>
        </el-tab-pane>
        <el-tab-pane name="monitorSetting">
          <span slot="label">
            <svg-icon class="icon-space" icon-class="monitorSet"/>
            树形结构
          </span>
        </el-tab-pane>
        <el-tab-pane name="configUpgrade">
          <span slot="label">
            <svg-icon class="icon-space" icon-class="upgrade"/>
            视频文本
          </span>
        </el-tab-pane>
        <el-tab-pane label="例子页面" name="monitorReport">
          <span slot="label">
            <svg-icon class="icon-space" icon-class="report"/>
            例子页面
          </span>
        </el-tab-pane>
        <el-tab-pane label="系统设置" name="systemSetting">
           <span slot="label">
            <svg-icon class="icon-space" icon-class="setting"/>
             系统设置
           </span>
        </el-tab-pane>
        <el-tab-pane label="用户权限" name="userPrivilege">
          <span slot="label">
            <svg-icon class="icon-space" icon-class="privilege"/>
            用户权限
          </span>
        </el-tab-pane>
      </el-tabs>
      </vue-scroll>
      <div class="welcome-info">欢迎您<span v-if="name!=null">，{{name}}</span>！<span></span></div>
      <el-dropdown trigger="click" class='international' @command="handleSetLanguage">
        <div>
          <svg-icon class-name='international-icon' icon-class="language" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="zh" :disabled="language==='zh'">中文</el-dropdown-item>
          <el-dropdown-item command="en" :disabled="language==='en'">English</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown class="skin-change" trigger="click" @command="handleCommand">
      <span class="el-dropdown-link">
        切换主题色
      </span>
        <el-dropdown-menu slot="dropdown" class="skin-dropdowm">
          <el-dropdown-item class="skin-black" command="1">黑色</el-dropdown-item>
          <el-dropdown-item class="skin-blue" command="2">蓝色</el-dropdown-item>
          <div class="triangle_border_up"></div>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="navbar-tool">
        <el-dropdown trigger="hover" @command="systemWarningMsg" @visible-change="systemWarningMsg" style="color: #fff;position: absolute;">
        <div class="tool-icon" style="right: 50px;top: 1px;" title="系统警告">
          <svg-icon class="icon-space" icon-class="warnIcon" style="width: 24px;height: 24px;"/>
        </div>
          <el-dropdown-menu slot="dropdown" class="system-warning">
            <div class="title-tip">
              <svg-icon class="icon-space" icon-class="triangleWarn" style="width: 24px;height: 24px;position: relative;top: 4px;"/>
              <span>预警信号</span>
            </div>
            <div style="position:relative;min-height: 100px"  element-loading-text="加载中..." v-loading="listLoading" border fit highlight-current-row>
              <el-dropdown-item v-for="(item, index) in warningMsg" :key="item.warn_id" :command="item.warn_id">
                <span>{{ index + 1}}.{{ item.warn_msg }}</span>
                <div class="warn-time">{{ item.warn_time}}</div>
              </el-dropdown-item>
            </div>
            <div class="triangle_border_up"></div>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="tool-icon" style="right: 5px;top: 3px;" @click="logoutDialogVisible = true" title="退出">
          <svg-icon class="icon-space" icon-class="logout" style="width: 27px;height: 27px;"/>
        </div>
      </div>
    </el-menu>
    <el-dialog title="退出系统" :visible.sync="logoutDialogVisible" width="25%">
      <div style="font-size: 25px;">确定要退出系统？</div>
      <div slot="footer" class="dialog-footer">
        <el-button style="width: 100px;" v-waves type="primary" @click="logout">确 定</el-button>
        <el-button style="width: 100px;" v-waves @click="logoutDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { showMessage } from '@/utils/index'
  import { getWarning } from '@/api/navbar'
  import Hamburger from '@/components/Hamburger'
  import waves from '@/directive/waves/index.js'

  export default {
    components: {
      Hamburger
    },
    directives: {
      waves
    },
    data() {
      return {
        listLoading: false,
        warningMsg: [],
        logoutDialogVisible: false,
        ops: {
          vuescroll: {},
          scrollPanel: {
            scrollingY: false
          },
          rail: {},
          bar: {}
        }
      }
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'avatar',
        'name',
        'roles'
      ]),
      selectTab: {
        get: function() {
          if (this.$store.state.app.selectTab) {
            return this.$store.state.app.selectTab
          } else {
            this.$store.state.app.selectTab = 'monitorOverview'
            return this.$store.state.app.selectTab
          }
        },
        set: function(newValue) {
          this.$store.state.app.selectTab = newValue
        }
      },
      language() {
        return this.$store.getters.language
      }
    },
    methods: {
      handleCommand(command) {
        let classString = document.body.className
        const nameIndex = classString.indexOf('custom-1b1e24')
        if (command === '1') {
          if (nameIndex === -1) {
            // do nothing
          } else {
            classString = classString.substr(0, nameIndex) + classString.substr(nameIndex + 'custom-1b1e24'.length)
          }
        } else if (command === '2') {
          if (nameIndex === -1) {
            classString = 'custom-1b1e24'
          } else {
            // do nothing
          }
        } else {
          // do nothing
        }
        document.body.className = classString
      },
      systemWarningMsg(show) {
        if (show) {
          this.listLoading = true
          getWarning().then(response => {
            this.listLoading = false
            if (response.code === '20000') {
              this.warningMsg = response.datas
            } else {
              showMessage(response.msg, 'error')
            }
          })
        }
      },
      toggleSideBar() {
        this.$store.dispatch('ToggleSideBar')
      },
      handleClick(tab, event) {
        this.$store.dispatch('SelectTab', { select: tab.paneName })
      },
      logout() {
        this.$store.dispatch('LogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      },
      handleSetLanguage(lang) {
        this.$i18n.locale = lang
        this.$store.dispatch('SetLanguage', lang)
        this.$message({
          message: 'switch language success',
          type: 'success'
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" type="text/scss" lang="scss" scoped>
  .navbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0px !important;
    .hamburger-container {
      line-height: 58px;
      height: 50px;
      float: left;
      padding: 0 10px;
    }
    .screenfull {
      position: absolute;
      right: 90px;
      top: 16px;
      color: red;
    }
    .skin-change{
      position: absolute;
      top: 0px;
      right: 80px;
      width: 100px;
      .el-dropdown-link{
        cursor: pointer;
        color:#fff;
        position: absolute;
      }
    }
    .avatar-container {
      height: 50px;
      display: inline-block;
      position: absolute;
      right: 35px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
    .navbar-tool{
      position: absolute;
      right: 10px;
      top: 5px;
      .tool-icon{
        position: absolute;
        .icon-space{
          cursor: pointer;
        }
      }
    }
  }
  .welcome-info{
    position: absolute;
    top: 0px;
    right: 200px;
  }
  .skin-black{
    background-color: #5D5C5A;
    color: #fff;
    margin-bottom: 1px;
    &:hover{
      width:120px;
      height:36px;
      -webkit-box-shadow: 0 0 5px rgba(0,113,241,1);
    }
  }
  .skin-blue{
    background-color: #337AB7;
    color: #fff;
    &:hover{
      width:120px;
      height:36px;
      -webkit-box-shadow: 0 0 5px rgba(0,113,241,1);
    }
  }
  .skin-green {
    background-color: #5D5C5A;
    color: #fff;
  }
  .navbar-tab{
    width: calc(100% - 200px);
    position: absolute;
  }
  .international{
    display: none;
    position: absolute;
    right: 185px;
    color: #fff;
  }
</style>

