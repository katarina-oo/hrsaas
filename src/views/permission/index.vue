<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <page-tools>
        <template v-slot:after>
          <el-button type="primary" size="small">添加权限</el-button>
        </template>
      </page-tools>

      <!-- 表格 -->
      <el-table border :data="list" row-key="id">
        <el-table-column align="center" label="名称" prop="name" />
        <el-table-column align="center" label="标识" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <template v-slot="{ row }">
            <el-button v-if="row.type === 1" type="text" @click="addPermission(row.id, 2)">添加</el-button>
            <el-button type="text" @click="editPermission(row.id)">编辑</el-button>
            <el-button type="text" @click="delPermission(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增编辑弹层 -->
    <el-dialog :visible="showDialog" :title="showText" @close="btnCancel">
      <el-form ref="permForm" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="名称" style="width:90%" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>

        <el-form-item label="标识" style="width:90%" prop="code">
          <el-input v-model="formData.code" />
        </el-form-item>

        <el-form-item label="描述" style="width:90%">
          <el-input v-model="formData.description" />
        </el-form-item>

        <el-form-item label="开启">
          <!-- 当值 为1 => 激活 为0 -=> 不激活 -->
          <el-switch
            v-model="formData.enVisible"
            inactive-value="0"
            active-value="1"
          />
        </el-form-item>
      </el-form>

      <!-- 底部的确定和取消 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnOK">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { tranListToTreeData } from '@/utils/index'
import { getPermissionList, delPermission, addPermission, getPermissionDetail, updatePermission } from '@/api/permisson'
export default {
  name: 'Permission',
  data() {
    return {
      list: [],
      showDialog: false,
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    showText() {
      return this.formData.id ? '编辑权限' : '新增权限'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList() { // 将数据转化成了 带 chilren的树形结构
      this.list = tranListToTreeData(await getPermissionList(), '0')
    },
    async delPermission(id) { // 删除功能
      try {
        await this.$confirm('确定删除该数据吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await delPermission(id)
        this.$message.success('删除数据成功')
        this.getPermissionList() // 重新拉取数据
      } catch (error) {
        console.log(error)
      }
    },
    async editPermission(id) { // 编辑
      this.formData = await getPermissionDetail(id)
      this.showDialog = true
    },
    // 两个添加按钮是不同的
    /** **
      * 添加访问权限 的 type = 1
      * 按钮操作权 的 type = 2
      * 传入的两个值 type 表示 leix
      * pid 表示当前数据的父节点的标识
    * ****/
    addPermission(type, pid) { // 新增
      // 记录当前添加的类型和父标识
      this.formData.type = type
      this.formData.pid = pid
      this.showDialog = true
    },
    btnOK() { // 确定
      this.$refs.permForm.validate().then(() => {
        // 校验成功 调 新增接口
        if (this.formData.id) {
          // 验证成功后认为有 id => 是编辑
          return updatePermission(this.formData)
        }
        return addPermission(this.formData)
      }).then(() => {
        this.$message.success('新增成功')
        this.getPermissionList() // 重新拉取数据
        this.showDialog = false
      })
    },
    btnCancel() { // 取消
      // 重置数据
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      this.$refs.permForm.resetFields() // 移除校验
      this.showDialog = false
    }
  }
}
</script>

<style>

</style>
