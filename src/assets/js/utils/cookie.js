// 保存cookie
export function setCookie (key, v, expiredays = 7) {
  const exdate = new Date()
  exdate.setDate(exdate.getDate() + expiredays)
  const expires = expiredays ? `;expires=${exdate.toGMTString()}` : ''
  document.cookie = `${key}=${escape(v)}${expires}`
}

// 删除cookie
export function delCookie (key) {
  setCookie(key, '', -1)
}

// 取回cookie
export function getCookie (key) {
  let v = ''
  if (document.cookie.length > 0) {
    let start = document.cookie.indexOf(key + '=')
    if (start >= 0) {
      start = start + key.length + 1
      let end = document.cookie.indexOf(';', start)
      if (end === -1) end = document.cookie.length
      v = unescape(document.cookie.substring(start, end))
    }
  }
  return v
}
