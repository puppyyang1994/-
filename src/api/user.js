import request from '@/utils/request'

export function loginAPI (data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

export function getUserProfileAPI () {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}
export function getInfo (token) {

}

export function logout () {

}
