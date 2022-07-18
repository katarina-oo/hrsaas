import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookie from 'js-cookie' // 引入cookie工具

import elementEN from 'element-ui/lib/locale/lang/en' // 引入饿了么的英文包
import elementZH from 'element-ui/lib/locale/lang/zh-CN' // 引入饿了么的中文包
import elementKO from 'element-ui/lib/locale/lang/ko' // 韩语包

// 自定义语言包
import customZH from './zh' // 引入自定义中文包
import customEN from './en' // 引入自定义英文包

Vue.use(VueI18n) // 完成 i18n的全局注册
export default new VueI18n({
  // i18n的选项
  // locale-参数1：指的是当前多语言的类型 可随意定义的字符串 中 / 英 ......
  // message-参数2：指的是当前的语言包
  locale: Cookie.get('language') || 'zh', // 从cookie中获取语言类型 获取不到就是中文
  messages: {
    en: {
      ...customEN,
      ...elementEN // 将饿了么的英文语言包引入
    },
    zh: {
      ...customZH,
      ...elementZH // 将饿了么的中文语言包引入
    },
    ko: {
      ...elementKO
    }
  }
})
