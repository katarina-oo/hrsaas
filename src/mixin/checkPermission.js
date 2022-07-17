import store from '@/store'
// 写一个混入对象
export default {
  // 混入对象是组件的选项对象
  methods: {
    // 检查权限(有/没有)，key是要检查的点
    checkPermission(key) {
      // 去用户的信息内找 points中是否有key 有 -> 有权限，反之
      const { userInfo } = store.state.user
      if (userInfo.roles && userInfo.roles.points) {
        return userInfo.roles.points.some(item => item === key)
      }
      // 没进入if 证明没权限
      return false
    }
  }
}
