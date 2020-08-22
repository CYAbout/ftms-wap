<template>
  <!--支付成功-->
  <div class="success-container">
    <!--支付结果-->
    <div class="pay-result">
      <!--<i class="pay-success-icon iconfont icon-pay-success"></i>-->
      <div class="" style="text-align: center;vertical-align: middle;margin-top: 80px;">
        <img src="~/assets/images/order_pay/pay_questionnaire.png" height="63" >
      </div>
      <span class="success-tip">还差最后一步</span>
      <!--<span class="success-tip">恭喜您，订单已支付成功！</span>-->

      <!--支付提示-->
      <div class="pay-tip">
        我们诚挚邀请您参与
        <span @click="doQuestionnaire">车主问卷调查</span>， 完成后核销码将自动发送到您的手机！
      </div>
    </div>

    <!--问卷调查-->
    <div @click="doQuestionnaire" class="questionnaire-btn">
      立即参与调查</div>
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
import congratulationsLayer from '~/components/book/layer/congratulations.vue'
import questionnaireSurvey from '~/components/order/layer/questionnaire-survey.vue'

export default {
  name: 'pay-success',
  components: {
    congratulationsLayer,
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
      questionnaireSurveyShow: false, // 问卷调查
      congratulationsShow: false,
      orderObj: {}
    }
  },
  mounted() {
    let t = this
    // t.orderNo = t.$storage.toyotaPayOrderNo.get() || '' // 保存订单号
    if (!t.userObj.logined) { // 获取登录信息
      let userObj = t.$common.getUserInfo() || ''
      if (userObj === '') {
        userObj = t.$common.getUnLoginData()
      }
      if (!userObj.logined) { // 未登录
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
        (async () => {
          try {
            await t.$store.dispatch('doLogin', userObj)
            // await t.$store.dispatch('getUserInfo', t.userObj.data)
            setTimeout(() => {
              t.getPayStatus()
            }, 200)
          } catch (error) {
            console.log(error)
          }
        })()
      }
    } else {
      t.$store.dispatch('getUserInfo', t.userObj.data)
      setTimeout(() => {
        t.getPayStatus()
      }, 200)
    }
  },
  computed: {
    ...mapState({ // 映射
      userObj: state => state.user.user
    })
  },
  methods: {
    // 支付状态查询
    getPayStatus() {
      let t = this
      Request.query({
        ACCESS_TOKEN: t.userObj.data.token
      }, t.orderNo, t.payType).then(result => {
        if (!result.success) {
          t.$router.replace('/wx/pay/' + t.orderNo)
        } else {
          t.getOrderDetail() // 获取订单详情
        }
      })
    },
    // 获取订单详情
    getOrderDetail() {
      let t = this
      Request.orderDetail({
        ACCESS_TOKEN: t.userObj.data.token
      }, t.orderNo).then(result => {
        if (result.success) {
          console.log('result:', result)
          t.orderObj = result.data || {}
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
        t.questionnaireSurveyShow = obj.show
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
