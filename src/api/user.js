import request from '@/utils/request'

// 登录接口
export const login = (data) => {
  return request({
    method: 'POST',
    url: '/sys/login',
    // data: data
    data
  })
}

// 获取用户资料
export const getUserInfo = () => {
  return request({
    method: 'POST',
    url: '/sys/profile'
  })
}

// 根据用户id获取用户的详情
export const getUserDetailById = (id) => {
  return request({
    method: 'GET',
    url: `/sys/user/${id}`
  })
}

export const logout = () => {

}
