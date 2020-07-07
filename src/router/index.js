import Vue from 'vue'
import VueRouter from 'vue-router'
import News from './pages/news.js'
import Mine from './pages/mine.js'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'HomeIndex',
    component: () => import('@/pages/index.vue'),
    meta: { title: '首页' }
  },
  ...News,
  ...Mine,
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
