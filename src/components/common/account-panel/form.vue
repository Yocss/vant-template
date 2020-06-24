<template>
  <div
    class="account-form"
  >
    <template
      v-for="k in field"
    >
      <van-field
        :key="form[k].key"
        v-model="form[k].value"
        v-bind="form[k].elementAttrs"
        :clickable="false"
        :clearable="k === 'user'"
        :right-icon="k === 'pass' ? rightIcon : ''"
        class="account-input"
        @click-right-icon="clickRightIcon"
        @focus="handleFocus(k)"
        @blur="handleBlur(k)"
        @input="handleInput"
      >
        <template
          v-if="k === 'code'"
          v-slot:button
        >
          <div
            class="account-form-code"
            @click="getVerifyCode"
          >
            {{ timer.time !== 60 ? timer.time : '获取短信验证码' }}
          </div>
        </template>
      </van-field>
    </template>
  </div>
</template>

<script>
import throttle from 'lodash/throttle'
export default {
  components: {
    VanField: () => import('vant/lib/field')
  },
  props: {
    field: {
      type: Array,
      default: () => { return [] }
    },
    phone: {
      type: [Number, String],
      default: ''
    },
    type: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      keep: false,
      showPass: false,
      currentKey: '',
      code: '',
      timer: {
        obj: null,
        time: 60
      },
      form: {
        user: {
          key: 'user',
          value: '',
          rule: [
            { required: true, message: '手机号不能为空' },
            { min: 13000000000, message: '手机号错误' },
            { max: 19999999999, message: '手机号错误' }
          ],
          elementAttrs: {
            placeholder: '请输入手机号',
            type: 'digit', // 妈的蛋
            error: false
          }
        },
        pass: {
          key: 'pass',
          value: '',
          rule: [
            { required: true, message: '密码不能为空' },
            { minLen: 6, message: '密码不得少于6位' }
          ],
          elementAttrs: {
            placeholder: '请输入密码',
            type: 'password',
            error: false
          }
        },
        code: {
          key: 'code',
          value: '',
          rule: [
            { required: true, message: '验证码不能为空' },
            { len: 4, message: '验证码错误' }
          ],
          elementAttrs: {
            placeholder: '请输入验证码',
            type: 'digit',
            error: false
          }
        }
      }
    }
  },
  computed: {
    rightIcon () {
      return this.showPass ? 'eye-o' : 'closed-eye'
    }
  },
  watch: {
    field: {
      handler () {
        // 初始化 data里的值
        if (!this.keep) {
          this.form = JSON.parse(JSON.stringify(this.$options.data().form))
          this.showPass = false
          this.currentKey = ''
          this.closeTimer()
        }
        if (this.phone) {
          this.form.user.value = this.phone
          this.openTimer()
        }
      },
      deep: true
    },
    'form.user.value': {
      handler (v) {
        this.phone !== v && this.closeTimer()
      }
    }
  },
  beforeDestroy () {
    this.closeTimer()
  },
  methods: {
    // 显示和隐藏密码
    clickRightIcon () {
      this.showPass = !this.showPass
      Object.assign(this.form.pass.elementAttrs, {
        type: this.showPass ? 'text' : 'password'
      })
    },
    handleFocus (k) {
      this.currentKey = k
      this.doVaildate(this.form[k])
    },
    handleBlur (k) {
      this.currentKey = ''
      this.doVaildate(this.form[k])
      // ios 端，失焦回滚，避免点击错位的ios专属bug
      if (window) {
        const userAgent = window.navigator.userAgent || ''
        const isIOS = /iPod/i.test(userAgent) || /iPad/i.test(userAgent) || /iPhone/i.test(userAgent)
        isIOS && window.scrollTo(0, 0)
      }
    },
    handleInput () {
      switch (this.currentKey) {
        case 'user':
          {
            this.form.user.value = this.form.user.value.slice(0, 11)
            const v = this.form.user.value
            const n = 100000000
            // 执行校验
            if (v.length === 11 && v > 13 * n && v < 20 * n) {
              this.doVaildate(this.form.user)
            } else {
              this.$notify.clear()
              Object.assign(this.form.user.elementAttrs, { error: false })
            }
          }
          break
        case 'code':
          {
            this.form.code.value = this.form.code.value.slice(0, 4)
            const v = this.form.code.value
            if (v.length === 4 && v < 10000) {
              this.doVaildate(this.form.code)
            } else {
              this.$notify.clear()
              Object.assign(this.form.code.elementAttrs, { error: false })
            }
          }
          break
      }
      // 数据为空时停止校验
      if (!this.form[this.currentKey].value) {
        Object.assign(this.form[this.currentKey].elementAttrs, {
          error: false
        })
      }
    },
    doVaildate (field) {
      let isOk = false
      const isArr = Array.isArray(field)
      const rule = isArr ? field : [field]
      if (isArr || field.value) {
        const { error, infos } = this.$vaildate(rule)
        // 报错时输入框标红
        if (isArr) {
          infos.forEach(item => {
            Object.assign(this.form[item.field].elementAttrs, { error })
          })
        } else {
          Object.assign(field.elementAttrs, { error })
        }
        // 顶部弹出提示
        error ? this.$notify({
          type: 'danger',
          message: infos[0].message
        }) : this.$notify.clear()
        isOk = !error
      }
      return isOk
    },
    getForm () {
      const form = {}
      const vals = []
      this.field.forEach(k => {
        vals.push(this.form[k])
        if (k === 'user') {
          form.phone = this.form[k].value
        } else {
          form[k] = this.form[k].value
        }
      })
      return this.doVaildate(vals) ? form : false
    },
    getVerifyCode: throttle(async function (keep = false) {
      this.keep = keep
      const phone = this.doVaildate([this.form.user])
      if (this.form.user.value * 1 !== this.phone * 1 && phone && this.timer.time > 59) {
        this.openTimer()
        const form = { type: this.type, phone: this.form.user.value }
        const data = await this.$http.post('account/verify_code', form)
        if (data) {
          // data.code !== 0 && this.closeTimer() && this.$notify({
          //   type: 'danger',
          //   message: data.info
          // })
          return this.form.user.value
        } else {
          this.closeTimer()
          return false
        }
        // return data.code === 0 ? this.form.user.value : false
      }
      if (this.form.user.value * 1 === this.phone * 1) {
        return this.phone * 1
      }
    }, 300),
    openTimer () {
      this.timer.obj = setInterval(() => {
        this.timer.time--
        if (this.timer.time < 1) {
          this.closeTimer()
        }
      }, 1000)
    },
    closeTimer () {
      clearInterval(this.timer.obj)
      this.timer.time = 60
      this.timer.obj = null
      return true
    },
    // 执行登录
    doLogin: throttle(async function (type = 'account', params) {
      const form = params || this.getForm()
      const api = {
        account: 'account/login',
        sms: 'account/login_sms'
      }
      if (form) {
        const data = await this.$http.post(api[type], form)
        if (data) {
          this.closeTimer()
          this.$store.dispatch('SetToken', data.token)
          // this.$store.dispatch('SetStore', {
          //   key: 'user',
          //   value: data
          // })
        }
        return data
      }
    }, 500),
    doSubmit: throttle(async function (type = 'register') {
      const form = this.getForm()
      const api = {
        register: 'account/register',
        find: 'account/reset_pwd'
      }
      if (form) {
        const params = Object.assign(form, { phone: this.form.user.value })
        if (type === 'register') {
          Object.assign(params, { ...this.$route.query })
        }
        const data = await this.$http.post(api[type], params)
        let bool = false
        if (data) {
          bool = await this.doLogin('account', params)
          // } else {
          //   this.$notify({
          //     type: 'danger',
          //     message: data.info
          //   })
        }
        return bool
      }
    }, 500)
  }
}
</script>
<style lang="stylus">
@import '~@/assets/css/common/variables.styl'
  $fieldHeight = 114px
  .account-form
    width 100%
    height auto
    &-code
      width 200px
      color $primary
      font-size 28px
      text-align right
    .account-input
      // position relative
      height $fieldHeight
      padding 0
      overflow hidden
      &::after
        border-bottom none
      &.van-field--error
        &>div
          border-bottom-color $danger
          input[type=text]
          input[type=password]
          input[type=number]
          input[type=tel]
            color $danger
      &>div
        // height $fieldHeight
        height 100%
        border-bottom 1px solid $gray
        overflow hidden
        &>div
          height 100%
        input[type=text]
        input[type=password]
        input[type=number]
        input[type=tel]
          display block
          padding 0 $font - 8
          border none
          // width 100%
          flex 1
          // height $fieldHeight
          height 100%
          font-size $font
          background-color #fff
        &>div
          padding-right $font - 8
          display flex
          justify-content center
          align-items center
          .van-field__right-icon
            padding-left $font - 16
    .van-field
      // border-bottom none
</style>
