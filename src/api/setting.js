import request from '@/utils/request'

// 获取角色列表
export const getRoleList = (params) => {
  return request({
    url: '/sys/role',
    method: 'GET',
    params
    // params是查询参数，里面需要携带分页信息
  })
}

// 获取公司信息的接口
export const getCompanyInfo = (companyId) => {
  return request({
    url: `/company/${companyId}`,
    method: 'GET'
  })
}

// 根据ID删除角色
export const deleteRole = (id) => {
  return request({
    url: `/sys/role/${id}`,
    method: 'DELETE'
  })
}

// 根据ID获取角色详情
export const getRoleDetail = (id) => {
  return request({
    url: `/sys/role/${id}`,
    method: 'GET'
  })
}

// 根据ID更新（修改）角色
export const updateRole = (data) => {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'PUT',
    data
  })
}

// 新增角色
export const addRole = (data) => {
  return request({
    url: `/sys/role`,
    method: 'POST',
    data
  })
}

// 给角色分配权限
export const assignPerm = (data) => {
  return request({
    url: '/sys/role/assignPrem',
    method: 'PUT',
    data
  })
}

