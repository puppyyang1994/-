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

