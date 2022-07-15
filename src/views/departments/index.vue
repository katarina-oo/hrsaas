<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构内容 - 头部 -->
      <el-card class="tree-card">
        <!-- 放置解构内容 -->
        <tree-tools :tree-node="company" :is-root="true" @addDepts="addDepts" />
        <!-- 放置一个 <el-tree></el-tree> -->
        <!-- default-expand-all => 是否默认展开所有节点 -->
        <el-tree
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
        >
          <!-- 传入内容，插槽 -> 会循环多次(有多少节点，就循环多少次) -->
          <!-- 作用域插槽 -> slot-scope="{ node, data }" 接收传递给插槽的数据 -->
          <!-- 解构的 data -> 就是每个节点的数据对象 -->
          <tree-tools slot-scope="{ data }" :tree-node="data" @delDepts="getDepartments" @addDepts="addDepts" @editdepts="editdepts" />
        </el-tree>
      </el-card>

      <!-- 放置新增弹层组件 -->
      <add-dept ref="addDept" :show-dialog.sync="showDialog" :tree-node="node" @addDepts="getDepartments" />
    </div>
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
import AddDept from './components/add-dept' // 引入新增部门组件
export default {
  name: 'Departments',
  components: {
    TreeTools,
    AddDept
  },
  data() {
    return {
      company: { name: '', manager: '' },
      departs: [],
      defaultProps: {
        label: 'name' // 从这个属性显示内容
      },
      showDialog: false, // 默认不显示
      node: null, // 记录当前点击的node节点
      loading: false // 用来控制进度弹层的显示和隐藏
    }
  },
  created() {
    this.getDepartments() // 调用自身方法
  },
  methods: {
    // 获取组织架构数据（封装一个方法）
    async getDepartments() {
      this.loading = true

      const res = await getDepartments()
      // 在最根级的tree-tools组件中，由于treenode属性中没有id，id便是undefined，但是通过undefined进行等值判断是寻找不到对应的根节点的， 所以在传值时，我们将id属性设置为 ''
      this.company = { name: res.companyName, manager: '负责人', id: '' }
      this.departs = tranListToTreeData(res.depts, '') // 数据扁平化了 -> 需要转化成树形结构

      this.loading = false
    },
    // 监听tree-tools中触发的点击添加部门的事件
    addDepts(node) {
      this.showDialog = true // 显示弹出层
      this.node = node // 接收添加部门的 pid
    },
    async editdepts(node) {
      this.node = node // 接收添加部门的 pid
      // console.log(this.$refs.addDept)

      // 小优化 点击编辑，回显时的短暂空白
      await this.$refs.addDept.getDepartDetail(node.id)
      this.showDialog = true // 显示弹出层
    }
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px  140px;
  font-size:14px;
}
</style>
