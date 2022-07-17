import request from '@/utils/request'

// 获取员工的简单列表
export const getEmployeeSimple = () => {
  return request({
    url: '/sys/user/simple',
    method: 'GET'
  })
}

// 获取员工列表数据
export const getEmployeeList = (params) => { // 用 params 接收 分页参数
  return request({
    url: '/sys/user',
    method: 'GET',
    params
  })
}

// 删除员工接口
export const delEmployee = (id) => {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete'
  })
}

// 新增员工的接口
export const addEmployee = (data) => {
  return request({
    url: '/sys/user',
    method: 'POST',
    data
  })
}

// 封装一个导入员工的接口 参数 data 是数组
export const importEmployee = (data) => {
  return request({
    url: '/sys/user/batch',
    method: 'POST',
    data
  })
}

// 保存员工的基本信息
export const saveUserDetailById = (data) => {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'PUT',
    data
  })
}

// 读取用户详情的基础信息
export const getPersonalDetail = (id) => {
  return request({
    url: `/employees/${id}/personalInfo`
  })
}

// 更新用户详情的基础信息
export const updatePersonal = (data) => {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'put',
    data
  })
}

// 获取用户的岗位信息
export const getJobDetail = (id) => {
  return request({
    url: `/employees/${id}/jobs`
  })
}

// 保存岗位信息
export const updateJob = (data) => {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'put',
    data
  })
}

// 给用户分配角色
export const assignRoles = (data) => {
  return request({
    url: '/sys/user/assignRoles',
    data,
    method: 'PUT'
  })
}
