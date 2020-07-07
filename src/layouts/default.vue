<template>
  <div class="layouts-default">
    <transition
      :name="animate"
      type="animation"
    >
      <router-view @animationend.native="onAnimated" />
    </transition>
  </div>
</template>
<script>
export default {
  name: 'LayoutsDefault',
  computed: {
    animate () {
      return this.$store.state.animate
    }
  },
  methods: {
    // 监听过渡动画结束 event， 结束后将animate置为'',以解除对.app的overflow:hidden限制
    onAnimated () {
      this.$store.dispatch('SetStore', { animate: '' })
    }
  }
}
</script>
