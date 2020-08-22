<template>
  <!--支付成功-->
  <div v-if="!hasPayStatus" class="success-pay-loading">正在获取支付状态，请稍后...</div>
  <div v-else class="success-container">
    <!--支付结果-->
    <div class="pay-result">
      <i v-show="orderObj.orderType === 'CARD_VOUCHER'" class="pay-success-icon iconfont icon-pay-success"></i>
      <div v-show="orderObj.orderType !== 'CARD_VOUCHER'" class="" style="text-align: center;vertical-align: middle;margin-top: 140px;">
        <img src="~/assets/images/order_pay/pay_questionnaire.png" height="93" >
      </div>
      <span v-show="orderObj.orderType === 'CARD_VOUCHER'" class="success-tip">恭喜您，订单已支付成功！</span>
      <span v-show="orderObj.orderType !== 'CARD_VOUCHER'" class="success-tip">还差最后一步</span>

      <!--支付提示-->
      <div v-show="orderObj.orderType === 'CARD_VOUCHER'" class="pay-tip">
        订单支付成功，您的优惠券码会通过短信发送到您的手机！请注意查收！
      </div>
      <div v-show="orderObj.orderType !== 'CARD_VOUCHER'" class="pay-tip">
        我们诚挚邀请您参与
        <span @click="doQuestionnaire">车主问卷调查</span>， 完成后核销码将自动发送到您的手机！
      </div>
    </div>

    <!--查看我的订单-->
    <div v-show="orderObj.orderType === 'CARD_VOUCHER'" class="questionnaire-btn" @click="go()">查看我的订单</div>
    <!--问卷调查-->
    <div v-show="orderObj.orderType !== 'CARD_VOUCHER'" @click="doQuestionnaire" class="questionnaire-btn">立即参与调查</div>
    <!--温馨提示-->
    <p class="reminder">温馨提示：订单支付成功后，我们的客户人员会联系您 确认提车相关信息。请耐心等待！</p>

    <!--问卷调查-->
    <questionnaire-survey :show="questionnaireSurveyShow" :orderNo="orderNo" @close="doClose"></questionnaire-survey>
    <!--恭喜弹窗-->
    <congratulations-layer :show="congratulationsShow" :options="orderObj" @close="doClose"></congratulations-layer>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Request from '~/plugins/request'
import questionnaireSurvey from '~/components/order/layer/questionnaire-survey.vue'
import congratulationsLayer from '~/components/book/layer/congratulations.vue'

export default {
  name: 'pay-success',
  components: {
    questionnaireSurvey,
    congratulationsLayer
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
      questionnaireSurveyShow: false, // 问卷调查
      congratulationsShow: false, // 恭喜弹窗
      orderNo: '',
      payType: '',
      mainOrderNo: '',
      orderObj: {},
      hasPayStatus: false,
      timer: null
    }
  },
  destroyed() {
    let t = this
    if (t.timer != null) {
      clearTimeout(t.timer)
      t.timer = null
    }
  },
  mounted() {
    let t = this
    t.orderNo = t.$storage.toyotaPayOrderNo.get() || '' // 保存订单号
    const param = t.$route.query.o
    if (param) {
      t.mainOrderNo = param.substring(0, param.length - 2)
      t.payType = param.substring(param.length - 2)
    }
    if (!t.userObj.logined) {
      // 获取登录信息
      let userObj = t.$common.getUserInfo() || ''
      if (userObj === '') {
        userObj = t.$common.getUnLoginData()
      }
      if (!userObj.logined) {
        // 未登录
        t.$common.clearUserInfo()
        // t.$messageBox.confirm('登录失效，是否重新登录?').then(action => {
        //   t.syncLoadLayer({
        //     type: 'login',
        //     show: true
        //   })
        // }, cancel => {
        //   t.$common.clearUserInfo()
        //   t.$router.replace('/wx')
        // })
      } else {
        // 异步调用
        ; (async () => {
          try {
            await t.$store.dispatch('doLogin', userObj)
            // await t.$store.dispatch('getUserInfo', t.userObj.data)
            setTimeout(() => {
              if (t.mainOrderNo && t.payType) {
                t.getPayStatus()
              } else {
                t.hasPayStatus = true
                t.getOrderDetail() // 获取订单详情
              }
            }, 200)
          } catch (error) {
            console.log(error)
          }
        })()
      }
    } else {
      t.$store.dispatch('getUserInfo', t.userObj.data)
      setTimeout(() => {
        if (t.mainOrderNo && t.payType) {
          t.getPayStatus()
        } else {
          t.hasPayStatus = true
          t.getOrderDetail() // 获取订单详情
        }
      }, 200)
    }
  },
  computed: {
    ...mapState({
      // 映射
      userObj: state => state.user.user
    })
  },
  methods: {
    go () {
      this.$router.push('/wx/user/order/all')
    },
    // 支付状态查询
    getPayStatus() {
      let t = this
      let count = 0
      function queryPayState() {
        count++
        if (count > 5) {
          clearTimeout(t.timer)
          return
        }
        Request.query({
          ACCESS_TOKEN: t.userObj.data.token
        }, t.mainOrderNo, t.payType).then(result => {
          if (!result.success) {
            if (count === 5) {
              t.$router.replace('/wx/pay/' + t.orderNo + '?source=callback')
            } else {
              t.timer = setTimeout(() => {
                queryPayState()
              }, 2000)
            }
          } else {
            clearTimeout(t.timer)
            t.hasPayStatus = true
            t.getOrderDetail() // 获取订单详情
          }
        })
      }
      queryPayState()
    },
    // 获取订单详情
    getOrderDetail() {
      let t = this
      Request.orderDetail(
        {
          ACCESS_TOKEN: t.userObj.data.token
        },
        t.orderNo
      ).then(result => {
        if (result.success) {
          console.log('result:', result)
          t.orderObj = result.data || {}
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
    // 问卷调查
    doQuestionnaire() {
      let t = this
      t.questionnaireSurveyShow = true
    },
    // 关闭弹窗
    doClose(obj) {
      let t = this
      if (obj.type === 'congratulations') {
        t.questionnaireSurveyShow = false
        t.congratulationsShow = obj.show
      } else if (obj.type === 'questionnaire') {
        t.congratulationsShow = false
        t.congratulationsShow = obj.show
      } else if (obj.type === 'close') {
        t.congratulationsShow = obj.show
        t.questionnaireSurveyShow = false
      }
    }
  }
}
</script>
<style lang="scss">
//noinspection CssUnknownTarget
@import "~/assets/sass/pages/pay/success.scss";
</style>
