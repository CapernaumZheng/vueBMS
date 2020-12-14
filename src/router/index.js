import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/errorPage/404'), hidden: true },
  { path: '/401', component: () => import('@/views/errorPage/401'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/organization_managing',
    component: Layout,
    name: 'organizationManaging',
    module: 'userPrivilege',
    meta: {
      roles: ['admin']
    },
    children: [
      {
        path: 'people_manage',
        name: 'people_manage',
        module: 'peopleManage',
        component: () => import('@/views/organizeConfig/peopleManage/index'),
        meta: {
          title: '用户管理',
          icon: 'userMana',
          roles: ['admin']
        }
      }
    ]
  },

  // 用户权限--密码修改
  {
    path: '/password_modify',
    component: Layout,
    name: 'passwordModify',
    module: 'userPrivilege',
    meta: {
      roles: ['admin']
    },
    children: [
      {
        path: 'password',
        name: 'passwordModify',
        module: 'userPrivilege',
        component: () => import('@/views/passwordModify/index'),
        meta: {
          title: '修改密码',
          icon: 'unlock',
          roles: ['admin']
        }
      }
    ]
  },

  // 系统设置--数据字典
  {
    path: '/dic_config',
    component: Layout,
    name: 'sysConfig',
    module: 'systemSetting',
    meta: {
      roles: ['admin']
    },
    children: [
      {
        path: 'index',
        name: 'dicConfig',
        module: 'systemSetting',
        component: () => import('@/views/dicConfig/index'),
        meta: {
          title: '数据字典',
          noCache: true,
          icon: 'dictionary',
          roles: ['admin']
        }
      }
    ]
  },

  // 系统设置--系统参数
  {
    path: '/sys_param',
    component: Layout,
    name: 'sysParam',
    module: 'systemSetting',
    meta: {
      roles: ['admin']
    },
    children: [
      {
        path: 'system',
        name: 'sysParam',
        module: 'systemSetting',
        component: () => import('@/views/sysParam/index'),
        meta: {
          title: '系统参数',
          icon: 'param',
          roles: ['admin']
        }
      }
    ]
  },

  // 系统设置--操作日志
  {
    path: '/operation_log',
    component: Layout,
    name: 'operationLog',
    module: 'systemSetting',
    meta: {
      roles: ['admin']
    },
    children: [
      {
        path: 'log',
        name: 'operationLog',
        module: 'systemSetting',
        component: () => import('@/views/operationLog/index'),
        meta: {
          title: '操作日志',
          icon: 'log',
          roles: ['admin']
        }
      }
    ]
  },

  // 系统设置--登录查询
  {
    path: '/login_query',
    component: Layout,
    name: 'loginQuery',
    module: 'systemSetting',
    meta: {
      roles: ['admin']
    },
    children: [
      {
        path: 'login',
        name: 'loginQuery',
        module: 'systemSetting',
        component: () => import('@/views/loginQuery/index'),
        meta: {
          title: '登录查询',
          icon: 'login',
          roles: ['admin']
        }
      }
    ]
  },

  // 系统设置--demo页面
  {
    path: '/demo_test',
    component: Layout,
    name: 'demoTest',
    module: 'systemSetting',
    meta: {
      roles: ['admin']
    },
    children: [
      {
        path: 'demo',
        name: 'demo',
        module: 'systemSetting',
        component: () => import('@/views/demo/index'),
        meta: {
          title: '前端Excel导出',
          icon: 'location',
          roles: ['admin']
        }
      }
    ]
  },

  // 例子页面--例子页面
  {
    path: '/report_monitor',
    component: Layout,
    name: 'reportMonitor',
    module: 'monitorReport',
    meta: {
      title: '例子',
      icon: 'organization',
      roles: ['admin']
    },
    children: [
      {
        path: 'report_query',
        name: 'downloadFile',
        module: 'monitorReport',
        component: () => import('@/views/reportMonitor/downloadFile/index'),
        meta: {
          title: '后端文件下载',
          icon: 'capacity',
          roles: ['admin']
        }
      },
      {
        path: 'session',
        name: 'session',
        module: 'monitorReport',
        component: () => import('@/views/reportMonitor/session/index'),
        meta: {
          title: 'session',
          icon: 'capacity',
          roles: ['admin']
        }
      },
      {
        path: 'session2',
        name: 'session',
        module: 'monitorReport',
        component: () => import('@/views/reportMonitor/session2/index'),
        meta: {
          title: 'session2',
          icon: 'capacity',
          roles: ['admin']
        }
      }

    ]
  },
  // 可展开表格
  {
    path: '/template_setting',
    component: Layout,
    name: 'templateSetting',
    module: 'monitorSetting',
    meta: {
      roles: ['admin']
    },
    children: [
      {
        path: 'template',
        name: 'templateSetting',
        module: 'monitorSetting',
        component: () => import('@/views/templateSetting/index'),
        meta: {
          title: '可展开表格',
          icon: 'temSetting',
          roles: ['admin']
        }
      }
    ]
  },
  // 可展开表格+树
  {
    path: '/collect_setting',
    component: Layout,
    name: 'collectSetting',
    module: 'monitorSetting',
    meta: {
      roles: ['admin']
    },
    children: [
      {
        path: 'collect',
        name: 'acquisitionObject',
        module: 'monitorSetting',
        component: () => import('@/views/acquisitionObject/index'),
        meta: {
          title: '树+可展开',
          icon: 'collect',
          roles: ['admin']
        }
      }
    ]
  },

  // 树设置
  {
    path: '/sys_tree_management',
    component: Layout,
    name: 'sysTreeManagement',
    module: 'monitorSetting',
    meta: {
      roles: ['admin']
    },
    children: [
      {
        path: 'index',
        name: 'sysTree',
        module: 'monitorSetting',
        component: () => import('@/views/sysTree/index'),
        meta: {
          title: '树节点切换',
          icon: 'sysTree',
          roles: ['admin']
        }
      }
    ]
  },

  {
    path: '/config_management',
    component: Layout,
    name: 'configManagement',
    module: 'monitorSetting',
    meta: {
      title: '树选中节点',
      icon: 'config',
      roles: ['admin']
    },
    children: [
      {
        path: 'configItem',
        name: 'configItem',
        module: 'monitorSetting',
        component: () => import('@/views/configItem/index'),
        meta: {
          title: '树选中节点',
          icon: 'configItem',
          roles: ['admin']
        }
      }
    ]
  },

  {
    path: '/event_monitor',
    component: Layout,
    name: 'eventMonitor',
    module: 'monitorOverview',
    redirect: '/log_monitor/real_time',
    meta: {
      title: '事件监控',
      icon: 'logmonitor',
      roles: ['admin']
    },
    children: [
      {
        path: 'history_query',
        name: 'historyQuery',
        module: 'monitorOverview',
        component: () => import('@/views/eventMonitor/historyQuery/index'),
        meta: {
          title: '树+表格',
          icon: 'historylog',
          roles: ['admin']
        }
      }
    ]
  },

  {
    path: '/indicators_monitor',
    component: Layout,
    name: 'indicatorsMonitor',
    module: 'monitorOverview',
    redirect: '/indicators_monitor/service_indicators',
    meta: {
      title: 'CPU监控',
      icon: 'indicator',
      roles: ['admin']
    },
    children: [
      {
        path: 'service_indicators',
        name: 'indicatorsMonitor',
        module: 'monitorOverview',
        component: () => import('@/views/indicatorsMonitor/index'),
        meta: {
          title: 'CPU监控',
          icon: 'server',
          roles: ['admin']
        }
      }
    ]
  },

  {
    path: '/screen_monitor',
    component: Layout,
    name: 'screenModule',
    module: 'monitorOverview',
    redirect: '/screen_monitor/screen_monitor',
    meta: {
      title: 'Baidu地图',
      icon: 'bigScreen',
      roles: ['admin']
    },
    children: [
      {
        path: 'baiduMapProvince',
        name: 'baiduMapProvince',
        module: 'monitorOverview',
        component: () => import('@/views/screenModule/baiduMapProvince/index'),
        meta: {
          title: '百度地图-省点',
          icon: 'bigScreen',
          roles: ['admin']
        }
      },
      {
        path: 'baiduMap2',
        name: 'baiduMap2',
        module: 'monitorOverview',
        component: () => import('@/views/screenModule/baiduMap2/index'),
        meta: {
          title: '百度地图-省线',
          icon: 'bigScreen',
          roles: ['admin']
        }
      },
      {
        path: 'screen_monitor',
        name: 'screenMonitor',
        module: 'monitorOverview',
        component: () => import('@/views/screenModule/screenMonitor/index'),
        meta: {
          title: '大屏图表',
          icon: 'bigScreen',
          roles: ['admin']
        }
      },
      {
        path: 'seat_area',
        name: 'seatArea',
        module: 'monitorOverview',
        component: () => import('@/views/screenModule/seatArea/index'),
        meta: {
          title: '省市二级联动',
          icon: 'seat',
          roles: ['admin']
        }
      }
    ]
  },

  {
    path: '/communicate_monitor',
    component: Layout,
    name: 'communicateMonitor',
    module: 'monitorOverview',
    redirect: '/communicate_monitor/communicate',
    meta: {
      title: 'Echart组合展示',
      icon: 'comMonitor',
      roles: ['admin']
    },
    children: [
      {
        path: 'communicate',
        name: 'commMonitor',
        module: 'monitorOverview',
        component: () => import('@/views/communicateMonitor/commMonitor/index'),
        meta: {
          title: '关系水母图',
          icon: 'communicate',
          roles: ['admin']
        }
      },
      {
        path: 'computer_setting',
        name: 'computerSetting',
        module: 'monitorOverview',
        component: () => import('@/views/communicateMonitor/computerSetting/index'),
        meta: {
          title: 'Tab表格',
          icon: 'camera',
          roles: ['admin']
        }
      }
    ]
  },

  {
    path: '/log_monitor',
    component: Layout,
    name: 'monitorOverview',
    module: 'monitorOverview',
    meta: {
      // title: '日志监控',
      // icon: 'logmonitor',
      roles: ['admin']
    },
    children: [
      {
        path: 'historyLog',
        name: 'historyLog',
        module: 'monitorOverview',
        component: () => import('@/views/logMonitor/historyLog/index'),
        meta: {
          title: '日志信息',
          icon: 'log',
          roles: ['admin']
        }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

