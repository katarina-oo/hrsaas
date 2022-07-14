// 权限拦截在路由跳转 导航守卫
import router from '@/router' // 引入路由实例
// 不需要导出，只需让代码执行即可
import store from '@/store' // 引入 stroe实例，和组件中this.$store是一样的
import nprogress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式

// 前置守卫，next是必须执行的
// next() -> 放行
// next(false) -> 停止跳转
// next(地址) -> 跳转到该地址
const whiteList = ['/login', '/404'] // 定义一个白名单（存放的是 -> 没token且不需要token的页面：login、404）
router.beforeEach(async(to, from, next) => {
  nprogress.start() // 开启进度条
  if (store.getters.token) { // 如果有 token
    if (to.path === '/login') { // 如果要访问的是 登录页 （免登录）
      next('/') // 跳转到主页
    } else { // 有 token 但不在登录页 --> 放行
      // 在此次获取用户信息
      // 如果当前vuex中有用户的资料的id 表示 已经有资料，不需要获取。没有id才需要获取用户信息
      if (!store.getters.userId) {
        // 如果没有id才表示当前用户资料没有获取过
        await store.dispatch('user/getUserInfo')
        // 后续需要获取数据的话，这里必须改成 同步
      }
      next()
    }
  } else { // 没有 token
    if (whiteList.includes(to.path)) {
      // 要去的地址在白名单 -> 放行
      next()
    } else {
      // 没有 token 且不在白名单中 --> 跳到登录页
      next('/login')
    }
  }
  nprogress.done() // 手动强制关闭一次  为了解决 手动切换地址时  进度条的不关闭的问题
})

// 后置守卫
router.afterEach(() => {
  nprogress.done() // 关闭进度条
})
