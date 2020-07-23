<template>
  <div class="com-player">
    <!-- 播放器 -->
    <div
      :class="{'is-music': isMusic}"
      id="com-player-box"
    />
  </div>
</template>
<script>
import 'video.js/dist/video-js.min.css'
import videojs from 'video.js'
const zh = require('video.js/dist/lang/zh-CN.json')
export default {
  name: 'ComPlayer',
  props: {
    src: {
      type: String,
      default: ''
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
      thisTime: 0,
      video: null,
      isMusic: false
    }
  },
  computed: {
    // isMusic () {
    //   const i = this.src.lastIndexOf('.')
    //   return this.src.slice(i + 1).toLowerCase() === 'mp3'
    // }
  },
  watch: {
    src () {
      this.reCreatePlayer()
    },
    'options.sources': {
      handler () {
        this.reCreatePlayer()
      }
    }
  },
  mounted () {
    this.createPlayer()
  },
  beforeDestroy () {
    this.clearTimer()
    // 注销播放器
    this.player && this.player.dispose()
  },
  methods: {
    reCreatePlayer () {
      this.clearTimer() // 清除定时器
      if (this.player) {
        this.removeEvent() // 移除事件监听
        this.player.dispose() // 注销播放器
        this.player = null
      }
      this.createPlayer() // 重建播放器
    },
    createPlayer () {
      // 只有当视频地址存在时，才创建播放器
      if (this.src || this.options.sources) {
        // 使用中文
        videojs.addLanguage('zh-CN', zh)
        // 1、创建video标签
        const cls = 'com-player-video video-js vjs-big-play-centered'
        const video = videojs.dom.createEl('video', {}, { class: cls })
        const ref = document.getElementById('com-player-box').appendChild(video)
        // 2、合并 options
        const options = Object.assign({
          autoplay: false, // 自动播放
          controls: true, // 显示控制栏
          playsinline: videojs.browser.IS_IOS, // 阻止IOS设备启用默认全屏
          webkitPlaysinline: videojs.browser.IS_IOS, // 阻止IOS设备启用默认全屏
          preload: 'auto', // 预加载
          responsive: true, // 响应式
          fluid: true, // 自适应
          language: 'zh-CN', // 播放器语言
          aspectRatio: '16:9', // 画面比例
          controlBar: {
            // timeControls: {
            //   // TimeDisplay: true,
            //   // remainingTimeDisplay: true
            // }
          },
          playbackRates: [0.5, 1, 1.5, 2]
        }, {
          sources: this.src || '',
          poster: this.poster || ''
        }, this.options)
        const _this = this
        // 3、创建播放器
        this.player = videojs(ref, options, function onPlayerReady () {
          // 播放器创建成功，开始监听播放器事件
          _this.addEvent()
        })
      }
    },
    // addVideoClick () {
    //   console.log('ok')
    //   this.player.pause()
    // },
    // 监听播放器事件
    addEvent () {
      // 元数据加载完成时
      this.player.on('loadedmetadata', this.handleLoaded)
      // 开始播放时，记录用户播放数据
      this.player.on('play', this.handlePlay)
      // this.player.on('playing', function (e) {
      //   console.log(e)
      // })
      this.player.on('timeupdate', this.handleProgress)
      // 播放暂停
      this.player.on('pause', this.handlePause)
      // 发生错误时
      this.player.on('error', this.handleError)
      // 播放完成时
      this.player.on('ended', this.handleEnded)

      this.video = document.getElementsByTagName('video')[0]
      // console.log(this.video)
      this.video.addEventListener('click', function () {
        console.log('ok')
      })
    },
    removeEvent () {
      this.player.off('loadedmetadata', this.handleLoaded)
      this.player.off('play', this.handlePlay)
      this.player.off('timeupdate', this.handleProgress)
      this.player.off('pause', this.handlePause)
      this.player.off('error', this.handleError)
      this.player.off('ended', this.handleEnded)
    },
    // 元数据加载完成时, 开始自动播放
    handleLoaded () { this.doEmit('loaded', this.player.duration()) },
    // 播放开始时，开始记录学员的记录
    handlePlay () {
      const src = this.player.src()
      // console.log(src)
      console.log(this.player.isAudio())
      const i = src.lastIndexOf('.')
      this.isMusic = src.slice(i + 1).toLowerCase() === 'mp3'

      this.startLog()
      this.doEmit('play', this.player.duration())
    },
    handleProgress () { this.doEmit('timeupdate', this.player.currentTime()) },
    // 播放暂停
    handlePause () { this.doEmit('pause') },
    // 播放发生错误时
    handleError () { this.doEmit('error') },
    // 播放结束时
    handleEnded () { this.doEmit('ended') },
    // 记录用户播放时间进度
    startLog () {
      // 每 10s 触发一次记录
      this.clearTimer()
      this.timer = setInterval(() => {
        this.thisTime = Math.ceil(this.player.currentTime)
        if (this.thisTime !== this.lastTime) {
          this.lastTime = this.thisTime
          this.doEmit('play', this.thisTime)
        }
      }, 10000)
    },
    // 清除定时器
    clearTimer () { clearInterval(this.timer) },
    // 触发事件
    doEmit (event, time = this.player.currentTime()) {
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
  height 100%
  .player-control
    padding 32px
    .player
      border 1px solid #ccc
      width 120px
      height 60px
      text-align center
      line-height 58px
      border-radius 8px
  #com-player-box
    width 100%
    height 100%
    .com-player-video
      font-size 12PX
      .vjs-picture-in-picture-control // 关闭画中画按钮
        display none
      .vjs-remaining-time // 显示剩余时间
        display block
        span
          display none
        .vjs-remaining-time-display
          display initial
      .vjs-poster
        background-size 100% 100%
        display block !important
      .vjs-big-play-button
        width 1.63332em
        border-radius 50%
      &.vjs-big-play-centered
        .vjs-big-play-button
          margin-left -.81666em
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
      // 播放器的几种状态
      &.vjs-has-started.vjs-paused // 播放暂停: 显示大号按钮，poster
        .vjs-big-play-button // 暂停时显示中间大号播放按钮
          display block
          .vjs-icon-placeholder::before // 暂停时按钮图标变为暂停图标
            content '\f103'
      &.vjs-has-started.vjs-playing // 播放中: 隐藏大号按钮，poster
        .vjs-poster
          opacity 0
      &.vjs-has-started.vjs-ended // 播放结束: 显示大号按钮，poser
        .vjs-poster
          opacity 1
        .vjs-big-play-button
          .vjs-icon-placeholder::before
            content '\f116'
        .vjs-poster // 音乐模式下不隐藏背景图
          opacity 1
    // 音乐模式
    &.is-music
      display none
      .com-player-video // 音乐模式下限制全屏按钮
        .vjs-fullscreen-control
          display none
      // .vjs-has-started.vjs-user-inactive.vjs-playing .vjs-control-bar
      // opacity 1 !important
      .vjs-has-started
        .vjs-control-bar
          opacity 0
        &.vjs-playing // 音乐模式下，不隐藏背景图
          .vjs-poster
            display block !important
            opacity 1
    // video
</style>
