<template>
  <div class="com-player">
    <!-- 播放器 -->
    <div id="com-player-box">
      <video
        ref="videoPlayer"
        class="com-player-video video-js vjs-big-play-centered"
      />
    </div>
  </div>
</template>
<script>
import 'video.js/dist/video-js.min.css'
import videojs from 'video.js'
import { IS_IOS } from '@/assets/js/utils/platform.js'
export default {
  name: 'ComPlayer',
  props: {
    url: {
      type: String,
      default: 'https://vod.jiankao.wang/7c01465c94e449eeb2c795909d6b5eca/84b66563011d4411b801161ac54cd95a-6a3736091d286b946486bc6e0da0fdc7-sd.mp4'
    },
    poster: {
      type: String,
      default: ''
    },
    options: {
      type: Object,
      default: () => { return {} }
    }
  },
  data () {
    return {
      player: null,
      timer: null,
      lastTime: 0,
      thisTime: 0
    }
  },
  mounted () {
    const player = this.$refs.videoPlayer
    // console.log(videojs.IS_IOS)
    const options = Object.assign({
      autoplay: false,
      controls: true,
      playsinline: IS_IOS, // 阻止IOS设备启用默认的全屏播放
      webkitPlaysinline: IS_IOS, // 阻止IOS设备启用默认的全屏播放
      preload: 'auto',
      // children: [
      //   'bigPlayButton',
      //   'controlBar'
      // ],
      // nativeControlsForTouch: true,
      // controlBar: {
      //   fullscreenToggle: true
      // },
      // children: {
      //   controlBar: {
      //     fullscreenToggle: false
      //   }
      // },
      // language: 'zh-CN',
      responsive: true,
      fluid: true,
      aspectRatio: '16:9',
      // poster: '//vjs.zencdn.net/(…)oceans.png',
      sources: '//vod.jiankao.wang/7c01465c94e449eeb2c795909d6b5eca/84b66563011d4411b801161ac54cd95a-6a3736091d286b946486bc6e0da0fdc7-sd.mp4'
    }, this.options)
    const _this = this
    this.player = videojs(player, options, function onPlayerReady () {
      console.log('onPlayerReady', this)
      _this.addEvent()
    })
  },
  beforeDestroy () {
    // this.clearTimer()
    // 注销播放器
    this.player && this.player.dispose()
  },
  methods: {
    createPlayer () {
      const CkPlayer = window.ckplayer
      this.player = new CkPlayer(Object.assign(
        {
          container: '#com-player-box',
          variable: 'ckplayer',
          poster: '',
          video: '',
          mobileCkControls: true,
          mobileAutoFull: false,
          autoPlay: true,
          h5container: '#com-player-box'
        },
        { video: this.url, poster: this.poster },
        this.config
      ))
      this.player && this.addEvent()
    },
    // 监听播放器事件
    addEvent () {
      // 元数据加载完成时
      // this.player.addListener('loadedmetadata', this.handleLoaded)
      // 开始播放时，记录用户播放数据
      this.player.on('play', this.handlePlay)
      // 播放暂停
      this.player.on('pause', this.handlePause)
      // 发生错误时
      this.player.on('error', this.handleError)
      // 播放完成时
      this.player.on('ended', this.handleEnded)
    },
    removeEvent () {
      // this.player.off('loadedmetadata', this.handleLoaded)
      this.player.off('play', this.handlePlay)
      this.player.off('pause', this.handlePause)
      this.player.off('error', this.handleError)
      this.player.off('ended', this.handleEnded)
    },
    // 元数据加载完成时, 开始自动播放
    handleLoaded () {
      this.player.videoPlay()
      this.doEmit('loaded')
    },
    // 播放开始时，开始记录学员的记录
    handlePlay () {
      console.log('play')
      this.startLog()
      this.doEmit('play')
    },
    // 播放暂停
    handlePause () {
      console.log('pause')
      this.doEmit('pause')
    },
    // 播放发生错误时
    handleError () {
      console.log('error')
      this.doEmit('error')
    },
    // 播放结束时
    handleEnded () {
      console.log('end')
      this.doEmit('ended')
    },
    // 记录用户播放时间进度
    startLog () {
      // 每 10s 触发一次记录
      this.clearTimer()
      this.timer = setInterval(() => {
        this.thisTime = Math.ceil(this.player.time)
        if (this.thisTime !== this.lastTime) {
          this.lastTime = this.thisTime
          this.doEmit('play', this.thisTime)
        }
      }, 10000)
    },
    // 清除定时器
    clearTimer () { clearInterval(this.timer) },
    // 触发事件
    doEmit (event, time = this.player.time) {
      event !== 'play' && this.clearTimer()
      this.$emit('emit', { event, time })
    }
  }
}
</script>
<style lang="stylus">
.com-player
  display block
  width 100%
  #com-player-box
    width 100%
    height 100%
    .com-player-video
      font-size 12PX
      .vjs-progress-holder
        height .2em
        user-select none
        outline none
        box-shadow none
        &:focus
          border none
          box-shadow none
      .vjs-play-progress
        outline none
        box-shadow none
        &:focus
          border none
          box-shadow none
        &:before
          content ' '
          display block
          width 1em
          height 1em
          border-radius 50%
          overflow hidden
          background-color #fff
          position absolute
          right -0.5em
          top 50%
          margin-top -0.5em
          z-index 1
    // video
</style>
