export default class Format {
  constructor (props) {
    this.accept = props.accept
    this.size = props.size
    this.limit = props.limit
  }

  // 格式化 accept 参数，小写并且去掉以 . 开头的部分
  formatAccept (val = this.accept) {
    let accept = val
    switch (this.getTypeOf(accept)) {
      case 'string':
        // 改为小写并且去掉.
        accept = accept.toLowerCase()
        if (accept.indexOf('.') === 0) {
          accept = accept.slice(1)
        }
        break
      case 'array':
        // 改为小写并且去掉.
        for (let i = 0; i < accept.length; i++) {
          accept[i] = accept[i].toLowerCase()
          if (accept[i].indexOf('.') === 0) {
            accept[i] = accept[i].slice(1)
          }
        }
        break
    }
    return accept
  }

  // 格式化 size 参数
  formatSize (size = this.size) {
    const s = Object.assign({
      width: 0, // 图片宽度, 正整数 单位为像素
      height: 0, // 图片高度, 正整数 单位为像素
      scale: 1, // 缩放比 大于 0 的数, 最高精度为2, 多余的直接丢弃
      error: 0, // 误差, 正整数 单位为像素
      aspectRatio: '' // 宽高比 4:3, 如果设定了宽高比，将以 width 或 height 不为0的数为基准，两个同时设置的情况下，以 width 为基准
    }, size)
    const { height = 0, width = 0, scale = 1, error = 0, aspectRatio = '' } = s
    if (height < 0 || width < 0) {
      throw new Error('height 或 width 必须是大于等于 0 的整数')
    }
    if (scale < 0) {
      throw new Error('scale 必须是大于 0 的数')
    }
    if (error < 0) {
      throw new Error('error 必须是大于 1 的整数 或 小于 1 的小数')
    }
    if (aspectRatio !== '') {
      const ratio = aspectRatio.split(':')
      if (!(/\d+:\d+/.test(aspectRatio))) {
        throw new Error('aspectRatio（宽高比）请使用标准的数学比例写法，如 16:9')
      } else if (height > 0 && width > 0) {
        const w = width / ratio[0]
        const h = height / ratio[1]
        if (w !== Math.floor(w) || h !== Math.floor(h) || w !== h) {
          throw new Error('aspectratio、with、height数据无法完成验算！')
        }
      } else if (height > 0) {
        const h = height / ratio[1]
        if (h !== Math.floor(h)) {
          throw new Error('aspectratio 与 height 验算过程中出现小数！')
        }
      } else if (width > 0) {
        const w = width / ratio[0]
        if (w !== Math.floor(w)) {
          throw new Error('aspectratio 与 width 验算过程中出现小数！')
        }
      }
      // 校组定义的比例是否合理
    }
    return {
      height,
      width,
      scale: Math.floor(scale * 100) / 100,
      error: error < 1 ? error : Math.floor(error),
      aspectRatio
    }
  }

  // 将 limit 统一格式化为以字节单位的量
  formatLimit (val = this.limit) {
    const { min = 0, max = 0, unit = 'mb' } = val
    if (this.getTypeOf(min) !== 'number' || this.getTypeOf(max) !== 'number') {
      throw new Error('min 或 max 必须为数字')
    }
    if (min < 0 || max < 0) {
      throw new Error('min 或 max 不允许为负数')
    }
    if (min > max) {
      throw new Error('不受支持的参数, 必须满足：min <= max')
    }
    if (!['', 'kb', 'mb', 'gb', 'tb'].includes(unit.toLowerCase())) {
      throw new Error('limit.unit 限定为：\'\'|\'kb\'|\'mb\'|\'gb\'|\'tb\'，不区别大小写')
    }
    const units = { kb: 1024, mb: 1048576, gb: 1073741824, tb: 1099511627776 }
    return {
      min: Math.floor(min * units[unit.toLowerCase()]), // 格式化后的字节单位
      max: Math.floor(max * units[unit.toLowerCase()]), // 格式化后的字节单位
      oMin: min, // 传入的原始大小
      oMax: max, // 传入的原始大小
      oUnit: unit.toUpperCase() // 传入的原始单位
    }
  }
}
