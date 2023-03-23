import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'

// 创建一个axios实例 等同于以前的axios 可以用service发起请求
const service = axios.create({
  // 设置baseUrl
// 基地址会放在请求的url的前面
// 基地址：就是你用service发起的请求 api文件里url后续地址
// 请求时的完整地址就是BaseURL + url
// 'api/sys/login'
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    const token = store.getters.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}` // 后台解析的方法要求必须前面拼接一个Bearer和一个空字符串
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 处理身份过期问题
// 响应拦截器
service.interceptors.response.use(
  // 因为后台成功、失败都是200所以并不是以状态码来判定是否请求成功
  // response参数 是axios响应对象 里面有config, data, headers, request
  response => {
    // console.log(response)
    // 结构
    const { success, message } = response.data
    if (success) {
      // 成功的的话返回数据 view页面就不需要写两次data了
      return response.data
    } else {
      // 逻辑失败 (把后台返回message提示文字返回到逻辑页面)
      Message.error(message)
      return Promise.reject(new Error(message))
    }
  },
  // 4xx的响应状态，如果后台返回了数据，就用一下；如果没有 就error本身的message
  //  &&data 为了防止null.data报错
  error => {
    // console.log((error.response && error.response.data && error.response.data.message) || error.message)
    console.dir(error)
    // 处理身份过期问题
    // 前面有就用前面的  没有就用||后面的
    Message.error((error.response && error.response.data && error.response.data.message) || error.message)

    // 可以用http状态码来判断 error.response.status === 401
    // 还可以用code逻辑码来判断 10002和后台商定的值，代表token过期
    // 可选链操作符（新版的语法，需要babel语法支持）左侧有值才会继续往下去点属性
    // 防止空值去.任意的属性报错
    if (error?.response?.data?.code === 10002) {
      // 前端token过期，需要前端做什么：
      // 清空token和本地vuex
      // 清除用户信息
      store.dispatch('user/logoutActions')
      // 返回登录页
      router.replace('/login')
    }
    return Promise.reject(error)
  })

export default service
