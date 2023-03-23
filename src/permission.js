import router from './router'
import store from '@/store'
// 导入进度条插件
import NProgress from 'nprogress'

// 导入进度条样式
import 'nprogress/nprogress.css'

// const whiteList = ['/login'] // no redirect whitelist

// 白名单数组
const whiteList = ['/login', '/404']

// 前置守卫
// 路由守卫里必须要有一个next调用，出口，让路由页面跳转
router.beforeEach((to, from, next) => {
  // 显示进度条效果
  NProgress.start()
  const token = store.getters.token
  // 如果有token 代表登录了

  // 登陆了不能去登录页
  // 非登录 只能去登录页
  if (token) {
    if (to.path === '/login') {
      // 中断 /login这次导航 重新跳转到/
      next('/') // 强制跳转到/首页
      // 在重定向的时候要把进度条关闭
      NProgress.done()
    } else { // 区别的页面
      // 去别的页  放行
      if (!store.getters.name) { store.dispatch('user/getUserProfileActions') }
      next()
    }
  } else { // 没有登录
    /* if (to.path === '/login') {
      next()
    } else { // 去首页  内部项目
      next('/login')
    } */
    // 如果没有token 访问的是白名单，直接放行
    // includes是谁的方法？数组方法，检查这个元素在数组中是否存在，存在就返回true
    if (whiteList.includes(to.path)) {
      next()
    } else {
      // 如果没有token, 且不是白名单页面，跳转到登录页面
      next('/login')
      NProgress.done()
    }
  }
})
// 验证方法：把本地cookie里的token手动删除 刷新， 看能否走最后一个else

// 后置守卫
router.afterEach((to, from) => {
  // 隐藏进度条效果
  NProgress.done()
})

// beforeEach中开启进度条
// afterEach中停止进度条
