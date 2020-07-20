<template>
  <div class="com-music">
    <div class="control-bar flex-align-center">
      <div
        id="controlBtn"
        style="padding: 20px; border: 1px solid #ccc;"
        v-text="'播放'"
        @click="controllPlay"
      />
      <div
        style="padding: 20px; border: 1px solid #ccc;"
        @click="setMuted"
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
      audio: {
        player: null,
        AudioContext: null,
        audioCtx: null,
        gainNode: null,
        track: null // 轨迹
      },
      options: {
        muted: false,
        volume: 60
      }
    }
  },
  methods: {
    controllPlay (e) {
      this.$toast('ha')
      this.createAudio()
      if (this.audio.audioCtx.state === 'suspended') {
        this.auido.audioCtx.resume()
      }
      this.audio.player.play()
    },
    setMuted () {
      this.audio.gainNode.gain.value = 0
    },
    createAudio () {
      if (!this.audio.AudioContext) {
        this.audio.AudioContext = window.AudioContext || window.webkitAudioContext
        this.audio.audioCtx = new this.audio.AudioContext()
        this.audio.player = this.$refs.music
        this.audio.track = this.audio.audioCtx.createMediaElementSource(this.audio.player)
        this.audio.gainNode = this.audio.audioCtx.createGain()
        this.audio.track.connect(this.audio.gainNode).connect(this.audio.audioCtx.destination)
      }
    },
    canPlay (e) {
      console.log(e)
    }
  }
}
</script>
