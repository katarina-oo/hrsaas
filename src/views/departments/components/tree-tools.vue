<template>
  <!-- 用了一个行列布局放置结构内容 -->
  <el-row type="flex" justify="space-between" align="middle" style="height: 40px; width: 100%">
    <!-- 左侧内容 -->
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>

    <!-- 右侧内容 -->
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <!-- 下拉菜单 -->
          <el-dropdown @command="operateDepts">
            <!-- 内容 -->
            <span>
              操作
              <i class="el-icon-arrow-down" />
            </span>
            <!-- 具名插槽 -->
            <el-dropdown-menu slot="dropdown">
              <!-- 下拉选项 -->
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <!-- 编辑部门和删除部门只会在子节点上显示 -->
              <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'

// 该组件需要对外开放属性 外部需要提供一个对象 对象里需要有name  manager
export default {
  // props可以用数组来接收数据 也可以用对象来接收
  // props: { props属性: { 配置选项 } }
  props: {
    // 定义一个props属性
    treeNode: {
      type: Object, // 对象类型
      required: true // 必传项
    },
    // 增加一个新的属性 isRoot（是否根节点）进行控制 -> 不需要显示 删除部门和编辑部门
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 操作节点调用的方法 (使用的 switch)
    // 点击 编辑 删除 新增时触发
    operateDepts(type) {
      switch (type) {
        case 'add':
          // 添加逻辑
          // 传出 this.treeNode => 就是当前点击的部门
          this.$emit('addDepts', this.treeNode) // 触发自定义事件，告诉父组件，显示弹出层, 并传出 treeNode
          break
        case 'edit':
          // 编辑逻辑
          this.$emit('editdepts', this.treeNode)
          break
        case 'del':
          // 删除逻辑 -> 通常都会有确认提醒
          this.$confirm('靓仔确定删除吗', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            return delDepartments(this.treeNode.id)
          }).then(() => {
          // 已经成功删除了员工数据，后端 -> 数据变化了，前端 -> 应通知父组件进行更新
            this.$emit('delDepts')// 触发自定义事件
            this.$message.success('删除部门成功')
          })
          break
        default:
          break
      }
    }
  }
}
</script>
