import Layout from '@/layout'

// 导出员工管理的路由规则
export default {
  path: '/employees', // 路由地址   /employees
  name: 'employees', // 给模块的一级路由加一个name属性 做权限用到到
  component: Layout, // 组件
  // 配置二级路的路由表
  children: [{
    // 二级路由的默认路由
    path: '', // 空着表示 --> /employees 不但有布局 layout --> 员工主页
    component: () => import('@/views/employees'),
    name: 'employees',
    // 路由元信息  其实就是存储数据的对象 我们可以在这里放置一些信息
    meta: {
      title: '员工管理', // 左侧导航会读取我们的路由里的meta里面的title作为显示菜单名称
      icon: 'people'
    }
  },
  {
    // path: 'detail/:id?', ? 的含义表示 -> 该参数可传可不传
    path: 'detail/:id', // 动态路由参数 /employees/detail
    component: () => import('@/views/employees/detail'),
    hidden: true, // 表示该内容不在左侧菜单显示
    meta: {
      title: '员工详情'
    }
  },
  // 打印页面路由
  {
    path: 'print/:id', // 二级默认路由
    component: () => import('@/views/employees/print'), // 按需加载
    hidden: true,
    meta: {
      title: '员工打印', // 标记当前路由规则的中文名称 后续在做左侧菜单时 使用
      icon: 'people'
    }
  }
  ]
}
