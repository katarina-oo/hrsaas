<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancel">
    <!-- 多选框组 -->
    <!-- el-checkbox-group选中的是 当前用户所拥有的角色  需要绑定 当前用户拥有的角色-->
    <el-checkbox-group v-model="roleIds">
      <!-- 要显示的是角色名称，存储的是角色id label表示要存储 -->
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>

    <!-- 定义 footer 的插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    userId: { // 当前要处理的用户的 id
      type: String,
      default: null
    }
  },
  data() {
    return {
      list: [], // 负责存储当前所有的角色id
      roleIds: [] // 负责存储 当前用户所拥有的角色id
    }
  },
  created() {
    // 获取所有的角色
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      // rows -> 是要循环的 记录
      const { rows } = await getRoleList({ page: 1, pagesize: 20 }) // 默认角色数据 最多 20 条 (通常是不会太多的)
      this.list = rows
    },
    // 这个方法的调用 -> props传值异步，因此不能用 this.userId
    async getUserDetailById(id) {
      const { roleIds } = await getUserDetailById(id) // 将用户拥有的角色赋值给当前用户的对象
      this.roleIds = roleIds
    },
    async btnOK() {
      await assignRoles({ id: this.userId, roleIds: this.roleIds })
      this.$message.success('分配角色成功')
      this.$emit('update:showRoleDialog', false)
    },
    btnCancel() {
      this.roleIds = [] // 清空原来的数组
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>
