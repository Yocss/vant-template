<template>
  <div class="base-page">
    <div class="base-page-bd">
      <!-- does the page need login -->
      <template v-if="allowShow">
        <slot />
      </template>
      <template v-else>
        <base-empty title="你还没有登录，请登录后继续" />
      </template>
    </div>
    <!-- loading status -->
    <div v-show="loading" class="base-page-loading">
      <van-loading
        type="spinner"
        color="#333"
        vertical
      >
        拼命加载中...
      </van-loading>
    </div>
  </div>
</template>
<script>
import { Loading } from 'vant'
export default {
  name: 'BasePage',
  components: {
    [Loading.name]: Loading
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    needLogin: {
      type: Boolean,
      default: false
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
  }
}
</script>
