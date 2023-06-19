import Cookies from 'js-cookie'

const TokenKey = 'hrsaas-ihrm-token' // 设定一个独一无二的key
const timeKey = 'hrsaas-timestamp-key'
// 获取时间戳
export function getTimeStamp () {
  return Cookies.get(timeKey)
}
// 设置时间戳
export function setTimeStamp () {
  Cookies.set(timeKey, Date.now())
}
// 已经封装好了方法 往user里引入
export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}
