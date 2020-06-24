<template>
  <base-modal
    :overlay="false"
    v-model="show"
  >
    <div
      v-if="show"
      class="account-panel"
    >
      <!-- 头部 -->
      <div class="account-panel_hd flex-between-center van-hairline--bottom">
        <!-- 左 -->
        <div
          class="account-panel_hd__left"
          @click="handleClick"
        >
          <van-icon :name="headItem.icon" />
        </div>
        <!-- 右 -->
        <div
          v-show="headItem.text"
          class="account-panel_hd__right"
          @click="handleChange(1)"
          v-text="headItem.text"
        />
      </div>
      <!-- 页面 -->
      <div class="account-panel_bd">
        <!-- :duration="500" -->
        <van-swipe
          ref="swipe"
          :loop="false"
          :show-indicators="false"
          :touchable="false"
        >
          <!-- 登录 -->
          <van-swipe-item>
            <account-login
              @click="onClick"
            />
          </van-swipe-item>
          <!-- 注册 -->
          <van-swipe-item>
            <account-register
              :page.sync="subPage"
              @click="onClick"
            />
          </van-swipe-item>
          <!-- 改密码 -->
          <van-swipe-item>
            <account-find
              :page.sync="subPage"
              @click="onClick"
            />
          </van-swipe-item>
        </van-swipe>
      </div>
    </div>
  </base-modal>
</template>

<script>
import { Icon, Swipe, SwipeItem } from 'vant'
export default {
  name: 'CommonAccountPanel',
  components: {
    [Icon.name]: Icon,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    AccountLogin: () => import('./login.vue'),
    AccountRegister: () => import('./register.vue'),
    AccountFind: () => import('./find.vue')
  },
  data () {
    return {
      icon: 'arrow-left', //  || cross
      currentPage: 0, // 0登录页， 1注册页，2找回密码页
      subPage: 0
    }
  },
  computed: {
    headItem () {
      const res = { icon: 'cross', text: '注册' }
      // 只有登录页是关闭按钮，其他页面是返回按钮
      const newRes = { icon: 'arrow-left', text: '' }
      this.currentPage > 0 && Object.assign(res, newRes)
      return res
    },
    show: {
      get () {
        return this.$store.state.account
      },
      set (account) {
        this.$store.dispatch('SetStore', { account })
      }
    }
    // action() {
    //   return this.$route.query.action || ''
    // }
  },
  watch: {
    currentPage (newVal, oldVal) {
      // 不是连续的两个item跳转则无动画展示
      // const animate = (newVal - oldVal) !== 1
      // this.swipeTo(animate)
      this.swipeTo()
    }
    // action: {
    //   handler(v) {
    //     // this.$nextTick(function())
    //     this.$nextTick(function() {
    //       if (v === 'register') {
    //         this.swipeTo(1)
    //       }
    //     })
    //   }
    // }
  },
  methods: {
    onClick (opera) {
      switch (opera.type) {
        case 'subPage':
          this.subPage = opera.page
          break
        case 'login':
          this.$notify({
            type: 'success',
            message: '登录成功'
          })
          this.closeAccount()
          break
        case 'register':
          this.$notify({
            type: 'success',
            message: '注册并成功登录'
          })
          this.closeAccount()
          break
        case 'find':
          this.$notify({
            type: 'success',
            message: '密码修改成功'
          })
          this.closeAccount()
          break
        case 'changePage':
          if (opera.data && opera.data.page > -1) {
            this.currentPage = opera.data.page
            this.subPage = 0
          }
          break
      }
    },
    handleChange (page) {
      this.currentPage = page
    },
    handleClick () {
      if (this.currentPage === 0) {
        this.closeAccount()
      } else {
        if (this.subPage * 1 === 1) {
          this.subPage = 0
        } else {
          this.currentPage = 0
        }
      }
    },
    closeAccount () {
      this.$store.dispatch('SetStore', { account: false })
      this.icon = 'arrow-left' //  || cross
      this.currentPage = 0 // 0登录页， 1注册页，2找回密码页
    },
    swipeTo (immediate) {
      this.$refs.swipe.swipeTo(this.currentPage, { immediate })
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/css/common/variables.styl'
.account-panel
  width 100%
  height 100%
  padding-top $font * 3
  &_hd
    position fixed
    left 0
    top 0
    width 100%
    height $font * 3
    padding 0 $font
    &_left
      width $font * 3
      height $font * 3
  &_bd
    padding $font
    width 100%
    height 100%
    &>.van-swipe
      height 100%
</style>
