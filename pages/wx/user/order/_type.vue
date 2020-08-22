<template>
  <!--订单列表-->
  <div class="order-container">
    <!-- 蒙层 -->
    <div
      v-show="isDown"
      class="mask"
      style="width: 100%; height: 1200px; background: transparent; position: absolute; z-index: 1;"
      @click="showOrderType"
    ></div>
    <!--头部-->
    <div class="order-header bm-box bm-box-horizontal bm-box-vertical-center">
      <div @click="doBack" class="header-left">
        <i class="iconfont icon-back"></i>
      </div>
      <div class="bm-flex header-title">我的订单</div>
      <!-- <ul class="header-right" style="border: solid 1px #999;" @click.stop="showOrderType">
        {{this.showMenu}}
        <i class="iconfont icon-down-min"></i>
        <li v-show="isDown" style="marign-top: -20px;" @click.stop="showOrderType($event)">
          全部
        </li>
        <li @click.stop="showOrderType($event)" v-for="(item, index) in newOrderListData" :key="item.codeId" v-show="isDown">
          {{item.codeValue}}
        </li>
      </ul>-->
    </div>
    <!--选项卡-->
    <div class="order-tabs bm-box bm-box-horizontal bm-box-vertical-center">
      <div @click="orderType = 'all'" class="tab-item" :class="{'active': orderType === 'all'}">全部订单</div>
      <div
        @click="orderType = 'COMMIT'"
        class="bm-flex tab-item"
        :class="{'active': orderType === 'COMMIT'}"
      >待支付</div>
      <div
        @click="orderType = 'PAID'"
        class="bm-flex tab-item"
        :class="{'active': orderType === 'PAID'}"
      >已支付</div>
      <div
        @click="orderType = 'COMPLETED'"
        class="tab-item"
        :class="{'active': orderType === 'COMPLETED'}"
      >已完成</div>
    </div>

    <!--无数据-->
    <data-empty v-show="noData" :options="orderType"></data-empty>

    <!--订单列表内容-->
    <ul v-show="!noData" class="order-lists">
      <li v-for="(obj,index) in orderListData" :key="obj.orderNo" class="order-item">
        <!--订单头-->
        <div class="item-header bm-box bm-box-horizontal">
          <div
            class="bm-flex order-no"
          >订单编号：{{obj.orderNo || ''}} ({{showOrderTypeName(obj.orderType, 1)}})</div>
          <div class="order-state">{{obj.order_state || ''}}</div>
        </div>
        <!--订单内容-->
        <div class="item-content bm-box bm-box-horizontal">
          <div class="order-pic">
            <img v-lazy="obj.goodsImg">
          </div>
          <div class="bm-flex order-info">
            <div class="name">{{obj.goodsName || ''}}</div>
            <div class="intention">
              <span>¥</span>
              <span>{{obj.depositPrice || ''}}</span>
            </div>
            <!-- <div v-for="(item, index) in obj.attrs" :key="item.attributeSort" class="attribute-item">
              <span> {{item.attributeName || ''}}：{{item.attributeValueName || ''}} </span>
            </div>-->
            <!--<div class="attribute-item">内饰：红+黑</div>-->
          </div>
        </div>

        <!--操作按钮-->
        <div class="operation-group bm-box bm-box-horizontal bm-box-vertical-center">
          <div class="bm-flex"></div>
          <!--待支付-->
          <div
            @click="toPay(obj.orderNo)"
            v-show="obj.orderStatus === 'COMMIT'"
            class="btn-item"
          >立即支付</div>
          <!--已支付-->
          <!-- <div @click="toApplicationRefund(obj.orderNo)" v-show="obj.orderStatus === 'PAID'" class="btn-item">申请退款</div> -->
          <div
            @click="toVerificationCode(obj.orderNo)"
            v-show="obj.orderStatus === 'PAID' && obj.isCompleteQuestion === 'Y'"
            class="btn-item verification-code"
          >发送核销码</div>
          <div
            @click="doQuestionnaireSurvey(obj)"
            v-show="obj.orderStatus === 'PAID' && obj.isCompleteQuestion === 'N' && obj.orderType !== 'CARD_VOUCHER'"
            class="btn-item verification-code"
          >问卷调查</div>
          <!-- 已完成未评价 先做成问卷调查的条件 ：已支付未评价 -->
          <div
            @click="toEvaluateSurvey(obj.orderNo)"
            v-show="obj.orderStatus === 'COMPLETED' && obj.isAssess !== 'Y'"
            class="btn-item verification-code"
          >立即评价</div>
          <!--退款中-->
          <div @click="toDetails(obj.orderNo)" class="btn-item">订单详情</div>
        </div>
      </li>
      <!--<li class="order-item">-->
      <!--&lt;!&ndash;订单头&ndash;&gt;-->
      <!--<div class="item-header bm-box bm-box-horizontal">-->
      <!--<div class="bm-flex order-no">订单编号：20288282776</div>-->
      <!--<div class="order-state">已支付</div>-->
      <!--</div>-->
      <!--&lt;!&ndash;订单内容&ndash;&gt;-->
      <!--<div class="item-content bm-box bm-box-horizontal">-->
      <!--<div class="order-pic">-->
      <!--<img src="~/assets/images/order_pay/orders_goods_pic.png"/>-->
      <!--</div>-->
      <!--<div class="bm-flex order-info">-->
      <!--<div class="name">亚洲龙2.5L 自然吸气</div>-->
      <!--<div class="attribute-item">外观颜色：黑</div>-->
      <!--<div class="attribute-item">内饰：红+黑</div>-->
      <!--<div class="intention">意向金：<span>¥</span> <span>500.00</span></div>-->
      <!--</div>-->
      <!--</div>-->
      <!--&lt;!&ndash;操作按钮&ndash;&gt;-->
      <!--<div class="operation-group bm-box bm-box-horizontal bm-box-vertical-center">-->
      <!--<div class="bm-flex"></div>-->
      <!--<div class="btn-item">申请退款</div>-->
      <!--<div class="btn-item">发送核销码</div>-->
      <!--</div>-->
      <!--</li>-->
      <!--<li class="order-item">-->
      <!--&lt;!&ndash;订单头&ndash;&gt;-->
      <!--<div class="item-header bm-box bm-box-horizontal">-->
      <!--<div class="bm-flex order-no">订单编号：20288282776</div>-->
      <!--<div class="order-state">退款中</div>-->
      <!--</div>-->
      <!--&lt;!&ndash;订单内容&ndash;&gt;-->
      <!--<div class="item-content bm-box bm-box-horizontal">-->
      <!--<div class="order-pic">-->
      <!--<img src="~/assets/images/order_pay/orders_goods_pic.png"/>-->
      <!--</div>-->
      <!--<div class="bm-flex order-info">-->
      <!--<div class="name">亚洲龙2.5L 自然吸气</div>-->
      <!--<div class="attribute-item">外观颜色：黑</div>-->
      <!--<div class="attribute-item">内饰：红+黑</div>-->
      <!--<div class="intention">意向金：<span>¥</span> <span>500.00</span></div>-->
      <!--</div>-->
      <!--</div>-->
      <!--&lt;!&ndash;操作按钮&ndash;&gt;-->
      <!--<div class="operation-group bm-box bm-box-horizontal bm-box-vertical-center">-->
      <!--<div class="bm-flex"></div>-->
      <!--<div @click="toDetails" class="btn-item">订单详情</div>-->
      <!--</div>-->
      <!--</li>-->
      <!--<li class="order-item">-->
      <!--&lt;!&ndash;订单头&ndash;&gt;-->
      <!--<div class="item-header bm-box bm-box-horizontal">-->
      <!--<div class="bm-flex order-no">订单编号：20288282776</div>-->
      <!--<div class="order-state">待支付</div>-->
      <!--</div>-->
      <!--&lt;!&ndash;订单内容&ndash;&gt;-->
      <!--<div class="item-content bm-box bm-box-horizontal">-->
      <!--<div class="order-pic">-->
      <!--<img src="~/assets/images/order_pay/orders_goods_pic.png"/>-->
      <!--</div>-->
      <!--<div class="bm-flex order-info">-->
      <!--<div class="name">亚洲龙2.5L 自然吸气</div>-->
      <!--<div class="attribute-item">外观颜色：黑</div>-->
      <!--<div class="attribute-item">内饰：红+黑</div>-->
      <!--<div class="intention">意向金：<span>¥</span> <span>500.00</span></div>-->
      <!--</div>-->
      <!--</div>-->
      <!--&lt;!&ndash;操作按钮&ndash;&gt;-->
      <!--<div class="operation-group bm-box bm-box-horizontal bm-box-vertical-center">-->
      <!--<div class="bm-flex"></div>-->
      <!--<div class="btn-item">立即支付</div>-->
      <!--</div>-->
      <!--</li>-->
    </ul>
    <!--展开更多-->
    <div @click="getMoreList(showMenu)" v-show="pageObj.hasNext" class="open-more">
      查看更多
      <i class="iconfont icon-drop-down"></i>
    </div>

    <!--核销码发送成功-->
    <send-success :show="verificationCodeShow" @close="doClose"></send-success>
    <!--申请退款-->
    <application-refund :show="applicationRefundShow" :options="refundObj" @close="doClose"></application-refund>
    <!--申请退款原因选择-->
    <common-select
      :show.sync="refundSelectShow"
      :options="reasonSelectList"
      :type="'reason'"
      @changed="selectedChanged"
    ></common-select>
    <!--问卷调查-->
    <questionnaire-survey
      :show="questionnaireSurveyShow"
      :orderNo="orderObj.orderNo"
      @close="doClose"
    ></questionnaire-survey>
    <!--恭喜弹窗-->
    <congratulations-layer :show="congratulationsShow" :options="orderObj" @close="doClose"></congratulations-layer>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapState } from 'vuex'
import Request from '~/plugins/request'
import dataEmpty from '~/components/common/data-empty.vue'
import sendSuccess from '~/components/order/layer/send-success.vue'
import applicationRefund from '~/components/order/layer/application-refund.vue'
import commonSelect from '~/components/common/layer/common-select.vue'
import congratulationsLayer from '~/components/book/layer/congratulations.vue'
import questionnaireSurvey from '~/components/order/layer/questionnaire-survey.vue'

export default {
  name: 'order',
  components: {
    dataEmpty,
    sendSuccess,
    applicationRefund,
    commonSelect,
    congratulationsLayer,
    questionnaireSurvey
  },
  asyncData(context) {
    // async await
    return {
      // 订单状态
      // 待支付 COMMIT
      // 已支付 PAID
      // 退款中 REFUND
      // 已退款REFUNDED
      // 已完成COMPLETED
      // 已取消CANCELED
      orderType: context.params.type || '' // all
    }
  },
  head() {
    return {
      title: '一汽丰田官方商城',
      meta: [
        // seo
        { hid: 'keywords', name: 'keywords', content: '' },
        { hid: 'description', name: 'description', content: '' }
      ]
    }
  },
  data() {
    return {
      verificationCodeShow: false, // 核销码发送成功
      applicationRefundShow: false, // 申请退款
      refundSelectShow: false, // 申请退款选择
      questionnaireSurveyShow: false, // 问卷调查
      congratulationsShow: false,
      isDown: false, // 全部类型下拉菜单的激活状态
      showMenu: '全部',
      orderObj: {
        // 订单项
        orderNo: ''
      },
      // * 车型配置不合适
      // * 价格太高
      // * 个人信息错误
      // * 想更换其他经销商再选购
      // * 提车等待期太长
      // * 取消购车计划
      // * 已购买其他车辆
      // * 其他原因（选择后出现输入框）
      reasonSelectList: [
        // 退款原因
        {
          flex: 1,
          values: [
            '车型配置不合适',
            '价格太高',
            '个人信息错误',
            '想更换其他经销商再选购',
            '提车等待期太长',
            '取消购车计划',
            '已购买其他车辆',
            '其他原因'
          ],
          defaultIndex: 0, // 默认值
          className: 'slot-1',
          textAlign: 'center'
        }
      ],
      refundObj: {
        reason: '',
        orderNo: ''
      },
      noData: false,
      pageObj: {
        totalPage: 1,
        pageSize: 5,
        pageNo: 1,
        hasNext: false
      },
      // 订单状态
      // 待支付 COMMIT
      // 已支付 PAID
      // 退款中 REFUND
      // 已退款 REFUNDED
      // 已完成 COMPLETED
      // 已取消 CANCELED
      ORDER_STATUS: {
        COMMIT: '待支付',
        PAID: '已支付',
        REFUND: '退款中',
        REFUNDED: '已退款',
        COMPLETED: '已完成',
        CANCELED: '已取消',
        REFUNDFAILED: '退款失败'
      },
      // 支付状态
      // 已支付 Y
      // 未支付 N
      PAY_STATUS: {
        Y: '已支付',
        N: '未支付'
      },
      orderListData: [], // 订单列表
      newOrderListData: [] // 新订单类型的数据
    }
  },
  mounted() {
    let t = this
    if (!t.userObj.logined) {
      // 获取登录信息
      let userObj = t.$common.getUserInfo() || ''
      if (userObj === '') {
        userObj = t.$common.getUnLoginData()
      }
      if (!userObj.logined) {
        // 未登录
        t.$common.clearUserInfo()
        t.$messageBox.confirm('登录失效，是否重新登录?').then(
          action => {
            t.syncLoadLayer({
              type: 'login',
              show: true
            })
          },
          cancel => {
            t.$common.clearUserInfo()
            t.$router.replace('/wx')
          }
        )
      } else {
        // 异步调用
        ; (async () => {
          try {
            await t.$store.dispatch('doLogin', userObj)
            console.log('userObj:>', t.userObj)
            if (t.orderStoreType) {
              t.orderType = t.orderStoreType
            }
            t.orderList() // 获取订单列表信息
          } catch (error) {
            console.log(error)
          }
        })()
      }
    } else {
      if (t.orderStoreType) {
        t.orderType = t.orderStoreType
      }
      t.orderList('') // 获取订单列表信息
      t.getSysCodeValuesNewOrderType() // 获取订单类型
    }
  },
  destroyed() { },
  computed: {
    ...mapState({
      // 映射
      userObj: state => state.user.user,
      orderStoreType: state => state.user.orderType
    })
  },
  methods: {
    // 获取所有订单信息
    orderList(newOrderType) {
      // console.log('789789789789789789', newOrderType)
      let t = this
      if (t.pageObj.pageNo === 1) {
        t.orderListData = []
        t.noData = false
        t.$store.dispatch('setOrderType', '')
      }
      // 获取订单信息
      Request.orderList({
        ACCESS_TOKEN: t.userObj.data.token,
        orderStatus: t.orderType === 'all' ? '' : t.orderType,
        pageSize: t.pageObj.pageSize,
        beginPage: t.pageObj.pageNo,
        orderType: newOrderType
      }).then(async result => {
        if (result.success) {
          console.log(result)
          let obj = result.data || {}
          t.pageObj.totalPage = obj.totalPages || 1
          t.pageObj.hasNext = obj.hasNextPage
          let dataList = obj.dataList || []
          // t.orderListData = []
          await _.each(dataList, (item, key) => {
            item['isCompleteQuestion'] = item.isCompleteQuestion || ''
            item['order_state'] = t.ORDER_STATUS[item.orderStatus] || ''
            item['pay_state'] = t.PAY_STATUS[item.payStatus] || ''
            item['attrs'] = item.attrs || []
            item['orderNo'] = item.orderNo || ''
            t.orderListData.push(item)
          })
          t.noData = !(t.orderListData.length > 0)
        } else if (result.code === '-10') {
          t.$messageBox.confirm('登录失效，是否重新登录?').then(
            action => {
              t.syncLoadLayer({
                type: 'login',
                show: true
              })
            },
            cancel => {
              t.$common.clearUserInfo()
              t.$router.replace('/wx')
            }
          )
        } else {
          t.$toast(result.msg)
        }
      })
    },
    // 获取订单新类型
    getSysCodeValuesNewOrderType() {
      Request.getSysCodeValuesNewOrderType('', 'order_type').then(result => {
        if (result.success) {
          this.newOrderListData = result.data
          console.log(this.newOrderListData)
        } else if (result.code === '-10') {
          this.$messageBox.confirm('登录失效，是否重新登录?').then(
            action => {
              this.syncLoadLayer({
                type: 'login',
                show: true
              })
            },
            cancel => {
              this.$common.clearUserInfo()
              this.$router.replace('/wx')
            }
          )
        } else {
          this.$toast(result.msg)
        }
      })
    },
    // 对应codeNo值展示相应订单类型
    showOrderTypeName(typeNo, size) {
      const aaa = {
        ORDINARY: size ? '普通' : '普通订单',
        PRESELL: size ? '预售' : '预售订单',
        SECKILL: size ? '秒杀' : '秒杀订单',
        CARD_VOUCHER: size ? '活动订单' : '卡券订单'
      }
      return aaa[typeNo]
    },
    // 全部类型的下拉菜单
    showOrderType(e) {
      this.isDown = !this.isDown
      if (e.target.tagName === 'LI') {
        // 显示当前选项
        this.showMenu = e.target.innerText
      }
    },
    // 查看更多
    getMoreList(showMenu) {
      let t = this
      t.pageObj.pageNo += 1
      let tump = {
        '全部订单': '',
        '普通订单': 'ORDINARY',
        '秒杀订单': 'SECKILL',
        '活动订单': 'CARD_VOUCHER',
        '预售订单': 'PRESELL'
      }
      t.orderList(tump[showMenu]) // 获取订单列表信息
    },
    // 跳转订单详情
    toDetails(orderNo) {
      let t = this
      // t.$store.dispatch('setOrderType', t.orderType)
      t.$router.push('/wx/user/order/deatils/' + orderNo)
    },
    // 跳转支付
    toPay(orderNo) {
      let t = this
      t.$store.dispatch('setOrderType', t.orderType)
      t.$router.push('/wx/pay/' + orderNo)
    },
    // 跳转立即评价
    toEvaluateSurvey(orderNo) {
      let t = this
      t.$store.dispatch('setOrderType', t.orderType)
      t.$router.push('/wx/evaluate/' + orderNo)
    },
    // 返回
    doBack() {
      this.$router.replace('/wx/user')
    },
    // 查看核销码
    toVerificationCode(orderNo) {
      let t = this
      Request.info(
        {
          ACCESS_TOKEN: t.userObj.data.token
        },
        orderNo
      ).then(result => {
        if (result.success) {
          // console.log('result:>', result)
          t.verificationCodeShow = true
        } else {
          t.$toast(result.msg)
        }
      })
    },
    // 申请退款
    toApplicationRefund(orderNo) {
      let t = this
      t.refundObj.orderNo = orderNo
      t.applicationRefundShow = true
    },
    // 问卷调查
    doQuestionnaireSurvey(obj) {
      console.log('===============')
      console.log(obj)
      let t = this
      t.orderObj = obj
      t.questionnaireSurveyShow = true
    },
    // 关闭弹出层
    doClose(obj) {
      let t = this
      console.log('doClose:>', obj)
      if (obj.type === 'send') {
        t.verificationCodeShow = obj.show
      } else if (obj.type === 'refund') {
        t.applicationRefundShow = obj.show
      } else if (obj.type === 'reason') {
        t.refundSelectShow = obj.show
      } else if (obj.type === 'refund-success') {
        t.applicationRefundShow = obj.show
        _.each(t.orderListData, (item, key) => {
          if (item.orderNo === obj.orderNo) {
            item.orderStatus = 'REFUND' // 改变状态
            item.order_state = t.ORDER_STATUS[item.orderStatus] || ''
          }
        })
      } else if (obj.type === 'congratulations') {
        t.questionnaireSurveyShow = false
        t.congratulationsShow = obj.show
        _.each(t.orderListData, (item, key) => {
          // 修改状态
          if (item.orderNo === t.orderObj.orderNo) {
            item.isCompleteQuestion = 'Y' // 已提交
          }
        })
      } else if (obj.type === 'questionnaire') {
        t.congratulationsShow = false
        t.questionnaireSurveyShow = obj.show
      } else if (obj.type === 'close') {
        t.congratulationsShow = obj.show
        t.questionnaireSurveyShow = false
      }
    },
    // 选择器选中值改变
    selectedChanged(obj) {
      let t = this
      console.log(obj.value)
      t.refundSelectShow = false
      t.refundObj.reason = obj.value
    }
  },
  watch: {
    // 监听
    orderType(val) {
      let t = this
      t.orderType = val
      t.pageObj.pageNo = 1
      console.log('这里是监听器', val, t.showMenu)
      let tump = {
        '全部类型': '',
        '普通订单': 'ORDINARY',
        '秒杀订单': 'SECKILL',
        '活动订单': 'CARD_VOUCHER',
        '预售订单': 'PRESELL'
      }
      // console.log('1231321321321321321', tump[t.showMenu])
      t.orderList(tump[t.showMenu]) // 获取订单列表信息
      t.getSysCodeValuesNewOrderType() // 获取订单类型
    },
    showMenu() {
      let t = this
      t.pageObj.pageNo = 1
      let tump = {
        '全部类型': '',
        '普通订单': 'ORDINARY',
        '秒杀订单': 'SECKILL',
        '活动订单': 'CARD_VOUCHER',
        '预售订单': 'PRESELL'
      }
      // console.log('456456456', t.showMenu, tump[t.showMenu])
      t.orderList(tump[t.showMenu]) // 获取订单列表信息
      t.getSysCodeValuesNewOrderType() // 获取订单类型
    }
  }
}
</script>
<style lang="scss">
//noinspection CssUnknownTarget
@import "~/assets/sass/pages/user/order.scss";
</style>
