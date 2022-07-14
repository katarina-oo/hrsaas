import Layout from '@/layout'

// 导出考勤的路由规则
export default {
  path: '/attendances', // 路由地址   /attendances
  name: 'attendances', // 给模块的一级路由加一个name属性 做权限用到到
  component: Layout, // 组件
  // 配置二级路的路由表
  children: [{
    // 二级路由的默认路由
    path: '', // 空着表示 --> /attendances 不但有布局 layout --> 员工主页
    component: () => import('@/views/attendances'),
    // 路由元信息  其实就是存储数据的对象 我们可以在这里放置一些信息
    meta: {
      title: '考勤管理', // 左侧导航会读取我们的路由里的meta里面的title作为显示菜单名称
      icon: 'skill'
    }
  }]
}
