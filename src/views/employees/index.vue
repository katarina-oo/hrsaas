<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <!-- 左侧显示总记录数 -->
        <span slot="before">共{{ page.total }} 条记录</span>

        <!-- 右侧显示按钮 -->
        <template slot="after">
          <el-button size="small" type="warning" @click="$router.push('/import?type=user')">excel导入</el-button>
          <el-button size="small" type="danger" @click="exportData">excel导出</el-button>
          <el-button size="small" type="primary" @click="showDialog = true">新增员工</el-button>
        </template>
      </page-tools>

      <!-- 放置表格和分页 -->
      <el-card>
        <el-table v-loading="loading" :data="list" border>
          <!-- sortable 可以以该列为基准的排序 -->
          <el-table-column label="序号" sortable type="index" width="70" />
          <el-table-column label="姓名" sortable prop="username" />

          <!-- 添加一列显示员工头像 -->
          <el-table-column width="120px" label="头像" align="center">
            <!-- 插槽 -->
            <template v-slot="{ row }">
              <img
                v-imageerror="require('@/assets/common/11.gif')"
                :src="row.staffPhoto"
                alt=""
                style="border-radius: 50%; width: 100px; height: 100px; padding: 10px"
                @click="showQrCode(row.staffPhoto)"
              >
            </template>
          </el-table-column>

          <el-table-column label="工号" sortable prop="workNumber" />
          <!-- el-table-column 的 formatter：可以序列化某一列的某一个单元格的值 -->
          <el-table-column label="聘用形式" sortable prop="formOfEmployment" :formatter="formatEmployment" />
          <el-table-column label="部门" sortable prop="departmentName" />

          <!-- 入职时间：作用域插槽 + 过滤器 -->
          <el-table-column label="入职时间" sortable prop="timeOfEntry">
            <template v-slot="{ row }">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>

          <el-table-column label="账户状态" sortable prop="enableState">
            <template v-slot="{ row }">
              <!-- 根据当前状态来确定 是否打开开关 -->
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>

          <el-table-column label="操作" sortable fixed="right" width="280">
            <template slot-scope="{ row }">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
              <el-button type="text" size="small" @click="delEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 放置完整功能的分页组件 -->
        <el-row type="flex" justify="center">
          <el-pagination
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[5, 10, 15, 20, 25, 30]"
            :page-size="page.size"
            :current-page="page.page"
            :total="page.total"
            @current-change="changePage"
            @size-change="handleSizeChange"
          />
        </el-row>
      </el-card>
    </div>

    <!-- 放置主键弹层 -->
    <add-employee :show-dialog.sync="showDialog" />

    <el-dialog title="二维码" :visible.sync="showCodeDialog">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>

    <!-- 放置分配组件 -->
    <AssignRole ref="assignRole" :show-role-dialog.sync="showRoleDialog" :user-id="userId" />
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees' // 引入员工的枚举对象
import AddEmployee from './components/add-employee.vue'
import { formatDate } from '@/filters/index'
import QrCode from 'qrcode'
import AssignRole from './components/assign-role.vue'
export default {
  name: 'Employees',
  components: {
    AddEmployee,
    AssignRole
  },
  data() {
    return {
      list: [], // 接收数组
      page: {
        page: 1, // 页码
        size: 10, // 每页条数
        total: 0 // 总数
      },
      loading: false, // 显示遮罩层
      showCodeDialog: false, // 显示二维码弹层
      showDialog: false, // 弹层默认关闭
      showRoleDialog: false, // 显示分配角色弹出
      userId: null // 定义一个 userId (传给 子组件)
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    changePage(newPage) { // pageSize 改变时会触发
      this.page.page = newPage
      this.getEmployeeList()
    },
    handleSizeChange(val) { // currentPage 改变时会触发
      this.page.size = val
      this.getEmployeeList() // 调用 重新拉取数据
    },
    async getEmployeeList() { // 获取员工列表数据的方法
      this.loading = true

      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows

      this.loading = false
    },
    /*
      row: 当前行的数据，一个对象
      column: 列的属性
      cellValue: 当前单元格的值 ，每一行内 聘用形式的值
    */
    formatEmployment(row, column, cellValue, index) {
      // 找 1 在聘用形式内 所对应的值
      const obj = EmployeeEnum.hireType.find(item => item.id === +cellValue)
      return obj ? obj.value : '未知'
    },
    async delEmployee(id) { // 调用删除接口，实现删除功能
      try {
        await this.$confirm('靓仔确定删除该叼毛吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await delEmployee(id)
        this.$message.success('删除员工成功')
        this.getEmployeeList() // 重新拉取数据

        // 判断当删除的角色是当前页的最后一条数据时，page -1，如果在第一页，就不需要 -1
        if (this.list.length === 1 && this.page.page > 1) {
          this.page.page--
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 导出excel数据
    exportData() {
      // 表头对应关系
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 懒加载
      import('@/vendor/Export2Excel').then(async excel => {
        // excel是引入文件的导出对象
        // 导出 -> header 从 Object.keys(headers)
        // data 从：
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        const data = this.formatJson(headers, rows) // 返回的 data 就是要导出的结构
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']] // 导出复杂表头
        const merges = ['A1:A2', 'B1:F1', 'G1:G2'] // 实现其合并的效果， 需要设定merges选项
        excel.export_json_to_excel({
          header: Object.keys(headers),
          // data: []
          data,
          filename: '员工信息表',
          autoWidth: true,
          bookType: 'xlsx',
          multiHeader, // 复杂表头
          merges // 合并选项
        })

        // excel.export_json_to_excel({
        //   // 要转换 数据结构 -> 需要和表头的顺序对应上
        //   // 要求转出标题是中文
        //   header: ['姓名', '工资'],
        //   // data: [[]], [[]]
        //   data: [['张三', 12000], ['李四', 5000]],
        //   filename: '员工薪资表',
        //   autoWidth: true
        // })
      })
    },
    // 将表头数据和数据进行对应
    // 该方法负责将数组转化成二维数组 [{}] --> [[]]
    formatJson(headers, rows) {
      return rows.map(item => { // item -> 是一个对象 样式=> { mobile: 132111,username: '张三'  }
        return Object.keys(headers).map(key => { // 得到的结果 -> ["手机号", "姓名", "入职日期" ......]
        // 到处时需要判断 字段
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
          // 格式化 日期
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            const obj = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
            // return obj ? obj.value : '未知'
            // ?. 可选链操作符 ?? 空值合并操作符 (左侧的值只有是 null 或 undefined 时，才会返回右侧的值)
            return obj?.value ?? '未知'
          }
          return item[headers[key]]
        })
      })
      // 可简写 但因需处理导出时的 时间格式问题，因此不可简写
      // return rows.map(item => Object.keys(headers).map(key => item[headers[key]]))
    },
    showQrCode(url) {
      // url存在的情况下，才弹出
      if (url) {
        this.showCodeDialog = true
        this.$nextTick(() => {
          QrCode.toCanvas(this.$refs.myCanvas, url) // 将地址转化成二维码
          // 如果转化的二维码后面信息 是一个地址的话 就会跳转到该地址 如果不是地址就会显示内容
        })
      } else {
        this.$message.warning('该用户还未上传头像')
      }
    },
    async editRole(id) {
      this.userId = id // 是给 props 赋值渲染 -> 异步
      await this.$refs.assignRole.getUserDetailById(id) // 调用子组件方法(异步方法) 传入id 把子组件的角色赋值给 roleIds，roleIds又绑定给了多选框组
      this.showRoleDialog = true
    }
  }
}
</script>

<style scoped>
.el-pagination {
  text-align: center;
  margin-top: 20px;
}
</style>
