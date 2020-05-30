import Vue from 'vue'
// import Store from '@/store/index.js'
import { Dialog } from 'vant'
Vue.mixin({
  computed: {
    isLogin () {
      return this.$store.state.token
    }
  },
  methods: {
    /**
     * 返回上一页，(无上一页时的处理方案未确定）
     * @param {*} step 返回步数
     */
    goBack (step = -1) {
      this.$router.go(step)
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
