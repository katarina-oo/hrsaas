// 负责所有全局自定义组件的注册

import PageTools from './PageTools/index.vue'
import UploadExcel from './UploadExcel'
import ImageUpload from './ImageUpload/index.vue'
import Print from 'vue-print-nb'
export default {
  install(Vue) { // vue 实例对象 是通过 install方法 -> 传进来的
    // 拿到 vue 全局对象
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel) // 注册导入excel组件
    Vue.component('ImageUpload', ImageUpload) // 注册图片上传组件
    Vue.use(Print) // 注册打印插件
  }
}
