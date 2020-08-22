/**
 * Created by wuxuanhua on 2018/11/3.
 */
'use strict'

import Vue from 'vue'
import _ from 'lodash'
import Base64 from '~/utils/base64'

const Cache = (function () {
  let Params = {
    userInfo: null,
    goods: null,
    register: null,
    origin: null,
    utmContent: null,
    utmCampaign: null,
    uniqueUserId: null
  }

  // 定义类
  class Session {
    constructor() {
      this.session = window.sessionStorage
    }

    // set
    set(key, value) {
      this.session.removeItem(key)
      this.session.setItem(key, Base64.encode(value))
    }

    // get
    get(key) {
      let value = this.session.getItem(key) || ''
      if (value !== '' && Object.prototype.toString.call(value) === '[object String]') {
        // 未经base64处理的数据
        if (value.indexOf('{') >= 0 || value.indexOf(':') >= 0 || value.indexOf('}') >= 0) {
          this.session.removeItem(key) // 清除该存储内容
          value = ''
        } else {
          value = Base64.decode(value)
        }
      }
      return value
    }

    // remove
    remove(key) {
      this.session.removeItem(key)
    }

    // clear
    clear() {
      this.session.clear()
    }
  }

  let CacheObj = new Session() // 存储操作对象
  // 本地存储封装对象
  let CacheService = {} // new Object();
  _.each(Params, (value, key) => {
    CacheService[key] = {
      set: (value) => {
        CacheObj.set(key, value)
      },
      get: () => {
        return CacheObj.get(key)
      },
      getReset: () => {
        let _value = CacheObj.get(key)
        CacheObj.remove(key)
        return _value
      },
      clear: () => {
        CacheObj.remove(key)
      },
      clearAll: () => {
        CacheObj.clear()
      }
    }
  })

  return CacheService
})()

Vue.prototype.$cache = Cache // VUE全局变量 Cache
export default Cache
