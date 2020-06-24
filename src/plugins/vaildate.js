import Vue from 'vue'
// import { Modal } from 'ant-design-vue'
/**
 * @description 校验数据是否符合预期
 * @param rules { Array } // 需要校验的对象， 必须是传Array类型
 * @return Object
 * rules = [
 *  {
 *    key: '', // 要校验的字段名
 *    value: '', // 要校验的值
 *    rule: [
 *      { required: true, message: '自定义错误说明' } // 支持的规则如上方所示
 *    ]
 *  }
 * ]
 */
Vue.prototype.$vaildate = function (rule = []) {
  const t = Object.prototype.toString.call(rule).slice(8, -1)
  // 参数必须正确
  if (t !== 'Array') {
    throw new Error('参数类型错误，请传入数组，详细格式请查看 src/plugins/rule.js')
  }
  // 支持校验的规则
  const rules = ['required', 'len', 'minLen', 'maxLen', 'min', 'max', 'enum', 'type', 'pattern']
  const obj = {
    error: false,
    infos: []
  }
  rule.map((item, i) => {
    const field = item.key
    const val = item.value
    const itemRule = item.rule || []
    const len = itemRule.length
    for (let j = 0; j < len; j++) {
      // 规则字段名
      const ruleKeys = Object.keys(item.rule[j])
      // 规则的合法值
      const ruleVals = Object.values(item.rule[j])
      // 注意顺序
      if (!rules.includes(ruleKeys[0])) {
        throw new Error('不支持的校验规则，请到vaildate.js中自行扩展')
      } else if (ruleKeys[0] === 'required' && !ruleVals[0] && !val) {
        // 选填项，不填直接校验通过，填了就必须遵守其他校验规则
        break
      } else {
        let error = false
        switch (ruleKeys[0]) {
          // 校验数据是否可以为空
          case 'required':
            // 不允许为空
            error = (!val) === ruleVals[0]
            break
          // 校验数据的长度是否正确
          case 'len':
            error = ruleVals[0] !== val.length
            break
          case 'minLen':
            error = ruleVals[0] > val.length
            break
          case 'maxLen':
            error = ruleVals[0] < val.length
            break
          case 'min':
            error = ruleVals[0] > val
            break
          case 'max':
            error = ruleVals[0] < val
            break
          case 'enum':
            error = !ruleVals[0].includes(val)
            break
          case 'type': {
            const valType = Object.prototype.toString.call(val).slice(8, -1).toLowerCase()
            error = ruleVals[0].toLowerCase() !== valType
            break
          }
          case 'pattern':
            error = !ruleVals[0].test(val)
            break
        }
        if (error) {
          obj.error = error
          obj.infos.push({
            field,
            index: i,
            message: ruleVals[1]
          })
          break
        }
      }
    }
  })
  return obj
}
