<template>
  <div class="app-header flex-between-center van-hairline--bottom">
    <div
      v-show="showLeft"
      class="left flex-align-center"
      @click="handleClick('left')"
    >
      <slot name="left">
        <van-icon name="arrow-left" />
      </slot>
    </div>
    <div
      class="middle flex-center"
      v-text="tit"
    />
    <div
      :class="{ show: right }"
      class="right flex-align-center justify-end"
      @click="handleClick('right')"
    >
      <slot name="right">
        <van-icon name="weapp-nav" />
      </slot>
    </div>
  </div>
</template>
<script>
import { Icon } from 'vant'
export default {
  name: 'AppHeader',
  components: {
    [Icon.name]: Icon
  },
  props: {
    title: {
      type: [String, Boolean],
      default: ''
    },
    left: {
      type: [Function, Boolean],
      default: undefined
    },
    right: {
      type: [Function, Boolean],
      default: undefined
    }
  },
  computed: {
    showLeft () {
      return typeof this.left !== 'boolean'
    },
    tit () {
      const tit = this.$route.meta.title || ''
      switch (typeof this.title) {
        case 'boolean':
          return this.title ? tit : ''
        case 'string':
          return this.title || tit
        default:
          return ''
      }
    }
  },
  methods: {
    handleClick (type) {
      switch (type) {
        case 'left': {
          const fn = this.left
          fn ? fn() : this.goBack() && this.$emit('click', 'left')
          break
        }
        case 'right': {
          const fn = this.right
          switch (typeof fn) {
            case 'boolean':
              fn && this.$emit('click', 'right')
              break
            case 'function':
              fn()
              break
          }
          break
        }
      }
    }
  }
}
</script>
<style lang="stylus">
@import '~@/assets/css/common/variables.styl'
.app-header
  width 100%
  height $font * 3
  .left
  .right
    width 20%
    height 100%
    i
      font-size $font + 4
      color $dark
      font-weight normal
  .left
    padding-left $font
  .right
    padding-right $font
    &>*
      display none
    &.show
      &>*
        display block
  .middle
    width 50%
    height 100%
    font-size $font
    font-weight 400
    color $black
</style>
