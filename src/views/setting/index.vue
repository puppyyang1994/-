<template>
  <div class="setting-container">
    <div class="app-container">
      <!-- card卡片组件 -->
      <el-card class="box-card">
        <!-- tabs组件完成标签页 -->
        <el-tabs v-model="activeName">
          <el-tab-pane label="角色管理" name="first" class="tab-pane">
            <!-- 布局组件 -->
            <!-- 新增角色按钮 -->
            <el-row style="height:60px">
              <el-button type="primary" icon="el-icon-plus" size="small" @click="addRoleBtnFn">新增角色</el-button>
            </el-row>
            <!-- 使用table组件实现用户角色的渲染 -->
            <el-table border style="width: 100%" :data="rolesList">
              <el-table-column
                type="index"
                label="序号"
                width="120"
              />
              <el-table-column
                prop="name"
                label="角色名"
                width="240"
              />
              <el-table-column
                prop="description"
                label="描述"
              />
              <el-table-column
                label="操作"
              ><template slot-scope="scope">
                <el-button size="small" type="success" @click="setRoles(scope.row)">分配权限</el-button>
                <el-button size="small" type="primary" @click="editRoles(scope.row)">编辑</el-button>
                <el-button size="small" type="danger" @click="delRoles(scope.row)">删除</el-button>
              </template>
              </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination
              :current-page="query.page"
              :page-sizes="[10,15,20,25]"
              :page-size="query.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </el-tab-pane>
          <el-tab-pane label="公司信息" class="tab-pane">
            <!-- 布局组件 -->
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form ref="form" :model="formData" label-width="120px" style="margin-top: 50px;">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" disabled style="width: 400px;" />
              </el-form-item>
              <el-form-item

                label="公司地址"
              >
                <el-input v-model="formData.companyAddress" disabled style="width: 400px;" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width: 400px;" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="formData.remarks"
                  type="textarea"
                  :rows="3"
                  disabled
                  style="width: 400px;"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <!-- el-dialog对话框 -->
      <!-- 实现弹框提示改变 -->
      <el-dialog
        :title="isEdit? '编辑角色' : '新增角色'"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="closeRoleDialog"
      >
        <el-form ref="roleForm" :model="roleForm" :rules="roleRules" label-width="100px">
          <el-form-item label="角色名称"><el-input v-model="roleForm.name" />
          </el-form-item>
          <el-form-item label="角色描述"><el-input v-model="roleForm.description" />
          </el-form-item>
        </el-form>

        <!-- 底部 -->
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" @click="cancelRoles">取消</el-button>
            <el-button size="small" type="primary" @click="roleSubmit">确定</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getCompanyInfoAPI, getRolesAPI, addRoleAPI, getRoleIdAPI, updateRoleAPI, deleteRoleAPI } from '@/api'

import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      activeName: 'first',
      query: {
        page: 1, // 当前页面
        pagesize: 10 // 页面显示的条数
      },
      rolesList: [], // 角色列表
      total: 0, // 角色数据总条数
      formData: {}, // 公司信息对象
      dialogVisible: false, // 控制弹窗是否关闭
      // 添加角色
      roleForm: {
        name: '',
        description: ''
      },
      // 添加角色验证
      roleRules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '角色描述不能为空', trigger: 'blur' }
        ]
      },
      // 声明状态isEdit 为false 点击添加时编辑按钮时，对状态进行改变
      isEdit: false // 判断是否处于编辑状态
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created () {
    // 调用获取角色列表的方法
    this.getRolesList()
    // 调用获取公司信息的方法
    this.getCompanyInfo()
  },
  methods: {

    // 获取角色列表方法
    async getRolesList () {
      const res = await getRolesAPI(this.query)
      //
      // console.log(res)
      // 根据返回的状态码进行业务处理
      if (!res.success) return this.$message.error(res.message)
      // 将返回的数据进行复制
      this.rolesList = res.data.rows
      this.total = res.data.total
    },
    // 获取公司信息
    async getCompanyInfo () {
      const res = await getCompanyInfoAPI(this.companyId)
      // console.log(res)
      if (!res.success) return this.$message.error(res.message)
      this.formData = res.data
    },
    // 每页显示的条数发生改变时触发
    handleSizeChange (newSize) {
      this.query.pagesize = newSize
      this.getRolesList()
    },
    // 当前页面发生改变时触发
    handleCurrentChange (newPage) {
      this.query.page = newPage
      this.getRolesList()
    },
    setRoles () {},
    // 编辑角色
    async editRoles (dataObj) {
      this.isEdit = true // 处于编辑状态
      const res = await getRoleIdAPI(dataObj.id)
      // console.log(res)
      if (!res.success) return this.$message.error(res.message)
      this.roleForm = res.data
      // 让对话框展示
      this.dialogVisible = true
    },
    // 删除角色
    async delRoles (dataObj) {
      // 显示删除询问对话框
      const delRes = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 用户点击了取消，给用户进行提示
      if (delRes === 'cancel') return this.$message.info('您取消了删除')
      // 调用删除的API
      const res = await deleteRoleAPI(dataObj.id)
      // 根据返回的状态码进行错误提示
      if (!res.success) return this.$message.error(res.message)
      // 删除成功后的提示
      this.$message.success(res.message)

      // 判断当前数据的长度是否等于1  页数
      if (this.rolesList.length === 1) {
        this.query.page--
        // 如果是第一页的第一条
        if (this.query.page === 0) {
          this.query.page = 1
        }
      }
      // 重新获取数据
      this.getRolesList()
    },
    // 角色对话框
    // 确定按钮
    roleSubmit () {
      this.$refs.roleForm.validate(async valid => {
        if (valid) {
          if (!this.isEdit) {
            // 调用新增角色的API
            const res = await addRoleAPI(this.roleForm)
            // console.log(res)
            if (!res.success) return this.$message.error(res.message)
            // 如果添加成功 也进行提示
            this.$message.success(res.message)
          } else {
            // 调用编辑角色的API
            const res = await updateRoleAPI(this.roleForm)
            if (!res.success) return this.$message.error(res.message)
            // 编辑成功，给用户进行提示
            this.$message.success(res.message)
          }

          // 重新获取权限列表的数据
          this.getRolesList()
          this.roleForm = {
            name: '',
            description: ''
          }
          // 隐藏对话框
          this.dialogVisible = false
        }
      })
    },
    cancelRoles () {
      this.dialogVisible = false
    },
    // 点击新增角色
    addRoleBtnFn () {
      this.isEdit = false // 不是编辑状态
      this.dialogVisible = true
    },
    // 创建清除数据的方法 无论怎么关闭 直接在关闭时清空（直接给dialog绑定close)
    closeRoleDialog () {
      this.$refs.roleForm.resetFields()
      this.dialogVisible = false
    }
  }
}
</script>

  <style lang="scss" scoped>
    .box-card{
      padding: 10px 30px;
    }
    .tab-pane {
      padding: 20px;
    }
    .el-pagination {
    text-align: center;
    margin-top: 20px;
}
  </style>
