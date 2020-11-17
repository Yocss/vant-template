module.exports = {
  css: {
    loaderOptions: {
      less: {
        modifyVars: {}
      }
    }
  },
  pwa: {
    name: 'welcome',
    themeColor: '#000',
    msTitleColor: '#000000'
  },
  devServer: {
    port: 5544,
    proxy: 'https://www.fastmock.site/mock/4a968665bccbba113c09ebaebc8b40fb/vant'
  }
}
