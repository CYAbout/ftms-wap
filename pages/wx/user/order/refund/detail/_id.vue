<template>
  <!--订单详情-->
  <div class="order-details-container">
    <!--头部-->
    <div class="order-header bm-box bm-box-horizontal bm-box-vertical-center">
      <div @click="doBack" class="header-left"><i class="iconfont icon-back"></i></div>
      <div class="bm-flex header-title">退款详情</div>
      <div class="header-right"></div>
    </div>

    <!--订单内容-->
    <div class="order-content">
      <!--订单基本信息-->
      <ul class="order-basic">
        <li class="basic-item bm-box bm-box-horizontal">
          <div class="bm-flex">退款编号：{{orderObj.refundNo || ''}}</div>
          <!--退款单状态-->
          <div class="order-state">{{refundState[orderObj.refundStatus+'']}}</div>
        </li>
        <li class="basic-item">申请日期：{{orderObj.applyTime || ''}}</li>
        <li class="basic-item">购买人：{{orderObj.buyName || ''}}</li>
        <li class="basic-item">手机号码：{{orderObj.mobilePhone || ''}}</li>
      </ul>

      <!--支付提示-->
      <div v-show="orderObj.refundStatus === 'REFUNDED'" class="pay-tip">
        退款已完成
      </div>
       <div v-show="orderObj.refundStatus === 'REFUSE'" class="pay-tip">
        退款申请审核不通过，退款申请已关闭
      </div>
       <div v-show="orderObj.refundStatus === 'REFUND'" class="pay-tip">
        退款申请已经审核通过，请耐心等待退款
      </div>
      <div v-show="orderObj.refundStatus === 'COMMIT'" class="pay-tip">
        退款申请已提交，客服人员会在1～3个工作日内完成审核
      </div>
      <div v-show="orderObj.refundStatus === 'FAILED'" class="pay-tip">
        退款失败，请提交您的银行卡信息！
      </div>
      <div v-show="orderObj.refundStatus === 'REFUNDBANK'" class="pay-tip">
        银行卡信息已提交，请耐心等待退款！
      </div>
      <div v-show="orderObj.refundStatus === 'CANCELED'" class="pay-tip">
        退款申请已取消
      </div>

      <!--商品信息-->
      <div class="commodity-information">
        <!-- 提交银行卡信息 -->
        <div v-if="orderObj.isNeedBank === 'Y'" class="commodity-btn">
          <div @click="toApplicationRefund" class="commodity-btn-item">提交银行卡信息</div>
        </div>
        <h5 class="commodity-label">商品信息</h5>
        <img class="commodity-pic" :src="goodsInfo.goodsImg || ''"/>
        <div class="commodity-title bm-box bm-box-horizontal">
          <div class="bm-flex title">{{goodsInfo.goodsName || ''}}</div>
          <div class="number">x1</div>
        </div>
      </div>

      <!--订单属性信息-->
      <ul class="order-attribute">
        <li v-for="(item, index) in attrList" :key="index" class="attribute-item  bm-box bm-box-horizontal">
          <div style="width:100%;" v-if="orderObj.orderType !== 'CARD_VOUCHER'">
            <div class="bm-flex attribute-label" style="font-size: .32rem;color: #666;display:inline-block;float: left;">{{item.attributeName || ''}}</div>
            <!--{{item.attributeValueName || ''}}-->
            <div class="attribute-value" style="font-size: .32rem;color: #666;display:inline-block;float: right;">
              <img style="display: block;height: .8rem;" :src="item.attributeImgUrl"/>
            </div>
          </div>
          <div style="width:100%;" v-else>
            <div v-if="index===0" style="display:none;">
              <div class="bm-flex attribute-label" style="font-size: .32rem;color: #666;display:none;float: left;">{{item.attributeName || ''}}</div>
              <div class="attribute-value" style="font-size: .32rem;color: #666;display:none;float: right;">{{item.attributeValueName}}</div>
            </div>
            <div v-else>
              <div class="bm-flex attribute-label" style="font-size: .32rem;color: #666;display: inline-block;float: left;">{{item.attributeName || ''}}</div>
              <div class="attribute-value" style="font-size: .32rem;color: #666;display:inline-block;float: right;">{{item.attributeValueName}}</div>
            </div>
          </div>
        </li>
        <li v-if="orderObj.orderType === 'CARD_VOUCHER'" class="attribute-item  bm-box bm-box-horizontal">
          <div class="bm-flex attribute-label">面额</div>
          <div class="attribute-value">{{goodsInfo.listPrice}}元</div>
        </li>
        <li class="attribute-item  bm-box bm-box-horizontal">
          <div class="bm-flex attribute-label">支付方式</div>
          <div class="attribute-value">在线支付</div>
        </li>
        <li v-if="orderObj.orderType === 'CARD_VOUCHER'" class="attribute-item  bm-box bm-box-horizontal">
          <div class="bm-flex attribute-label intentional-gold">订单金额</div>
          <div class="attribute-value intentional-gold">
            <span style="color:#d3b078;font-size:16px;font-weight:600;">￥{{goodsInfo.depositPrice}}</span>
          </div>
        </li>
        <li v-if="orderObj.orderType !== 'CARD_VOUCHER'" class="attribute-item  bm-box bm-box-horizontal">
          <div class="bm-flex attribute-label intentional-gold">意向金</div>
          <div class="attribute-value intentional-gold">¥ <span>{{goodsInfo.depositPrice}}</span></div>
        </li>
      </ul>

      <!--退款原因-->
      <div class="refund-tracking">
        <h5 class="refund-label">退款信息</h5>
        <ul class="order-attribute">
          <li class="attribute-item  bm-box bm-box-horizontal">
            <div class="bm-flex attribute-label">订单编号：</div>
            <div class="attribute-value">{{orderObj.orderNo || ''}}</div>
          </li>
          <li class="attribute-item  bm-box bm-box-horizontal">
            <div class="bm-flex attribute-label">经销商：</div>
            <div class="attribute-value">{{orderObj.dealerName || ''}}</div>
          </li>
          <li class="attribute-item  bm-box bm-box-horizontal">
            <div class="bm-flex attribute-label">退款原因：</div>
            <div class="attribute-value" style='max-width: 5.5rem;word-break: break-all;'>{{orderObj.reason || ''}}</div>
          </li>
          <li class="attribute-item  bm-box bm-box-horizontal">
            <div class="bm-flex attribute-label intentional-gold">退款金额：</div>
            <div class="attribute-value intentional-gold">¥ {{orderObj.amount || ''}}</span></div>
          </li>
        </ul>
      </div>
      <!--退款原因-->
      <div v-if="orderObj.userName !== 'noValue'" class="refund-tracking">
        <h5 class="refund-label">银行卡信息</h5>
        <ul class="order-attribute">
          <li class="attribute-item  bm-box bm-box-horizontal">
            <div class="bm-flex attribute-label">开户人名称：</div>
            <div class="attribute-value">{{orderObj.userName || ''}}</div>
          </li>
          <li class="attribute-item  bm-box bm-box-horizontal">
            <div class="bm-flex attribute-label">开户行：</div>
            <div class="attribute-value">{{orderObj.bank || ''}}</div>
          </li>
          <li class="attribute-item  bm-box bm-box-horizontal">
            <div class="bm-flex attribute-label">银行卡卡号：</div>
            <div class="attribute-value">{{orderObj.cardNo | hideIdNo}}</div>
          </li>
        </ul>
      </div>
      <!--订单跟踪-->
      <div class="order-tracking">
        <h5 class="tracking-label">订单跟踪</h5>

        <ul class="tracking-list">
          <li
            v-for="(item, index) in orderObj.refundLog"
            :key="index"
            class="tracking-item bm-box bm-box-horizontal"
            :class="{'active': index===0}"
          >
            <div class="tracking-date">{{item.date_time || ''}}</div>
            <div class="dot-line">
              <span class="dot"></span>
            </div>
            <div class="bm-flex tracking-state">{{item.logdesc}}</div>
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
      <!--&lt;!&ndash; 提交银行卡信息 &ndash;&gt;-->
      <!--<div v-if="orderObj.refundFailureCount >= 12" class="footer-btn-wrapper">-->
      <!--<div @click="toApplicationRefund" class="footer-btn-item">提交银行卡信息</div>-->
      <!--</div>-->
      <!--申请退款-->
      <div v-if="orderObj.refundStatus === 'COMMIT'" class="footer-btn-wrapper">
        <div @click="toCancelRefund" class="footer-btn-item">取消退款</div>
      </div>
      <application-refund :show="applicationRefundShow" :options="refundObj" @close="doClose"></application-refund>
      <!--申请退款原因选择-->
      <common-select
        :show.sync="_refundSelectShow"
        :options="refundSelectList"
        :type="refundSelectShow"
        @changed="selectedChanged"
      ></common-select>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import _ from 'lodash'
  import Request from '~/plugins/request'
  import sendSuccess from '~/components/order/layer/send-success.vue'
  import completeSurvey from '~/components/order/layer/complete-survey.vue'
  import congratulationsLayer from '~/components/book/layer/congratulations.vue'
  import commonSelect from '~/components/common/layer/common-select.vue'
  import questionnaireSurvey from '~/components/order/layer/questionnaire-survey.vue'
  import applicationRefund from '~/components/order/layer/application-refunded2.vue'

  export default {
    name: 'order-details',
    components: {
      sendSuccess,
      completeSurvey,
      applicationRefund,
      congratulationsLayer,
      commonSelect,
      questionnaireSurvey
    },
    asyncData (context) { // async await
      return {
        refundNo: context.params.id.split('&')[0],
        orderNo: context.params.id.split('&')[1]
      }
    },
    head () {
      return {
        title: '一汽丰田官方商城',
        meta: [ // seo
          {hid: 'keywords', name: 'keywords', content: ''},
          {hid: 'description', name: 'description', content: ''}
        ]
      }
    },
    data () {
      return {
        applicationRefundShow: false,
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
          refundNo: '',
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
          COMMIT: '等待客服审核',
          REFUND: '退款中',
          FAILED: '退款失败',
          REFUNDED: '已退款',
          REFUSE: '审核不通过',
          REFUNDBANK: '退款中',
          CANCELED: '已取消'
        },
        orderType: '', // COMMIT 待支付；PAID 已支付；closed 已关闭；REFUND 退款中；REFUNDED 已退款
        orderObj: {}, // 订单信息
        attrList: [], // 商品属性
        goodsInfo: {}
      }
    },
    mounted () {
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

      setTimeout(() => {
        t.$util.win.goTop() // 回到顶部
      }, 400)
    },
    destroyed () {
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
      // 选择器选中值改变
      selectedChanged(obj) {
        let t = this
        console.log(obj, obj.value)
        t.refundObj[obj.type] = obj.value
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
            console.log('====获取城市信息', v)
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
      doClose(obj) {
        let t = this
        if (obj.type === 'refund') {
          t.applicationRefundShow = obj.show
        } else if (obj.type === 'reason' || obj.type === 'accountBank' || obj.type === 'accountBankProvince' || obj.type === 'accountBankCity') {
          t.refundSelectShow = obj.type
          if (obj.type === 'reason') {
            if (t.orderObj.orderType === 'CARD_VOUCHER') {
              t.refundSelectShow = 'reasonB'
            } else {
              t.refundSelectShow = obj.type
            }
          }
        }
      },
      // 获取银行options
      getSysCodeValues() {
        Request.getSysCodeValues('', 'bank_name').then(result => {
          if (result.success) {
            console.log('11111', result)
            this.accountBankList[0].values = result.data.map(el => el.codeValue)
            this.bankList = result.data
            console.log('11111', this.accountBank[0].values)
          }
        })
      },
      // 获取省份信息
      getProvince() {
        Request.getRegionInfo('', '0').then(v => {
          console.log('===获取省份信息', v)
          this.accountBankProvinceList[0].values = v.data.map(el => el.name)
          this.provinceList = v.data
        })
      },
      // 申请退款
      toApplicationRefund() {
        let t = this
        // 跳转
        t.skipPage('homeContainerTop')
        t.refundObj.refundNo = t.orderObj.refundNo
        t.refundObj.orderNo = t.orderNo
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
      // 获取订单详情
      getOrderDetail () {
        let t = this
        Request.refundDetail({
          ACCESS_TOKEN: t.userObj.data.token
        }, t.refundNo).then(result => {
          if (result.success) {
            console.log('result:', result)
            t.orderObj = result.data || {}
            t.orderObj['applyTime'] = t.$util.Date.getFormatDate(t.orderObj.applyTime, 'datetime')
            t.orderObj['goodsInfo'] = t.orderObj.orderGoodsInfo || []
            if (t.orderObj.goodsInfo.length > 0) {
              t.goodsInfo = t.orderObj.goodsInfo[0] || {}
              t.attrList = t.goodsInfo.attrs || []
            }
            _.each(t.orderObj.refundLog, (item, key) => {
              item['date_time'] = t.$util.Date.getFormatDate(item.time, 'datetime')
            })
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
      // 返回
      doBack () {
        // this.$router.go(-1)
        this.$router.replace('/wx/user/order/refund')
      }
    }
  }
</script>
<style lang="scss">
  //noinspection CssUnknownTarget
  @import '~/assets/sass/pages/user/order-details.scss';
</style>

