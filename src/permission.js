import router from './router'
import store from '@/store'

// const whiteList = ['/login'] // no redirect whitelist

// 前置守卫
// 路由守卫里必须要有一个next调用，出口，让路由页面跳转
router.beforeEach(async (to, from, next) => {
  const token = store.getters.token
  // 如果有token 代表登录了

  // 登陆了不能去登录页
  // 非登录 只能去登录页
  if (token) {
    if (to.path === '/login') {
      // 中断 /login这次导航 重新跳转到/
      next('/') // 强制跳转到/首页
    } else {
      next() // 去别的页  放行
    }
  } else { // 没有登录
    if (to.path === '/login') {
      next()
    } else { // 去首页  内部项目
      next('/login')
    }
  }
})
// 验证方法：把本地cookie里的token手动删除 刷新， 看能否走最后一个else

// 后置守卫
router.afterEach(() => {

})
