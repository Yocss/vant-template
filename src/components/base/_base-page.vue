<template>
  <div
    :class="{ 'show-head': head }"
    class="base-page"
  >
    <!-- header -->
    <div
      v-show="head"
      class="base-page-hd"
    >
      <slot name="header">
        <app-header />
      </slot>
    </div>
    <!-- /header -->

    <!-- body -->
    <div class="base-page-bd">
      <!-- allow show page without logged -->
      <template v-if="allowShow">
        <slot />
      </template>
      <template v-else>
        <base-empty
          :call-back="login"
          title="您还没有登录，请登录后继续"
          button="立即登录"
        />
      </template>
    </div>
    <!-- /body -->
  </div>
</template>
<script>
import { Loading } from 'vant'
import AppHeader from '@/components/common/app-header.vue'
export default {
  name: 'BasePage',
  components: {
    [Loading.name]: Loading,
    AppHeader
  },
  props: {
    needLogin: {
      type: Boolean,
      default: false
    },
    head: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    allowShow () {
      let bool = true
      if (this.needLogin && !this.isLogin) {
        bool = false
      }
      return bool
    }
  },
  methods: {
    login () {
      console.log('do login')
    }
  }
}
</script>
<style lang="stylus">
@import '~@/assets/css/common/variables.styl'
.base-page
  width 100%
  height @width
  $headHeight = $font * 3
  &.show-head
    padding-top $headHeight
    &>.base-page-hd
      display block
  &-hd
    display none
    position absolute
    left 0
    top 0
    width @width
    height $headHeight
  &-bd
    width @width
    height @width
</style>
