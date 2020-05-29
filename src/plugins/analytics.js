// cnzz 的统计分析(针对单页应用的异步统计)
import appConfig from '@/app.config.js'

export function analytics (toUrl, fromUrl = '') {
  if (process.env.VUE_APP_MODE === 'production' && appConfig.cnzz) {
    if (!window._czc) {
      const cnzzTag = document.createElement('script')
      cnzzTag.type = 'text/javascript'
      cnzzTag.async = true
      cnzzTag.charset = 'utf-8'
      cnzzTag.src = `${appConfig.cnzz}&sync=1`
      const cnccRoot = document.getElementsByTagName('script')[0]
      cnccRoot.parentNode.insertBefore(cnzzTag, cnccRoot)
    }

    const cncc = window._czc || []
    cncc.push(['_setAutoPageview', false])
    cncc.push(['_trackPageview', toUrl, fromUrl])
  }
}
