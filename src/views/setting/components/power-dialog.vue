<!-- 抽离分配权限的弹层组件 -->
<template>
  <el-dialog title="分配权限" :visible="showPermDialog" @close="btnPermCancel">
    <!-- 权限树 -> 将数据绑定到组件上 -->
    <!-- default-expand-all =>是否默认展开所有节点 -->
    <!-- show-checkbox =>	节点是否可被选择 -->
    <!-- check-strictly => 为 true 表示父子勾选时，不相互关联 -->
    <!-- node-key => 每个树节点用来作为唯一标识的属性 （用id作为唯一标识） -->
    <!-- default-checked-keys => 默认勾选的节点的 key 的数组 -->
    <el-tree
      ref="permTree"
      :data="permData"
      :props="defaultProps"
      :default-expand-all="true"
      :show-checkbox="true"
      :check-strictly="true"
      node-key="id"
      :default-checked-keys="selectCheck"
    />

    <!-- 确定 取消按钮 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnPermOK">确定</el-button>
        <el-button size="small" @click="btnPermCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { assignPerm } from '@/api/setting'
export default {
  name: 'PowerDialog',
  props: {
    roleId: {
      type: String,
      default: ''
    },
    showPermDialog: {
      type: Boolean,
      default: false
    },
    permData: {
      type: Array,
      // 引用类型，设置默认值的时候，需要是一个工厂函数返回的样子
      default: () => []
    },
    selectCheck: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      defaultProps: { // 定义显示字段的名称 和 子属性的字段名称
        label: 'name'
      }
    }
  },
  methods: {
    async btnPermOK() {
      // const inputParams = {
      //   id: this.roleId,
      //   // getCheckedKeys 可以获取到所有选中的节点的 key 的集合
      //   permIds: this.$refs.permTree.getCheckedKeys()
      // }
      // await assignPerm(inputParams)
      await assignPerm({ permIds: this.$refs.permTree.getCheckedKeys(), id: this.roleId })
      this.$message.success('分配权限成功')
      this.$emit('update:showPermDialog', false)
    },
    btnPermCancel() {
      // 原则上，都需通知父组件更新数据
      this.$emit('update:select-check', [])
      this.$emit('update:showPermDialog', false)
      this.$emit('update:role-id', '')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
