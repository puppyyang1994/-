import request from '@/utils/request'

export function login (data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

/* 获取用户的基本信息 返回promise对象 axios留下的 */
export function getUserInfo () {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}

// 获取员工基本信息（只为了拿到员工头像）

export function getUserDetailById (id) {
  return request({
    url: `/sys/user/${id}`, // 把员工id值带在路径上传递给后台
    method: 'GET' // method默认请求方式就是get
  })
}

export function logout () {

}
