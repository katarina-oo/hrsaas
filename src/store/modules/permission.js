// 专门建立处理权限路由的模块

// asyncRoutes 引入所有的动态路由
import { constantRoutes, asyncRoutes } from '@/router'
// vuex中的permission模块用来存放当前的 静态路由 + 当前用户的 权限路由
const state = {
  // 最初用户应当拥有所有的 静态路由的权限
  routes: constantRoutes // 路由表 -> 表示当前用户所拥有的所有路由的数组
}
const mutations = {
  // 定义修改 routes 的 mutations
  // 参数2 payload(载荷) 是我们登录成功需要添加的新路由
  setRoutes(state, newRoutes) {
    // 下面这么写不对 不是语法不对 是业务不对
    // state.routes = [...state.routes, ...newRoutes]

    // 应该是每次更新 都应该在静态路由的基础上进行追加
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = {
  // 筛选权限路由
  // 第二个参数为当前用户所拥有的菜单权限
  // 例：menus: ["settings", "permissions"]
  filterRoutes(context, menus) {
    const routes = []
    // 筛选出 动态路由中 和 menus 中能够对上的路由
    // asyncRoutes -> 所有的动态路由 形式为 => [{path: 'setting', name: 'setting'}, {}]
    menus.forEach(key => { // key 就是标识
      // 在asyncRoutes中找 有没有对象中的name属性等于 key的 找不到 -> 没权限， 找到了 -> 筛选出来
      // asyncRoutes.filter(item => item.name === key) // 返回新数组 有可能有值，也可没有值
      routes.push(...asyncRoutes.filter(item => item.name === key))
    })
    // 得到的 routes 是所有模块中满足权限要求的路由数组，也是当前用户所拥有的动态路由的权限
    context.commit('setRoutes', routes) // 将动态路由提交给mutations
    return routes // state数据 是用来 显示左侧菜单用的  return 是给路由addRoutes用的
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
