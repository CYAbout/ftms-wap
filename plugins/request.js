/**
 * request 封装 （在客户端调用）
 * Created by wuxuanhua on 18/8/16
 */
// require('es6-promise').polyfill()
// eslint-disable-next-line no-unused-vars
import { RequestAxios, AjaxGet, baseUrl } from '~/plugins/axios'
import _ from 'lodash'
import urlConfig from '~/plugins/url-config' // 接口路径封装

// axios post
// eslint-disable-next-line no-unused-vars
function axiosPost(url, param = '') {
  // Main.defaults.headers.common['Authorization'] =
  return RequestAxios.post(url, param).then((res) => {
    return res
  }, (err) => {
    return err
  }).catch((err) => {
    console.log('catch err:>', err)
  })
}

// function axiosPut(url, param = '') {
//   // Main.defaults.headers.common['Authorization'] =
//   return RequestAxios.put(url, param).then((res) => {
//     return res
//   }, (err) => {
//     return err
//   }).catch((err) => {
//     console.log('catch err:>', err)
//   })
// }

// axios get
// eslint-disable-next-line no-unused-vars
function axiosGet(url, param = '') {
  if (param !== '') {
    let newParam = ''
    _.each(param, (value, key) => {
      if (key !== 'ACCESS_TOKEN' && key !== 'CODE_KEY') {
        if (newParam === '') {
          newParam = '?' + key + '=' + value
        } else {
          newParam += '&' + key + '=' + value
        }
      }
    })
    url = url + newParam
  }
  return RequestAxios.get(url, param).then((res) => {
    return res
  }, (err) => {
    return err
  }).catch((err) => {
    console.log('catch err:>', err)
  })
}

export default {
  // 查询广告位信息 code -> home_page_ads
  getAdvertisementList: (param, code = 'home_page_ads') => {
    return axiosGet(urlConfig.getAdvertisementList + code, param)
  },
  // 获取公钥
  getPublicKey: param => {
    return axiosGet(urlConfig.getPublicKey, param)
  },
  // 获取手机验证码 LOGIN_：登录  （快捷登录时使用）REGISTER_：注册  （注册时使用）FINDPASSWORD_：找回密码（找回密码时使用）
  sendMobileCode: param => {
    return axiosPost(urlConfig.sendMobileCode, param)
  },
  // APP端注册校验（手机验证码校验）
  registerCheck: param => {
    return axiosPost(urlConfig.registerCheck, param)
  },
  // 找回密码校验验证码
  findPasswordCheck: param => {
    return axiosPost(urlConfig.findPasswordCheck, param)
  },
  // 获取图片验证码
  getImageCode: param => {
    return axiosGet(urlConfig.getImageCode, param)
  },
  // 验证图片验证码
  checkImageCode: param => {
    // AjaxGet
    return axiosGet(urlConfig.checkImageCode, param)
  },
  // 优惠码验证
  checkProtectGuestReqInfo: (param) => {
    return axiosPost(urlConfig.checkProtectGuestReqInfo, param)
  },
  // 用户优惠码对接
  saveProtectGuestReqInfo: param => {
    return axiosPost(urlConfig.saveProtectGuestReqInfo, param)
  },
  // 登录
  login: param => {
    return axiosPost(urlConfig.login, param)
  },
  // 注册
  register: param => {
    return axiosPost(urlConfig.register, param)
  },
  // 找回密码
  findPassword: param => {
    return axiosPost(urlConfig.findPassword, param)
  },
  // 找回密码
  updatePassword: param => {
    return axiosPost(urlConfig.updatePassword, param)
  },
  // updateMemberInfo
  updateMemberInfo: param => {
    return axiosPost(urlConfig.updateMemberInfo, param)
  },
  // 退出登录
  logout: param => {
    return axiosPost(urlConfig.logout, param)
  },
  // 获取个人资料
  getMemberInfo: param => {
    return axiosGet(urlConfig.getMemberInfo, param)
  },
  /**
   * 获取系统码信息
   * 获取价格筛选区间 codeTypeNo为“price_range”
   * 获取商品标签（新品和热销等）codeTypeNo为“product_tag”
   * 获取预约试驾的计划购车时间 codeTypeNo为“plan_shopping_time”
   * 获取订单新类型codeTypeNo为"order_type"
   */
  getSysCodeValues: (param, code = 'price_range') => {
    return axiosGet(urlConfig.getSysCodeValues + code, param)
  },
  // 获取我的订单页面新订单类型
  getSysCodeValuesNewOrderType: (param, code = 'order_type') => {
    return axiosGet(urlConfig.getSysCodeValues + code, param)
  },
  /**
   * 获取前台分类筛选条件
   * parentId为前台分类父id，查询一级分类时为-1（获取车型时，先传-1，然后再调用，传1整车）
   */
  getProCatalogByParentId: (param, code = '-1') => {
    return axiosGet(urlConfig.getProCatalogByParentId + code, param)
  },
  // 根据车系获取车型
  getProductByProCatalogId: (catelogId = 0) => {
    return axiosGet(urlConfig.getProductByProCatalogId + catelogId)
  },
  // 新增预约
  insertDrive: data => {
    return axiosPost(urlConfig.insertDrive, data)
  },
  // 查询商品列表
  queryProductListForPage: param => {
    return axiosPost(urlConfig.queryProductListForPage, param)
  },
  // 加入心愿单
  insertCollect: param => {
    return axiosPost(urlConfig.insertCollect, param)
  },
  // 获取心愿单
  queryCollectGoodsList: param => {
    return axiosGet(urlConfig.queryCollectGoodsList, param)
  },
  // 获取预售商品信息 {productId}
  queryProductPresellInfo: (param, productId = '') => {
    return axiosGet(urlConfig.queryProductPresellInfo + productId, param)
  },
  // 我的预约信息
  queryDriveList: param => {
    return axiosGet(urlConfig.queryDriveList, param)
  },
  // 取消预约信息
  updateSubscribeStatus: (param, productId = '') => {
    return axiosGet(urlConfig.updateSubscribeStatus + productId, param)
  },

  // 查询商品详细信息
  queryProductDetail: (param, productId = '') => {
    return axiosGet(urlConfig.queryProductDetail + productId, param)
  },
  // 查询商品规格信息（包含规格值）必传参数为商品ID：productId（截图商品id为12544）
  queryGoodsAttributeList: param => {
    return axiosPost(urlConfig.queryGoodsAttributeList, param)
  },
  // 查询商品规格值信息 请求参数商品ID：productId和规格ID：attributeId。均为必填参数
  queryGoodsAttributeValueList: param => {
    return axiosPost(urlConfig.queryGoodsAttributeValueList, param)
  },
  // 查询单品列表 必传参数为商品ID：productId，可选参数为选中的规格值id：goodsAttributeValueIds
  queryGoodsInfoList: param => {
    return axiosPost(urlConfig.queryGoodsInfoList, param)
  },
  // 查询商品意向金
  queryProductEarnest: (param, productId = '') => {
    return axiosGet(urlConfig.queryProductEarnest + productId, param)
  },
  /**
   * 获取区域信息
   * 根据父id查询区域信息，查询省份信息时regionParentId为0
   */
  getRegionInfo: (param, parentId = '0') => {
    return axiosGet(urlConfig.getRegionInfo + parentId, param)
  },
  /**
   * 获取经销商列表信息
   * @param param "provinceId":130000, "dealerName":"新华","cityId":130100
   * @returns {*}
   */
  queryDealerList: param => {
    return axiosPost(urlConfig.queryDealerList, param)
  },
  /**
   * 按位置获取区域
   * @param param "cityName":beijing
   * @returns {*}
   */
  getRegionInfoByLocate: param => {
    return axiosPost(urlConfig.getRegionInfoByLocate, param)
  },
  /**
   * 预售订单下单
   * @param param
   * goodsId（Integer）:货品ID（SKU）
   * earnestAmount（BigDecimal）: 意向金金额
   * planId（Integer）: 优惠方案ID
   * planDesc（String）: 优惠方案描述
   * dealerId（Integer）: 经销商Id
   * dealerCityId（Integer）: 经销商所在城市Id
   * dealerName（String）: 经销商名称
   * isOldCarowner（String）: 是否老车主（Y / N）
   * extractName（String）: 提车人名称
   * exractMobilephone（String）提车人手机号
   * idCardNo（String）提车人身份证号
   * orderChannel（String）订单渠道来源（官方商城01、门店扫码02、花椒直播03、熊猫直播04、广告05）
   * orderTerminal: （String）订单终端来源（PC，WechatOfficialAccount，H5，APP）
   * @returns {*}
   */
  createPreSaleOrder: param => {
    return axiosPost(urlConfig.place, param)
  },
  // 订单列表 "orderStatus":"", "beginPage":"1","pageSize":"5"
  orderList: param => {
    return axiosPost(urlConfig.orderList, param)
  },
  // 订单详情
  orderDetail: (param, orderNo = '') => {
    return axiosGet(urlConfig.orderDetail + orderNo, param)
  },
  // 退款单列表 "orderStatus":"", "beginPage":"1","pageSize":"5"
  refundOrderList: param => {
    return axiosPost(urlConfig.refundOrderList, param)
  },
  // 退款单详情
  refundDetail: (param, orderNo = '') => {
    return axiosGet(urlConfig.refundDetail + orderNo, param)
  },
  // 银行卡留资
  saveMemberBankCard: (param) => {
    return axiosPost(urlConfig.saveMemberBankCard, param)
  },
  // 提交银行卡信息
  bankCard: (param) => {
    return axiosPost(urlConfig.bankCard, param)
  },
  // 取消订单（未支付调用）
  cancel: (param, orderNo = '') => {
    return axiosGet(urlConfig.cancel + orderNo, param)
  },
  // 取消退款（已支付调用）
  refundCancel: (param, orderNo = '') => {
    return axiosGet(urlConfig.refundCancel + orderNo, param)
  },
  /**
   * 评价相关
   */
  // 我的评价列表
  queryAssessmentList: param => {
    return axiosPost(urlConfig.queryAssessmentList, param)
  },
  // 新增评价
  insertAssessment: param => {
    return axiosPost(urlConfig.insertAssessment, param)
  },
  // 商品评价列表
  listAssessment: param => {
    return axiosPost(urlConfig.listAssessment, param)
  },
  // 评价详情
  getAssessmentInfo: (param, id) => {
    return axiosGet(urlConfig.getAssessmentInfo + id, param)
  },
  /**
   * 订单支付
   * type(String)支付方式（00 网银支付，01 微信扫码支付，02 支付宝扫码支付，03 微信公众号支付，04 支付宝H5支付，06 银联在线(移动端)，07 支付宝服务窗）
   * payInfo(String)支付连接或二维码
   */
  pay: (param, orderNo = '', payType = '03') => {
    // {orderNo}/{payType}
    return axiosGet(urlConfig.pay + orderNo + '/' + payType, param)
  },
  // 支付状态查询 {orderNo}/{payType} （主订单号）
  query: (param, orderNo = '', payType = '03') => {
    // {orderNo}/{payType}
    return axiosGet(urlConfig.query + orderNo + '/' + payType, param)
  },
  // 申请退款 "orderNo":"201811121418129439","reason":"不想要了，赶紧退款"
  apply: param => {
    return axiosPost(urlConfig.apply, param)
  },
  // 发送核销码
  info: (param, orderNo = '') => {
    return axiosGet(urlConfig.info + orderNo, param)
  },
  /**
   * 保存调查问卷
   * @param param
   * orderNo(String) 订单号（子订单）
   * questionnaireInfo(JSONArray)
   *  name(String) 问题名称
   *  code(String) 问题编号
   *  answerAndCode(String) 问题答案
   *  @returns {*}
   */
  insertQuestionnaire: param => {
    return axiosPost(urlConfig.insertQuestionnaire, param)
  },
  // --------------------------- 卡劵接口 ---------------------------
  // 卡券活动信息
  queryCardActivity: param => {
    return axiosGet(urlConfig.queryCardActivity, param)
  },
  // 卡券列表
  cardList: (param, activeId) => {
    return axiosGet(urlConfig.cardList + activeId, param)
  },
  // 卡券详情
  cardDetail: (param, cardVoucherId) => {
    return axiosGet(urlConfig.cardDetail + cardVoucherId, param)
  },
  // 卡券订单下单
  createCardVoucherOrder: param => {
    return axiosPost(urlConfig.createCardVoucherOrder, param)
  },
  // 个人卡券列表
  cardVouchersList: param => {
    return axiosPost(urlConfig.cardVouchersList, param)
  },
  // 获取消息详情
  messageDetail: (param, msgId) => {
    return axiosGet(urlConfig.messageDetail + msgId, param)
  },
  // 获取消息列表
  messageList: (param, msgType) => {
    return axiosPost(urlConfig.messageList, param)
  },
  // 处理消息列表（已读，删除）
  dealMsgList: params => {
    return axiosPost(urlConfig.dealMsgList, params)
  },
  // 查询消息条数
  messageNumber: param => {
    return axiosGet(urlConfig.messageNumber, param)
  },
  // 判断是否在phev活动期间内
  phevActivityTime: param => {
    return axiosGet(urlConfig.phevActivityTime, param)
  },
  // 判断是否在亚洲龙活动期间内
  yzlActivityTime: param => {
    return axiosGet(urlConfig.yzlActivityTime, param)
  },
  // 判断4.11活动状态
  getActivityState: param => {
    return axiosGet(urlConfig.getActivityState, param)
  },
  // 判断是否在phev活动期间内
  activityMay: param => {
    return axiosGet(urlConfig.activityMay, param)
  }
}
