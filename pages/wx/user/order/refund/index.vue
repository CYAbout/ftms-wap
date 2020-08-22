<template>
  <!--订单列表-->
  <div class="order-container refund-container">
    <!--头部-->
    <div class="order-header bm-box bm-box-horizontal bm-box-vertical-center">
      <div @click="doBack" class="header-left"><i class="iconfont icon-back"></i></div>
      <div class="bm-flex header-title">我的退款</div>
      <div class="header-right"></div>
    </div>

    <!--无数据-->
    <data-empty v-if="noData" :options="orderType"></data-empty>

    <!--订单列表内容-->
    <ul v-else class="order-lists">
      <li v-for="(obj,index) in orderListData.slice(0, 20)" :key="index" class="order-item">
        <!--订单头-->
        <div class="item-header bm-box bm-box-horizontal">
          <div class="bm-flex order-no">退款编号：{{obj.refundNo || ''}}</div>
          <div class="order-state">{{obj.order_state || ''}}</div>
        </div>
        <!--订单内容-->
        <div class="item-content bm-box bm-box-horizontal">
          <div class="order-pic">
            <img v-lazy="obj.goodsImg"/>
          </div>
          <div class="bm-flex order-info">
            <div class="name">{{obj.goodsName || ''}}</div>
            <!-- <div v-for="(item, index) in obj.attrs" :key="item.attributeId" class="attribute-item">
              <span>
                {{item.attributeName || ''}}：{{item.attributeValueName || ''}}
              </span>
            </div> -->
            <!--<div class="attribute-item">内饰：红+黑</div>-->
            <div class="intention"><span>¥ </span> <span>{{obj.depositPrice | fMoney}}</span></div>
          </div>
        </div>

        <!--操作按钮-->
        <div class="operation-group bm-box bm-box-horizontal bm-box-vertical-center">
          <div class="bm-flex"></div>
          <div @click="toDetails(obj.refundNo, obj.orderNo)"  class="btn-item">查看详情</div>
          <!--退款中-->
          <div @click="toCancelRefund(obj.orderNo)" v-if="obj.refundStatus === 'COMMIT'" class="btn-item">取消退款</div>
        </div>
      </li>
    </ul>
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
        orderObj: {
          // 订单项
          orderNo: ''
        },
        noData: false,
        pageObj: {
          totalPage: 1,
          pageSize: 100,
          pageNo: 1,
          hasNext: false
        },
        ORDER_STATUS: {
          COMMIT: '等待客服审核',
          PAID: '已支付',
          REFUND: '退款中',
          FAILED: '退款失败',
          REFUNDED: '已退款',
          REFUSE: '审核不通过',
          REFUNDBANK: '退款中',
          COMPLETED: '已完成',
          CANCELED: '已取消'
        },
        refundState: {
          COMMIT: '等待客服审核',
          REFUND: '退款中',
          FAILED: '退款失败',
          REFUNDED: '已退款',
          REFUSE: '审核不通过',
          CANCELED: '已取消',
          REFUNDBANK: '退款中'
        },
        // 支付状态
        // 已支付 Y
        // 未支付 N
        PAY_STATUS: {
          Y: '已支付',
          N: '未支付'
        },
        orderListData: [] // 订单列表
      }
    },
    beforeMount() {},
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
          ;(async () => {
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
        t.orderList() // 获取订单列表信息
      }
    },
    destroyed() {},
    computed: {
      ...mapState({
        // 映射
        userObj: state => state.user.user,
        orderStoreType: state => state.user.orderType
      })
    },
    methods: {
      // 获取订单列表信息
      orderList() {
        let t = this
        if (t.pageObj.pageNo === 1) {
          t.orderListData = []
          t.noData = false
        }
        Request.refundOrderList({
          ACCESS_TOKEN: t.userObj.data.token,
          orderStatus: '',
          pageSize: t.pageObj.pageSize,
          beginPage: t.pageObj.pageNo
        }).then(result => {
          if (result.success) {
            // console.log('result:>', result)
            let obj = result.data || {}
            t.pageObj.totalPage = obj.totalPages || 1
            t.pageObj.hasNext = obj.hasNextPage
            let dataList = obj.dataList || []
            _.each(dataList, (item, key) => {
              item['isCompleteQuestion'] = item.isCompleteQuestion || ''
              item['order_state'] = t.refundState[item.refundStatus] || ''
              item['pay_state'] = t.PAY_STATUS[item.payStatus] || ''
              item['attrs'] = item.goodsAtrrs || []
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
      // 查看更多
      getMoreList() {
        let t = this
        t.pageObj.pageNo += 1
        t.orderList() // 获取订单列表信息
      },
      // 跳转订单详情
      toDetails(refundNo, orderNo) {
        let t = this
        t.$store.dispatch('setOrderType', t.orderType)
        t.$router.push('/wx/user/order/refund/detail/' + refundNo + '&' + orderNo)
      },
      // 取消退款
      toCancelRefund(orderNo) {
        this.$messageBox.confirm('确定要取消退款申请?').then(action => {
          Request.refundCancel({
            ACCESS_TOKEN: this.userObj.data.token
          }, orderNo).then(v => {
            this.orderType = 'PAID'
            window.location.reload()
          })
        }, cancel => { })
      },
      // 跳转支付
      toPay(orderNo) {
        let t = this
        t.$store.dispatch('setOrderType', t.orderType)
        t.$router.push('/wx/pay/' + orderNo)
      },
      // 返回
      doBack() {
        this.$router.replace('/wx/user')
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
        }
      }
    }
  }
</script>
<style lang="scss">
  //noinspection CssUnknownTarget
  @import '~/assets/sass/pages/user/order1.scss';
</style>
