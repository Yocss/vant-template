<template>
  <div class="layouts-home-foot van-hairline--top">
    <ul class="flex-between-center">
      <li
        v-for="nav in footNav"
        :key="nav.title"
        :class="`${navClass} flex-center ${isActive(nav.name) ? 'active' : ''}`"
        @click="routerTo(nav.name)"
      >
        <div class="item">
          <div class="icon">
            <van-icon
              :name="isActive(nav.name) ? icons[nav.name][1] : icons[nav.name][0]"
            />
          </div>
          <p
            v-text="nav.title"
          />
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import { Icon } from 'vant'
export default {
  name: 'LayoutsHomeFootNav',
  components: {
    [Icon.name]: Icon
  },
  data () {
    return {
      icons: {
        HomeIndex: ['wap-home-o', 'wap-home'],
        MineIndex: ['manager-o', 'manager']
      }
    }
  },
  computed: {
    routeName () {
      return this.$route.name
    },
    footNav () {
      return this.$store.state.footNav
    },
    navClass () {
      return `w${this.footNav.length}`
    }
  },
  methods: {
    isActive (name) {
      return this.$route.name === name
    },
    routerTo (name) {
      this.$router.replace({ name })
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/css/common/variables.styl'
$footHeight = ($font - 4) * 4
.layouts-home-foot
  position fixed !important
  left 0
  // bottom -100%
  bottom 0
  width 100%
  height $footHeight
  background-color #fff
  ul
    li
      width 100%
      height $footHeight
      &.active
        color $primary
      .item
        text-align center
        &>.icon
          margin 0 auto 4px
          width $font + 4
          height @width
          font-size @width
        &>p
          font-size $font - 4
          line-height auto
</style>
