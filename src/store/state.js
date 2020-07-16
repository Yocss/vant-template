import config from '@/app.config.js'
import { getCookie } from '@/assets/js/utils/cookie.js'
function getToken () {
  return (window && config.keys.token) ? window.sessionStorage.getItem(config.keys.token) || getCookie(config.keys.token) || '' : ''
}
export default {
  layout: 'default',
  loading: false, // 页面加载状态
  animate: '', // layouts default 页面入场出场动画
  route: {
    to: null,
    from: null
  },
  footNav: [ // 页脚导航条
    { title: '首页', name: 'HomeIndex', icon: 'wap-home-o' },
    { title: '题库', name: 'StudyIndex', icon: 'points' },
    { title: '资料', name: 'SourceIndex', icon: 'newspaper-o' },
    { title: '我的', name: 'MineIndex', icon: 'manager-o' }
  ],
  token: getToken(),
  // 登录框
  account: false
}
