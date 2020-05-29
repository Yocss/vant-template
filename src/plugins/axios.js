/**
 * axios封装
 * axios详细文档：https://www.kancloud.cn/yunye/axios/234845
 */
import Axios from 'axios'
import Qs from 'qs'
import Vue from 'vue'
// import { Modal, message } from 'ant-design-vue'
import config from '@/app.config.js'
import store from '@/store'
import { Notify, Dialog } from 'vant'
// const errCode = config.httpRequest.error
// const successCode = config.httpRequest.success
const req = config.httpRequest
// 根据 app.config.axios.dataType 转换 data 类型
const transform = req.useJson ? {} : {
  transformRequest: [(data) => { return Qs.stringify(data) }]
}
const axios = Axios.create(Object.assign(
  {
    baseURL: config.api[process.env.VUE_APP_MODE],
    timeout: req.timeout
  },
  transform
))
// 配置请求参数
axios.interceptors.request.use(
  (config) => {
    const params = {}
    let data = {}
    let customParams = {}
    switch (config.method) {
      case 'post':
        data = config.data || {}
        customParams = { ...data }
        break
      case 'get':
        data = config.params || {}
        customParams = { ...data }
        break
    }
    Object.assign(data, params, customParams)
    return config
  },
  (err) => {
    Promise.reject(err)
  }
)

// 响应拦截
axios.interceptors.response.use(
  (response) => {
    const { data } = response
    if (data.code !== undefined) {
      data.code *= 1
      return req.error.includes(data.code) ? Promise.reject(data) : data
    } else {
      const res = { code: 500, data, info: '程序君太累了，工程师正在处理(500)' }
      if (data === '') {
        res.code = 501
        res.info = '程序君异常，工程师正在处理(501)'
      }
      return Promise.reject(res)
    }
  },
  (err) => {
    const data = {}
    // let code = app.data().isOnline ? 600 : 601
    let code = 600
    const info = {
    }
    if (err.response) {
      code = err.response.status
      data.code = code
      data.data = err.response.data
      data.info = info[code] || `系统异常（${code}）`
    } else {
      data.code = 600
      data.data = err.response.data
      data.info = '网络似乎不太通畅，请检查网络后重试'
    }
    return Promise.reject(data)
  }
)

// 处理严重错误
function handleError (err) {
  if (req.error.includes(err.code)) {
    store.state.token && store.dispatch('SetToken', '')
    Dialog.confirm({
      title: '请求出错了',
      message: err.info || '请求出错，请重试'
    }).then(() => {
      store.dispatch('SetStore', { account: { visible: true } })
    })
  }
}
// 记录错误日志
function errLog (url, data, err) {
  if (url !== req.errApi && err.code >= 400 && err.code < 600) {
    const errData = JSON.stringify({
      code: err.code,
      message: err.data,
      info: err.info,
      interface: url,
      client: process.client ? 'client' : 'server',
      device: 'pc',
      params: data
    })
    request(req.errApi, { data: errData })
  }
}
// 请求方法
async function request (url, data, opt, method = 'post', times = req.reTimes) {
  url = url.indexOf('/') === 0 ? url.slice(1) : url
  try {
    const d = { post: { data }, get: { params: data } }
    const res = await axios({ url, method, ...opt, ...d[method] })
    return res
  } catch (err) {
    times--
    // 发生严重错误且允许重试时，重新请求
    // console.log(times)
    if (times > 0 && process.server) {
      // 严重错误，在服务端并且是token无效的时候，清空token后重试
      if (req.error.includes(err.code)) {
        store.state.token && store.dispatch('SetToken', '')
      }
      const retry = await request(url, data, opt, method, times)
      return retry
    } else {
      // 非一般错误的处理方式
      handleError(err)
      // 记录错误日志
      errLog(url, data, err)
      return err
    }
  }
}

/**
 * 二次封装请求方法, 直接返回data里的数据，数据错误时自动吐司
 * @param {string} url api地址
 * @param {object} data 请求的参数
 * @param {object} option axios参数
 * @param {bool} tip 是否弹出提示
 * @param {enum} method 请求方法，只可选post | get
 */
async function getData (url = '', data = {}, option = {}, tip = true, method = 'post') {
  const res = await request(url, data, option, method)
  const bool = req.success.includes(res.code)
  const result = bool ? res.data || {} : false
  // 无结果 && tip = true 时弹出提示框
  if (!result && tip) {
    // 严重的错误已交由基础请求函数request()处理，所以此外只需处理一般错误即可
    if (!req.error.includes(res.code)) {
      Notify({ type: 'danger', message: res.info || '请求错误，未获取预期数据' })
    }
  }
  return result
}

Vue.prototype.$http = {
  async post (url, data, opt = {}, tip = true) {
    const res = await getData(url, data, opt, tip, 'post')
    return res
  },
  async get (url, data, opt = {}, tip = true) {
    const res = await getData(url, data, opt, tip, 'get')
    return res
  }
}
// // 公共post方法, 返回完整数据
// inject('post', async function (url = '', data = {}, opt = {}) {
//   const res = await request(url, data, opt, 'post')
//   return res
// })

// // 公共get方法 返回完整数据
// inject('get', async function (url = '', data = {}, opt = {}) {
//   const res = await request(url, data, opt, 'get')
//   return res
// })

// // 公共http对象，包含post及get方法，直接返回data里的数据, 默认自动弹出错误提示
// // 因与nuxt兼容问题，fetch方法弃用, 改用$http
// inject('http', {
//   async post (url, data, opt = {}, tip = true) {
//     const res = await getData(url, data, opt, tip, 'post')
//     return res
//   },
//   async get (url, data, opt = {}, tip = true) {
//     const res = await getData(url, data, opt, tip, 'get')
//     return res
//   }
// })
