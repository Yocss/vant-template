export default [
  {
    path: '/news',
    name: 'NewsIndex',
    component: () => import('@/pages/news/index.vue'),
    meta: { title: '发现' }
  },
  {
    // path: '/news/:id([\\d\\w]{15})',
    path: '/news/:id',
    name: 'NewsDetail',
    component: () => import('@/pages/news/_id.vue'),
    meta: { title: '详情' }
  }
]
