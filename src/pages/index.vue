<template>
  <base-page
    class="home-index"
  >
    <router-link to="/news">
      去新闻页
    </router-link>
  </base-page>
</template>
<script>
export default {
  name: 'HomeIndex',
  // computed: {
  //   loading () {
  //     return this.$store.state.loading
  //   }
  // },
  // mounted () {
  //   setInterval(() => {
  //     this.$store.dispatch('SetStore', { loading: !this.loading })
  //   }, 3000)
  // }
  created () {
    this.asyncData()
  },
  methods: {
    async asyncData () {
      const data = await this.$http.post('test')
      console.log(data)
    }
  }
}
</script>

<style lang="stylus">
.home-index
  // height 100%
</style>
