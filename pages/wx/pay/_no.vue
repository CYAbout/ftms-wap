<template>
  <!--支付-->
  <div class="pay-container">
    <!--订单信息-->
    <div class="order-information">
      <i class="pay-success-icon iconfont icon-pay-success"></i>
      <span class="success-tip">订单提交成功,请尽快支付！</span>

      <!--订单号-->
      <div class="order-no">
        您的订单号为
        <span>{{orderObj.orderNo || ''}}</span>
      </div>
      <span class="order-tip">
        请您于
        <span>{{countDown.h}}：{{countDown.m}}：{{countDown.s}}</span>分钟内完成支付,否则订单会被自动取消！
      </span>
    </div>

    <!--车型图片-->
    <div class="car-pic">
      <img class="logo" src="~/assets/images/order_pay/TOYOTA.png">
      <div class="main-pic">
        <img :src="goodsInfo.goodsImg || ''">
      </div>
    </div>

    <!--车型名称-->
    <div class="car-title">{{goodsInfo.goodsName || ''}}</div>

    <!--选择的属性-->
    <ul v-if="attrList.length === 3" class="attribute-list">
      <li class="attribute-item bm-box bm-box-horizontal bm-box-vertical-center">
        <div class="left-content bm-box bm-box-horizontal">
          <span>{{attrList[0].attributeName || ''}}：</span>
          <span class="bm-flex">{{attrList[0].attributeValueName || ''}}</span>
        </div>
        <div class="bm-flex bm-box bm-box-horizontal">
          <span>{{attrList[1].attributeName || ''}}：</span>
          <span class="bm-flex">{{attrList[1].attributeValueName || ''}}</span>
        </div>
      </li>
      <li class="attribute-item bm-box bm-box-horizontal bm-box-vertical-center">
        <div class="bm-flex bm-box bm-box-horizontal">
          <span>{{attrList[2].attributeName || ''}}：</span>
          <span class="bm-flex">{{attrList[2].attributeValueName || ''}}</span>
        </div>
        <div @click="toDetails" class="order-details">
          订单详情
          <i class="iconfont icon-left-min"></i>
        </div>
      </li>
      <li class="attribute-item bm-box bm-box-horizontal bm-box-vertical-center">
        <div class="left-content bm-box bm-box-horizontal">
          <span>购买人：</span>
          <span class="bm-flex">{{orderObj.extractName || ''}}</span>
        </div>
        <div class="bm-flex bm-box bm-box-horizontal">
          <span>手机号：</span>
          <span class="bm-flex">{{orderObj.extractMobilephone || ''}}</span>
        </div>
      </li>
    </ul>
    <ul v-else class="attribute-list">
      <li class="attribute-item bm-box bm-box-horizontal bm-box-vertical-center">
        <!--<div class="left-content"><span>外观颜色：</span>白</div>-->
        <div v-for="(item,index) in attrList" class="bm-flex bm-box bm-box-horizontal">
          <span>{{item.attributeName || ''}}：</span>
          <span class="bm-flex">{{item.attributeValueName || ''}}</span>
        </div>
        <div @click="toDetails" class="order-details">
          订单详情
          <i class="iconfont icon-left-min"></i>
        </div>
      </li>
      <div v-show="attrList.length<=0" class="bm-flex"></div>
      <li class="attribute-item bm-box bm-box-horizontal bm-box-vertical-center">
        <div class="left-content">
          <span>购买人：</span>
          <span>{{orderObj.extractName || ''}}</span>
        </div>
        <div class="bm-flex">
          <span>手机号：</span>
          <span>{{orderObj.extractMobilephone || ''}}</span>
        </div>
      </li>
    </ul>

    <!--应付金额-->
    <div class="amount-payable">
      应付金额：
      <span>￥</span>
      <span>{{goodsInfo.depositPrice | fMoney}}</span>
    </div>

    <!--支付方式-->
    <div class="payment-method">
      <div class="payment-label">选择支付方式：</div>
      <!--选择支付方式-->
      <div class="payment-select bm-box bm-box-horizontal bm-box-vertical-center">
        <div
          v-show="isPublic"
          @click="payType = '03'"
          class="bm-flex payment-item bm-box bm-box-horizontal"
          :class="{'active': payType === '03'}"
        >
          <img class="pay-icon" src="~/assets/images/order_pay/wechat.png">
          <div class="bm-flex">微信支付</div>
          <span class="triangle"></span>
          <i class="iconfont icon-complete"></i>
        </div>
        <div
          v-show="!isPublic"
          @click="payType = '04'"
          class="bm-flex payment-item bm-box bm-box-horizontal"
          :class="{'active': payType === '04'}"
        >
          <img class="pay-icon" src="~/assets/images/order_pay/alipay.png">
          <div class="bm-flex">支付宝</div>
          <span class="triangle"></span>
          <i class="iconfont icon-complete"></i>
        </div>
        <div
          @click="payType = '06'"
          class="bm-flex payment-item bm-box bm-box-horizontal"
          :class="{'active': payType === '06'}"
        >
          <img class="pay-icon" src="~/assets/images/order_pay/unionpay.png">
          <div class="bm-flex">网银支付</div>
          <span class="triangle"></span>
          <i class="iconfont icon-complete"></i>
        </div>
      </div>
    </div>

    <!--立即支付-->
    <div @click="toPay" class="topay-btn">
      <i class="iconfont icon-rmb"></i>立即支付
    </div>

    <!--退款规则-->
    <div @click="refundRuleTip" class="refunds-rule">
      <i class="iconfont icon-refund"></i>退款规则
    </div>

    <!--支付中提示-->
    <div v-if="payTipShow">
      <pay-tip
        :show="payTipShow"
        :orderNo="orderObj.mainOrderNo"
        :payType="payType"
        @close="doClose"
      ></pay-tip>
    </div>

    <!--扫描二维码-->
    <qr-code :show="qrCodeShow" @close="doClose"></qr-code>
    <!--退款规则-->
    <prompt :show="promptShow" :type="'refund-rule'" @close="doClose"></prompt>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import _ from 'lodash'
import Request from '~/plugins/request'
import payTip from '~/components/book/layer/pay-tip.vue'
import qrCode from '~/components/book/layer/qr-code.vue'
import prompt from '~/components/common/layer/prompt.vue'

export default {
  name: 'pay',
  components: {
    payTip,
    qrCode,
    prompt
  },
  asyncData(context) { // async await
    return {
      orderNo: context.params.no
    }
  },
  head() {
    return {
      title: '一汽丰田官方商城',
      meta: [ // seo
        { hid: 'keywords', name: 'keywords', content: '' },
        { hid: 'description', name: 'description', content: '' }
      ]
    }
  },
  data() {
    return {
      timer: null,
      countDown: {
        d: '00',
        h: '00',
        m: '00',
        s: '00'
      },
      payTipShow: false,
      qrCodeShow: false,
      promptShow: false,
      payType: '04', // （00 网银支付，01 微信扫码支付，02 支付宝扫码支付，03 微信公众号支付，04 支付宝H5支付，06 银联在线(移动端)，07 支付宝服务窗）
      orderObj: {}, // 订单信息
      attrList: [], // 商品属性
      goodsInfo: {},
      isPublic: false
    }
  },
  mounted() {
    let t = this
    if (!t.userObj.logined) { // 获取登录信息
      let userObj = t.$common.getUserInfo() || ''
      if (userObj === '') {
        userObj = t.$common.getUnLoginData()
      }
      if (!userObj.logined) { // 未登录
        t.$common.clearUserInfo()
        t.$messageBox.confirm('登录失效，是否重新登录?').then(action => {
          t.syncLoadLayer({
            type: 'login',
            show: true
          })
        }, cancel => {
          t.$common.clearUserInfo()
          t.$router.replace('/wx')
        })
      } else {
        // 异步调用
        (async () => {
          try {
            await t.$store.dispatch('doLogin', userObj)
            console.log('userObj:>', t.userObj)
            t.getOrderDetail() // 获取订单详情
          } catch (error) {
            console.log(error)
          }
        })()
      }
    } else {
      t.getOrderDetail() // 获取订单详情
    }

    // 判断是否是微信浏览器
    let isWeChat = t.$util.isWeChat
    if (isWeChat) {
      t.payType = '03'
      t.isPublic = true
    }

    setTimeout(() => {
      t.$util.win.goTop() // 回到顶部
      if (this.$route.query.source === 'callback') {
        t.payTipShow = true
      }
    }, 400)
  },
  destroyed() {
    let t = this
    if (t.timer != null) {
      clearTimeout(t.timer)
      t.timer = null
    }
  },
  computed: {
    ...mapState({ // 映射
      userObj: state => state.user.user
    })
  },
  methods: {
    // 获取订单详情
    getOrderDetail() {
      let t = this
      t.attrList = []
      Request.orderDetail({
        ACCESS_TOKEN: t.userObj.data.token
      }, t.orderNo).then(result => {
        if (result.success) {
          console.log('result:', result)
          t.orderObj = result.data || {}
          t.orderObj['goodsInfo'] = t.orderObj.goodsInfo || []
          if (t.orderObj.goodsInfo.length > 0) {
            t.goodsInfo = t.orderObj.goodsInfo[0] || {}
            t.goodsInfo['attrs'] = t.goodsInfo.attrs || []
            t.orderObj['orderStatus'] = t.orderObj.orderStatus || ''
            t.orderObj['payStatus'] = t.orderObj.payStatus || ''
            _.each(t.goodsInfo.attrs, (item, key) => {
              item['attributeName'] = item.attributeName || ''
              console.log('attributeName:>', item.attributeName)
              // 过滤 外观 内饰
              if (!(item.attributeName.indexOf('外观') >= 0 || item.attributeName.indexOf('内饰') >= 0)) {
                t.attrList.push(item)
              }
            })

            // 已支付
            if (t.orderObj.orderStatus === 'PAID' || t.orderObj.payStatus === 'Y') {
              t.$router.push('/wx/user/order/deatils/' + t.orderNo)
            }
          }
          console.log('attrList:>', t.attrList)
          t.orderObj['payEndTime'] = t.$util.Date.getFormatDate(t.orderObj.payDealine, 'datetime')
          t.doCountDown(0, t.orderObj.payEndTime) // 倒计时
        } else if (result.code === '-10') {
          t.$messageBox.confirm('登录失效，是否重新登录?').then(action => {
            t.syncLoadLayer({
              type: 'login',
              show: true
            })
          }, cancel => {
            t.$common.clearUserInfo()
            t.$router.replace('/wx')
          })
        } else {
          t.$toast(result.msg)
        }
      })
    },
    // 支付
    toPay() {
      let t = this
      const tempwindow = window.open()
      // t.payTipShow = true
      // t.qrCodeShow = true
      t.$storage.toyotaPayOrderNo.set(t.orderNo) // 保存订单号
      Request.pay({
        ACCESS_TOKEN: t.userObj.data.token
      }, t.orderObj.mainOrderNo, t.payType).then(result => {
        if (result.success) {
          let obj = result.data || {}
          let payInfo = obj.payInfo || ''
          t.payTipShow = true
          t.$common.saveUserInfo(t.userObj) // 重新存储用户信息 (防止支付后获取不到用户信息)
          setTimeout(() => {
            if (t.payType === '04') {
              // window.open(payInfo)
              tempwindow.location = payInfo
            } else {
              window.location.href = payInfo
            }
          }, 10)
        } else if (result.code === '-10') {
          t.$messageBox.confirm('登录失效，是否重新登录?').then(action => {
            t.syncLoadLayer({
              type: 'login',
              show: true
            }, 10)
          }, cancel => {
            t.$common.clearUserInfo()
            t.$router.replace('/wx')
          })
        } else {
          t.$toast(result.msg)
        }
      })
      // t.$router.push('/wx/pay/success')
      // t.$router.push('/wx/pay/fail')
    },
    // 跳转订单详情
    toDetails() {
      this.$router.push('/wx/user/order/deatils/' + this.orderNo)
    },
    // 关闭弹窗
    doClose(obj) {
      let t = this
      if (obj.type === 'qrcode') {
        t.qrCodeShow = obj.show
      } else if (obj.type === 'prompt') {
        t.promptShow = obj.show
      } else if (obj.type === 'pay-tip') {
        t.payTipShow = obj.show
        if (obj.flag === 'pay-success') { // 支付成功
          t.$router.push('/wx/pay/success/' + t.orderNo)
        }
      }
    },
    // 退款规则
    refundRuleTip() {
      this.promptShow = true
      // this.$toast('您可以在与经销商签订订车、购车相关合同协议之前，随时提交退款申请。经销商将在3个工作日完成退款审核，如审核通过，将原路返回意向金至您的支付账户，具体到账情况以第三方支付平台及银行规定为准')
    },
    // 活动倒计时
    doCountDown(difference, deadline) {
      let t = this

      // 倒计时方法
      function countDown(difference, deadline) {
        let a = (t.$util.Date.strToDate(deadline)).getTime() // 截止时间
        let b = (new Date().getTime()) - difference // 这是获取当前时间，是一个不固定的数值
        let [d, s, h, m] = [0, 0, 0, 0] // 定义变量
        d = Math.floor((a - b) / 1000 / 60 / 60 / 24) // 获取剩余天数
        h = Math.floor((a - b) / 1000 / 60 / 60 % 24) // 获取剩余小时
        m = Math.floor((a - b) / 1000 / 60 % 60) // 获取剩余分钟
        s = Math.floor((a - b) / 1000 % 60) // 获取剩余秒数

        // 中间这块区域是用来判断，当前时间数值小于10的时候给他前面加个0，这里可以根据具体情况可加可不加，以下同理
        if (d < 10) {
          d = '0' + d
        } else if (d < 0) {
          d = 0
        }
        if (h < 10) {
          h = '0' + h
        } else if (h < 0) {
          h = 0
        }
        if (m < 10) {
          m = '0' + m
        } else if (m < 0) {
          m = 0
        }
        if (s < 10) {
          s = '0' + s
        } else if (s < 0) {
          s = 0
        }

        t.countDown = {
          d: d === 0 ? '00' : d,
          h: h === 0 ? '00' : h,
          m: m === 0 ? '00' : m,
          s: s === 0 ? '00' : s
        }
        if (a <= b) { // 当我们的时间到期的时候，清除计时器，然后把当前标签的内容设置为0；
          clearTimeout(t.timer)
          t.countDown = {
            d: '00',
            h: '00',
            m: '00',
            s: '00'
          }
          t.timer = null
        } else {
          t.timer = setTimeout(() => {
            countDown(difference, deadline)
          }, 1000)
        }
      }

      countDown(difference, deadline) // 启动倒计时
    }
  }
}
</script>
<style lang="scss">
//noinspection CssUnknownTarget
@import "~/assets/sass/pages/pay/index.scss";
</style>
