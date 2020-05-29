<template>
  <div class="app">
    <!-- set page layout by router meta -->
    <templates
      v-if="template"
      :is="template"
    />
    <!-- for public page: error, login oth. -->
    <router-view v-else />
  </div>
</template>
<script>
import LayoutsDefault from './default.vue'
import LayoutsHome from './home.vue'
export default {
  name: 'AppContainer',
  computed: {
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
