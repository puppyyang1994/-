import Layout from '@/layout'
export default {
  path: '/salaries', // 薪资
  component: Layout,
  children: [
    {
      path: '',
      name: 'Salaries',
      component: () => import('@/views/salaries'),
      meta: { title: '薪资', icon: 'money' }
    }
  ]
}
