import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router'
// state 定义状态
// 初始化的时候从缓存中读取状态 并赋值到初始化的状态上
// Vuex的持久化 如何实现 ？ Vuex和前端缓存相结合
const state = {
  // 设置 token 初始状态
  token: getToken(), // 初始化vuex时，先从缓存中读取
  userInfo: {} // 定义一个空对象
}

// mutations 修改状态 （vuex 和 缓存 一起公用）
const mutations = {
  // 设置token
  updateToken(state, token) {
    state.token = token // 将数据设置给 vuex
    // vuex变化 => 在同步给缓存
    setToken(token) // 这样就一直和 vuex 缓存同步的 --> 这样就实现了 vuex 的数据持久化
  },
  // 删除缓存
  removeToken(state) {
    state.token = null // 将 vuex 的数据置空
    removeToken() // vuex 数据置空 -->  同步到缓存(置空)
  },
  updateUserInfo(state, result) {
    // 更新一个对象
    // state.userInfo['username'] = result --> 不是响应式

    // state.userInfo = { ...result } // 也是响应式(这样写属于浅拷贝)
    state.userInfo = result // 是响应式
  },
  // 删除用户信息
  removeUserInfo(state) {
    state.userInfo = {}
  }
}

// actions 执行异步状态
const actions = {
  // 登录 -> 定义login action 也需要参数 调用action时 传递过来的参数
  async login({ commit }, data) {
    // 解构 - context
    const token = await login(data) // 拿到token
    commit('updateToken', token)

    // 写入时间戳
    setTimeStamp() // 将当前的最新时间写入缓存

    // axios 默认加了一层 data
    // if (token.data.success) {
    // // 如果为 true 表示登录成功，就获取到了用户的 token
    // // actions 修改state 必须通过mutations
    //   commit('updateToken', token.data.data)
    // }
  },
  // 获取用户信息资料
  async getUserInfo({ commit }) { // 解构
    const result = await getUserInfo()

    const baseInfo = await getUserDetailById(result.userId)
    commit('updateUserInfo', { ...result, ...baseInfo }) // 提交到 mutations
    // commit('updateUserInfo', result) // 提交到 mutations
    return result // 这里是给我们后期做权限时，留下的
  },
  // 登出操作
  logout({ commit }) { // 解构
    // 删除 token
    commit('removeToken') // 不仅仅删除了vuex中的 还删除了缓存中的
    // 删除用户资料
    commit('removeUserInfo') // 删除用户信息

    // 重置路由
    resetRouter()
    // 然后去设置权限模块下路由为初始状态
    // Vuex子模块调用子模块的action，在都未加锁的情况下，可用随意调动
    // 不加命名空间的情况下，所有的mutations和action都挂在全局上，可直接调用
    // 此时的情况是：加了命名空间的子模块 调用 另一个加了命名空间的子模块的mutations
    // 加了命名空间的 context 指的就不是全局的context了
    // mutations名称 载荷(payload) 第三个参数 { root: true } 调用根级的mutations或actions
    commit('permission/setRoutes', [], { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
