/**
 * 用户信息保存封装
 */
import Vue from 'vue'
import _ from 'lodash'
import Storage from '~/plugins/storage.js'
// import Cache from '~/plugins/cache.js'
import Util from '~/plugins/util.js'
// import Pinyin from '~/utils/pinyin.js';

const Common = {
  /**
   * 密码加密 sha1 加密
   *
   * @param {*} passward 未加密密码
   * @param {*} mod  模
   * @param {*} exponent 参数
   * @returns  密码
   */
  fcmdEncrypt: (passward, mod, exponent) => {
    console.log(passward, mod, exponent)
    // var mod = "00adf39a1a46538fea090ae8e5d39c3a413463c78cb5a130bce26a111c71bd12513ba474ae27ed4fdd002207b86ec2325fe24a3262c2683972d68029225bbf5903bf7e566ec3725268660796def1255e319ec72e72637d944d9dadc533905facb74d3c27854df6ee415c6f1b9aea1324bc28e8210e44e9b47d58fabe12e98994c1"
    // var exponent = "010001"
    // eslint-disable-next-line no-undef
    return RSAUtils.encryptedString(RSAUtils.getKeyPair(exponent, '', mod), encodeURIComponent(passward))
  },
  // 保存用户信息 保存5天
  saveUserInfo: (obj) => {
    Storage.toyotaUserObj.set(Util.Str.jsonToStr({
      date: new Date(), // 当前时间
      saveDay: 5, // 保留几天
      obj: obj
    }))
  },
  saveActIcon: (obj) => {
    Storage.activityIcon.set(Util.Str.jsonToStr({
      date: new Date().getTime(), // 当前时间
      icon: 3,
      obj: obj
    }))
  },

  // 获取用户信息
  getUserInfo: () => {
    let userInfo = Storage.toyotaUserObj.get()
    // console.log('userInfo:>', userInfo)
    if (Object.prototype.toString.call(userInfo) === '[object String]' && userInfo !== '') {
      userInfo = Util.Str.strToJson(userInfo)
      let a = (new Date(userInfo.date).getTime()) + parseInt(userInfo.saveDay) * (1000 * 60 * 60 * 24) // 截止时间
      let b = (new Date()).getTime() // 这是获取当前时间，是一个不固定的数值
      let [d, s, h, m] = [0, 0, 0, 0] // 定义变量
      d = Math.floor((a - b) / 1000 / 60 / 60 / 24) // 获取剩余天数
      h = Math.floor((a - b) / 1000 / 60 / 60 % 24) // 获取剩余小时
      m = Math.floor((a - b) / 1000 / 60 % 60) // 获取剩余分钟
      s = Math.floor((a - b) / 1000 % 60) // 获取剩余秒数
      if (d <= 0) d = ''
      if (h <= 0) h = ''
      if (m <= 0) m = ''
      if (s <= 0) s = ''
      if (('' + d + h + m + s) === '') {
        return ''
      } else {
        return userInfo.obj
      }
    } else {
      return ''
    }
  },
  getActIcon: () => {
    let iconObj = Storage.activityIcon.get()
    if (Object.prototype.toString.call(iconObj) === '[object String]' && iconObj !== '') {
      iconObj = Util.Str.strToJson(iconObj)
      return iconObj
    } else {
      return ''
    }
  },
  // 清除用户信息
  clearUserInfo: () => {
    Storage.toyotaUserObj.clear()
  },

  // 获取未登录对象
  getUnLoginData () {
    return {
      logined: false,
      data: {
        loginName: '',
        memberId: '',
        mobile: '',
        token: ''
      }
    }
  },

  // 格式化城市列表
  formatProvinceName: (obj) => {
    _.each(obj, (value, key) => {
    })
  },

  // 隐藏页面插件
  plugInHide: () => {
    // eslint-disable-next-line no-undef
    let ids = $('body > div')
    if (Object.prototype.toString.call(ids) === '[object Object]') {
      _.each(ids, function (value, key) {
        console.log('value-id:>', value.id)
        if (value.id !== '' && value.id.indexOf('xunlei_com_thunder_helper') >= 0) {
          // eslint-disable-next-line no-undef
          $(value).hide()
        }
      })
    }
  }
}

Vue.prototype.$common = Common // VUE全局变量
