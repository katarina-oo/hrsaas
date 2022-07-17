<template>
  <el-dialog title="新增员工" :visible="showDialog" class="tit" @close="btnCancel">
    <!-- 表单 -->
    <el-form ref="addEmployee" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" placeholder="请选择入职时间" />
      </el-form-item>

      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" placeholder="请选择">
          <!-- 遍历只能遍历组件的数据 -->
          <el-option
            v-for="item in EmployeeEnum.hireType"
            :key="item.id"
            :label="item.value"
            :value="item.id"
            @node-click="selectNode"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" placeholder="请输入工号" />
      </el-form-item>

      <el-form-item label="部门" prop="departmentName">
        <!-- <el-input v-model="formData.departmentName" placeholder="请选择部门" /> -->
        <!-- 使用级联选择器实现 -->
        <el-cascader
          v-model="selectedDepts"
          v-loading="loading"
          placeholder="请选择部门"
          :options="treeData"
          :props="{ expandTrigger: 'hover', value: 'name', label: 'name' }"
          @change="onChangeDept"
          @focus="getDepartments"
        />
      </el-form-item>

      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" placeholder="请选择转正时间" />
      </el-form-item>
    </el-form>

    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import EmployeeEnum from '@/api/constant/employees'
import { getDepartments } from '@/api/departments' // 获取组织架构数据
import { tranListToTreeData } from '@/utils/index' // 调用 将列表型的数据转化成树形数据的方法
import { addEmployee } from '@/api/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      EmployeeEnum, // 在data中定义数据

      treeData: [], // 定义数组接收树形数据
      showTree: false, // 控制树形的显示或者隐藏
      loading: false, // 控制树的显示或者隐藏进度条
      selectedDepts: [],

      // 定义表单数据
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' },
          { min: 1, max: 4, message: '用户姓名为1~4位！', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          // pattern 正则表达式 如果满足 -> 通过校验，不满足 -> 不通过
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间不能为空', trigger: 'blur' }],
        correctionTime: [{ required: true, message: '转正时间不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    selectNode(node) { // 节点被点击时的回调
      this.formData.departmentName = node.name
      this.showTree = false
    },
    async getDepartments() {
      this.showTree = true
      this.loading = true

      // depts 是一个数组，他需要转化成树形结构，才可以被 el-tree 显示
      const { depts } = await getDepartments()
      // 调用递归方法的 将 列表型的数据转化成树形数据
      this.treeData = tranListToTreeData(depts, '')

      this.loading = false
    },
    async btnOK() {
      // 校验表单
      try {
        await this.$refs.addEmployee.validate()
        // 校验成功后
        await addEmployee(this.formData) // 调用新增接口

        this.$message.success('添加数据成功')
        // 通知父组件 更新数据
        // this.$parent -> 父组件的实例
        this.$parent.getEmployeeList && this.$parent.getEmployeeList() // 直接调用父组件的更新方法
        this.$emit('update:showDialog', false)
      } catch (error) {
        console.log(error)
      }
    },
    btnCancel() {
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      this.$refs.addEmployee.resetFields() // 移除之前的校验
      this.selectedDepts = []
      this.$emit('update:showDialog', false)
    },
    onChangeDept(vals) { // 当选中节点变化时触发
      this.formData.departmentName = vals[vals.length - 1]
    }
  }
}
</script>

<style scoped>
.tit{
  text-align: center;
}
 .el-date-picker, .el-select, .el-cascader {
  width: 100%;
}
.el-date-editor.el-input, .el-date-editor.el-input__inner {
  width: 100%;
}
</style>
