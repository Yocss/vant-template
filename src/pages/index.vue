<template>
  <base-page
    :head="false"
    class="home-index"
  >
    <com-player
      ref="comPlayer"
      :src="video"
      poster="https://sihong-lm.oss-cn-shanghai.aliyuncs.com/other/11583918726b3f16216fcf40b6223d04fd501e4b8f8.jpg"
      @emit="handleEmit"
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
    <div style="margin: 20px;">
      <button
        @click="handlePlay"
      >
        去播放
      </button>
      <button
        @click="handlePause"
      >
        去暂停
      </button>
      <button
        @click="handleMuted"
      >
        去静音
      </button>
      <button
        @click="handleNext"
      >
        下一首
      </button>
    </div>
    <div
      style="margin-top: 40px; padding: 50px;"
    >
      <van-slider
        v-model="progress"
        @change="onChange"
      />
    </div>
  </base-page>
</template>
<script>
import { Alioss } from 'alioss-file-uploader'
import { Slider } from 'vant'
import ComPlayer from 'av-player'
export default {
  name: 'HomeIndex',
  components: {
    [Slider.name]: Slider,
    ComPlayer
    // ComPlayer: () => import('@/components/common/com-player.vue')
    // ComMusic: () => import('@/components/common/com-music.vue')
  },
  data () {
    return {
      total: 0,
      progress: 0,
      video: 'https://vod.jiankao.wang/7c01465c94e449eeb2c795909d6b5eca/84b66563011d4411b801161ac54cd95a-6a3736091d286b946486bc6e0da0fdc7-sd.mp4'
      // video: 'https://sihong-lm.oss-cn-shanghai.aliyuncs.com/assets/balloon.mp3'
      // video: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226225/1.m3u8'
      // video: 'http://boliu.jiankao.wang/aaa/bbb.m3u8?auth_key=1611109831-0-0-3e1c6dd0d8a195de929f602b5a563fe4'
      // video: 'https://vod.jiankao.wang/c5836ab4bf354a888c2270af4622a51e/1164b87649d8cfba09a73762c2914629-sd.m3u8'
      // video: 'rtmp://boliu.jiankao.wang/aaa/bbb?auth_key=1611110861-0-0-f514266afed1cc8510b8f8744d8d0926'
      // video: 'https://vod.jiankao.wang/7c01465c94e449eeb2c795909d6b5eca/84b66563011d4411b801161ac54cd95a-6a3736091d286b946486bc6e0da0fdc7-sd.mp4'
    }
  },
  methods: {
    handleEmit (e) {
      console.log(e)
      switch (e.event) {
        case 'play':
          this.total = e.time
          break
        case 'loaded':
          if (isNaN(this.total)) {
            this.total = e.time
          }
          break
        case 'timeupdate': {
          const t = e.time
          if (this.total > 0) {
            const value = t / this.total * 100
            this.progress = value
          }
          break
        }
        case 'ended':
          // this.handleNext()
          break
      }
    },
    onChange (v) {
      const t = this.total * v / 100
      this.$refs.comPlayer.player.currentTime(t)
      // this.$refs.comPlayer.player.playbackRate(3) // 设置播放速度
    },
    handlePlay () {
      this.$refs.comPlayer.player.play()
    },
    handlePause () {
      this.$refs.comPlayer.player.pause()
    },
    handleMuted () {
      this.$refs.comPlayer.player.muted(!this.$refs.comPlayer.player.muted())
    },
    handleNext () {
      this.$refs.comPlayer.player.src(this.video)
      this.handlePlay()
    },
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
