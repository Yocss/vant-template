function getType (vars) {
  return Object.prototype.toString.call(vars).slice(8, -1)
}

// 将数据写入store中
// data数据格式为: { key: 'keyName', value: any } 或 { keyName: value }
function setStore (state, data) {
  let val = data
  if (data.value) { val = { [data.key]: data.value } }
  Object.keys(val).forEach((k) => {
    if (getType(val[k]) === 'Object') {
      Object.assign(state[k], val[k])
    } else {
      state[k] = val[k]
    }
  })
}
// 单个改动时数据格式
// data = { key: 'keyName', value: { } }
// 或
// data = { keyName: value }

// 批量改动时的数据格式
// data = [
//  { key: 'keyName', value: {} },
//  或
//  { keyName: value },
// ]

export default {
  SET_STORE: (state, data) => {
    const type = getType(data)
    switch (type) {
      case 'Array': {
        // 批量改动
        data.forEach((val) => {
          setStore(state, val)
        })
        break
      }
      case 'Object': {
        // 单个改动
        setStore(state, data)
        break
      }
    }
  }
}
