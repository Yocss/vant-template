/**
 * global routerHooks, you can do somethins in the hooks
 * 全局路由守卫，在路由进入前或进入后执行相关任务
 */
import router from '@/router/index.js'
import store from '@/store/index.js'
import { analytics } from './analytics.js'

function hooks () {
  // global hook before router enter
  router.beforeEach(async function (to, from, next) {
    // page layout
    setLayout(to)
    next()
  })
  // global hook after router enter
  router.afterEach((to, from) => {
    // 页面进入和退出效果
    const route = { ...store.state.route }
    let animate = ''
    if (from.name) {
      const isBack = route.from === to.name
      animate = isBack ? 'slideOut' : 'slideIn'
    }
    store.dispatch('SetStore', { animate })
    // 记录上一次路由
    store.dispatch('SetStore', { route: { from: from.name, to: to.name } })
    // cnzz analytics, work in production only
    analytics(to.fullPath, from.fullPath)
  })
}

hooks()

// set page's layout
function setLayout (to) {
  const layout = to.meta.layout || 'default'
  store.dispatch('SetStore', { layout })
}
