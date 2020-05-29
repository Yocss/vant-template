import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../pages/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'HomeIndex',
    component: () => import('@/pages/index.vue'),
    meta: { title: '首页', layout: 'home' }
  },
  {
    path: '/news',
    name: 'NewsIndex',
    component: () => import('@/pages/news/index.vue'),
    meta: { title: '新闻页', layout: 'default' }
  },
  {
    path: '*',
    name: 'Error',
    component: () => import('@/layouts/error.vue'),
    meta: { title: '访问发生错误', layout: 'null' }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
