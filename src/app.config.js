export default {
  site: {
    title: 'Yocss',
    favicon: '',
    css: [],
    js: []
    // keywords: '',
    // description: '',
  },
  api: {
    // development: 'https://www.fastmock.site/mock/4a968665bccbba113c09ebaebc8b40fb/vant',
    development: '/',
    production: '/api'
  },
  keys: {
    cookie: 30, // cookie 保存时长，0表示不保存, 单位为天
    token: '_tk_', // 务必确保值存在，否则页面刷新时将失去用户的登录状态
    user: '_us_'
  },
  // cnzz 网页分析
  // cnzz: 'https://s9.cnzz.com/z_stat.php?id=1278259705',
  cnzz: '',
  httpRequest: {
    // 需要特殊处理的http状态码
    status: {
      success: [0, 200, 2000], // 请求成功并正确返回数据
      refresh: [401, 4010], // token过期，需要刷新token
      error: [402, 4020], // token无效，需要重新登录
      auth: [403, 4030, 405, 4050] // token权限不足, 弹出提示框
    },
    reTimes: 3, // 请求失败时的重试次数
    timeout: 5000, // 允许的 响应超时 时长
    useJson: false, // 是否使用序列化的字符串
    // header: ['X-Requested-TK'],
    // 重新定义的错误码提示
    httpStatus: {
      401: 'token过期, 刷新token', // token过期, 刷新token
      402: '登陆失效了，请重新登录', // token无效，需重新登录
      403: '你没有足够的权限访问该资源（403）', // token权限不足，访问被禁止
      405: '服务器拒绝了你的请求（405）', // token权限不足，访问被禁止
      404: '未找到相关资源（404）',
      500: '程序异常, 请稍候再试（500）',
      501: '程序异常，请稍候再试（501）',
      502: '程序异常，请稍候再试（502）',
      503: '程序异常，请稍候再试（503）',
      504: '程序未响应，请稍候再试（504）',
      505: '程序无法响应，请稍候再试（505）',
      601: '你的设备已离线，请确保你的设备已联网（601）'
    },
    logApi: 'log/saveerror' // 日志api，将错误日志提交给服务器
  }
}
