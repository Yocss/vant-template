<template>
  <van-action-sheet
    v-model="show"
    :round="round"
    :duration="duration"
    :close-on-click-overlay="closeOnClickOverlay"
    get-container="body"
    v-bind="$attrs"
    class="base-modal"
  >
    <slot />
  </van-action-sheet>
</template>

<script>
import { ActionSheet } from 'vant'
export default {
  name: 'BaseModal',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    round: {
      type: Boolean,
      default: false
    },
    duration: {
      type: Number,
      default: 0.2
    },
    closeOnClickOverlay: {
      type: Boolean,
      default: false
    }
  },
  components: {
    [ActionSheet.name]: ActionSheet
  },
  computed: {
    show: {
      get () {
        return this.value
      },
      set (v) {
        this.$emit('input', v)
        !v && this.$emit('close')
      }
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/css/common/variables.styl'
  .base-modal
    width 100%
    height 100%
    max-height 100% !important
    overflow hidden
    background-color #fff
    // position absolute
    .van-action-sheet__content
      width 100%
      height 100%
</style>
