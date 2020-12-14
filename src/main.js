import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import i18n from './lang' // 国际化

import '@/styles/index.scss' // global css
import './assets/custom-theme/custom-1b1e24/index.css'

import App from './App'
import router from './router'
import store from './store'
import * as filters from './filters' // global filters
import 'babel-polyfill'

import '@/icons' // icon
import '@/permission' // permission control
import vuescroll from 'vuescroll'
import 'vuescroll/dist/vuescroll.css'
import waves from '@/directive/waves/index.js'

Vue.use(ElementUI, { i18n: (key, value) => i18n.t(key, value) })
Vue.use(vuescroll, {
  ops: {
    vuescroll: {},
    scrollPanel: {},
    rail: {},
    bar: {
      onlyShowBarOnScroll: false,
      background: '#c1c1c1'
    }
  } // 在这里设置全局默认配置
})

Vue.config.devtools = true

Vue.config.productionTip = false

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.directive('waves', waves) // 全局注册按钮水波纹指令

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
