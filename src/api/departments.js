import request from '@/utils/request'

export function departmentsListAPI () {
  return request({
    url: '/company/department'
  })
}

// 在获取员工简单列表里
export function getEmployeeSimpleAPI () {
  return request({
    url: '/sys/user/simple'
  })
}

// 新增子部门
export function addDepartmentsAPI (data) {
  return request({
    url: '/company/department',
    method: 'POST',
    data // 前端form表单的参数名，直接和接口的对应 这里可以写很多属性名代码
  })
}

// 部门详情获取接口
export function getDepartDetailAPI (id) {
  return request({
    url: `/company/department/${id}`,
    method: 'GET'
  })
}

// 更新部门数据接口
export function updateDeparmentsAPI (data) {
  return request({
    url: `/company/department/${data.id}`, // 注意 这里要是父级的id
    method: 'put',
    data
  })
}

// 删除部门接口
// id指当前点击的操作按钮，所在的项的id（部门Id)
export function delDepartmentAPI (id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}
