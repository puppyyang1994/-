
import { getToken, setToken, removeToken } from '@/utils/auth'
import { loginAPI, getUserProfileAPI, getUserPhotoAPI } from '@/api'

const getDefaultState = () => {
  return {
    token: getToken(), // 设置token的共享状态  放到缓存中
    userInfo: {} // 保存用户基本信息（初识值的类型最好喝将来赋值类型统一）
  }
}
const state = getDefaultState()

const mutations = {
  // 把state里的值回归初始化
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  // 设置token
  SET_TOKEN (state, token) {
    // 1. 先修改state数据
    state.token = token
    // 调用存储数据的方法 缓存token
    setToken(token)
  },
  REMOVE_TOKEN (state) {
    state.token = ''
    removeToken()
  },
  // 操作userInfo这个变量
  SET_USER (state, value) {
    state.userInfo = value // 一会请求到的信息对象
  },
  // 删除用户信息
  REMOVE_USER (state) {
    state.userInfo = {}
  }
}

const actions = {
  // 封装的登录逻辑
  async loginActions ({ commit }, data) {
    const res = await loginAPI(data)
    // 当前在模块内 前面不需要模块名
    commit('SET_TOKEN', res.data)
    // console.log('登录成功了')
    return res // 把结果返回到调用处index.vue
    // async函数返回的值 都会作为Promise成功的值
  },

  // 获取用户基本信息
  async getUserProfileActions ({ commit }) {
    // {data}是 res.data的解构赋值
    const { data: infoObj } = await getUserProfileAPI()
    // console.log(res)// 里面有userID
    const { data: photoObj } = await getUserPhotoAPI(infoObj.userId)
    // console.log(photoObj)
    // 把两个对象都展开合并成一个新的对象，传递给userInfo保存， 也可以用Object.assign()
    // 用户信息对象，交到mutations里的userInfo上
    commit('SET_USER', { ...infoObj, ...photoObj }) // 把数据保存到state里
  },
  // 封装退出登录逻辑（被动退出 token过期）
  logoutActions ({ commit }) {
    commit('REMOVE_TOKEN') // 删掉token
    commit('REMOVE_USER') // 删掉用户信息
    // state值清除 getters也受到影响
    // 跳转到登录页 所以要路由对象 引入 但老师建议不写在这里 这里都是vuex相关的
    // 老师建议写到拦截器里面 request.js中
  }

}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

