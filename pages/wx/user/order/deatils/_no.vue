<template>
  <!--订单详情-->
  <div class="order-details-container">
    <!--头部-->
    <div class="order-header bm-box bm-box-horizontal bm-box-vertical-center">
      <div @click="doBack" class="header-left">
        <i class="iconfont icon-back"></i>
      </div>
      <div class="bm-flex header-title">订单详情</div>
      <div class="header-right"></div>
    </div>

    <!--订单内容-->
    <div class="order-content">
      <!--订单基本信息-->
      <ul class="order-basic">
        <li class="basic-item bm-box bm-box-horizontal">
          <div class="bm-flex">订单编号：{{orderObj.orderNo || ''}}</div>
          <!--待支付-->
          <div class="order-state">{{orderStatus[orderType+'']}}</div>
        </li>
        <li class="basic-item">订单类型：
          <span v-if="orderObj.orderType==='CARD_VOUCHER'">活动订单</span>
          <span v-else>预售订单</span>
        </li>
        <li class="basic-item">订单提交日期：{{orderObj.commitTime || ''}}</li>
        <li class="basic-item" v-if="orderObj.buyType === 'PERSON'">购买人：{{orderObj.extractName || ''}}</li>
        <li class="basic-item" v-if="orderObj.buyType === 'COMPANY'">公司名称：{{orderObj.companyName || ''}}</li>
        <li class="basic-item" v-if="orderObj.buyType === 'COMPANY'">经办人姓名：{{orderObj.extractName || ''}}</li>
        <li class="basic-item" v-if="orderObj.buyType === 'PERSON'">手机号码：{{orderObj.extractMobilephone || ''}}</li>
        <li class="basic-item" v-if="orderObj.buyType === 'COMPANY'">经办人电话：{{orderObj.extractMobilephone || ''}}</li>
        <div v-show="orderObj.isCompleteQuestion === 'Y'" class="basic-item certificate">
          <!--查看证书-->
          <div
            v-if="orderObj.orderStatus !== 'REFUNDED'"
            class="view-certificate"
            @click="doOpenCongratulations"
          >
            <i v-show="orderObj.orderStatus !== 'REFUNDED'" class="iconfont icon-certificate"></i>
            查看证书
          </div>
        </div>
      </ul>

      <!--支付提示-->
      <!--{{countDown.h}}：{{countDown.m}}：{{countDown.s}}-->
      <div
        v-show="orderType === 'COMMIT'"
        class="pay-tip"
      >还剩余{{countDown.m}}分{{countDown.s}}秒，若未及时付款，系统将自动取消</div>
      <div v-show="orderType === 'CANCELED'" class="pay-tip">订单已取消</div>
      <div v-show="orderType === 'COMPLETED'" class="pay-tip">订单已经完成，感谢您的支持</div>
      <div
        v-show="orderType === 'PAID' && orderObj.isCompleteQuestion === 'N' && orderObj.orderType === 'PRESELL'"
        class="pay-tip"
      >
        订单支付成功，但还没有填写车主问卷调查，所以核销码未发送到您的手机
        <!-- 请点击
        <span @click="completeSurveyShow = true">【立即参与调查】</span> 参与填写 -->
      </div>
      <div
        v-show="orderType === 'PAID' && orderObj.isCompleteQuestion === 'Y' && orderObj.orderType === 'PRESELL'"
        class="pay-tip"
      >
        订单支付成功，券码已经发送到您的手机
      </div>
      <div
        v-show="orderType === 'PAID' && orderObj.orderType === 'CARD_VOUCHER'"
        class="pay-tip"
      >订单支付成功，券码已经发送到您的手机</div>
      <!-- <div
        v-show="orderType === 'PAID' && orderObj.isCompleteQuestion === 'Y'"
        class="pay-tip"
      >订单支付成功，核销码已经发送到您的手机。核销码需要在经销商选定车型配置时出示，请妥善保管！</div> -->
      <div v-show="orderType === 'REFUND'" class="pay-tip">退款申请已提交，请耐心等待退款</div>
      <div v-show="orderType === 'REFUNDED'" class="pay-tip">订单退款成功，欢迎您再次购买</div>

      <!--商品信息-->
      <div class="commodity-information">
        <h5 class="commodity-label">商品信息</h5>
        <img class="commodity-pic" :src="goodsInfo.goodsImg || ''">
        <div class="commodity-title bm-box bm-box-horizontal">
          <div class="bm-flex title">{{goodsInfo.goodsName || ''}}</div>
          <div class="number">x1</div>
        </div>
      </div>

      <!--订单属性信息-->
      <ul class="order-attribute" style="padding-bottom:0;border:none;" v-if="!(orderObj&&orderObj.orderType === 'CARD_VOUCHER')">
        <li
          v-for="(item, index) in attrList"
          :key="index"
          class="attribute-item bm-box bm-box-horizontal"
        >
          <div class="saleDetail">
            <div class="bm-flex attribute-label"
            >{{item.attributeName || ''}}</div>
            <!-- {{item.attributeValueName || ''}} -->
            <!-- <div class="attribute-value">{{item.attributeValueName || ''}}</div> -->
            <div class="attribute-value">
              <img :src="item.attributeImgUrl">
            </div>
          </div>
        </li>
      </ul>
      <!-- <ul class="order-attribute" style="padding:0;border:none!important;">
        <li
          class="attribute-item bm-box bm-box-horizontal"
          v-if="(orderObj&&orderObj.orderType === 'CARD_VOUCHER')"
        >
          <div class="attribute-value">{{attrList[0].attributeValueName || ''}}</div>
        </li>
        <li
          class="attribute-item bm-box bm-box-horizontal"
          v-if="(orderObj&&orderObj.orderType === 'CARD_VOUCHER')"
        >
          <div class="attribute-value">{{attrList[1].attributeValueName || ''}}</div>
        </li>
      </ul> -->
      <ul class="order-attribute" style="padding-top:0;">
        <!--<li class="attribute-item  bm-box bm-box-horizontal">-->
        <!--<div class="bm-flex attribute-label">内饰</div>-->
        <!--<div class="attribute-value">红+黑</div>-->
        <!--</li>-->
        <li class="attribute-item  bm-box bm-box-horizontal" v-if="(orderObj&&orderObj.orderType === 'CARD_VOUCHER')">
          <div class="bm-flex attribute-label">卡券类型</div>
          <div class="attribute-value">{{attrList[1].attributeValueName || ''}}</div>
        </li>
        <li class="attribute-item  bm-box bm-box-horizontal" v-if="(orderObj&&orderObj.orderType === 'CARD_VOUCHER')">
          <div class="bm-flex attribute-label">卡券用途</div>
          <div class="attribute-value">{{attrList[2].attributeValueName || ''}}</div>
        </li>
        <li class="attribute-item bm-box bm-box-horizontal">
          <div class="bm-flex attribute-label">配送方式</div>
          <div class="attribute-value">到店提车</div>
        </li>
        <li class="attribute-item  bm-box bm-box-horizontal">
          <div class="bm-flex attribute-label">支付方式</div>
          <div class="attribute-value">在线支付</div>
        </li>
        <li class="attribute-item bm-box bm-box-horizontal">
          <div class="bm-flex attribute-label intentional-gold" v-if="(orderObj&&orderObj.orderType === 'PRESELL')">意向金</div>
          <div class="bm-flex attribute-label intentional-gold" v-if="(orderObj&&orderObj.orderType === 'CARD_VOUCHER')">订单金额</div>
          <div class="attribute-value intentional-gold">
            ¥
            <span>{{goodsInfo.depositPrice | fMoney}}</span>
          </div>
        </li>
      </ul>

      <!--订单跟踪-->
      <div class="order-tracking">
        <h5 class="tracking-label">订单跟踪</h5>

        <ul class="tracking-list">
          <li
            v-for="(item, index) in orderObj.orderLog"
            :key="index"
            class="tracking-item bm-box bm-box-horizontal"
            :class="{'active': index===0}"
          >
            <div class="tracking-date">{{item.date_time || ''}}</div>
            <div class="dot-line">
              <span class="dot"></span>
            </div>
            <div class="bm-flex tracking-state">{{item.desc}}</div>
          </li>
          <!--<li class="tracking-item bm-box bm-box-horizontal">-->
          <!--<div class="tracking-date">2018-09-08 19:00:00</div>-->
          <!--<div class="dot-line">-->
          <!--<span class="dot"></span>-->
          <!--</div>-->
          <!--<div class="bm-flex tracking-state">订单提交成功，请尽快请尽快完成支付 完成支付</div>-->
          <!--</li>-->
        </ul>
      </div>

      <!--订单操作-->
      <div class="order-operation">
        <!--操作按钮-->
        <div class="operation-group bm-box bm-box-horizontal bm-box-vertical-center" style="margin-bottom:1.4rem;">
          <div class="bm-flex"></div>
          <!--待支付-->
          <div @click="doCancelOrder" v-if="orderType === 'COMMIT'" class="btn-item">取消订单</div>
          <div @click="toPay" v-if="orderType === 'COMMIT'" class="btn-item">立即支付</div>
          <!--已支付-->
          <div
            @click="toVerificationCode('核销码')"
            v-if="(orderType === 'PAID' || orderType === 'REFUNDFAILED') && orderObj.isCompleteQuestion === 'Y'"
            class="btn-item"
          >发送核销码</div>
          <!-- 查看券码 -->
          <div
            @click="toVerificationCode('券码')"
            v-if="orderObj.orderStatus === 'PAID' && orderObj.orderType === 'CARD_VOUCHER' && orderObj.payStatus === 'Y' && orderObj.isCompleteQuestion === 'N' "
            class="btn-item"
          >查看券码</div>
          <div @click="doQuestionnaireSurvey"
               v-if="orderType === 'PAID' && orderObj.isCompleteQuestion === 'N' && orderObj.orderType !== 'CARD_VOUCHER'" class="btn-item">问卷调查
          </div>
          <div @click="toApplicationRefund" v-if="(orderObj.orderStatus === 'PAID' || orderObj.orderStatus === 'REFUNDFAILED') && orderObj.orderType !== 'CARD_VOUCHER' " class="btn-item">申请退款</div>
          <!-- <div @click="toApplicationRefund" v-if="orderObj.orderStatus === 'PAID' && orderObj.orderType !== 'CARD_VOUCHER' " class="btn-item">申请退款</div> -->
          <!--已关闭 -> 已取消-->
          <!--<div-->
          <!--v-if="orderType === 'CANCELED' || orderObj.orderStatus === 'REFUNDED'"-->
          <!--class="btn-item"-->
          <!--@click="againBuy(orderObj.goodsInfo[0].productId, orderObj.goodsInfo[0].attrs[0].attributeValueId, orderObj.goodsInfo[0].attrs[1].attributeValueId,orderObj.goodsInfo[0].attrs[2].attributeValueId)"-->
          <!--&gt;再次购买</div>-->
          <!--退款中-->
          <div @click="toCancelRefund" v-if="orderObj.refundStatus === 'COMMIT'" class="btn-item refund">取消退款</div>
          <!--已退款-->
          <!--<div v-if="orderType === 'REFUNDED'" class="btn-item">再次购买</div>-->
        </div>

        <!--倒计时 待支付-->
        <div
          v-show="orderType === 'COMMIT'"
          class="count-down bm-box bm-box-horizontal bm-box-vertical-center"
        >
          <div class="bm-flex"></div>
          <div class="time">{{countDown.h}}：{{countDown.m}}：{{countDown.s}}</div>
        </div>
      </div>
    </div>

    <!--核销码发送成功-->
    <send-success :show="verificationCodeShow" @close="doClose" v-bind:cardType="cardType" ></send-success>
    <!--问卷调查-->
    <questionnaire-survey :show="questionnaireSurveyShow" :orderNo="orderNo" @close="doClose"></questionnaire-survey>
    <!--完成问卷调查-->
    <complete-survey :show="completeSurveyShow" @close="doClose"></complete-survey>
    <!--申请退款-->
    <application-refunded :show="applicationRefundedShow" :options="refundObj" @close="doClose"></application-refunded>
    <application-refund :show="applicationRefundShow" :options="refundObj" @close="doClose"></application-refund>
    <!--恭喜弹窗-->
    <congratulations-layer :show="congratulationsShow" :options="orderObj" @close="doClose"></congratulations-layer>
    <!--申请退款原因选择-->
    <common-select
      :show.sync="_refundSelectShow"
      :options="refundSelectList"
      :type="refundSelectShow"
      @changed="selectedChanged"
    ></common-select>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import _ from 'lodash'
  import Request from '~/plugins/request'
  import sendSuccess from '~/components/order/layer/send-success.vue'
  import completeSurvey from '~/components/order/layer/complete-survey.vue'
  import applicationRefunded from '~/components/order/layer/application-refunded.vue'
  import applicationRefund from '~/components/order/layer/application-refund.vue'
  import congratulationsLayer from '~/components/book/layer/congratulations.vue'
  import commonSelect from '~/components/common/layer/common-select.vue'
  import questionnaireSurvey from '~/components/order/layer/questionnaire-survey.vue'

  export default {
    name: 'order-details',
    components: {
      sendSuccess,
      completeSurvey,
      applicationRefund,
      applicationRefunded,
      congratulationsLayer,
      commonSelect,
      questionnaireSurvey
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
        currentTime: new Date().getTime(),
        diffTime: 0,
        payTime: new Date().getTime(),
        countDown: {
          d: '00',
          h: '00',
          m: '00',
          s: '00'
        },
        cardType: '',
        provinceList: [],
        cityList: [],
        bankList: [],
        refundSelectShow: null, // 申请退款选择
        reasonList: [ // 退款原因
          {
            flex: 1,
            values: ['车型配置不合适', '价格太高', '个人信息错误', '想更换其他经销商再选购', '提车等待期太长', '取消购车计划', '已购买其他车辆', '其他原因'],
            defaultIndex: 0, // 默认值
            className: 'slot-1',
            textAlign: 'center'
          }
        ],
        reasonBList: [ // 退款原因
          {
            flex: 1,
            values: ['信息填写错误，重新购买', '暂时不购买', '适用期限不合适', '找到更多优惠', '无法适用', '其他原因'],
            defaultIndex: 0, // 默认值
            className: 'slot-1',
            textAlign: 'center'
          }
        ],
        accountBankList: [ // 开户银行
          {
            flex: 1,
            values: [],
            defaultIndex: 0, // 默认值
            className: 'slot-1',
            textAlign: 'center'
          }
        ],
        accountBankProvinceList: [ // 开户银行省份
          {
            flex: 1,
            values: [],
            defaultIndex: 0, // 默认值
            className: 'slot-1',
            textAlign: 'center'
          }
        ],
        accountBankCityList: [ // 开户银行城市
          {
            flex: 1,
            values: [],
            defaultIndex: 0, // 默认值
            className: 'slot-1',
            textAlign: 'center'
          }
        ],
        refundObj: {
          reason: '请选择退款原因',
          orderNo: '',
          accountBank: '',
          accountBankProvince: '',
          accountBankCity: '',
          cityId: '',
          provinceId: ''
        },
        // 退款状态
        // 待审核 COMMIT
        // 退款中 REFUND
        // 已退款 REFUNDED
        // 审核不通过 REFUSE
        refundState: {
          COMMIT: '待审核',
          REFUND: 'REFUND',
          REFUNDED: '已退款',
          REFUSE: '审核不通过'
        },
        // 订单状态
        // 待支付 COMMIT
        // 已支付 PAID
        // 退款中 REFUND
        // 已退款 REFUNDED
        // 已完成 COMPLETED
        // 已取消 CANCELED
        orderStatus: {
          COMMIT: '待支付',
          PAID: '已支付',
          REFUND: '退款中',
          REFUNDED: '已退款',
          COMPLETED: '已完成',
          CANCELED: '已取消'
        },
        orderType: 'COMMIT', // COMMIT 待支付；PAID 已支付；closed 已关闭；REFUND 退款中；REFUNDED 已退款
        verificationCodeShow: false, // 核销码发送成功
        questionnaireSurveyShow: false, // 问卷调查
        completeSurveyShow: false, // 完成问卷调查
        applicationRefundShow: false, // 申请退款
        applicationRefundedShow: false,
        congratulationsShow: false, // 恭喜弹窗
        orderObj: {}, // 订单信息
        attrList: [], // 商品属性
        goodsInfo: {},
        goods: {},
        goodsId: '',
        attrListName1: '',
        attrListName2: '',
        attrListName3: '',
        attrListName4: ''
        // isCardType: true // 是卡券类型的话是不需要问卷调查功能的
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
              // console.log('userObj:>', t.userObj)
              t.getOrderDetail() // 获取订单详情
              // console.log(t.getOrderDetail)
            } catch (error) {
              console.log(error)
            }
          })()
        }
      } else {
        t.getOrderDetail() // 获取订单详情
      }

      setTimeout(() => {
        t.$util.win.goTop() // 回到顶部
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
      }),
      refundSelectList() {
        if (!this.refundSelectShow) return []
        return this[this.refundSelectShow + 'List']
      },
      _refundSelectShow() {
        return this.refundSelectShow != null
      }
    },
    methods: {
      // 获取银行options
      getSysCodeValues() {
        Request.getSysCodeValues('', 'bank_name').then(result => {
          if (result.success) {
            this.accountBankList[0].values = result.data.map(el => el.codeValue)
            this.bankList = result.data
          }
        })
      },
      // 获取省份信息
      getProvince() {
        Request.getRegionInfo('', '0').then(v => {
          this.accountBankProvinceList[0].values = v.data.map(el => el.name)
          this.provinceList = v.data
        })
      },
      // 获取订单详情
      getOrderDetail() {
        let t = this
        Request.orderDetail({
          ACCESS_TOKEN: t.userObj.data.token
        }, t.orderNo).then(result => {
          if (result.success) {
            // console.log('result:', result)
            t.orderObj = result.data || {}
            t.orderObj['isCompleteQuestion'] = t.orderObj.isCompleteQuestion || ''
            t.orderObj['orderStatus'] = t.orderObj.orderStatus || ''
            t.orderObj['payStatus'] = t.orderObj.payStatus || ''
            t.orderType = t.orderObj.orderStatus
            t.orderObj['payDealine'] = t.orderObj.payDealine || ''
            t.orderObj['payEndTime'] = t.$util.Date.getFormatDate(t.orderObj.payDealine, 'datetime')
            t.orderObj['commitTime'] = t.$util.Date.getFormatDate(t.orderObj.commitTime, 'datetime')
            t.orderObj['orderLog'] = t.orderObj.orderLog || []
            t.currentTime = t.orderObj.currentTime
            t.payTime = t.orderObj.payTime
            t.diffTime = t.currentTime - new Date()
            // console.log('====diffTime', t.diffTime)
            _.each(t.orderObj.orderLog, (item, key) => {
              item['date_time'] = t.$util.Date.getFormatDate(item.time, 'datetime')
            })
            t.orderObj['goodsInfo'] = t.orderObj.goodsInfo || []
            if (t.orderObj.goodsInfo.length > 0) {
              t.goodsInfo = t.orderObj.goodsInfo[0] || {}
              t.attrList = t.goodsInfo.attrs || []
              t.goodsId = t.goodsInfo.goodsId
              // t.goodsId = t.goodsInfo[0].goodsId
            }
            if (t.orderType === 'COMMIT') {
              t.doCountDown(0, t.orderObj.payEndTime) // 倒计时
            } else if (t.orderObj.isCompleteQuestion === 'N' && t.orderObj.orderStatus === 'PAID' && result.data.orderType !== 'CARD_VOUCHER') {
              t.completeSurveyShow = true
            }
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

        this.getSysCodeValues()
        this.getProvince()
      },
      // 取消订单
      doCancelOrder() {
        let t = this
        t.$messageBox.confirm('您确定要取消该订单?').then(action => {
          Request.cancel({
            ACCESS_TOKEN: t.userObj.data.token
          }, t.orderObj.mainOrderNo).then(result => {
            if (result.success) {
              t.$toast(result.msg || '订单取消成功')
              t.getOrderDetail() // 获取订单详情
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
        }, cancel => { })
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
      },
      // 查看核销码 和 查看券码
      toVerificationCode(item) {
        let t = this
        Request.info({
          ACCESS_TOKEN: t.userObj.data.token
        }, t.orderNo).then(result => {
          if (result.success) {
            // console.log('result:>', result)
            t.cardType = item
            t.verificationCodeShow = true
          } else {
            t.$toast(result.msg)
          }
        })
      },
      // 申请退款
      toApplicationRefund() {
        let t = this
        t.refundObj.orderNo = t.orderNo
        // 大于86天弹窗不同；
        if (+this.diffTime + +new Date() - +this.payTime > 86 * 24 * 60 * 60 * 1000) {
          t.skipPage('homeContainerTop')
          t.applicationRefundedShow = true
          // 抓取子组建confirm变量状态，修复第二次不弹窗问题
          t.$children[3].confirmShow = false
          return
        }
        t.skipPage('homeContainerTop')
        t.applicationRefundShow = true
      },
      // 跳转
      skipPage(id) {
        let t = this
        window.location.hash = '#' + id
        setTimeout(() => { // 清除hash
          t.$router.replace('')
        }, 600)
      },
      // 取消退款
      toCancelRefund() {
        this.$messageBox.confirm('确定要取消退款申请?').then(action => {
          Request.refundCancel({
            ACCESS_TOKEN: this.userObj.data.token
          }, this.orderNo).then(v => {
            this.orderType = 'PAID'
            window.location.reload()
          })
        }, cancel => { })
      },
      // 问卷调查
      doQuestionnaireSurvey() {
        let t = this
        t.completeSurveyShow = false
        t.questionnaireSurveyShow = true
        // t.$util.win.goTop() // 回到顶部
        // setTimeout(() => {
        //   t.questionnaireSurveyShow = true
        // }, 400)
      },
      // 跳转支付
      toPay() {
        this.$router.push('/wx/pay/' + this.orderNo)
      },
      // 再次购买
      againBuy(id, attr1, attr2, attr3) {
        let t = this
        if (this.orderObj && this.orderObj.orderType === 'CARD_VOUCHER') {
          this.$router.push('/wx/salesDetails/' + this.goodsInfo.goodsId)
        } else {
          // this.$router.push('/wx/book/' + this.orderObj.goodsInfo[0].productId)
          // this.$router.push(`/wx/book/match?id=${id}&attr1=${attr1}&attr2=${attr2}&attr3=${attr3}`)
          // 添加所有选中
          const selecctType = attr1
          const selecctColor = attr2
          const selecctInner = attr3
          t.$emit('selected', {
            sort: 1,
            obj: selecctType
          })
          t.$emit('selected', {
            sort: 2,
            obj: selecctColor
          })
          t.$emit('selected', {
            sort: 3,
            obj: selecctInner
          })
          setTimeout(() => {
            t.toMatch(attr1, attr2, attr3)
          }, 100)
        }
      },
      // 跳转选配订单
      toMatch(attr1, attr2, attr3) {
        let t = this
        if (!t.userObj.logined) {
          // 未登录
          t.$common.clearUserInfo()
          t.$messageBox.confirm('登录后才能订购，是否登录?').then(action => {
            t.syncLoadLayer({
              type: 'login',
              show: true
            })
          }, cancle => {
          })
        } else {
          let goodsAttrs = []
          goodsAttrs[0] = attr1
          goodsAttrs[1] = attr2
          goodsAttrs[2] = attr3
          t.goods.ecPrice = t.goodsInfo.listPrice
          t.goods.goodsId = t.goodsInfo.goodsId
          t.goods.goodsName = t.goodsInfo.goodsName
          t.goods.productId = t.goodsInfo.productId
          t.goods.goodsAttrs = goodsAttrs
          // let goods = $.extend(true, {}, t.goods)
          // console.log('goods:>', goods)
          t.$cache.goods.set(t.$util.Str.jsonToStr(t.goods))
          t.$router.push('/wx/book/match')
        }
      },
      // 关闭弹出层
      doClose(obj) {
        let t = this
        if (obj.type === 'send') {
          t.verificationCodeShow = obj.show
        } else if (obj.type === 'refund') {
          if (+this.diffTime + +new Date() - +this.payTime > 90 * 24 * 60 * 60 * 1000) {
            t.applicationRefundedShow = obj.show
          } else {
            t.applicationRefundShow = obj.show
          }
        } else if (obj.type === 'reason' || obj.type === 'accountBank' || obj.type === 'accountBankProvince' || obj.type === 'accountBankCity') {
          t.refundSelectShow = obj.type
          if (obj.type === 'reason') {
            if (t.orderObj.orderType === 'CARD_VOUCHER') {
              t.refundSelectShow = 'reasonB'
            } else {
              t.refundSelectShow = obj.type
            }
          }
        } else if (obj.type === 'refund-success') {
          t.applicationRefundShow = obj.show
          // t.orderType = 'REFUND'
          t.getOrderDetail() // 获取订单详情
        } else if (obj.type === 'survey') {
          t.completeSurveyShow = obj.show
        } else if (obj.type === 'congratulations') {
          t.questionnaireSurveyShow = false
          t.congratulationsShow = obj.show
          if (!t.congratulationsShow) { // 重新获取订单数据
            t.getOrderDetail() // 获取订单详情
          }
        } else if (obj.type === 'questionnaire') {
          t.completeSurveyShow = false
          t.questionnaireSurveyShow = obj.show
        } else if (obj.type === 'close') {
          t.congratulationsShow = obj.show
          t.questionnaireSurveyShow = false
        } else if (obj.type === 'refunded') {
          t.applicationRefundedShow = obj.show
        }
      },
      // 选择器选中值改变
      selectedChanged(obj) {
        let t = this
        console.log(obj, obj.value)
        if (obj.type === 'reasonB') {
          t.refundObj['reason'] = obj.value
        } else {
          t.refundObj[obj.type] = obj.value
        }
        t.refundSelectShow = null
        if (obj.type === 'accountBankProvince') {
          _.each(t.provinceList, (item, key) => {
            if (obj.value === item.name) {
              t.refundObj['provinceId'] = item.regionId
            }
          })
          if (!obj.value) {
            this.accountBankCityList[0].values = []
            this.refundObj.accountBankCity = ''
            return
          }
          const item = this.provinceList.find(el => el.name === obj.value)
          if (!item) return
          Request.getRegionInfo('', item.regionId).then(v => {
            // console.log('====获取城市信息', v)
            this.accountBankCityList[0].values = v.data.map(el => el.name)
            this.cityList = v.data
            t.refundObj['cityId'] = v.data[0].regionId
            t.refundObj['accountBankCity'] = v.data[0].name
          })
        } else if (obj.type === 'accountBankCity') {
          _.each(t.cityList, (item, key) => {
            if (obj.value === item.name) {
              t.refundObj['cityId'] = item.regionId
            }
          })
        }
      },
      // 返回
      doBack() {
        // this.$router.go(-1)
        this.$router.replace('/wx/user/order/all')
      },
      // 查看证书
      doOpenCongratulations() {
        this.congratulationsShow = true
      }
    }
    // watch: {
    //   questionnaireSurveyShow: function(val) {
    //     val ? this.questionnaireSurveyShow = true : this.questionnaireSurveyShow = false
    //   },
    //   congratulationsShow: function(val) {
    //     val ? this.congratulationsShow = true : this.congratulationsShow = false
    //   },
    //   completeSurveyShow: function(val) {
    //     val ? this.completeSurveyShow = true : this.completeSurveyShow = false
    //   },
    //   applicationRefundShow: function(val) {
    //     val ? this.applicationRefundShow = true : this.applicationRefundShow = false
    //   },
    //   applicationRefundedShow: function(val) {
    //     val ? this.applicationRefundedShow = true : this.applicationRefundedShow = false
    //   }
    // }
  }
</script>
<style lang="scss">
  //noinspection CssUnknownTarget
  @import "~/assets/sass/pages/user/order-details.scss";
</style>

<style lang="scss" scoped>
  .saleDetail {
    width: 100%;
    display: flex;
    justify-content: space-between;
    >div {
      font-size: .32rem;
      color: #666;
      img {
        height: .8rem;
      }
    }
  }
</style>
