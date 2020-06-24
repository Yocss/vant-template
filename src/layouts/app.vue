<template>
  <div
    :class="{ animate: animate }"
    class="app"
  >
    <!-- set page layout by router meta -->
    <templates
      v-if="template"
      :is="template"
      class="layout"
    />
    <!-- for public page: error, login oth. -->
    <router-view
      v-else
      class="layout"
    />
    <com-account />
    <!-- loading status -->
    <transition name="fade">
      <div v-show="loading" class="layout-loading filter flex-center">
        <base-loading />
      </div>
    </transition>
  </div>
</template>
<script>
import LayoutsDefault from './default.vue'
import LayoutsHome from './home.vue'
export default {
  name: 'AppContainer',
  components: {
    ComAccount: () => import('@/components/common/account-panel/index.vue')
  },
  computed: {
    animate () {
      return this.$store.state.animate
    },
    route () {
      return this.$store.state.route
    },
    loading () {
      return this.$store.state.loading
    },
    template () {
      const layout = {
        default: LayoutsDefault,
        home: LayoutsHome,
        null: false
      }
      const k = this.$store.state.layout
      return layout[k]
    }
  }
}
</script>

<style lang="stylus">
.app
.layout
  position relative
  width 100%
  height 100%
.app.animate
  overflow hidden
.layout
  z-index 1
  &-loading
    position absolute
    left 0
    top 0
    right 0
    bottom 0
    background-color rgba(#fff, .4)
    z-index 2
</style>
