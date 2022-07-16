<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs v-model="activeName" type="border-card">

          <!-- 左侧角色管理 -->
          <el-tab-pane label="角色管理" name="role">
            <el-row style="height:60px">
              <el-button
                round
                icon="el-icon-plus"
                type="primary"
                size="small"
                @click="showDialog = true"
              >
                新增角色
              </el-button>
            </el-row>

            <!-- 表格 -->
            <el-table border="" :data="list">
              <el-table-column type="index" align="center" label="序号" width="120" />
              <el-table-column prop="name" align="center" label="角色名称" width="240" />
              <el-table-column prop="description" align="center" label="描述" />
              <el-table-column align="center" label="操作">

                <!-- 使用作用域插槽 -->
                <template slot-scope="{ row }">
                  <el-button size="small" type="success" round>分配权限</el-button>
                  <!-- 新增按钮 -->
                  <el-button size="small" type="primary" icon="el-icon-plus" circle @click="showDialog = true" />
                  <!-- 编辑按钮 -->
                  <el-button size="small" type="primary" icon="el-icon-edit" circle @click="editRole(row.id)" />
                  <!-- 删除按钮 -->
                  <el-button size="small" type="danger" icon="el-icon-delete" circle @click="deleteRole(row.id)" />
                </template>

              </el-table-column>
            </el-table>

            <!-- 放置完整功能的分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height:60px">
              <el-pagination
                background
                :total="page.total"
                :page-size="page.pagesize"
                :current-page="page.page"
                layout="total, sizes, prev, pager, next, jumper"
                :page-sizes="[5, 10, 15, 20]"
                @current-change="changePage"
                @size-change="handleSizeChange"
              />
            </el-row>

          </el-tab-pane>

          <!-- 右侧公司信息 -->
          <el-tab-pane label="公司信息">
            <!-- Alert 提示信息 -->
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              :show-icon="true"
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="企业名称">
                <el-input v-model="formData.name" disabled class="w400" />
              </el-form-item>

              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" class="w400" disabled />
              </el-form-item>

              <el-form-item label="公司电话">
                <el-input v-model="formData.companyPhone" class="w400" disabled />
              </el-form-item>

              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" class="w400" disabled />
              </el-form-item>

              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" class="w400" :rows="3" disabled />
              </el-form-item>
            </el-form>
          </el-tab-pane>

        </el-tabs>
      </el-card>
    </div>

    <!-- 抽离 - 弹层组件 -->
    <!-- <RoleDialog ref="roleRef" v-model="showDialog" @updatelist="getRoleList" /> -->
    <RoleDialog ref="roleRef" :show-dialog.sync="showDialog" @updatelist="getRoleList" />

  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole } from '@/api/setting'
import { mapGetters } from 'vuex'
import RoleDialog from './components/role-dialog.vue'
export default {
  name: 'Setting',
  components: {
    RoleDialog
  },
  data() {
    return {
      activeName: 'role', // 选中选项卡的 name(打开页面显示第一个 带有name 选项卡)
      list: [], // 承接数组
      // 放置页码及相关数据
      page: {
        page: 1, // 当前页码请求页
        pagesize: 5, // 一页显示几个
        total: 0 // 记录总数
      },
      formData: {}, // 存放公司信息
      showDialog: false // 控制弹层是否显示（默认关闭）
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRoleList() // 获取角色列表
    this.getCompanyInfo() // 获取公司信息
  },
  methods: {
    async getRoleList() { // 获取角色列表数据
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
    },
    async getCompanyInfo() { // 获取公司信息数据
      this.formData = await getCompanyInfo(this.companyId)
    },
    changePage(newPage) { // currentPage 改变时会触发
      this.page.page = newPage // 将当前页码赋值给当前的最新页码
      this.getRoleList() // 重新拉取数据
    },
    handleSizeChange(val) { // pageSize 改变时会触发
      this.page.pagesize = val
      this.getRoleList() // 重新拉取数据
    },
    async deleteRole(id) { // 调用删除接口，实现删除功能
      try {
        await this.$confirm('靓仔确定删除吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        // 只有点击了确定 才进入到下方
        await deleteRole(id) // 调用删除接口
        this.$message.success('删除角色成功')
        this.getRoleList() // 重新加载数据

        // 判断当删除的角色是当前页的最后一条数据时，page -1，如果在第一页，就不需要 -1
        if (this.list.length === 1 && this.page.page > 1) {
          this.page.page--
        }
      } catch (error) {
        console.log(error)
      }
    },
    async editRole(id) {
      await this.$refs.roleRef.loadDeatil(id)
      // 打开弹框（短暂的白屏的问题了）
      this.showDialog = true // 显示弹层
    }
  }
}
</script>

<style scoped>
.el-pagination {
  text-align: center;
  margin-top: 20px;
}
  .w400 {
    width:400px
  }
</style>
