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
import { AliossFileUploader } from '@/assets/js/uploader/index.js'
export default {
  name: 'HomeIndex',
  components: {
    // ComPlayer: () => import('@/components/common/com-player.vue')
  },
  data () {
    return {
      video: 'https://vod.jiankao.wang/7c01465c94e449eeb2c795909d6b5eca/84b66563011d4411b801161ac54cd95a-6a3736091d286b946486bc6e0da0fdc7-sd.mp4',
      config: {
        accessKeyId: 'STS.NTwR17qG7u25A58sR8pxH7QDT',
        accessKeySecret: 'DYT8vnShZ85q3bF5zM6ZLSYsmYpovwHXEq5ury8mF6rJ',
        bucket: 'sihong-ss',
        endpoint: 'http://oss-cn-shanghai.aliyuncs.com',
        region: 'oss-cn-shanghai',
        securityToken: 'CAIS/AF1q6Ft5B2yfSjIr5fCGYuDnJgWwvDeQxOJl1JtfPdk2JTvtjz2IHBOf3loBegZsP02lWlR7vsZlrlXd7ZkXEj5betv0ZRszw2FO3hXXSFzq+5qsoasPETOITyZtZagToeUZdfZfejXGDKgvyRvwLz8WCy/Vli+S/OggoJmadJlNWvRL0AxZrFsKxBltdUROFbIKP+pKWSKuGfLC1dysQcO4gEWq4bHm5PCskeP1wOqm7FI+Nuue6LJNZc8YM1NNP6ux/Fze6b71ypd1gNH7q8ejtYfqW2c7onBWwYPukzXarOMr4Z1SRJhYq8zF6Ne6eL7kfBoeQdPOD1WWnwagAF0egvIXwf3eat1R5nkIB118sq8GEsquae6kG7aINsCQlN2FfrjiYjiGlZ11OXPd/TFfwp9+YZDbROpLHIZD56ASxNVsosCSBsDF23EUwI8mqDS9iG5pAZdrUcBB3gAmaxCwutCrnB0ue6nz2rvKFpoaZfkQ/udG774TII8EZFX6g==',
        // file_name: ['3'],
        // path: 'cert/',
        paths: [],
        url: 'https://sihong-ss.oss-cn-shanghai.aliyuncs.com/'
      }
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
    async handleUpload () {
      // 1. 使用sts参数初始化
      // await this.getSTS()
      const alioss = new AliossFileUploader({ oss: this.config })
      // 2. 执行上传任务
      // alioss.upload()
      alioss.create({
        // accept: ['jpg'],
        // limit: { min: 120, max: 1120, unit: 'KB' },
        // size: { width: 776, height: 489, scale: 2 }
        // size: { width: 620, height: 300, scale: 1.5, error: 0.03 }
        // size: { width: 620, height: 300, aspectRatio: '31:15' }
        // size: { aspectRatio: '31:15' }
        size: { width: 620, height: 300, scale: 0.7, error: 5 }
      })
    },
    async getSTS () {
      const data = await this.$http.post('upload/stsUpload', {
        number: 1,
        type: 0,
        device: 0,
        profession: 0,
        region: '360000',
        token: '722639b183504ffa3e31c86ec5c5ba18'
      }, { baseURL: 'http://ss.sihongedu.com' })
      console.log(data)
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
