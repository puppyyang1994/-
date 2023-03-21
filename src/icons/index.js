import Vue from 'vue'
// 如果引入路径是一个文件夹 默认引入的就是index
// 全局svg组件
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally

// 全局注册组件（一次注册，任意的.vue文件内使用）
Vue.component('svg-icon', SvgIcon)

// 非常难 （了解即可，不用硬度）
// 打印分析
// require.context webpack自动化导入模块
// 从一个文件夹 引入很多模块（文件路径, 是否遍历之目录， 匹配文件正则）
// .svg结尾的文件

const req = require.context('./svg', false, /\.svg$/)
// console.log(req)
const requireAll = requireContext => {
  // console.log(requireContext.keys())

  /*  ['./dashboard.svg', './example.svg', ....] */
  //   每个要引入文件传入req中，进行webpack引入
  return requireContext.keys().map(requireContext)

  // 方法名其实也是一个对象，也有属性也可以访问
}

requireAll(req)

/* function webpackContext(req) {
    var id = webpackContextResolve(req);
    return __webpack_require__(id);
} */
