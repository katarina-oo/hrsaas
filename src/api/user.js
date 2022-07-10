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

// export const getInfo = (token) => {

// }

export const logout = () => {

}
