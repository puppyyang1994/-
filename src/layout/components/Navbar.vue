<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <!-- 删除面包屑 换成div -->
    <div class="app-breadcrumb">
      海南天鹏游乐有限公司
      <!-- <span class="breadBtn">体验版</span> -->
    </div>

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- 拿到用户头像avatar -->
          <img :src="avatar" class="user-avatar">
          <span class="name">{{ name }}</span>
          <i class="el-icon-caret-bottom" style="color:#fff" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://gitee.com/shuiruohanyu/hrsaas53">
            <el-dropdown-item>
              项目地址
            </el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
// 知识点：在逻辑页面中，使用vuex和getters值方式
// 方式1：$store.getters.变量名  （如果用模块内getters:$store.getters['模块key名/变量名']
// 方式2：映射的方式（vuex里值复制到组件内）
// 1. 拿到vuex提供的辅助函数 mapGetters (固定名)
import { mapGetters } from 'vuex'
// 2. 调用函数，出入要映射过来的getters里变量名
// 辅助函数在原地返回对象
// {name:mappedGetters函数}
// 简单看后面函数内其实还是this.$store.getters[val] ->去取name对应的值并返回
// console.log(mapGetters(['name']))
import Hamburger from '@/components/Hamburger'

export default {
  components: {

    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name'
    ])
  },
  methods: {
    toggleSideBar () {
      this.$store.dispatch('app/toggleSideBar')
    },
    // 退出登录 点击事件
    async logout () {
      // 为了提高用户体验，给用户一个确认框
      this.$confirm('确定退出登录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 调用user模块下的logouActions 清除用户信息
        await this.$store.dispatch('user/logoutActions')
        // route是信息对象 router后跟方法
        // this.$route.fullPath  带参数 '/info?a=1-&b=20'
        // this.$route.path 路径  不带额外的参数  '/info'
        console.log(this.$route)
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
        this.$message({
          type: 'success',
          message: '退出登录成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  // background: #fff;
  background-image: -webkit-linear-gradient(right, #818A96, #B2B9C4);
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  .app-breadcrumb {
  display: inline-block;
  font-size: 18px;
  line-height: 50px;
  margin-left: 10px;
  color: #25282C;
  cursor: text;

  .breadBtn {
    background: #84a9fe;
    font-size: 14px;
    padding: 0 10px;
    display: inline-block;
    height: 30px;
    line-height: 30px;
    border-radius: 10px;
    margin-left: 15px;
  }
}

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;
    // color只能影响文字的颜色/字体图标的颜色
    color:white

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
  // margin-top: 5px;
  position: relative;

  // 头像
  .user-avatar {
    cursor: pointer;
    width: 30px;
    height: 30px;
    border-radius: 15px;
    vertical-align: middle;
    margin-right: 10px;
  }

  // name
  .name {
    color: #fff;
    vertical-align: middle;
    margin-left:5px;
  }

  .user-dropdown {
    color: #fff;
  }

  // 下拉 icon 图标位置
  .el-icon-caret-bottom {
    cursor: pointer;
    position: absolute;
    right: -20px;
    top: 20px;
    font-size: 12px;
  }
}
  }
}
}
</style>
