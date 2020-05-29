/**
 * global routerHooks, you can do somethins in the hooks
 * 全局路由守卫，在路由进入前或进入后执行相关任务
 */
import router from '@/router/index.js'
import store from '@/store/index.js'
import { analytics } from './analytics.js'

function hooks () {
  // global before router enter
  router.beforeEach(async function (to, from, next) {
    // page layout
    setLayout(to)
    next()
  })
  // global after router enter
  router.afterEach((to, from) => {
    // cnzz analytics, work in production env
    // cnzz 页面访问统计, 仅在 production 环境下生效
    analytics(to.fullPath, from.fullPath)
  })
}

hooks()

// set page's layout
function setLayout (to) {
  const layout = to.meta.layout || 'default'
  store.dispatch('SetStore', { layout })
}
