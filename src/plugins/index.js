import Vue from 'vue'
import { Toast } from 'vant'
import './registerServiceWorker.js'
import './axios.js'
import './hooks.router.js'
import './base.component.js'
import './mixins.js'
import './vaildate.js'

Vue.prototype.$toast = Toast
