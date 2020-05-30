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
      v-show="showRight"
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
    showRight () {
      return typeof this.right !== 'boolean'
    },
    tit () {
      const tit = this.$route.meta.title || ''
      let res = ''
      if (typeof this.title === 'boolean') {
        res = this.title ? tit : ''
      } else {
        res = this.title
      }
      return res
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
          fn ? fn() : this.$emit('click', 'right')
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
  .middle
    width 50%
    height 100%
    font-size $font
    font-weight 400
    color $black
</style>
