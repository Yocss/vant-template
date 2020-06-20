import OSS from 'ali-oss'
import { request } from '@/plugins/axios.js'
import config from '@/config/index.js'

const rule = {
  accept: '', // 也可以是数据， 如 ['jpg', 'png', 'jpeg], 不需要加点
  size: { width: 0, height: 0, scale: 1 }, // 图片尺寸，scale 代表比例范围
  limit: { min: 0, max: 2, unit: 'MB' } // 文件大小
}
const option = {
  number: 1,
  type: 0 // 0表示存入other文件夹内， 1代表头像， 2代表问答类型
}
/**
 * 执行上传文件
 * @param {blob} file // file 对象
 * @param {Object} rules // 上传限制
 * @param {Object} option // 获取STS的参数
 * @return {Object} { name, link }
 */
async function upload (blob, options = { option, rule }, fn) {
  try {
    // 1. 校验上传规则
    await doVaildate(options.rule || rule, blob)

    // 2. 获取授权
    const { config, file } = await fetchSTS(options.option || option)

    // 3. 初始化oss
    const uploader = new OSS(config)

    // 4. 执行上传
    const fileName = `${file.path}${file.name}.${getFileType(blob)}`
    const { name, res } = await uploader.multipartUpload(fileName, blob, {
      partSize: setPartSize(blob),
      progress: async function (p, checkpoint) {
        let per = p === 1 ? 100 : (p * 100).toFixed(1)
        per = Math.floor(per * 100) === per * 100 ? Math.floor(per) : per
        const point = checkpoint
        fn && fn(per, point)
      }
    })
    const result = { link: '', name: '' }
    if (res.status === 200) {
      const fileItem = res.requestUrls[0]
      const index = fileItem.indexOf(name)
      result.link = fileItem.slice(0, index)
      result.name = name
    }
    return result
  } catch (error) {
    throw new Error(error)
  }
}
// 执行校验任务
async function doVaildate (rules, file) {
  for (const k in rules) {
    switch (k) {
      case 'accept':
        vaildateAccept(rules[k], file)
        break
      case 'size':
        await vaildateSize(rules[k], file)
        break
      case 'limit':
        vaildateLimit(rules[k], file)
        break
    }
  }
}
// 校验文件类型是否合法
function vaildateAccept (accept, file) {
  let bool = true
  if (accept) {
    const dataType = Object.prototype.toString.call(accept).slice(8, -1)
    switch (dataType) {
      case 'String':
        // 检测 file 是否包含 accept 中字段
        bool = file.type.indexOf(accept) === 0
        break
      case 'Array':
        bool = accept.includes(getFileType(file))
        break
    }
  }
  if (bool) {
    return bool
  } else {
    throw new Error('你选择的文件是不支持上传的类型')
  }
}

// 校验图片尺寸是否合法
async function vaildateSize (size, file) {
  let bool = true
  // 必须是图片才检查尺寸
  if (file.type.indexOf('image') === 0) {
    const { width, height } = await computeImageSize(file)
    if (size.width > 0 && size.height > 0) {
      // 检查图片长宽比是否正常
      const scale1 = (width / height).toFixed(4) * 10000
      const scale2 = (size.width / size.height).toFixed(4) * 10000
      const scale = scale1 === scale2
      // 检查长宽是否在合法尺寸范围
      const Bwidth = width <= size.width * size.scale
      const Bheight = height <= size.height * size.scale
      // 长宽比合法，长宽值处于合法范围
      bool = scale && Bwidth && Bheight
    }
  }
  if (bool) {
    return bool
  } else {
    const allowSize = `${size.width} × ${size.height} px`
    throw new Error(`图片尺寸不符，请上传 ${allowSize} 的图片`)
  }
}

// 校验文件大小是否合法
function vaildateLimit (limit, file) {
  const { min, max } = transformValue(limit)
  const size = file.size
  let bool = size > 0
  if (min <= max && max > 0) {
    bool = size >= min && size <= max
  }
  if (bool) {
    return bool
  } else {
    const msg = min > 0 ? `请控制在${limit.min}-${limit.max}${limit.unit || 'KB'}之间` : `请控制在 ${limit.max}${limit.unit || 'KB'} 内`
    throw new Error(`文件大小不得超过 ${msg}`)
  }
}

// 返回已选文件的类型
function getFileType (file) {
  const name = file.name
  const i = name.lastIndexOf('.')
  return i > 0 ? name.slice(i * 1 + 1).toLowerCase() : ''
}

// 计算图片的尺寸【注：此函数为异步函数】
function computeImageSize (file) {
  const blob = URL.createObjectURL(file)
  const image = document.createElement('img')
  image.src = blob
  return new Promise(resolve => {
    image.addEventListener('load', () => {
      const height = image.naturalHeight
      const width = image.naturalWidth
      resolve({ width, height })
    })
  })
}

// 转换传入的 limit 数值
function transformValue (limit) {
  const unit = limit.unit.toLowerCase()
  const step = { kb: 1024, mb: 1048576, gb: 1073741824 }
  const minVal = limit.min || 0
  const maxVal = limit.max || 0
  const unitVal = step[unit] || 1024
  const min = minVal * unitVal
  const max = maxVal * unitVal
  return { min, max }
}
// 设置分片大小
function setPartSize (file) {
  let num = 102400
  const size = file.size
  if (size > 512000 && size <= 5242880) {
    num = 307200
  } else if (size > 5242880) {
    num = 819200
  }
  return num
}
// 获取授权, 返回分配的文件名、 初始化参数, 失败返回 false
async function fetchSTS (option = { number: 1, type: 0 }) {
  const result = {}
  const query = Object.assign({ number: 1, type: 0 }, option)
  const data = await request('upload/stsUpload', query)
  const isOk = config.successCode.includes(data.code)
  if (isOk) {
    const res = data.data
    const config = {
      accessKeyId: res.accessKeyId,
      accessKeySecret: res.accessKeySecret,
      // region: data.data.endpoint,
      region: res.region,
      bucket: res.bucket,
      stsToken: res.securityToken
    }
    const file = {
      path: res.path,
      name: res.file_name[0]
    }
    Object.assign(result, { config, file })
  }
  return JSON.stringify(result) === '{}' ? false : result
}

export default upload
