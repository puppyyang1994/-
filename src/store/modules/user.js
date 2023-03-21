
import { getToken, setToken, removeToken } from '@/utils/auth'
import { loginAPI } from '@/api'

const getDefaultState = () => {
  return {
    token: getToken() // 设置token的共享状态  放到缓存中
  }
}
const state = getDefaultState()

const mutations = {
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
  }

}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

