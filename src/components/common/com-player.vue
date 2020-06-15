<template>
  <div class="com-player">
    <!-- 播放器 -->
    <div id="com-player-box" />
  </div>
</template>
<script>
// eslint-disable-next-line
import '@/assets/js/ckplayer/ckplayer.min.js'
export default {
  name: 'ComPlayer',
  data () {
    return {
      player: null
    }
  },
  mounted () {
    const Ckplayer = window.ckplayer
    this.player = new Ckplayer({
      container: '#com-player-box',
      variable: 'player',
      flashplayer: false,
      mobileCkControls: true,
      mobileAutoFull: false,
      autoPlay: true,
      // video: 'https://vod.jiankao.wang/7c01465c94e449eeb2c795909d6b5eca/fe4720a772a550e672c91a0ac3a75bba-ld.m3u8'
      video: 'https://vod.jiankao.wang/7c01465c94e449eeb2c795909d6b5eca/84b66563011d4411b801161ac54cd95a-6a3736091d286b946486bc6e0da0fdc7-sd.mp4'
    })
  }
}
</script>
