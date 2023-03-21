<template>
  <div class="login-container">
    <!-- 1. el绑定 model属性 和 rules属性 -->
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <!-- 插入标题图片 -->
      <div class="title-container">
        <h3 class="title">
          <img src="@/assets/common/login-logo.png" alt="">
        </h3>
      </div>
      <!-- 用户名 手机号 -->
      <el-form-item prop="mobile">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.mobile"
          placeholder="请输入手机号"
          name="mobile"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <!-- 密码 -->
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>
      <!-- 登录按钮 -->
      <el-button
        class="loginBtn"
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleLogin"
      >登录</el-button>

      <div class="tips">
        <span style="margin-right: 20px">账号: 13800000002</span>
        <span> 密码: 123456</span>
      </div>
    </el-form>
    <el-button @click="fnTest">测试</el-button>
  </div>
</template>

<script>
import { validMobile } from '@/utils/validate'
import { getUserProfileAPI } from '@/api'
// import { mapActions } from 'vuex'

export default {
  name: 'Login',
  data () {
    // 自定义校验函数  手机号
    const validateMobile = function (rule, value, callback) {
      validMobile(value) ? callback() : callback(new Error('手机号格式不对'))
    }
    return {
      loginForm: {
        mobile: '13800000002',
        password: '123456'
      },
      loginRules: {
        mobile: [
          { required: true, trigger: 'blur', message: '手机号不能为空' },
          { validator: validateMobile, trigger: 'blur' }
        ],
        password: [
          { required: true, trigger: 'blur', message: '密码不能为空' },
          {
            min: 6,
            max: 16,
            message: '密码的长度在6-16位之间 ',
            trigger: 'blur'
          }
        ]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    // ...mapActions('user', ['loginActions']),
    showPwd () {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin () {
      this.$refs.loginForm.validate(async (valid) => {
        // 登录校验
        if (valid) {
          this.loading = true
          // await只能提取Promise对象成功的状态的值
          // await是来取代then()函数的， await可以把成功的值提取出来留在原地
          // 如何捕获Promise错误的状态呢？ 使用try+catch
          /*  try {
            // 放入可能会报错的代码
            const res = await loginAPI(this.loginForm)
            this.$message.success(res.message)
            this.$store.commit('user/SET_TOKEN', res.data)
            // console.log(res.data)
            this.loading = false
          } catch (err) {
            // 一旦try大括号内代码报错立刻停止try大括号代码向下执行
            // 转而直接跳入catch大括号里执行，err形参接收的是错误信息对象
            // 用console.dir打印
            this.$message.error(err.message)
            console.dir(err)
          } */
          try {
            /* const res = this.$store.dispatch('user/loginActions', this.loginForm)
            console.log(res) 会返回一个Promise对象 */
            // 这里必须加await, 不加await,会调用登录接口的时候，这个登录异步任务无结果的时候，代码会往下走就跳转进去了（就算密码错了也能跳转）
            const res = await this.$store.dispatch('user/loginActions', this.loginForm)
            // 登录后跳转主页
            // axios方法无论何时都会返回Promise对象（自定义的，非axios）
            // await等待后面成功了 才会继续往下走
            this.$message(res.message)
            this.$router.replace('/')
            // console.log('跳转了')   //会先跳转 在登录 解决办法就是异步处理
          } catch (error) {
            console.dir(error)
          }
        } else {
          return false // 测试未通过
        }
      })
    },
    async fnTest () {
      const res = await getUserProfileAPI()
      console.log(res)
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
// 修改手机号和密码字体颜色
$light_gray: #68b0fe;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  // 设置背景图片
  background-image: url('~@/assets/common/login.jpg');
  background-position: center;
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.7); // 输入登录表单的背景色
    border-radius: 5px;
    color: #454545;
  }
  // elementui 自带的   修改错误提示字体
  .el-form-item__error {
    color: #fff;
  }
  // 修改登录按钮样式
  .loginBtn {
    background: #407ffe;
    height: 64px;
    line-height: 32px;
    font-size: 24px;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
