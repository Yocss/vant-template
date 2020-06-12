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
    // 设置页面转场效果
    let animate = ''
    if (from.name) {
      if (to.path === from.path) {
        // 首页同级间跳转转场使用模糊效果处理
        animate = 'goto'
      } else {
        if (from.path.indexOf(to.path) === 0) {
          // to.path 被包含在 from.path中表示返回
          animate = 'back'
          // animate = 'goto'
        } else if (to.path.indexOf(from.path) === 0) {
          // from.path 被包含在 to。path中表示前进
          animate = 'go'
          // animate = 'goto'
        } else {
          // 首页同级间跳转转场使用模糊效果处理
          animate = 'goto'
        }
      }
    }
    store.dispatch('SetStore', { animate })
    // 记录上一次路由
    store.dispatch('SetStore', { route: { from, to } })
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
