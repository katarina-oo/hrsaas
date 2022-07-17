import request from '@/utils/request'

// 获取权限
export const getPermissionList = (params) => {
  return request({
    url: '/sys/permission',
    method: 'GET',
    params
  })
}

// 新增权限
export const addPermission = (data) => {
  return request({
    url: '/sys/permission',
    method: 'POST',
    data
  })
}

// 更新权限
export const updatePermission = (data) => {
  return request({
    url: `/sys/permission/${data.id}`,
    method: 'PUT',
    data
  })
}

// 删除权限
export const delPermission = (id) => {
  return request({
    url: `/sys/permission/${id}`,
    method: 'DELETE'
  })
}

// 获取权限详情
export const getPermissionDetail = (id) => {
  return request({
    url: `/sys/permission/${id}`,
    method: 'GET'
  })
}
