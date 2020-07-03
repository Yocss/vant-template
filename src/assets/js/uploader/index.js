import Validate from './vaildate.js'
import OSS from 'ali-oss'

/*
1. 检查传入的参数是否合法
2. 校验文件是否大小，尺寸，类型是否合法
3. 初始化，用STS参数初始化OSS客户端
4. 执行上传（上传过程中不断回调，返回百分比及上传进度，存储上传进度，以备失败续传）
5. 上传完成（返回上传结果）
6. 被丢弃的文件(未处理)，目前的想法是：先上传到 temp 路径中，客户点了保存后移入真正的路径
*/
/**
 * OSS文件上传类 + 文件文件类型校验、文件大小校验、图片尺寸校验)
 * create(option)
 * option: {
 *  stsUrl: String 获取STS授权的地址
 *  stsNum: 要上传的文件数量
 *  stsType: 要上传的文件类型
 *  accept: [Array, String]
 *  limit: { min: 0, max: 2, unit: 'kb' },
 *  size: {
 *    width: 0, // 图片宽度, 0 表示不限制
 *    height: 0, // 图片高度, 0 表示不限制
 *    scale: 1, 缩放率，width和height为最大上传尺寸，width和height为最小上传尺寸
 *    error: 0, 宽高允许的误差值
 *    aspectRatio: '', 图片宽高比
 *  }
 * }
 */
export class AliossFileUploader extends Validate {
  // 初始化
  constructor (props = {}) {
    super(props)
    this.accept = props.accept || ''
    this.size = props.size || { width: 0, height: 0, scale: 1, aspectRatio: '', error: 0 }
    this.limit = props.limit || { min: 0, max: 2, unit: 'MB' }
    this.https = true
    this.alioss = null
    // this.alioss = new OSS(props.oss)
  }

  // 创建 input[type=file]
  create (opt = {}, sts, callBack) {
    const options = Object.assign({
      // stsUrl: '/upload/stsUpload',
      // stsNum: 1,
      // stsType: 1,
      https: true,
      accept: '',
      size: { width: 0, height: 0, scale: 1, aspectRatio: '', error: 0 },
      limit: { min: 0, max: 2, unit: 'MB' }
    }, opt)
    // 初始化参数
    this.https = options.https
    this.accept = this.formatAccept(options.accept)
    this.size = this.formatSize(options.size)
    this.limit = this.formatLimit(options.limit)
    // 1. 创建input
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    // if (options.stsNum > 1) {
    //   fileInput.multiple = 'multiple'
    // }
    fileInput.multiple = 'multiple'
    fileInput.click()
    const _this = this
    // 2. 监听用户选取的文件
    fileInput.addEventListener('change', async function (e) {
      // console.log(e.path)
      const blobs = e.path[0].files
      // console.log(blobs)
      // 判断文件类型是否符合要求
      try {
        // 1. 检查文件类型，大小，尺寸是否合法
        await _this.doVaildate(blobs)
        // 2. 调用sts方法 或 使用参数 初始化
        const files = []
        Object.keys(blobs).forEach(i => {
          files.push({
            index: i,
            file: blobs[i],
            orgName: blobs[i].name,
            size: blobs[i].size,
            extName: _this.getExtName(blobs[i].name),
            upName: '',
            url: '',
            progress: 0,
            checkpoint: null
          })
        })
        let config = {}
        let fileNames = []
        switch (_this.getTypeOf(sts)) {
          case 'function': {
            const res = await sts({ number: files.length, type: 100000 })
            config = res.config
            fileNames = res.files
            break
          }
          case 'object':
            config = sts
        }
        // console.log(config)
        if (config.stsToken) {
          _this.alioss = new OSS(config)
          // 3. 执行上传
          // console.log(blobs)
          files.forEach((e, i) => {
            e.upName = `${fileNames[i]}.${e.extName}`
            _this.doUpload(e, files, callBack)
          })
        }
      } catch (err) {
        console.log(err)
      }
    })
  }

  async doUpload (ele, list, fn) {
    // const uploader = new OSS()
    const _this = this
    const data = list.reduce((arr = [], e) => {
      return arr.concat({
        index: e.index,
        progress: e.progress,
        size: e.size,
        file: e.orgName,
        name: e.upName,
        checkpoint: null,
        url: e.url
      })
    }, [])
    const { name, res } = await this.alioss.multipartUpload(ele.upName, ele.file, {
      partSize: _this.setPartSize(ele.file),
      progress: async function (progress, checkpoint) {
        // console.log(p, checkpoint)
        data[ele.index].progress = Math.floor(progress * 100)
        data[ele.index].checkpoint = checkpoint
        fn && fn(data)
      }
    })
    // console.log(file)
    if (name && res.status * 1 === 200) {
      const url = res.requestUrls[0]
      const i = url.indexOf(name)
      let file = url.slice(0, i) + name
      if (this.https && file.indexOf('https:') !== 0) {
        file = 'https:' + url.slice(5)
      }
      // console.log(file)
      data[ele.index].url = file
      fn && fn(data)
    }
  }
}
