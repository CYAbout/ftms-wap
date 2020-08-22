/**
 * Created by wuxuanhua on 17/5/5.
 */

/**
 * 防止跨站脚本攻击（XSS）
 * 在数据添加到DOM时候，我们需要对内容进行HtmlEncode或JavaScriptEncode，以预防XSS攻击。
 */
'use strict'
// 使用“\”对特殊字符进行转义，除数字字母之外，小于127使用16进制“\xHH”的方式进行编码，大于用unicode（非常严格模式）。
let JavaScriptEncode = function (str) {
  // eslint-disable-next-line no-array-constructor
  let hex = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f')

  function changeTo16Hex (charCode) {
    return '\\x' + charCode.charCodeAt(0).toString(16)
  }

  function encodeCharx (original) {
    let found = true
    let thecharchar = original.charAt(0)
    let thechar = original.charCodeAt(0)
    switch (thecharchar) {
      case '\n':
        return '\\n'
        // eslint-disable-next-line no-unreachable
        break // newline
      case '\r':
        return '\\r'
        // eslint-disable-next-line no-unreachable
        break // Carriage return
      case '\'':
        return '\\\''
        // eslint-disable-next-line no-unreachable
        break
      case '"':
        return '\\"'
        // eslint-disable-next-line no-unreachable
        break
      // eslint-disable-next-line no-useless-escape
      case '\&':
        return '\\&'
        // eslint-disable-next-line no-unreachable
        break
      case '\\':
        return '\\\\'
        // eslint-disable-next-line no-unreachable
        break
      case '\t':
        return '\\t'
        // eslint-disable-next-line no-unreachable
        break
      case '\b':
        return '\\b'
        // eslint-disable-next-line no-unreachable
        break
      case '\f':
        return '\\f'
        // eslint-disable-next-line no-unreachable
        break
      case '/':
        return '\\x2F'
        // eslint-disable-next-line no-unreachable
        break
      case '<':
        return '\\x3C'
        // eslint-disable-next-line no-unreachable
        break
      case '>':
        return '\\x3E'
        // eslint-disable-next-line no-unreachable
        break
      default:
        found = false
        break
    }
    if (!found) {
      if (thechar > 47 && thechar < 58) { // 数字
        return original
      }

      if (thechar > 64 && thechar < 91) { // 大写字母
        return original
      }

      if (thechar > 96 && thechar < 123) { // 小写字母
        return original
      }

      if (thechar > 127) { // 大于127用unicode
        let c = thechar
        let a4 = c % 16
        c = Math.floor(c / 16)
        let a3 = c % 16
        c = Math.floor(c / 16)
        let a2 = c % 16
        c = Math.floor(c / 16)
        let a1 = c % 16
        return '\\u' + hex[a1] + hex[a2] + hex[a3] + hex[a4] + ''
      } else {
        return changeTo16Hex(original)
      }
    }
  }

  let preescape = str
  let escaped = ''
  let i = 0
  for (i = 0; i < preescape.length; i++) {
    escaped = escaped + encodeCharx(preescape.charAt(i))
  }
  return escaped
}

// 将字符转换成HTMLEntites，以对抗XSS。
let HtmlEncode = function (str) {
  // eslint-disable-next-line no-array-constructor
  let hex = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f')
  let preescape = str
  let escaped = ''
  for (let i = 0; i < preescape.length; i++) {
    let p = preescape.charAt(i)
    escaped = escaped + escapeCharx(p)
  }

  return escaped

  function escapeCharx (original) {
    let found = true
    let thechar = original.charCodeAt(0)
    switch (thechar) {
      case 10:
        return '<br/>'
        // eslint-disable-next-line no-unreachable
        break // newline
      case 32:
        return '&nbsp;'
        // eslint-disable-next-line no-unreachable
        break // space
      case 34:
        return '&quot;'
        // eslint-disable-next-line no-unreachable
        break // "
      case 38:
        return '&amp;'
        // eslint-disable-next-line no-unreachable
        break // &
      case 39:
        return '&#x27;'
        // eslint-disable-next-line no-unreachable
        break // '
      case 47:
        return '&#x2F;'
        // eslint-disable-next-line no-unreachable
        break // /
      case 60:
        return '&lt;'
        // eslint-disable-next-line no-unreachable
        break // <
      case 62:
        return '&gt;'
        // eslint-disable-next-line no-unreachable
        break // >
      case 198:
        return '&AElig;'
        // eslint-disable-next-line no-unreachable
        break
      case 193:
        return '&Aacute;'
        // eslint-disable-next-line no-unreachable
        break
      case 194:
        return '&Acirc;'
        // eslint-disable-next-line no-unreachable
        break
      case 192:
        return '&Agrave;'
        // eslint-disable-next-line no-unreachable
        break
      case 197:
        return '&Aring;'
        // eslint-disable-next-line no-unreachable
        break
      case 195:
        return '&Atilde;'
        // eslint-disable-next-line no-unreachable
        break
      case 196:
        return '&Auml;'
        // eslint-disable-next-line no-unreachable
        break
      case 199:
        return '&Ccedil;'
        // eslint-disable-next-line no-unreachable
        break
      case 208:
        return '&ETH;'
        // eslint-disable-next-line no-unreachable
        break
      case 201:
        return '&Eacute;'
        // eslint-disable-next-line no-unreachable
        break
      case 202:
        return '&Ecirc;'
        // eslint-disable-next-line no-unreachable
        break
      case 200:
        return '&Egrave;'
        // eslint-disable-next-line no-unreachable
        break
      case 203:
        return '&Euml;'
        // eslint-disable-next-line no-unreachable
        break
      case 205:
        return '&Iacute;'
        // eslint-disable-next-line no-unreachable
        break
      case 206:
        return '&Icirc;'
        // eslint-disable-next-line no-unreachable
        break
      case 204:
        return '&Igrave;'
        // eslint-disable-next-line no-unreachable
        break
      case 207:
        return '&Iuml;'
        // eslint-disable-next-line no-unreachable
        break
      case 209:
        return '&Ntilde;'
        // eslint-disable-next-line no-unreachable
        break
      case 211:
        return '&Oacute;'
        // eslint-disable-next-line no-unreachable
        break
      case 212:
        return '&Ocirc;'
        // eslint-disable-next-line no-unreachable
        break
      case 210:
        return '&Ograve;'
        // eslint-disable-next-line no-unreachable
        break
      case 216:
        return '&Oslash;'
        // eslint-disable-next-line no-unreachable
        break
      case 213:
        return '&Otilde;'
        // eslint-disable-next-line no-unreachable
        break
      case 214:
        return '&Ouml;'
        // eslint-disable-next-line no-unreachable
        break
      case 222:
        return '&THORN;'
        // eslint-disable-next-line no-unreachable
        break
      case 218:
        return '&Uacute;'
        // eslint-disable-next-line no-unreachable
        break
      case 219:
        return '&Ucirc;'
        // eslint-disable-next-line no-unreachable
        break
      case 217:
        return '&Ugrave;'
        // eslint-disable-next-line no-unreachable
        break
      case 220:
        return '&Uuml;'
        // eslint-disable-next-line no-unreachable
        break
      case 221:
        return '&Yacute;'
        // eslint-disable-next-line no-unreachable
        break
      case 225:
        return '&aacute;'
        // eslint-disable-next-line no-unreachable
        break
      case 226:
        return '&acirc;'
        // eslint-disable-next-line no-unreachable
        break
      case 230:
        return '&aelig;'
        // eslint-disable-next-line no-unreachable
        break
      case 224:
        return '&agrave;'
        // eslint-disable-next-line no-unreachable
        break
      case 229:
        return '&aring;'
        // eslint-disable-next-line no-unreachable
        break
      case 227:
        return '&atilde;'
        // eslint-disable-next-line no-unreachable
        break
      case 228:
        return '&auml;'
        // eslint-disable-next-line no-unreachable
        break
      case 231:
        return '&ccedil;'
        // eslint-disable-next-line no-unreachable
        break
      case 233:
        return '&eacute;'
        // eslint-disable-next-line no-unreachable
        break
      case 234:
        return '&ecirc;'
        // eslint-disable-next-line no-unreachable
        break
      case 232:
        return '&egrave;'
        // eslint-disable-next-line no-unreachable
        break
      case 240:
        return '&eth;'
        // eslint-disable-next-line no-unreachable
        break
      case 235:
        return '&euml;'
        // eslint-disable-next-line no-unreachable
        break
      case 237:
        return '&iacute;'
        // eslint-disable-next-line no-unreachable
        break
      case 238:
        return '&icirc;'
        // eslint-disable-next-line no-unreachable
        break
      case 236:
        return '&igrave;'
        // eslint-disable-next-line no-unreachable
        break
      case 239:
        return '&iuml;'
        // eslint-disable-next-line no-unreachable
        break
      case 241:
        return '&ntilde;'
        // eslint-disable-next-line no-unreachable
        break
      case 243:
        return '&oacute;'
        // eslint-disable-next-line no-unreachable
        break
      case 244:
        return '&ocirc;'
        // eslint-disable-next-line no-unreachable
        break
      case 242:
        return '&ograve;'
        // eslint-disable-next-line no-unreachable
        break
      case 248:
        return '&oslash;'
        // eslint-disable-next-line no-unreachable
        break
      case 245:
        return '&otilde;'
        // eslint-disable-next-line no-unreachable
        break
      case 246:
        return '&ouml;'
        // eslint-disable-next-line no-unreachable
        break
      case 223:
        return '&szlig;'
        // eslint-disable-next-line no-unreachable
        break
      case 254:
        return '&thorn;'
        // eslint-disable-next-line no-unreachable
        break
      case 250:
        return '&uacute;'
        // eslint-disable-next-line no-unreachable
        break
      case 251:
        return '&ucirc;'
        // eslint-disable-next-line no-unreachable
        break
      case 249:
        return '&ugrave;'
        // eslint-disable-next-line no-unreachable
        break
      case 252:
        return '&uuml;'
        // eslint-disable-next-line no-unreachable
        break
      case 253:
        return '&yacute;'
        // eslint-disable-next-line no-unreachable
        break
      case 255:
        return '&yuml;'
        // eslint-disable-next-line no-unreachable
        break
      case 162:
        return '&cent;'
        // eslint-disable-next-line no-unreachable
        break
      case '\r':
        break
      default:
        found = false
        break
    }
    if (!found) {
      if (thechar > 127) {
        let c = thechar
        let a4 = c % 16
        c = Math.floor(c / 16)
        let a3 = c % 16
        c = Math.floor(c / 16)
        let a2 = c % 16
        c = Math.floor(c / 16)
        let a1 = c % 16
        return '&#x' + hex[a1] + hex[a2] + hex[a3] + hex[a4] + ';'
      } else {
        return original
      }
    }
  }
}

export default {
  JsEncode: JavaScriptEncode,
  HtmlEncode: HtmlEncode
}
