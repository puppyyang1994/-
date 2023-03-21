import request from '@/utils/request' // 导入axios方法

// 按需导出了一个函数
// 本函数只向目标url发起请求

export function getList (params) {
  // 类似axios方法在原地调用，返回值是：Promise对象(内部包裹着一个ajax请求)
  // return到views那边去
  // promise对象 如何写代码接收成功/失败结果
  // .then()结束成功的结果 .catch()接收失败的结果
  return request({
    url: '/vue-admin-template/table/list',
    method: 'get',
    params
  })
}

// 总结：为何请求url +方式 + 参数 要封装到函数里？
// 为了复用，方便管理
// request-》车
// api方法 -》秘书
// views里导入api接口方法 -》 我喊秘书去开车，去后台把数据请求回来返回到逻辑页面
// 结构：代码分层的思想
