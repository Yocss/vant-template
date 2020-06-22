<template>
  <base-page
    class="home-index"
  >
    <!-- <com-player
      :src="video"
      poster="https://sihong-lm.oss-cn-shanghai.aliyuncs.com/other/11583918726b3f16216fcf40b6223d04fd501e4b8f8.jpg"
    /> -->
    <p>
      <a
        href="javascript:void(0);"
        style="display: block; width: 120px; height: 60px; margin: 15px; background-color: #f33; color: #fff;"
        @click="toggleVideo"
      >切换</a>
    </p>
    <div
      style="width: 200px; height: 100px; background-color: #f33; color: #fff;"
      @click="handleUpload"
    >上传图片</div>
    <router-link to="/news">
      去新闻页
    </router-link>
  </base-page>
</template>
<script>
import { Uploader } from '@/assets/js/uploader.js'
export default {
  name: 'HomeIndex',
  components: {
    // ComPlayer: () => import('@/components/common/com-player.vue')
  },
  data () {
    return {
      video: 'https://vod.jiankao.wang/7c01465c94e449eeb2c795909d6b5eca/84b66563011d4411b801161ac54cd95a-6a3736091d286b946486bc6e0da0fdc7-sd.mp4'
    }
  },
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
    // this.asyncData()
  },
  methods: {
    handleUpload () {
      const uploader = new Uploader()
      uploader.create({
        // accept: ['jpg'],
        // limit: { min: 120, max: 1120, unit: 'KB' },
        // size: { width: 776, height: 489, scale: 2 }
        // size: { width: 620, height: 300, scale: 1.5, error: 0.03 }
        // size: { width: 620, height: 300, aspectRatio: '31:15' }
        // size: { aspectRatio: '31:15' }
        size: { width: 620, height: 300, scale: 0.7, error: 5 }
      })
    },
    toggleVideo () {
      const url = ['https://vod.jiankao.wang/sv/161c514-1714d59df34/161c514-1714d59df34.mp4', 'https://vod.jiankao.wang/7c01465c94e449eeb2c795909d6b5eca/84b66563011d4411b801161ac54cd95a-6a3736091d286b946486bc6e0da0fdc7-sd.mp4']
      const i = url.findIndex(e => e === this.video)
      this.video = i > 0 ? url[0] : url[1]
    },
    async asyncData () {
      const data = await this.$http.post('base')
      console.log(data)
    }
  }
}
</script>

<style lang="stylus">
.home-index
  // height 100%
</style>
