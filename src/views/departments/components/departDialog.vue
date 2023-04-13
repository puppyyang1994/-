<template>
  <div>
    <!-- 弹窗组件 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="50%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      @close="closeDialog"
    >
      <!-- 添加表单 -->
      <el-form ref="deptForm" label-width="120px" :model="form" :rules="rules">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="form.name" style="width:80%" placeholder="1-50个字符" />
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input v-model="form.code" style="width:80%" placeholder="1-50个字符" />
        </el-form-item>
        <el-form-item label="部门负责人" prop="manager">
          <el-select v-model="form.manager" style="width:80%" placeholder="请选择">
            <el-option v-for="item in employeesList" :key="item.id" :value="item.username" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍" prop="introduce">
          <el-input v-model="form.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelFn">取 消</el-button>
        <el-button type="primary" @click="enterFn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 其实父->子还是用到了props属性, 子->父还是用了自定义事件, 只不过名字有固定格式

export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    employeesList: {
      type: Array,
      default () {
        return [] // 独立作用域
      },
      isEdit: {
        type: Boolean,
        default: false
      },
      // props的默认值如果类型校验是数组/对象->为了防止互相引用, 要在函数里返回一个新数组/对象
      originList: {
        type: Array,
        default () {
          return []
        },
        required: true
      },
      parentId: {
        type: String,
        default: ''
      }
    }

  },

  // 子组件通过props获取属性，接收父组件传过来的数据和方法
  data () {
    // 子部门名称非重验证
    const validName = (rule, value, callback) => {
      // 查找同级分类
      // 先筛选属于这个pid下属的（parentId就是id)部门对象, 然后映射name名字数组
      let existNameList = this.originList?.filter(item => item.pid === this.parentId)?.map(item => item.name)
      // 如果是编辑的情况
      if (this.isEdit) {
        // 找到部门的当前对象
        const dept = this.originList?.finde(item => item.id === this.parentId)
        // 取出父级的id(当前对象的pis)
        const pid = dept.pid
        // 过滤 筛选出同一级别的数据， 但是id 不包含当前编辑部门的id, 映射返回name名字数组
        existNameList = this.originList
          .filter(item => item.pid === pid && item.id !== this.parentId)
          .map(item => item.name)
      }
      // 判断最新输入的部门名称是否存在
      existNameList?.includes(value) ? callback(new Error('这个部门下这个名字' + value + '已经被占用了')) : callback()
    }
    // 子部门编号非重验证
    const validCode = (rule, value, callback) => {
      // 判断是否能找到对应的部门，如果找到了则返回该对象
      let existCodeList = this.originList?.map(item => item.code)
      // 如果是编辑状态，则将需要编辑的这一项排除在外
      if (this.isEdit) {
        existCodeList = this.originList.filter(item => item.id !== this.parentId).map(item => item.code)
      }
      // 如果存在该对象，这说明编码已经存在，抛出错误
      existCodeList?.includes(value) ? callback(new Error('编码' + value + '已经存在')) : callback()
    }
    return {
      // 校验部门编码是否重复

      form: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      // 表单验证
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 20, message: '部门名称要求1-20个字符', trigger: 'blur' },
          { validator: validName, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },
          { validator: validCode, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 300, message: '部门介绍要求1-300个字符', trigger: 'blur' }
        ]
      }

    }
  },

  methods: {
    // 取消-点击事件
    cancelFn () {
      this.$emit('update:dialogVisible', false)
      this.$refs.deptForm.resetFields()
    },
    // 确定-点击事件
    // 手动兜底验证 -- 自定义验证
    enterFn () {
      this.$refs.deptForm.validate(async (valid) => {
        if (valid) {
          this.$emit('addDepartEV', { ...this.form })
          this.form = {
            name: '', // 部门名称
            code: '', // 部门编码
            manager: '', // 部门管理者
            introduce: '' // 部门介绍
          }

          this.$refs.deptForm.resetFields()
          this.$emit('update:dialogVisible', false)
        }
      })
    },
    closeDialog () {
      this.$refs.deptForm.resetFields()
    }

  }

}
</script>

<style>

</style>
