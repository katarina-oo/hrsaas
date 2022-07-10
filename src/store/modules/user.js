import { getToken, setToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'

// state 定义状态
// 初始化的时候从缓存中读取状态 并赋值到初始化的状态上
// Vuex的持久化 如何实现 ？ Vuex和前端缓存相结合
const state = {
  // 设置 token 初始状态
  token: getToken() // 初始化vuex时，先从缓存中读取
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
  }
}

// actions 执行异步状态
const actions = {
  // 登录 -> 定义login action 也需要参数 调用action时 传递过来的参数
  async login({ commit }, data) { // 解构 - context
    const token = await login(data) // 拿到token
    commit('updateToken', token)

    // axios 默认加了一层 data
    // if (token.data.success) {
    // // 如果为 true 表示登录成功，就获取到了用户的 token
    // // actions 修改state 必须通过mutations
    //   commit('updateToken', token.data.data)
    // }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
