import Format from './format'
export default class Vaildate extends Format {
  constructor (props) {
    super(props)
    this.accept = props.accept
    this.size = props.size
    this.limit = props.limit
  }

  async doVaildate (blobs) {
    // blobs.forEach(blob => {
    for (let i = 0; i < blobs.length; i++) {
      // 1、校验文件类型是否符合
      this.vaildateFileType(blobs[i])
      // 2、校验文件大小是否符合
      this.vaildateFileLimit(blobs[i])
      // 3、校验图片尺寸大小
      if (blobs[i].type.indexOf('image') === 0) {
        await this.vaildateImageSize(blobs[i])
      }
    }
  }

  /**
   * 校验图片尺寸是否合法
   * @param {BLOB} blob 图片
   * 1、只设定了宽或高， 则代表高或宽不限制
   * 2、error 代表允许的误差值
   * 3、若设置 aspectRatio，则 scale, error 失效
   * 4、scale 表缩放，大于1时，宽高为最小值， 小于1时，宽度为最大值, 未设置宽高时不生效
   */
  // 校验图片尺寸是否符合要求
  async vaildateImageSize (blob) {
    const { width, height, error, scale, aspectRatio } = this.size
    let bool = false
    const { realWidth, realHeight } = await this.computeImageSize(blob)
    // 1. 限定比例, 比例被限定时，不容许误差存在
    if (aspectRatio) {
      this.vaildateAspectRatio({ width, height, realWidth, realHeight, aspectRatio })
    // 2. 自由尺寸
    } else if (width === 0 && height === 0) {
      bool = true
    // 3. 限定宽高, 并处理相应的缩放和误差
    } else {
      this.handleLimit({ width, height, error, scale, realHeight, realWidth })
    }
    return bool
  }

  handleLimit ({ width, height, error, scale, realHeight, realWidth }) {
    let bool = false
    const err = { status: false, message: '' }
    // 1、无误差时，计算宽高比是否一致
    if (error === 0) {
      let r1 = 0
      let r2 = 0
      if (width > 0 && height > 0) {
        r1 = Math.floor(width / height * 100)
        r2 = Math.floor(realWidth / realHeight * 100)
      }
      // 1-a. 确保比例一致
      const bRatio = r1 === r2
      // 1-b. 确保尺寸在合理范围内
      let bScale = true
      if (scale === 1) {
        bScale = realWidth === width && realHeight === height
        if (width === 0 || height === 0) {
          bScale = realWidth === width || realHeight === height
        }
      } else if (scale < 1) {
        bScale = realWidth >= width * scale && realHeight >= height * scale
        if (width === 0) {
          bScale = realHeight >= height * scale && realHeight <= height
        }
        if (height === 0) {
          // console.log(realWidth, width, width * scale)
          bScale = realWidth >= width * scale && realWidth <= width
        }
      } else {
        bScale = realWidth <= width * scale && realHeight <= height * scale
        if (width === 0) {
          bScale = realHeight <= height * scale && realHeight >= height
        }
        if (height === 0) {
          bScale = realWidth <= width * scale && realWidth >= width
        }
      }
      bool = bRatio && bScale
    } else {
      const params = { realWidth, realHeight, width, height, error }
      const bScale = this.vaildateError(params)
      let bwErr = true
      let bhErr = true
      let wError = error * 1
      let hError = error * 1
      // 当 error 为小于 1 的小数时，计算出等比的误差值
      if (error < 1) {
        wError = width * error
        hError = height * error
      }
      // console.log(wError, hError)
      if (scale === 1) {
        bwErr = width > 0 ? Math.abs(realWidth - width) <= wError : true
        bhErr = height > 0 ? Math.abs(realHeight - height) <= hError : true
      } else if (scale > 1) {
        bwErr = width > 0 ? (realWidth >= width - wError) && (realWidth <= Math.floor(width * scale) + wError) : true
        bhErr = height > 0 ? (realHeight >= height - hError) && (realHeight <= Math.floor(height * scale) + hError) : true
      } else {
        bwErr = width > 0 ? (realWidth <= width + wError) && (realWidth >= Math.floor(width * scale) - wError) : true
        bhErr = height > 0 ? (realHeight <= height + hError) && (realHeight >= Math.floor(height * scale) - hError) : true
      }
      bool = bScale && (bwErr && bhErr)
    }
    if (!bool) {
      let message = `图片尺寸不符，建议尺寸：${width}×${height}px`
      if (width === 0) {
        message = `图片尺寸不符，图片建议高度：${height}px`
      }
      if (height === 0) {
        message = `图片尺寸不符，建议尺寸：${width}px`
      }
      err.message = message
      throw err
    }
    return bool
  }

  // 验证误差是否在合理范围内
  vaildateError ({ realWidth, realHeight, width, height, error }) {
    let minScale = 0
    let maxScale = 0
    if (width > 0 && height > 0) {
      if (error < 1) {
        minScale = Math.floor((width - width * error) / (height + height * error) * 100)
        maxScale = Math.floor((width + width * error) / (height - height * error) * 100)
      } else {
        minScale = Math.floor((width - error) / (height + error) * 100)
        maxScale = Math.floor((width + error) / (height - error) * 100)
      }
    }
    const realScale = Math.floor(realWidth / realHeight * 100)
    let status = minScale <= realScale && realScale <= maxScale
    if (width === 0) {
      const mError = error < 1 ? height * error : error
      status = realHeight >= height - mError && realHeight <= height + mError
    }
    if (height === 0) {
      const mError = error < 1 ? width * error : error
      status = realWidth >= width - mError && realWidth <= width + mError
    }
    if (!status) {
      let message = `误差过大，建议尺寸：${width}×${height}px`
      if (width === 0) {
        message = `误差过大，图片建议高度：${height}px`
      }
      if (height === 0) {
        message = `误差过大，图片建议宽度：${width}px`
      }
      const err = { status, message }
      throw err
    }
    return status
  }

  // 验证图片比例是否在合理范围内
  vaildateAspectRatio ({ realWidth, realHeight, width, height, aspectRatio }) {
    const ratio = aspectRatio.split(':')
    let bool = false
    let cw = width
    let ch = height
    if (width > 0 && height > 0) {
      const w = realWidth / ratio[0]
      const h = realHeight / ratio[1]
      bool = w === Math.floor(w) && h === Math.floor(h) && w === h
    } else if (width > 0) {
      const w = width / ratio[0]
      const h = realHeight / ratio[1]
      bool = h === Math.floor(h) && w <= h
      cw = width
      ch = w * ratio[1]
    } else if (height > 0) {
      const h = height / ratio[1]
      const w = realWidth / ratio[0]
      bool = w === Math.floor(w) && w <= h
      cw = h * ratio[0]
      ch = height
    } else {
      // 如果比例出现错误，并给出建议尺寸
      const w = realWidth / ratio[0]
      const h = realHeight / ratio[1]
      bool = w === Math.floor(w) && h === Math.floor(h) && w === h
      cw = Math.floor(w) * ratio[0]
      ch = Math.floor(w) * ratio[1]
    }
    if (!bool) {
      const err = { status, message: `图片比例不符：建议尺寸${cw}×${ch}px` }
      throw err
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

  // 设置分片大小
  setPartSize (blob) {
    const { size } = blob
    let num = 102400
    if (size > 512000 && size <= 5242880) {
      num = 307200
    } else if (size > 5242880) {
      num = 819200
    }
    return num
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
}
