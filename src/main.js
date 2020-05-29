import Vue from 'vue'
import App from '@/layouts/app.vue'
import '@/plugins/index.js'
import router from '@/router'
import store from '@/store'

// load style
import '@/assets/css/common/index.styl'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
