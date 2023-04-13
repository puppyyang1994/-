import Layout from '@/layout'

// Layout组件中包含

export default {
  path: '/approvals',
  component: Layout,
  children: [
    {
      path: '/approvals',
      name: 'Approvals',
      component: () => import('@/views/approvals'),
      meta: { title: '审批', icon: 'tree-table' }
    }
  ]
}

