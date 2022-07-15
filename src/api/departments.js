import request from '@/utils/request'

// 获取组织架构数据
export const getDepartments = () => {
  return request({
    url: '/company/department', // 遵循 restful 接口规范 （同样的地址，不同的方法）
    method: 'GET'
  })
}

// 删除组织架构的部门
export const delDepartments = (id) => {
  return request({
    url: `/company/department/${id}`,
    method: 'DELETE' // 接口满足， 遵循 restful 接口规范 （同样的地址，不同的方法）
    // 同样的地址，不通过的方法，执行不同的业务
  })
}

// 新增部门
export const addDepartments = (data) => {
  return request({
    url: '/company/department', // 遵循 restful 接口规范 （同样的地址，不同的方法）
    method: 'POST',
    data
  })
}

// 获取部门详情 --> 实现回显
export const getDepartDetail = (id) => {
  return request({
    url: `/company/department/${id}`,
    method: 'GET'
  })
}

// 确认编辑的数据
export const updateDepartments = (data) => {
  return request({
    url: `/company/department/${data.id}`,
    method: 'PUT',
    data
  })
}
