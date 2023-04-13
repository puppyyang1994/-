import Layout from '@/layout'
export default {
  path: '/permission', // 权限
  component: Layout,
  children: [
    {
      path: '',
      name: 'Permission',
      component: () => import('@/views/permission'),
      meta: { title: '权限', icon: 'lock' }
    }
  ]
}
