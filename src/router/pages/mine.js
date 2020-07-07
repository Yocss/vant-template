export default [
  {
    path: '/mine',
    name: 'MineIndex',
    component: () => import('@/pages/mine/index.vue'),
    meta: { title: '我的', layout: 'home' }
  }
]
