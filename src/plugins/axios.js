/**
 * axios封装
 * axios详细文档：https://www.kancloud.cn/yunye/axios/234845
 */
import Axios from 'axios'
import Qs from 'qs'
import Vue from 'vue'
import { version } from '../../package.json'
import { Notify, Dialog } from 'vant'
import config from '@/app.config.js'
import store from '@/store'
import helper from '@axmine/helper'
const req = config.httpRequest
const keys = config.keys

const Cookie = helper.cookie
const cookie = new Cookie('cookie')
const session = new Cookie('sessionStorage')

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
    const data = { post: config.data, get: config.params }[config.method]
    const tk = keys.token
    const token = store.state.token || cookie.get(tk) || session.get(tk) || ''
    const { directionId, professionId } = store.state.subject
    token && Object.assign(config.headers, {
      'X-Token': token,
      'X-Version': version
      // 'X-Env': ''
    })
    const params = directionId ? { directionId } : {}
    professionId && Object.assign(params, { professionId })
    Object.assign(data, params, data)
    return config
  },
  (err) => {
    Promise.reject(err)
  }
)

// 响应拦截
axios.interceptors.response.use(
  res => {
    let { data } = res
    // 检测返回数据是否为标准json, 非标准json直接报500错误
    try {
      JSON.stringify(data)
    } catch (err) {
      data = { code: 5000, result: {}, message: '响应错误：未返回预期数据（500)' }
    }
    return data
  },
  err => {
    // 响应错误，http状态码不是200时的错误
    const { httpStatus } = req
    const data = { code: 504, result: {}, message: '' }
    const res = err.response
    let code = data.code
    let message = httpStatus[code] || `指令异常，请联系工程师（${data.code}）`
    // 如果有响应内容
    if (res) {
      code = res.status
      Object.assign(data, { code, result: res.data })
      // message = res.data.message
      message = httpStatus[res.status] || `请求异常，请联系管理员（${res.status}）`
    } else {
      Object.assign(data, { result: err.message || {} })
    }
    data.message = message
    data.code *= 10
    return Promise.reject(data)
  }
)

// 请求方法
async function request (api, json, config = {}, times = req.times) {
  const conf = Object.assign({ method: 'post', option: {} }, config)
  const url = api.indexOf('/') === 0 ? api.slice(1) : api
  const { status } = req
  try {
    const method = conf.method || 'post'
    // 执行 ajax 请求
    const data = { post: { data: json }, get: { params: json } }[method]
    const result = await axios({ url, method, ...conf.option, ...data })
    return result
  } catch (err) {
    times--
    // 非token无效的问题，则开始重试
    const tokenOk = status.refresh.concat([4040, 404])
    if (times > 0 && !tokenOk.includes(err.code)) {
      const result = await request(api, json, config, times)
      return result
    } else {
      // 如果是token过期，则不报错
      const isExpired = status.refresh.includes(err.code)
      const args = [api, json, config, err]
      if (isExpired) {
        // 处理token过期，请求刷新token, 刷新成功重新上一次请求，否则提示token无效
        handleExpired(...args)
      } else {
        // 严重的错误，直接这里处理掉，否则
        handleError(...args)
      }
    }
  }
}

async function handleExpired (api, json, config, error) {
  // token过期处理
  console.log(api, json, config, error)
  return false
}

// 处理严重错误
function handleError (api, json, config, error) {
  // 1. 向服务器提交错误日志
  if (api !== req.errLogApi && req.errLogApi) {
    // 将错误保存到服务器
    request(req.errLogApi, {
      data: JSON.stringify({
        apiUrl: api,
        params: json,
        version,
        error,
        config,
        client: process.server ? 'server' : 'client'
      })
    })
  }
  // 2. 如果是token无效，在浏览器端弹出提示框，让用户重新登录
  const isError = req.error.includes(error.code)
  if (isError) {
    const tips = {
      title: '请求出错了',
      message: req.httpStatus[error.code] || error.message || '请求出错了，请重试'
    }
    store.dispatch('SetToken', '')
    Dialog.confirm(tips).then(() => {
      store.dispatch('SetStore', { account: true })
    })
  }
  return isError ? false : error
}

/**
 * 二次封装请求方法, 直接返回data里的数据，数据错误时自动吐司
 * @param {string} url api地址
 * @param {object} data 请求的参数
 * @param {object} option axios参数
 * @param {bool} tip 是否弹出提示
 * @param {enum} method 请求方法，只可选post | get
 */
async function getResult (api, jsonData, config = {}) {
  const data = await request(api, jsonData, config)
  const bool = req.success.includes(data.code * 1)
  const isError = req.error.includes(data.code * 1)
  const result = bool ? data.result || {} : false
  // 如果结果错误并且要求显性提示
  if (isError) {
    handleError(api, jsonData, config, data)
  } else if (!result && config.tips) {
    Notify({
      type: 'danger',
      message: data.message || '请求错误，未获取预期数据'
    })
  }
  return result
}

const httpRequest = {
  async post (url, data = {}, opt = {}) {
    const config = Object.assign(opt, { method: 'post', tips: true })
    const res = await getResult(url, data, config)
    return res
  },
  async get (url, data = {}, opt = {}) {
    const config = Object.assign(opt, { method: 'get', tips: true })
    const res = await getResult(url, data, config)
    return res
  },
  async request (url, data = {}, config = {}) {
    const conf = Object.assign({ method: 'post' }, config)
    const result = await getResult(url, data, conf)
    return result
  }
}
Vue.prototype.$http = httpRequest
export default httpRequest
