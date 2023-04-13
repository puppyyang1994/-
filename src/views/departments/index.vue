<template>
  <div class="departments-container">
    <div class="app-container">
      <!-- 绘制组织架构整体区域 el-card卡片组件 -->
      <!-- 卡片组件 头部和body -->
      <el-card class="box-card">
        <!-- 头部要用具名slot -->
        <div slot="header" class="clearfix">
          <el-tabs v-model="activeName">
            <!-- label tab导航显示文字  name 点击关联到v-model的值 -->
            <el-tab-pane label="组织架构" name="first" />
            <!-- 一行 -->
            <el-row type="flex" justify="space-between" align="middle" class="department-header">
              <!-- 左边 -->
              <el-col :span="20">
                <i class="el-icon-s-home" />
                <span class="company">哈哈哈哈哈哈哈哈有限公司</span>
              </el-col>
              <!-- 右边 -->
              <el-col :span="4">
                <el-row type="flex" justify="end">
                  <el-col />
                  <el-col>
                    <el-dropdown>
                      <!-- 下拉菜单文字 -->
                      <span class="el-dropdown-link">
                        操作<i class="el-icon-arrow-down el-icon--right" />
                      </span>
                      <!-- 下拉项 -->
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="add()">添加子部门</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-col>
                </el-row>
              </el-col>

            </el-row>

            <!-- 树形控件  样式去element-ui.scss文件里修改-->
            <el-tree class="departments-tree" :data="treeData" :props="defaultProps" :default-expand-all="false">

              <!-- 默认插槽 并且使用内部的数据进行自定义模板的渲染 scope.data所以直接key解构赋值变量也是data(对应数据对象) -->
              <template #default="{ data }">
                <el-row
                  type="flex"
                  justify="space-between"
                  align="middle"
                  style="height: 40px; width: 100%;"
                >
                  <!-- 部门名字 -->
                  <el-col :span="20">
                    <!-- 返回的数据里name就是名字 -->
                    <span>{{ data.name }}</span>
                  </el-col>
                  <!--右边操作区域-->
                  <el-col :span="4">
                    <el-row type="flex" justify="end">
                      <!-- 两个列 -->
                      <el-col>{{ data.manager }}</el-col>
                      <!-- 下列菜单 -->
                      <el-col>
                        <el-dropdown>
                          <!-- 下拉菜单文字 -->
                          <span class="el-dropdown-link">
                            操作<i class="el-icon-arrow-down" />
                          </span>
                          <!-- 下拉项 -->
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="add(data)">添加子部门</el-dropdown-item>
                            <el-dropdown-item @click.native="edit(data)">编辑部门</el-dropdown-item>
                            <el-dropdown-item v-if="data && !data.children" @click.native="del(data)">删除部门</el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown></el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </template>

            </el-tree>
          </el-tabs>
        </div>
      </el-card>
    </div>

    <!-- 新增子频道 -->
    <!-- 新增子部门弹窗 -->
    <!-- .sync可以给当前绑定绑定固定格式update:变量名的事件, 把值赋予给右侧的变量 -->
    <departDialog
      ref="departDialog"
      :dialog-visible.sync="showDepartDialog"
      :employees-list="employeesList"
      :origin-list="originList"
      :is-edit="isEdit"
      :parent-id="clickDepartId"
      @addDepartEV="addDepartmentsFn"
    />
  </div></template>

<script>
import {
  departmentsListAPI, getEmployeeSimpleAPI,
  addDepartmentsAPI, getDepartDetailAPI, updateDeparmentsAPI, delDepartmentAPI } from '@/api'
import { transTree } from '@/utils'
import departDialog from './components/departDialog.vue'
export default {
  name: 'Departments',
  components: {
    departDialog
  },
  data () {
    return {
      // 是否展示-添加子频道的弹出层
      showDepartDialog: false,
      activeName: 'first', // 被激活的那个
      treeData: [
        {
          departName: '总裁办',
          name: 'AAA'
        },
        {
          departName: '行政部',
          name: 'BBB'
        },
        {
          departName: '人事部',
          name: 'CCC'

        },
        {
          departName: '财务部',
          name: 'DDD',
          children: [
            {
              departName: '财务核算部'
            },
            {
              departName: '税务管理部'
            },
            {
              departName: '薪资管理部'
            }
          ]
        },
        {
          departName: '技术部',
          name: 'EEE',
          children: [
            {
              departName: '前端技术部'
            },
            {
              departName: '后端技术部'
            }
          ]
        },
        {
          departName: '运营部',
          name: 'FFF'
        },
        {
          departName: '市场部',
          name: 'GGG',
          children: [
            {
              departName: '市场部1'
            },
            {
              departName: '市场部2'
            }
          ]
        }
      ],
      // 定义结构显示
      defaultProps: {
        children: 'children',
        label: 'name' // 改成name字段
      },
      employeesList: [], // 员工列表
      clickDepartId: '', // 部门的id
      isEdit: false, // 编辑状态（false未编辑）
      originList: []// 用于弹窗内-校验部门code和name是否重复数据数组
    }
  },
  created () {
    this.getDepartmentsListFn()
    this.getEmployeesListFn()
  },

  methods: {
    // 新增-添加部门的方法
    // 根据编辑状态，再点击确定来判断如何调用接口

    async addDepartmentsFn (dataObj) {
      if (this.isEdit) {
        // 编辑状态
        dataObj.id = this.clickDepartId
        const res = await updateDeparmentsAPI(dataObj)
        console.log(res)
      } else {
        // 新增状态
        dataObj.pid = this.clickDepartId
        const res = await addDepartmentsAPI(dataObj)
        console.log(res)
      }
      this.getDepartmentsListFn()
    },
    // 获取部门列表方法
    async getDepartmentsListFn () {
      const res = await departmentsListAPI()
      // console.log(res)
      // 数据在传给子组件之前需要先进行格式化
      this.originList = res.data.depts.map(item => (
        {
          id: item.id,
          code: item.code,
          name: item.name,
          pid: item.pid

        }
      ))
      this.treeData = transTree(res.data.depts, '')
    },
    async getEmployeesListFn () {
      const res = await getEmployeeSimpleAPI()
      // console.log(res)
      this.employeesList = res.data
    },
    /*  handleClick (tab, event) {
      console.log(tab, event)
    } */
    // 正文部分--右侧点击添加子部门
    add (data) {
      this.isEdit = false
      if (data) {
        // 添加二级以下部门
        this.clickDepartId = data.id // 保存当前部门的id
      } else { // 添加一级部门（当前点击公司id为''
        this.clickDepartId = '' // 一级部门的pid都是 ''
      }

      this.showDepartDialog = true // 显示弹窗
    },
    // 编辑子部分
    async edit (data) {
      this.isEdit = true
      this.clickDepartId = data.id // 编辑部门的Id
      this.showDepartDialog = true // 显示弹窗
      const res = await getDepartDetailAPI(data.id)
      console.log(res)
      this.$refs.departDialog.form = res.data // 影响组件表单里对象
    },
    // 删除部分
    async del (data) {
      // 显示删除确认消息对话框
      const delRes = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(delRes) // 返回的cancel是取消
      // 如果点击的是取消
      if (delRes === 'cancel') return this.$message('您取消了！')

      // 否则调用删除接口
      const delDepartRes = await delDepartmentAPI(data.id)
      console.log(delDepartRes)
      // 根据状态值，查看是否删除成功
      if (!delDepartRes.success) return
      this.$message.error(delDepartRes.message)
      // 删除成功需要给用户进行提示
      // this.$message.success(delDepartRes.message)
      // 删除后需要重新获取当前页面数据
      this.getDepartmentsListFn()
    }

  }

}
</script>

  <style lang="scss" scoped>
.box-card {
  padding: 10px 30px;
}

.tab-pane {
  padding: 20px 80px;

  .company {
    margin-left: 12px;
    font-weight: bold;
    font-size: 14px;
  }

  .department-header {
    height: 50px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ccc;
  }
}
.departments-tree {
  margin: 12px 0px;
}
</style>
