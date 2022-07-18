import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import * as directives from '@/directives'
// 头像的自定义 的 全局注册自定义指令
// 遍历所有的导出的指令对象 完成自定义全局注册
Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key]) // 注册自定义指令
})

import Components from '@/components/index'
// 注册自定义组件
Vue.use(Components)

// filters -> 就是一个对象的集合， key -> 是方法名， value -> 是函数
import * as filters from '@/filters/index'
// 注册过滤器
Object.keys(filters).forEach(key => {
  // 过滤器的名字就是 ——> key，值就是 ——> filters[key] filters 是对象 key 是键值
  Vue.filter(key, filters[key]) // 注册自定义的过滤器
})

import CheckPermission from '@/mixin/checkPermission'
// 全局混入检查对象
Vue.mixin(CheckPermission) // 所有的组件都拥有了检查的方法

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
import i18n from '@/Lang'
Vue.use(ElementUI, {
  // 会根据当前的 locale 属性去寻找对应的显示内容
  i18n: (key, value) => i18n.t(key, value) // t方法 会去对应的语言包里寻找对应的内容
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
