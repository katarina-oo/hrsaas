// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
import { getTimeStamp } from '@/utils/auth'
const TimeOut = 7200 // 定义超时时间

const service = axios.create({
  // 设置axios请求的基础的基础地址
  // 如果执行 npm run dev  值为 /api 正确  /api 这个代理只是给开发环境配置的代理
  // 如果执行 npm run build 值为 /prod-api  没关系  运维应该在上线的时候 给你配置上 /prod-api的代理
  // npm run dev => /api 或 npm run build => /prod-api
  baseURL: process.env.VUE_APP_BASE_API, // 请求的全部路径：baseURL + url
  timeout: 5000 // 设置超时时间
}) // 创建一个axios的实例

// 请求拦截器（为所有请求统一添加访问前缀 -> token）
service.interceptors.request.use(config => {
  // config 是请求的配置信息
  // 统一注入 token
  const token = store.getters.token
  if (token) {
    // 有 token 的情况下 才检查时间戳是否超时
    if (IsCheckTimeOut()) {
      // 如果为 true 表示 token 超时了
      store.dispatch('user/logout') // 登出操作（等于删除了 token）
      router.push('/login') // 在跳转到登录页
      return Promise.reject(new Error('token超时了'))
    }

    // 如果token存在 注入token
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config // 必须返回配置
}, error => {
  return Promise.reject(error)
})

// 响应拦截器（统一处理返回数据、统一处理服务器异常的情况）
service.interceptors.response.use(response => { // 请求成功回调
  // axios默认加了一层data
  const { success, message, data } = response.data
  // 要根据 success 的成功与否决定下面的操作
  if (success) { // 为 true 正常返回数据
    return data
  } else {
    // 业务已经出错了，应该进 catch
    Message.error(message) // 提示错误信息
    return Promise.reject(new Error(message)) // 返回执行错误 让当前的执行链跳出成功 直接进入 catch
  }
}, error => { // 请求直接出错执行
  /**
    * Token 失效的被动处理
  **/
  if (error.response && error.response.data && error.response.data.code === 10002) {
    // 当等于 10002 时，表示 后端告诉我 token 超时了 --> 应该删 token 退出登录
    store.dispatch('user/logout') // 登出操作（等于删除了 token）
    router.push('/login') // 在跳转到登录页
  } else {
    Message.error(error.message) // 提示错误信息
  }
  // Message.error(error.message) // 提示错误信息
  return Promise.reject(error) // 返回执行错误 让当前的执行链跳出成功 直接进入 catch
})

// 定义方法 -> 用于检查 token 是否超时
// 超时逻辑：当时时间 - 缓存中的时间 是否大于 所定义的时间(TimeOut)
function IsCheckTimeOut() {
  var currentTime = Date.now() // 当前时间戳
  var timestamp = getTimeStamp() // 缓存时间戳
  return (currentTime - timestamp) / 1000 > TimeOut
}
export default service // 导出axios实例

