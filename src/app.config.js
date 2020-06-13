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
    development: 'https://www.fastmock.site/mock/4a968665bccbba113c09ebaebc8b40fb/vant',
    production: ''
  },
  port: 5188,
  keys: {
    token: '_tk_',
    user: '_us_'
  },
  // cnzz 网页分析
  cnzz: 'https://s9.cnzz.com/z_stat.php?id=1278259705',
  httpRequest: {
    success: [0, 2000],
    error: [403],
    reTimes: 3,
    timeout: 5000,
    useJson: true, // 是否使用序列化的字符串
    // header: ['X-Requested-TK'],
    httpStatus: {
      403: '你没有权限访问',
      404: '无法找到相关资源',
      500: '程序处理异常, 请稍候再试（500）',
      501: '程序处理异常，请稍候再试（501）',
      502: '程序处理异常，请稍候再试（502）',
      503: '程序出现异常，请稍候再试（503）',
      504: '程序未正确响应，请稍候再试（504）',
      505: '程序君无法正确响应，请稍候再试（505）',
      601: '你的设备已离线，请确定已正确联网（601）'
    },
    logApi: 'log/saveerror' // 日志api，将错误日志提交给服务器
  }
}
