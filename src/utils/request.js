// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from 'axios'
import { Message } from 'element-ui'

const service = axios.create({
  // 设置axios请求的基础的基础地址
  // 如果执行 npm run dev  值为 /api 正确  /api 这个代理只是给开发环境配置的代理
  // 如果执行 npm run build 值为 /prod-api  没关系  运维应该在上线的时候 给你配置上 /prod-api的代理
  // npm run dev => /api 或 npm run build => /prod-api
  baseURL: process.env.VUE_APP_BASE_API, // 请求的全部路径：baseURL + url
  timeout: 5000 // 设置超时时间
}) // 创建一个axios的实例

service.interceptors.request.use() // 请求拦截器

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
  Message.error(error.message) // 提示错误信息
  return Promise.reject(error) // 返回执行错误 让当前的执行链跳出成功 直接进入 catch
}) // 响应拦截器

export default service // 导出axios实例
