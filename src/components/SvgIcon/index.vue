<template>
  <!-- 字体文件是外部链接用div 非外链用svg标签展示 -->
  <!-- svg 里use  同源策略 不能使用外链地址 所以用div -->
  <!-- 此svgIcon组件会被views里面使用 在这个组件内 可应用￥listeners接收所有绑定的事件 -->
  <!-- $listeners 值： {click:btn, test:fn} -->
  <!-- v-on:事件名   一个一个绑定 -->
  <!-- v-on={}   绑定多个 -->
  <div
    v-if="isExternal"
    :style="styleExternalIcon"
    class="svg-external-icon svg-icon"
    v-on="$listeners"
  />
  <!-- aria-hidden 计算机朗读标签时 不读svg -->
  <svg v-else :class="svgClass" aria-hidden="true" v-on="$listeners">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script>
// doc: https://panjiachen.github.io/vue-element-admin-site/feature/component/svg-icon.html#usage
import { isExternal } from '@/utils/validate'
// teplate内的模板语法只能用export default里的变量

export default {
  name: 'SvgIcon',
  props: {
    // 字体图标svg文件名
    iconClass: {
      type: String,
      required: true
    },
    // 外部自定义类名
    className: {
      type: String,
      default: ''
    }
  },
  computed: {
    // 是否为外链链接 如果是外链返回true
    isExternal() {
      // 调用import方法
      return isExternal(this.iconClass)
    },
    // 拼接在内存中查找svg文件的标识
    iconName() {
      return `#icon-${this.iconClass}`
    },
    svgClass() {
      // 例如：外部<svg-icon class= 'my'>
      // 内部<svg></svg>标签身上就有一个内部 svg-icon my 类名
      if (this.className) {
        return 'svg-icon ' + this.className
      } else {
        return 'svg-icon'
      }
    },
    // 外链icon样式
    styleExternalIcon() {
      return {
        // mask蒙层
        mask: `url(${this.iconClass}) no-repeat 50% 50%`,
        '-webkit-mask': `url(${this.iconClass}) no-repeat 50% 50%`
      }
    }
  }
}
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover !important;
  display: inline-block;
}
</style>
