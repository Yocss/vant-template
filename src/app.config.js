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
    development: '',
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
    success: [0, 200],
    error: [403],
    reTimes: 3,
    timeout: 5000,
    useJson: true, // 是否使用序列化的字符串
    // header: ['X-Requested-TK'],
    httpStatus: {
      403: '您没有权限访问',
      404: '程序君无法找到资源，请重试',
      500: '程序君太累了，工程师正在处理（500）',
      501: '程序君异常，工程师正在处理（501）',
      502: '程序君失联了，请您稍候再试（502）',
      503: '程序君罢工了，工程师正在安抚（503）',
      504: '程序君太累了，工程师正在处理（504）',
      505: '程序君蒙圈了，工程师正在处理（505）',
      601: '你的设备已离线，请联网后重试（601）'
    },
    logApi: 'log/saveerror' // 日志api，将错误日志提交给服务器
  }
}
