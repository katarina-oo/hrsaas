<!-- 抽离 - 弹层组件 -->
<template>
  <!-- close事件，在点击确定的时候会触发 -->
  <el-dialog :title="title" :visible="showDialog" class="tit" @close="btnCancel">
    <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
      <el-form-item prop="name" label="角色名称">
        <el-input v-model="roleForm.name" />
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input v-model="roleForm.description" />
      </el-form-item>
    </el-form>

    <!-- 底部两个按钮 -> 放置 footer 插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="8">
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button size="small" type="primary" @click="btnOK">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleDetail, updateRole, addRole } from '@/api/setting'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      roleForm: {
        name: '', // 角色名称
        description: '' // 角色描述
      },
      // 表单的校验规则
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    title() {
      return this.roleForm.id ? '编辑角色' : '添加角色'
    }
  },
  methods: {
    async loadDeatil(id) {
      this.roleForm = await getRoleDetail(id) // 实现数据的回显
    // this.isShow = true
    },
    async btnOK() {
      try {
        await this.$refs.roleForm.validate()
        // 只有校验通过的情况下，才会执行 await 的下方内容
        // roleForm这个对象 有id 就是编辑 没有id 就是新增
        if (this.roleForm.id) {
          // 编辑
          await updateRole(this.roleForm)
        } else {
          // 新增
          await addRole(this.roleForm)
        }

        this.$message.success(`${this.roleForm.id ? '编辑' : '添加'}角色成功`)
        this.$emit('updatelist')

        // this.$emit('input', false)
        this.$emit('update:showDialog', false)

        // 重新拉取数据
        // this.getRoleList()
        // this.showDialog = false // 关闭弹层 -> 会触发 el-dialog的 close 事件
      } catch (error) {
        console.log(error)
      }
    },
    btnCancel() {
      this.roleForm = { // 取消时，清空数据
        name: '', // 角色名称
        description: '' // 角色描述
      }
      // 移除校验规则
      this.$refs.roleForm.resetFields()
      // 关闭弹框
      // this.$emit('input', false)
      this.$emit('update:showDialog', false) // 用 .sync
    }
  }
}
</script>

<style lang="scss" scoped>
.tit{
  text-align: center;
}
</style>
