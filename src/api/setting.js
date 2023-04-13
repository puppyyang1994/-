import request from '@/utils/request'

// 获取所有角色信息API
export function getRolesAPI (params) {
  return request({
    url: '/sys/role',
    method: 'GET',
    params: params
  })
}

// 获取公司信息
export function getCompanyInfoAPI (companyId) {
  return request({
    url: `/company/${companyId}`
  })
}

// 新增角色 data {name, description}
export function addRoleAPI (data) {
  return request({
    url: '/sys/role',
    method: 'POST',
    data
  })
}

// 获取某一角色聊表
export function getRoleIdAPI (id) {
  return request({
    url: `/sys/role/${id}`
  })
}

// 编辑功能API
export function updateRoleAPI (data) {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'put',
    data
  })
}

// 删除角色API
export function deleteRoleAPI (id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}
