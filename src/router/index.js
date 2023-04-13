import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import Layout from '@/layout'
// 引入多个动态路由模块
import permissionRouter from './modules/permission'
import departmentsRouter from './modules/departments'
import approvalsRouter from './modules/approvals'

import employeesRouter from './modules/employees'

import attendancesRouter from './modules/attendances'
import salarysRouter from './modules/salaries'
import settingRouter from './modules/setting'
import socialRouter from './modules/social'

// 动态路由表，项目中不同的用户可以访问不同的功能(放到静态路由前)
export const asyncRoutes = [

  departmentsRouter,
  settingRouter,
  employeesRouter,
  permissionRouter,
  approvalsRouter,
  attendancesRouter,
  salarysRouter,
  socialRouter
]

// 静态路由表，项目中的每个用户都可以访问

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '主页', icon: 'dashboard' }
    }]
  },
  /*  {
    // 路由地址为info,直接就有1级和默认2级组件挂载了
    path: '/info',
    component: Layout, // 一级挂载点还是布局页面layout组件
    children: [{
      path: '', // 空字符串就是默认匹配的二级路由
      component: () => import('@/views/info'), // 渲染到二级路由挂载点中（AppMain.vue)
      meta: { title: 'info', icon: 'user' }
    }]
  }, */

  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // 控制路由滚动行为 滚动到顶部
  scrollBehavior: () => ({ y: 0 }),
  // 组合到一起组成路由表
  routes: [...constantRoutes, ...asyncRoutes]
})

const router = createRouter()

export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
