import config from '@/app.config.js'
import { getCookie } from '@/assets/js/utils/cookie.js'
export default {
  layout: 'default',
  loading: false,
  animate: '',
  route: {
    to: null,
    from: null
  },
  token: (window && config.keys.token) ? window.sessionStorage.getItem(config.keys.token) || getCookie(config.keys.token) || '' : '',
  // 登录框
  account: false
}
