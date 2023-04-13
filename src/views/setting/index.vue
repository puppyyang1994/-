<template>
  <div class="setting-container">
    <div class="app-container">
      <!-- card卡片组件 -->
      <el-card class="box-card">
        <!-- tabs组件完成标签页 -->
        <el-tabs v-model="activeName">
          <el-tab-pane label="角色管理" name="first" class="tab-pane">
            <!-- 布局组件 -->
            <el-row style="height:60px">
              <el-button type="primary" icon="el-icon-plus" size="small">新增角色</el-button>
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

    </div>
  </div>
</template>

<script>
import { getCompanyInfoAPI, getRolesAPI } from '@/api'
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
      formData: {} // 公司信息对象

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
    // 获取公司信息
    async getCompanyInfo () {
      const res = await getCompanyInfoAPI(this.companyId)
      console.log(res)
      if (!res.success) return this.$message.error(res.message)
      this.formData = res.data
    },
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
    // 每页显示的条数发生改变时触发
    handleSizeChange () {},
    // 当前页面发生改变时触发
    handleCurrentChange () {},
    setRoles () {},
    editRoles () {},
    delRoles () {}
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
