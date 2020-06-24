<template>
  <div class="account-panel-register">
    <van-swipe
      ref="swipe"
      :duration="250"
      :loop="false"
      :show-indicators="false"
      :touchable="false"
    >
      <van-swipe-item>
        <div class="account-panel_form flex-column-between">
          <div class="account-panel_form__bd">
            <h1>注册</h1>
            <account-form
              ref="code"
              :phone="phone"
              :field="field"
              :type="1"
            />
            <van-button
              type="info"
              size="large"
              :loading="loading"
              :disabled="loading"
              @click="handleSubmit('code')"
            >
              下一步
            </van-button>
            <div class="account-panel_form__oth flex-center">
              注册即视为同意
              <a
                href="/license"
                target="_blank"
              >
                《注册协议》
              </a>
            </div>
          </div>
          <div class="account-panel_form__ft flex-center">
            <p
              @click="handleChange(0)"
              v-text="'已有帐号？去登录'"
            />
          </div>
        </div>
      </van-swipe-item>
      <van-swipe-item>
        <div class="account-panel_form flex-column-between">
          <div class="account-panel_form__bd">
            <h1>注册</h1>
            <h2>短信已发送至 {{ phone }}</h2>
            <account-form
              ref="pass"
              :type="3"
              :phone="phone"
              :field="field"
            />
            <van-button
              type="info"
              size="large"
              :loading="loading"
              :disabled="loading"
              @click="handleSubmit('pass')"
            >
              完成注册并登录
            </van-button>
            <div class="account-panel_form__oth flex-center">
              注册即视为同意
              <a href="/license/index">
                《注册协议》
              </a>
            </div>
          </div>
          <div class="account-panel_form__ft flex-center">
            <p
              @click="handleChange(0)"
              v-text="'已有帐号？去登录'"
            />
          </div>
        </div>
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>
export default {
  name: 'AccountPanelLogin',
  components: {
    VanSwipe: () => import('vant/lib/swipe'),
    VanSwipeItem: () => import('vant/lib/swipe-item'),
    AccountForm: () => import('./form'),
    VanButton: () => import('vant/lib/button')
  },
  props: {
    page: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      // page: 0,
      loading: false,
      phone: ''
    }
  },
  computed: {
    field () {
      return [['user'], ['code', 'pass']][this.page]
    }
  },
  watch: {
    page (v) {
      this.$emit('click', { type: 'subPage', page: v })
      this.swipeTo()
    }
  },
  methods: {
    async handleSubmit (ref) {
      this.loading = true
      switch (ref) {
        case 'code': {
          // 获取验证码
          const gotPhone = await this.$refs[ref].getVerifyCode(true)
          if (gotPhone) {
            this.phone = gotPhone
            // this.page = 1
            this.$emit('update:page', 1)
          }
          break
        }
        case 'pass': {
          // 执行注册
          const register = await this.$refs[ref].doSubmit('register')
          register && this.$emit('click', { type: 'register' })
          break
        }
      }
      this.loading = false
    },
    handleClick (page) {
      if (page < 2) {
        // this.page = page
        this.$emit('update:page', page)
      } else {
        this.handleChange(page)
      }
    },
    handleChange (page) {
      const data = { page }
      this.$emit('click', { type: 'changePage', data })
    },
    swipeTo () {
      this.$refs.swipe.swipeTo(this.page)
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/css/common/variables.styl'
.account-panel-register
  height 100%
  &>.van-swipe
    height 100%
  .account-panel_form
    height 100%
    padding-bottom 30px
    h1
    h2
      margin $font 0
      font-size 48px
      color $dark
      text-align center
    h2
      font-size $font
      color #454545
    button
      margin $font * 2.5 auto $font
    border-radius 8px
</style>
