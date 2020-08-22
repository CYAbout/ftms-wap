/**
 * Created by wuxuanhua on 2018/11/3.
 */
'use strict'

import Vue from 'vue'
import _ from 'lodash'
import Base64 from '~/utils/base64'

const Storage = (function () {
  let Params = {
    toyotaUserObj: null,
    toyotaPasswordObj: null, // 记住登录密码
    toyotaPayOrderNo: null,
    activityIcon: null
  }

  // 定义类
  class Storage {
    constructor() {
      this.storage = window.localStorage
    }

    // set
    set(key, value) {
      this.storage.removeItem(key)
      this.storage.setItem(key, Base64.encode(value))
    }

    // get
    get(key) {
      let value = this.storage.getItem(key) || ''
      if (value !== '' && Object.prototype.toString.call(value) === '[object String]') {
        // 未经base64处理的数据
        if (value.indexOf('{') >= 0 || value.indexOf(':') >= 0 || value.indexOf('}') >= 0) {
          this.storage.removeItem(key) // 清除该存储内容
          value = ''
        } else {
          value = Base64.decode(value)
        }
      }
      return value
    }

    // remove
    remove(key) {
      this.storage.removeItem(key)
    }

    // clear
    clear() {
      this.storage.clear()
    }
  }

  let StorageObj = new Storage() // 存储操作对象
  // 本地存储封装对象
  let StorageService = {} // new Object();
  _.each(Params, (value, key) => {
    StorageService[key] = {
      set: (value) => {
        StorageObj.set(key, value)
      },
      get: () => {
        return StorageObj.get(key)
      },
      getReset: () => {
        let _value = StorageObj.get(key)
        StorageObj.remove(key)
        return _value
      },
      clear: () => {
        StorageObj.remove(key)
      },
      clearAll: () => {
        StorageObj.clear()
      },
      setWithTime(key, value) {
        const curTime = new Date().getTime()
        window.localStorage.setItem(key, JSON.stringify({data: value, time: curTime}))
      }
    }
  })

  return StorageService
})()

Vue.prototype.$storage = Storage // VUE全局变量 Storage
export default Storage
