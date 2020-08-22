// import Vue from 'vue'
// import service from '~/plugins/axios'
import uaParse from '~/utils/ua-parse'
import Request from '~/plugins/request.js'
import _ from 'lodash'
// import { scrollTo, easing } from '~/utils/scroll-to-anywhere'
// import urlConfig from '~/plugins/url-config'

/**
 * global actions
 * ({commit})
 * (context, obj) +> .$store.dispatch('',{})
 */
export const actions = {

  // Nuxt.js 会以上下文对象作为参数，调用一个特别的方法，叫做 nuxtServerInit。所以当应用完毕时，一些我们从服务器获取到的数据就会被填充到这个状态树 (store) 上。
  // 全局服务初始化
  nuxtServerInit(store, { params, route, req }) {
    // 检查设备类型
    const userAgent = process.server ? req.headers['user-agent'] : navigator.userAgent
    const { isMobile } = uaParse(userAgent)

    store.commit('option/SET_USER_AGENT', userAgent)
    store.commit('option/SET_MOBILE_LAYOUT', isMobile)

    const initAppData = []
    return Promise.all(initAppData)
  },

  // 商品详情页加载次数
  doDetailsLoad({ commit, state }) {
    let num = state.goods.detailsLoad
    commit('goods/DETAILS_LOAD_NUM', num + 1)
  },

  // 预售详情页加载次数
  doPresellLoad({ commit, state }) {
    let num = state.goods.presellLoad
    commit('goods/PRESELL_LOAD_NUM', num + 1)
  },

  // 获取 公钥
  publicKey ({ commit }) {
    Request.getPublicKey().then(result => {
      if (result.success) {
        let obj = result.data || {}
        commit('user/PWD_PUBLIC_KEY', {
          exp: obj.exp,
          mod: obj.mod
        })
      }
    })
  },
  // 获取位置
  getPosition (context, obj) {
    context.commit('user/POSITION_GET_CITY', {
      provinceName: obj.provinceName,
      provinceId: obj.provinceId,
      cityName: obj.cityName,
      cityId: obj.cityId
    })
  },
  // 获取位置
  getDealer (context, obj) {
    context.commit('user/GET_DEALER', {
      provinceObj: obj.provinceObj,
      cityObj: obj.cityObj,
      dealerName: obj.dealerName
    })
  },
  // 获取平安用户code
  getUserCode (context, obj) {
    context.commit('user/PA_GET_USERCODE', {
      uniqueUserId: obj.uniqueUserId,
      utmSource: obj.utmSource
    })
  },
  // 登录
  doLogin (context, obj) {
    context.commit('user/USER_GET_DATA', obj)
  },

  // 获取用户信息
  getUserInfo (context, obj) {
    let userObj = context.state.user.user
    Request.getMemberInfo({
      'ACCESS_TOKEN': obj.token || ''
    }).then(result => {
      if (result.success) {
        let obj = result.data || {}
        userObj.data['birthday'] = obj.birthday || ''
        userObj.data['loginName'] = obj.loginName || ''
        userObj.data['memberId'] = obj.memberId || obj.memberId || ''
        userObj.data['memberLogo'] = obj.memberLogo || ''
        userObj.data['mobile'] = obj.mobile || ''
        userObj.data['realName'] = obj.realName || ''
        userObj.data['sex'] = obj.sex || ''
        userObj.data['idCard'] = obj.idCard || ''
        context.commit('user/USER_GET_DATA', userObj)
      }
    })
  },

  // 获取首页广告数据
  getAdvertisementList({ commit }) {
    Request.getAdvertisementList().then(result => {
      if (result.success) {
        // console.log('result:>', result)
        let newObj = {}
        _.each(result.data, (obj, key) => {
          // console.log(key + '--' + obj)
          let advertisementPicsBOList = obj.advertisementPicsBOList || []
          _.each(advertisementPicsBOList, (list, key) => {
            list['linkUrl'] = list.linkUrl || ''
            list['picHrefUrl'] = list.picHrefUrl || ''
            list['productId'] = list.productId || ''
            // if (!list.linkUrl && list.productId && obj.adNo === 'app_d_home_top2_ad') {
            //   list.linkUrl = '/book/' + list.productId
            // }
          })
          if (obj.adNo === 'app_d_home_top1_ad') {
            newObj['swipeList'] = advertisementPicsBOList
          } else if (obj.adNo === 'app_d_home_top2_ad') {
            newObj['newCarList'] = advertisementPicsBOList
          } else if (obj.adNo === 'app_d_home_top3_ad') {
            newObj['activityList'] = advertisementPicsBOList
          }
        })
        commit('home/ADVERTISEMENT_GET_DATA', {
          swipeList: newObj.swipeList,
          newCarList: newObj.newCarList,
          activityList: newObj.activityList
        })
      }
    })
  },

  // 订单显示状态
  setOrderType(context, str) {
    context.commit('user/ORDER_SHOW_TYPE', str)
  }
}
