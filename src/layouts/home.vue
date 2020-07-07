<template>
  <div class="layouts-home">
    <router-view />
    <home-foot-nav />
  </div>
</template>
<script>
import HomeFootNav from '@/components/layouts/home-foot-nav.vue'
export default {
  name: 'LayoutsHome',
  components: {
    HomeFootNav
  }
}
</script>

<style lang="stylus">
@import '~@/assets/css/common/variables.styl'
.layouts-home
  // padding-bottom $footHeight

</style>
