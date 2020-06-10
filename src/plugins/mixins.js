import Vue from 'vue'
// import Store from '@/store/index.js'
import { Dialog } from 'vant'
Vue.mixin({
  computed: {
    isLogin () {
      return this.$store.state.token
    },
    route () {
      return this.$store.state.route
    }
  },
  methods: {
    /**
     * 返回上一页，(无上一页时重定向至首页）
     * @param {*} step 返回步数
     */
    goBack (step = -1) {
      this.route.from ? this.$router.go(step) : this.$router.replace('/')
      return true
    },

    /**
     * 检查登录，如未登录，则弹出登录框
     * @param {function} callBack callBack
     */
    checkLogin (callBack = undefined) {
      if (!this.isLogin) {
        Dialog.confirm({
          title: '温馨提示',
          message: '您尚未登录，请登录后继续操作'
        }).then(() => {
          // 去登录
          console.log('开启登录框')
        })
      }
      return this.isLogin
    }
  }
})
