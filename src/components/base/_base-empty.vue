<template>
  <div class="base-empty">
    <p>{{ title }}</p>
    <van-button
      v-if="button"
      v-bind="button.attrs"
      @click="$emit('click')"
    >{{ button.buttonText }}</van-button>
  </div>
</template>
<script>
import { Button } from 'vant'
export default {
  name: 'BaseEmpty',
  components: {
    [Button.name]: Button
  },
  props: {
    title: {
      type: String,
      default: '暂无相关数据'
    },
    button: {
      type: [Object, Boolean],
      default: false
      // () => {
      //   return {
      //     attrs: {
      //       type: 'info',
      //     },
      //     buttonText: '确定',
      //   }
      // }
    },
    callBack: {
      type: Function,
      default: undefined
    }
  }
}
</script>
