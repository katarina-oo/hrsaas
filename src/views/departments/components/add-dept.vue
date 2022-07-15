<template>
  <!-- 新增部门的弹层 -->
  <el-dialog :title="showTitle" :visible="showDialog" class="el_dialog" @close="btnCancel">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form ref="deptForm" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input
          v-model="formData.name"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>

      <el-form-item label="部门编码" prop="code">
        <el-input
          v-model="formData.code"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>

      <el-form-item label="部门负责人" prop="manager">
        <el-select
          v-model="formData.manager"
          style="width: 80%"
          placeholder="请选择"
          class="el_select"
          @focus="getEmployeeSimple"
        >
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>

      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          v-model="formData.introduce"
          style="width: 80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
        />
      </el-form-item>
    </el-form>

    <!-- 确定 - 取消 按钮 -->
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <!-- 使用 el-row -> 支持 flex 布局 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  // 传入一个props变量来控制 显示或者隐藏
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    // 当前操作的节点
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    // 自定义一个校验规则函数 -> 去找同级部门下 是否有重复的部门名称
    const checkNameRepeat = async(rule, value, callback) => {
      // value -> 是部门名称，要和同级部门下的部门去比较，有相同的 不能过 / 不相同才可以过
      const { depts } = await getDepartments() // 先要获取最新的组织架构数据
      // 去找同级部门下，有没有和 value 相同的数据
      // 找到同级部门所有的子部门 console.log(depts.filter(item => item.pid === this.treeNode.id))
      let isRepeat = false // 定义一个是否重复的默认值
      if (this.formData.id) {
        // 有 id 就是编辑模式 -> 1.先找同事（他们的 pid 都是一样的） -> 2.剔除自己 -> 3.再看剩下的人跟我刚刚书写的部门名称是否一样 -> 一样 ? 有提示不通过 : 通过
        // 编辑的数据，在数据库里有，要判断同级部门下，我的名字不能和其他的同级部门的名字进行重复
        // 首先要找到我的同级部门 this.formData.id 就是我当前的id 我的pid是 this.formData.pid
        // depts.filter(item => item.pid === this.treeNode.pid && item.id) // 找到我所有同级部门的数据 -> 包含我自己，需要排除掉，才能不重复
        // .some(item => item.name === value) 找同级目录下有没有name 和 我的name 相同
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      } else {
        // 没有 id 就是新增模式
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }
      // 如果 isRepeat 为 true -> 表示名字相同 不通过
      isRepeat ? callback(new Error(`同级部门下已经存在这个${value}部门了`)) : callback()
    }
    // 自定义校验规则 -> 检查部门编码
    const checkCodeRepeat = async(rule, value, callback) => {
      // 先要获取最新的组织架构数据
      const { depts } = await getDepartments()

      let isRepeat = false
      if (this.formData.id) {
        // 编辑模式
        isRepeat = depts.filter(item => item.id !== this.treeNode.id).some(item => item.code === value && value)
      } else {
        // 新增模式下
        // 这里加一个 value不为空 因为我们的部门有可能 有的 code 是空的
        isRepeat = depts.some(item => item.code === value && value)
      }
      // 要求编码 和 所有的部门编码都不能重复
      isRepeat ? callback(new Error(`组织架构下已经存在这个${value}编码了`)) : callback()
    }
    return {
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      // 定义校验规则
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' },
          { trigger: 'blur', validator: checkNameRepeat }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' },
          { trigger: 'blur', validator: checkCodeRepeat }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 300, message: '部门介绍要求1-50个字符', trigger: 'blur' }
        ]
      }, // 校验规则 { key: 数组 }

      peoples: [] // 定义接收获取的员工简单列表的数据
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增部门'
    }
  },
  methods: {
    // 获取员工简单列表数据
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    },
    // 获取表单详情的方法
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id)
      // 因为父组件调用子组件的方法，先设置了 node数据，直接调用方法
      // props传值是异步的
    },
    btnOK() {
      this.$refs.deptForm.validate(async isOK => {
        if (isOK) {
          if (this.formData.id) {
            await updateDepartments(this.formData)
          } else {
            // 表单校验通过，将 id 设成 pid
            await addDepartments({ ...this.formData, pid: this.treeNode.id }) // 调用新增接口 添加父部门的id
          }
          // 表单校验通过，将 id 设成 pid
          // await addDepartments({ ...this.formData, pid: this.treeNode.id }) // 调用新增接口 添加父部门的id
        }
        this.$message.success('新增部门成功')
        // 在新增成功之后，触发一个自定义事件，调用告诉父组件，重新拉取数据
        this.$emit('addDepts')

        // 然后去修改 showDialog值(控制弹出层)
        this.$emit('update:showDialog', false)
      })
    },
    // 关闭弹层
    btnCancel() {
      this.formData = {
        // 重置数据 因为 resetFields 只能重置 表单上的数据 (编辑中的id 不能重置)
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      this.$emit('update:showDialog', false)
      // resetFields() -> 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      // 清除之前的校验 (可以重置数据，只能重置定义在 formData 中的数据)
      // resetFields 仅仅是对具有校验规则的属性有效，对于一些特色数据可能还是需要手动清空数据
      this.$refs.deptForm.resetFields()
    }
  }

}
</script>

<style lang="scss" scoped>
.el_select{
  width: 100px;
}
.el_dialog{
  text-align: center;
}
</style>
