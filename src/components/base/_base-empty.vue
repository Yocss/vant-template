<template>
  <div class="base-empty flex-center">
    <div class="base-empty-bd flex-column-center">
      <slot>
        <van-icon name="warning" />
      </slot>
      <p>{{ title }}</p>
      <van-button
        v-if="btn.show"
        v-bind="btn.attrs"
        @click="callBack"
      >{{ btn.text }}</van-button>
    </div>
  </div>
</template>
<script>
import { Button, Icon } from 'vant'
export default {
  name: 'BaseEmpty',
  components: {
    [Button.name]: Button,
    [Icon.name]: Icon
  },
  props: {
    title: {
      type: String,
      default: '暂无相关数据'
    },
    button: {
      type: [Object, String, Boolean],
      default: false
      // () => {
      //   return {
      //     attrs: {
      //       type: 'info',
      //     },
      //     text: '确定',
      //   }
      // }
    },
    callBack: {
      type: Function,
      default: undefined
    }
  },
  computed: {
    btn () {
      let show = false
      let text = '确定'
      const attrs = { size: 'small', type: 'info', plain: true, round: true }
      const type = Object.prototype.toString.call(this.button).slice(8, -1)
      switch (type) {
        case 'Object':
          show = true
          Object.assign(attrs, this.button.attrs || {})
          break
        case 'String':
          if (this.button) {
            show = true
            text = this.button
          }
          break
      }
      return Object.assign({}, { show, text, attrs })
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/css/common/variables.styl'
.base-empty
  width 100%
  height 100%
  &-bd
    i
      font-size 140px
      color lighten($light, 60%)
    p
      margin $font auto
      font-size $font
      color $grey
</style>
