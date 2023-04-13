import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Vue Admin Template'

export default function getPageTitle (pageTitle) {
  if (pageTitle) {
    // return `${pageTitle} - ${title}`
    // 调整顺序 我们想让全局的title在前面
    return `${title}-${pageTitle}`
  }
  return `${title}`
}
