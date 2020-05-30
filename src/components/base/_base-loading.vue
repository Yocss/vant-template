<template>
  <div class="base-loading">
    <div
      :style="logoStyle"
      class="base-loading-item flex-column-center"
    >
      <span />
    </div>
    <p
      v-text="title"
    />
  </div>
</template>
<script>
export default {
  name: 'BaseLoading',
  props: {
    src: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '正在加载数据'
    }
  },
  computed: {
    logoStyle () {
      return this.src ? {
        'background-image': `url(${this.src})`
      } : {}
    }
  }
}
</script>
<style lang="stylus">
@import '~@/assets/css/common/variables.styl'
.base-loading
  width 1
  &-item
    position relative
    padding 1px
    width $font * 2.2
    height @width
    margin 0 auto ($font / 2)
    background-image url('/logo.png')
    background-position center center
    background-repeat no-repeat
    background-size (@width * .66) (@width * .66)
    overflow hidden
    img
      position absolute
      left 0
      top 0
      width 100%
      height 100%
    span
      display block
      width 100%
      height 100%
      border-top 1px solid $primary
      border-bottom 1px solid $success
      border-radius 50%
      animation: yo-rotate .8s linear infinite;
  &>p
    font-size $font - 4
    color $grey
</style>
