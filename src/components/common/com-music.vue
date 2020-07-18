<template>
  <div class="com-music">
    <div class="control-bar flex-align-center">
      <div
        style="padding: 20px; border: 1px solid #ccc;"
        @click="playControl('play')"
        v-text="'播放'"
      />
      <div
        style="padding: 20px; border: 1px solid #ccc;"
        @click="playControl('pause')"
        v-text="'暂停'"
      />
      <div
        style="padding: 20px; border: 1px solid #ccc;"
        @click="playControl('muted')"
        v-text="'静音'"
      />
    </div>
    <!-- muted="muted" -->
    <audio
      ref="music"
      controls
      :src="data"
      preload="metadata"
      :muted="options.muted"
      :volume="options.volume"
      crossOrigin = "anonymous"
    />
  </div>
</template>
<script>
export default {
  name: 'ComMusic',
  data () {
    return {
      // data: 'http://sihong-lm.oss-cn-shanghai.aliyuncs.com/assets/balloon.mp3',
      data: 'https://vod.jiankao.wang/sv/31452569-17361169053/31452569-17361169053.mp3',
      player: null,
      audioCtx: null,
      gainNode: null,
      track: null, // 轨迹
      options: {
        muted: false,
        volume: 60
      }
    }
  },
  mounted () {
    // const AudioContext = window.AudioContext || window.webkitAudioContext
    // this.audioCtx = new AudioContext()
    this.player = this.$refs.music
    // this.track = this.audioCtx.createMediaElementSource(this.player)
    // this.gainNode = this.audioCtx.createGain()
    // this.track.connect(this.gainNode).connect(this.audioCtx.destination)
  },
  methods: {
    playControl (type) {
      // if (this.audioCtx.state === 'suspended') {
      //   this.audioCtx.resume()
      // }
      switch (type) {
        case 'play':
          this.player.play()
          break
        case 'pause':
          this.player.pause()
          break
        case 'muted': {
          this.options.volume = 0
          this.options.muted = true
          // this.player.load()
          // console.log(this.gainNode.gain.value)
          // this.gainNode.gain.value = 0
          break
        }
      }
    },
    canPlay (e) {
      console.log(e)
    }
  }
}
</script>
