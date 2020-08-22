/*
* HTML编译输出过滤器
*/

// 文字溢出过滤器
export const textOverflow = (text, length) => {
  const _length = length || text.length
  const cansub = _length && text && (text.length) > _length
  return cansub ? (text.substr(0, _length) + '...') : text
}

// 首字母大写
export const firstUpperCase = str => {
  return str ? str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase()) : str
}

// 隐藏部分手机号
export const hidePhone = phoneNum => {
  phoneNum = phoneNum.toString().replace(/\s*/g, '')
  return phoneNum === '' ? '' : phoneNum.replace(/(\d{3})\d{1,5}(\d{3})/g, '$1*****$2')
}

// 隐藏部分身份证号或银行卡号 530****350 12-19
export const hideIdNo = cardNo => {
  cardNo = cardNo || ''
  if (isNaN(cardNo)) return ''
  if (cardNo === '' || cardNo === 0) return ''
  cardNo = cardNo.toString().replace(/\s*/g, '')
  return cardNo === '' ? '' : cardNo.replace(/(\d{4})\d{4,11}(\d{4})/, '$1****$2')
}

/**
 * 金额格式化   金额 用逗号 隔开 数字格式化
 * @param s - 金额
 * @param n - 小数位数 默认为保留两位小数
 */
export const fMoney = (s, n = 2) => {
  s = s || ''
  if (isNaN(s)) return '0.00'
  if (s === '' || s === 0) return '0.00'
  let flag = ''
  if (s < 0) {
    flag = '-'
    s = s.toString().split('-')[1]
  }

  n = (n > 0 && n <= 20) ? n : 2
  // eslint-disable-next-line no-useless-escape
  s = parseFloat((s + '').replace(/[^\d\.-]/g, '')).toFixed(n) + ''

  let [l, r, t] = [s.split('.')[0].split('').reverse(), s.split('.')[1], '']
  if (!r) return s + '.00'
  for (let i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? ',' : '')
  }
  return flag + t.split('').reverse().join('') + '.' + r
}

// 四舍五入 保留两位小数
export const floorTwo = s => {
  if (isNaN(s)) {
    s = 0
  }
  if (Number(s) < 0) {
    s = 0
  }
  return Math.floor(s * 100) / 100
}
