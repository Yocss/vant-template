<template>
  <!-- <div class="layouts-default"> -->
  <transition :name="animate">
      <router-view class="layouts-default" />
  </transition>
  <!-- </div> -->
</template>
<script>
export default {
  name: 'LayoutsDefault',
  data () {
    return {
      animate: 'slideIn'
    }
  },
  watch: {
    '$route' (to, from) {
      // console.log(to)
      const toLen = to.path.split('/').length
      const fromLen = from.path.split('/').length
      // this.animate = toLen < fromLen ? 'slideIn' : 'slideOut'
      console.log(toLen, fromLen)
      console.log(this.animate)
    }
  }
}
</script>
