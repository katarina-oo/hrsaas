<template>
  <!-- 公共导入组件 -->
  <UploadExcel :on-success="success" />
</template>

<script>
import { importEmployee } from '@/api/employees'
export default {
  methods: {
    async success({ header, results }) {
      // header 和 results 中的数据是中文 -> 转成 英文
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName',
        '聘用形式': 'formOfEmployment'
      }

      // var arr = []
      // results.forEach(item => {
      //   var userInfo = {}
      //   Object.keys(item).forEach(key => {
      //     // 现在 key 是中文 调用封装的 数据转换
      //     userInfo[userRelations[key]] = item[key] // 将原来中文对应的值 赋值给原来英文对应的值
      //   })
      //   arr.push(userInfo)
      // })

      // 另一个方法
      var newArr = results.map(item => {
        var userInfo = {}
        Object.keys(item).forEach(key => {
          if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
            // 后台端口 限制了 -> 不能是字符串 要求转换成字符串类型
            userInfo[userRelations[key]] = new Date(this.formatDate(item[key], '/')) // 只有这样才能入库
          } else {
            userInfo[userRelations[key]] = item[key] // 将原来中文对应的值，赋值给原来英文对应的值
          }
        })
        return userInfo
      })
      await importEmployee(newArr) // 接收一个数组
      this.$message.success('导入excel成功')
      this.$router.back() // 回到上一个页面
    },
    // 转化 excel 的日期格式
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
