<template>
  <!-- trigger="click" 点击时显示下拉菜单 -->
  <el-dropdown trigger="click" @command="changeLanguage">
    <!-- 这里必须加一个div -->
    <div>
      <svg-icon style="color:#fff;font-size:20px" icon-class="language" />
    </div>
    <!-- 下拉图标 -->
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="zh" :disabled="'zh'=== $i18n.locale ">中文</el-dropdown-item>
      <el-dropdown-item command="en" :disabled="'en'=== $i18n.locale ">en</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import Cookie from 'js-cookie'
export default {
  methods: {
    changeLanguage(type) {
      // 设置的类型 先写入到 cookie缓存
      Cookie.set('language', type) // 写入 cookie缓存
      // 改变当前的多语言
      this.$i18n.locale = type // 将当前的多语言类型改成对应的类型
      this.$message.success('切换多语言成功')
    }
  }
}
</script>
