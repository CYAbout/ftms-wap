/**
 * 信息同步 （主要用于两非父子组件间）
 * Created by wuxuanhua on 2018/11/3.
 * if (t.$dataSyncEmit) { // 监听
 *  // 登录
 *  t.$dataSyncEmit.$on('user-data-sync', function (Obj) {
 *    if (!Obj.userToken || !Obj.userId || Obj.userToken !== t.userObj.userToken) {}
 *  })
 * }
 */
'use strict'
import Vue from 'vue'

let DataSync = {}
DataSync.install = function (Vue, options) {
  Vue.prototype.$dataSyncEmit = new Vue() // 使用一个空的 Vue 实例作为中央事件总线

  /**
   * 用户信息同步
   * @param obj 用户信息对象
   */
  Vue.prototype.syncUserData = function (obj) {
    this.$dataSyncEmit.$emit('user-data-sync', obj)
  }

  /**
   * 通知调起头部弹层
   * @param type: login 登录； register 注册； forget 忘记密码验证； reset 重置密码
   */
  Vue.prototype.syncLoadLayer = function (type) {
    this.$dataSyncEmit.$emit('load-layer-sync', type)
  }

  // 同步地址信息
  Vue.prototype.syncCurrentAddressChanged = function (obj) {
    this.$dataSyncEmit.$emit('current-address-changed', obj)
  }
}

Vue.use(DataSync)
