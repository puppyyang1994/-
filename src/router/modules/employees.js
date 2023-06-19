import Layout from '@/layout'

export default {
  path: '/employees', // 员工
  component: Layout,
  children: [
    {
      path: '',
      name: 'Employees',
      component: () => import('@/views/employees'),
      meta: { title: '员工管理', icon: 'people' }
    }
  ]
}
