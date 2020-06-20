// import OSS from 'ali-oss'

export class Uploader {
  // 初始化
  // constructor () {
  //   this.accept = this.formatAccept('')
  //   this.size = { width: 0, height: 0, scale: 1 }
  //   this.limit = this.formatLimit({ min: 0, max: 2, unit: 'MB' })
  // }

  // 获取STS授权
  getSTS () {
    console.log('getSTS')
  }

  // 创建 input[type=file]
  create (opt = {}) {
    const options = Object.assign({
      stsUrl: '/upload/stsUpload',
      stsNum: 1,
      stsType: 1,
      accept: '',
      size: { width: 0, height: 0, scale: 1, aspectRatio: '', error: 0 },
      limit: { min: 0, max: 2, unit: 'MB' }
    }, opt)
    // 初始化参数
    this.accept = this.formatAccept(options.accept)
    this.size = this.formatSize(options.size)
    this.limit = this.formatLimit(options.limit)
    // 1. 创建input
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    if (options.stsNum > 1) {
      fileInput.multiple = 'multiple'
    }
    fileInput.click()
    const _this = this
    // 2. 监听用户选取的文件
    fileInput.addEventListener('change', async function (e) {
      const blobs = e.path[0].files
      // console.log(blobs)
      // 判断文件类型是否符合要求
      try {
        _this.doVaildate(blobs)
        // console.log(res)
        console.log('fkfkfk okkkk')
      } catch (err) {
        console.log(err)
        // throw err
      }
    })
  }

  doVaildate (blobs) {
    blobs.forEach(blob => {
      // 1、校验文件类型是否符合
      this.vaildateFileType(blob)
      // 2、校验文件大小是否符合
      this.vaildateFileLimit(blob)
      // 3、校验图片尺寸大小
      if (blob.type.indexOf('image') === 0) {
        this.vaildateImageSize(blob)
      }
    })
  }

  /**
   * 校验图片尺寸是否合法
   * @param {BLOB} blob 图片
   * 1、只设定了宽或高， 则代表高或宽不限制
   * 2、error 代表允许的误差值
   * 3、设置了 aspectRatio，则 scale 失效，并以一条宽或高为基准，宽高同时不为0时以宽为基准
   * 4、scale 表缩放，大于1时，宽高为最小值， 小于1时，宽度为最大值, 未设置宽高时不生效
   */
  // 校验图片尺寸是否符合要求
  async vaildateImageSize (blob) {
    // console.log(this.size)
    const { width, height, error, scale, aspectRatio } = this.size
    let bool = false
    console.log(width, height, error, scale, aspectRatio)
    const { realWidth, realHeight } = await this.computeImageSize(blob)
    console.log(realHeight, realWidth)
    if (width === 0 && height === 0) {
      bool = true
    } else if (width > 0 && height > 0 && !aspectRatio) {
      // 没搞完
    }
    return bool
  }

  // 验证用户所选文件是否符合要求的文件类型
  vaildateFileType (blob) {
    let bool = this.accept === ''
    if (this.accept !== '') {
      const { type, name } = blob
      switch (this.getTypeOf()) {
        case 'array': {
          bool = this.accept.includes(this.getExtName(name))
          break
        }
        case 'string': {
          bool = type.indexOf(this.accept) === 0
          break
        }
      }
      // 抛出错误
      if (!bool) {
        const err = {
          status: bool,
          message: '文件类型不符合要求, 请重新选择',
          file: name
        }
        throw err
      }
    }
    return bool
  }

  // 校验文件大小是否符合规范
  vaildateFileLimit (blob) {
    const { min, max, oMin, oMax, oUnit } = this.limit
    let bool = true
    if (max > 0) {
      const { name, size } = blob
      const err = { status: true, message: '', file: name }
      // 禁止上传空文件
      if (size < 1) {
        bool = false
        err.message = '该文件似乎是一个空文件，不支持上传空文件'
      } else if (size > max) {
        bool = false
        const msg = oMin > 0 ? `应介于 ${oMin}-${oMax}${oUnit} 之间` : `不得大于 ${oMax}${oUnit}`
        err.message = `文件太大，${msg}`
      } else if (size < min) {
        bool = false
        err.message = `文件太小，应介于 ${oMin}-${oMax}${oUnit} 之间`
      }
      if (!bool) { throw err }
    }
    return bool
  }

  // 计算图片的实际尺寸
  computeImageSize (img) {
    const blob = URL.createObjectURL(img)
    const image = document.createElement('img')
    image.src = blob
    return new Promise(resolve => {
      image.addEventListener('load', () => {
        const realHeight = image.naturalHeight
        const realWidth = image.naturalWidth
        resolve({ realWidth, realHeight })
      })
    })
  }

  // 返回数据的标准类型
  getTypeOf (v = this.accept) {
    const res = Object.prototype.toString.call(v).slice(8, -1)
    return res.toLowerCase()
  }

  // 获取文件的拓展名
  getExtName (name) {
    let res = ''
    const i = name.lastIndexOf('.')
    if (i > -1) {
      res = name.slice(i + 1)
    }
    return res.toLowerCase()
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
      scale: 1, // 缩放比 大于 0 的数
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
      throw new Error('error 必须是大于 0 的整数')
    }
    if (aspectRatio !== '' && !(/\d+:\d+/.test(aspectRatio))) {
      throw new Error('aspectRatio（宽高比）请使用标准的数学比例写法，如 16:9')
    }
    return { height, width, scale, error, aspectRatio }
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
