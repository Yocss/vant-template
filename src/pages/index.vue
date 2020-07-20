<template>
  <base-page
    :head="false"
    class="home-index"
  >
    <com-player
      :src="video"
      poster="https://sihong-lm.oss-cn-shanghai.aliyuncs.com/other/11583918726b3f16216fcf40b6223d04fd501e4b8f8.jpg"
    />
    <!-- <p>
      <a
        href="javascript:void(0);"
        style="display: block; width: 120px; height: 60px; margin: 0 15px; background-color: #f33; color: #fff;"
        @click="toggleVideo"
      >切换</a>
    </p>
    <div
      style="width: 200px; height: 100px; background-color: #f33; color: #fff;"
      @click="handleUpload"
    >上传图片</div> -->
    <!-- <com-music /> -->
    <!-- <router-link to="/news">
      去新闻页
    </router-link> -->
  </base-page>
</template>
<script>
import { Alioss } from 'alioss-file-uploader'
export default {
  name: 'HomeIndex',
  components: {
    ComPlayer: () => import('@/components/common/com-player.vue')
    // ComMusic: () => import('@/components/common/com-music.vue')
  },
  data () {
    return {
      // video: 'https://vod.jiankao.wang/7c01465c94e449eeb2c795909d6b5eca/84b66563011d4411b801161ac54cd95a-6a3736091d286b946486bc6e0da0fdc7-sd.mp4'
      video: 'https://sihong-lm.oss-cn-shanghai.aliyuncs.com/assets/balloon.mp3'
    }
  },
  methods: {
    async handleUpload () {
      if (this.checkLogin()) {
        const alioss = new Alioss()
        alioss.upload(this.getSTS, this.callBack)
      }
    },
    callBack (list) {
      console.log(list)
    },
    async getSTS (list) {
      const query = { number: list.length, type: 100 }
      const token = this.$store.state.token
      const data = await this.$http.post('upload/stsUpload', Object.assign(query, { token }))
      if (data) {
        const config = {
          accessKeyId: data.accessKeyId || '',
          accessKeySecret: data.accessKeySecret || '',
          endpoint: data.endpoint || '',
          region: data.region || '',
          bucket: data.bucket || '',
          stsToken: data.securityToken || ''
        }
        const files = data.file_name.map(e => data.path + e)
        return { config, files }
      }
    },
    toggleVideo () {
      // const url = ['https://vod.jiankao.wang/sv/161c514-1714d59df34/161c514-1714d59df34.mp4', 'https://vod.jiankao.wang/7c01465c94e449eeb2c795909d6b5eca/84b66563011d4411b801161ac54cd95a-6a3736091d286b946486bc6e0da0fdc7-sd.mp4']
      const url = 'https://sihong-lm.oss-cn-shanghai.aliyuncs.com/assets/balloon.mp3'
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
