<template>
  <div class="account-panel-login">
    <van-swipe
      ref="swipe"
      :duration="250"
      :loop="false"
      :show-indicators="false"
      :touchable="false"
    >
      <van-swipe-item>
        <div class="account-panel_form">
          <h1>帐号登录</h1>
          <account-form
            ref="account"
            :field="field"
            :type="3"
          />
          <van-button
            type="info"
            size="large"
            :loading="loading"
            :disabled="loading"
            @click="handleLogin('account')"
          >
            立即登录
          </van-button>
          <div class="account-panel_form__oth flex-between-center">
            <p
              @click="handleClick(1)"
              v-text="'手机短信登录'"
            />
            <p
              @click="handleClick(2)"
              v-text="'忘记密码'"
            />
          </div>
        </div>
      </van-swipe-item>
      <van-swipe-item>
        <div class="account-panel_form">
          <h1>短信登录</h1>
          <account-form
            ref="sms"
            :type="3"
            :field="field"
          />
          <van-button
            type="info"
            size="large"
            :loading="loading"
            :disabled="loading"
            @click="handleLogin('sms')"
          >
            立即登录
          </van-button>
          <div class="account-panel_form__oth flex-center">
            <p
              @click="handleClick(0)"
              v-text="'返回使用帐号登录'"
            />
          </div>
        </div>
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>
import { Icon, Swipe, SwipeItem, Button } from 'vant'
export default {
  name: 'AccountPanelLogin',
  components: {
    [Icon.name]: Icon,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Button.name]: Button,
    AccountForm: () => import('./form')
  },
  data () {
    return {
      page: 0,
      loading: false
    }
  },
  computed: {
    field () {
      return [['user', 'pass'], ['user', 'code']][this.page]
    }
  },
  watch: {
    page (v) {
      this.$emit('click', { type: 'subPage', page: v })
      this.swipeTo()
    }
  },
  methods: {
    async handleLogin (ref) {
      this.loading = true
      const login = await this.$refs[ref].doLogin(ref)
      login && this.$emit('click', { type: 'login' })
      this.loading = false
    },
    handleClick (page) {
      if (page < 2) {
        this.page = page
      } else {
        const data = { page }
        this.$emit('click', { type: 'changePage', data })
      }
    },
    swipeTo () {
      this.$refs.swipe.swipeTo(this.page)
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/css/common/variables.styl'
.account-panel-login
  height 100%
.account-panel_form
  h1
    margin $font 0
    font-size 48px
    color $dark
    text-align center
  button
    margin $font * 2.5 auto $font
    border-radius 8px
</style>
