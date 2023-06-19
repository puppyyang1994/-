
import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'

/* const getDefaultState = () => {
  return {
    token: getToken(), // 设置token的共享状态  放到缓存中
    userInfo: {} // 保存用户基本信息（初识值的类型最好喝将来赋值类型统一）
  }
} */
const state = {
  token: getToken(),
  userInfo: {}
}

const mutations = {
  // 把state里的值回归初始化
  /*  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  }, */
  // 设置token
  setToken (state, token) {
    // 1. 先修改state数据
    state.token = token
    // 调用存储数据的方法 缓存token
    setToken(token)
  },
  removeToken (state) {
    state.token = null
    removeToken()
  },
  // 操作userInfo这个变量
  setUserInfo (state, userInfo) {
    state.userInfo = userInfo // 一会请求到的信息对象
  },
  // 删除用户信息
  removerUserInfo (state) {
    state.userInfo = {}
  }
}

const actions = {
  // 封装的登录逻辑
  async login (context, data) {
    const res = await login(data)

    // 当前在模块内 前面不需要模块名
    context.commit('setToken', res)
    // console.log('登录成功了')
    // return res // 把结果返回到调用处index.vue
    // async函数返回的值 都会作为Promise成功的值
    setTimeStamp()
  },

  // 获取用户基本信息
  async getUserInfo (context) {
    const result = await getUserInfo() // 获取返回值
    const baseInfo = await getUserDetailById(result.userId) // 为了获取头像
    const baseResult = { ...result, ...baseInfo } // 将两个接口结果合并
    // 此时已经获取到了用户的基本资料 迫不得已 为了头像再次调用一个接口
    context.commit('setUserInfo', baseResult) // 提交mutations
    // 加一个点睛之笔  这里这一步，暂时用不到，但是请注意，这给我们后边会留下伏笔
    return baseResult

    // {data}是 res.data的解构赋值
    // const { data: infoObj } = await getUserProfileAPI()
    // console.log(res)// 里面有userID
    // const { data: photoObj } = await getUserPhotoAPI(infoObj.userId)
    // console.log(photoObj)
    // 把两个对象都展开合并成一个新的对象，传递给userInfo保存， 也可以用Object.assign()
    // 用户信息对象，交到mutations里的userInfo上
    // commit('SET_USER', { ...infoObj, ...photoObj }) // 把数据保存到state里
  },
  // 封装退出登录逻辑（被动退出 token过期）
  logout (context) {
    context.commit('removeToken') // 删掉token
    context.commit('removeUserInfo') // 删掉用户信息
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
