// import axios from 'axios'
// import { Message } from 'element-ui'
// import store from '@/store'
// import router from '@/router'

// // 创建一个axios实例 等同于以前的axios 可以用service发起请求
// const service = axios.create({
//   // 设置baseUrl
// // 基地址会放在请求的url的前面
// // 基地址：就是你用service发起的请求 api文件里url后续地址
// // 请求时的完整地址就是BaseURL + url
// // 'api/sys/login'
//   baseURL: process.env.VUE_APP_BASE_API,
//   timeout: 5000
// })

// // 请求拦截器
// service.interceptors.request.use(
//   config => {
//     const token = store.getters.token
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}` // 后台解析的方法要求必须前面拼接一个Bearer和一个空字符串
//     }
//     return config
//   },
//   error => {
//     return Promise.reject(error)
//   }
// )

// // 处理身份过期问题
// // 响应拦截器
// service.interceptors.response.use(
//   // 因为后台成功、失败都是200所以并不是以状态码来判定是否请求成功
//   // response参数 是axios响应对象 里面有config, data, headers, request
//   response => {
//     // console.log(response)
//     // 结构
//     const { success, message } = response.data
//     if (success) {
//       // 成功的的话返回数据 view页面就不需要写两次data了
//       return response.data
//     } else {
//       // 逻辑失败 (把后台返回message提示文字返回到逻辑页面)
//       Message.error(message)
//       return Promise.reject(new Error(message))
//     }
//   },
//   // 4xx的响应状态，如果后台返回了数据，就用一下；如果没有 就error本身的message
//   //  &&data 为了防止null.data报错
//   error => {
//     // console.log((error.response && error.response.data && error.response.data.message) || error.message)
//     console.dir(error)
//     // 处理身份过期问题
//     // 前面有就用前面的  没有就用||后面的
//     Message.error((error.response && error.response.data && error.response.data.message) || error.message)

//     // 可以用http状态码来判断 error.response.status === 401
//     // 还可以用code逻辑码来判断 10002和后台商定的值，代表token过期
//     // 可选链操作符（新版的语法，需要babel语法支持）左侧有值才会继续往下去点属性
//     // 防止空值去.任意的属性报错
//     if (error?.response?.data?.code === 10002) {
//       // 前端token过期，需要前端做什么：
//       // 清空token和本地vuex
//       // 清除用户信息
//       store.dispatch('user/logoutActions')
//       // 返回登录页

//       router.replace(`/login?redirect=${router.currentRoute.fullPath}`)
//     }
//     return Promise.reject(error)
//   })

//   // 响应拦截器
// service.interceptors.response.use(..., async(error) => {
//   if (error.response.status === 401) {
//     Message({ type: 'warning', message: 'token超时了' })
//     // 说明token超时了
//     await store.dispatch('user/logout') // 调用action 退出登录
//     //  主动跳到登录页
//     router.push('/login') // 跳转到登录页
//     return Promise.reject(error)
//   }
//   // error.message
//   Message.error(error.message)
//   return Promise.reject(error)
// })
// export default service

import axios from 'axios'
import { Message } from 'element-ui'

import store from '@/store'
import router from '@/router'
import { getTimeStamp } from '@/utils/auth'

const TimeOut = 3600 // 定义超时时间
const service = axios.create({
//    设置基础地址
// 环境变量 npm run dev  /api   /生产环境 npm run build  /prod-api
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000 // 认为只要超过5秒钟不响应 就超时
})
// 请求拦截器
service.interceptors.request.use(config => {
  // 请求接口  config是请求配置
  // 取token
  // axios默认加了一层data
  // const { success, message, data } = response.data
  //   要根据success的成功与否决定下面的操作
  if (store.getters.token) {
    if (IsCheckTimeOut()) {
      // 如果它为true表示 过期了
      // token没用了 因为超时了
      store.dispatch('user/logout') // 登出操作
      // 跳转到登录页
      router.push('/login')
      return Promise.reject(new Error('token超时了'))
    }

    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config
}, error => {
  // Message.error(error.message) // 提示错误信息
  return Promise.reject(error) // 返回执行错误 让当前的执行链跳出成功 直接进入 catch
})
// 响应拦截器
service.interceptors.response.use(response => {
  // 成功执行
  // axios默认加了一层data的包裹
  const { success, message, data } = response.data
  if (success) {
    // 此时认为业务执行成功了
    return data // 返回用户所需要的数据
  } else {
    // 当业务失败的时候
    Message.error(message) // 提示消息
    return Promise.reject(new Error(message))
  }
}, async error => {
  // error 有response对象 config
  if (error.response && error.response.data && error.response.data.code === 10002) {
    // 后端告诉前端token超时了
    await store.dispatch('user/logout') // 调用登出action
    router.push('/login') // 跳到登录页
  } else {
    // 失败
  // Message等同于 this.$message
    Message.error(error.message) // 提示错误
  }

  // reject
  return Promise.reject(error) // 传入一个错误的对象  就认为promise执行链 进入了catch
})
function IsCheckTimeOut () {
  var currentTime = Date.now() // 当前时间戳
  var timeStamp = getTimeStamp() // 缓存时间戳
  return (currentTime - timeStamp) / 1000 > TimeOut
}
export default service

