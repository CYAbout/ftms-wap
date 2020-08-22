<template>
  <!--申请退款-->
  <mt-popup
    class="application-refund-layer"
    v-model="applicationRefundPopupVisible"
    popup-transition="popup-fade">
    <div class="application-refund-content">
      <!--编辑栏-->
      <div class="edit-line bm-box bm-box-horizontal bm-box-vertical-center">
        <div class="edit-label">退款原因：</div>
        <div @click="reasonSelect" class="bm-flex edit-select">
          <span>{{options.reason}}</span> <i class="iconfont icon-down-min"></i>
        </div>
      </div>

      <div v-show="options.reason === '其他原因'" class="edit-line bm-box bm-box-horizontal bm-box-vertical-center">
        <div class="edit-label">其他原因：</div>
        <div class="bm-flex edit-textarea">
          <textarea v-model="otherReason" rows="3" maxlength="50"></textarea>
          <i class="word">50字</i>
        </div>
      </div>

      <!--查看规则-->
      <div class="to-rules bm-box bm-box-horizontal bm-box-vertical-center">
        <div class="bm-flex"></div>
        <!--<div @click="refundRuleTip" class="look-rule"><i class="iconfont icon-rule"></i>退款规则</div>-->
      </div>

      <!--退款规则-->
      <prompt :show="promptShow" :type="'refund-rule'" @close="doClose"></prompt>

      <!--保存按钮-->
      <div @click="doSubmit" class="save-btn">
        <i class="iconfont icon-save"></i>保存
      </div>

      <!--提示信息-->
      <div class="refund-tip">
        退款申请提交后需等待经销商审核，审核通过后我们会将款项三个工作日退回到您的账户中，请耐心等待～
      </div>
    </div>
    <!--关闭按钮-->
    <div @click="applicationRefundPopupVisible = false" class="close-btn"><i class="iconfont icon-pay-fail"></i></div>
  </mt-popup>
</template>

<script>
  import { mapState } from 'vuex'
  import Request from '~/plugins/request'
  import prompt from '~/components/common/layer/prompt.vue'

  export default {
    props: {
      'show': {
        type: Boolean,
        default: false
      },
      'options': {
        type: Object,
        default: () => { // 不传参数时使用默认值
          // 默认值
          return {
            orderNo: '',
            reason: ''
          }
        }
      }
    },
    components: {
      prompt
    },
    data () {
      return {
        promptShow: false,
        applicationRefundPopupVisible: this.show,
        otherReason: ''
      }
    },
    computed: {
      ...mapState({ // 映射
        userObj: state => state.user.user
      })
    },
    methods: {
      // 退款规则
      refundRuleTip() {
        this.promptShow = true
        // this.$toast('您可以在与经销商签订订车、购车相关合同协议之前，随时提交退款申请。经销商将在3个工作日完成退款审核，如审核通过，将原路返回意向金至您的支付账户，具体到账情况以第三方支付平台及银行规定为准')
      },
      // 关闭弹窗
      doClose(obj) {
        let t = this
        if (obj.type === 'prompt') {
          t.promptShow = false
          t.applicationRefundPopupVisible = false
        }
      },
      // 申请退款
      doSubmit () {
        let t = this
        if (t.options.reason === '其他原因' && t.otherReason === '') {
          t.$toast('请填写退款原因')
        } else if (t.options.reason !== '其他原因' && t.options.reason === '') {
          t.$toast('请选择退款原因')
        } else if (t.options.reason === '请选择退款原因') {
          t.$toast('请选择退款原因')
        } else {
          Request.apply({
            ACCESS_TOKEN: t.userObj.data.token,
            orderNo: t.options.orderNo,
            reason: (t.options.reason === '其他原因' && t.otherReason !== '') ? t.otherReason : t.options.reason
          }).then(result => {
            if (result.success) {
              t.$toast(result.msg || '申请退款提交成功')
              t.$emit('close', {
                type: 'refund-success',
                show: false,
                orderNo: t.options.orderNo
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
        }
      },
      // 选择原因
      reasonSelect () {
        this.$emit('close', {
          type: 'reason',
          show: true
        })
      }
    },
    filter: {},
    watch: {
      // 监听show改变
      show (val) {
        this.applicationRefundPopupVisible = val
      },
      applicationRefundPopupVisible (val) {
        if (!val) {
          // eslint-disable-next-line no-undef
          $('.bm-content').css({'overflow-y': 'auto'})
          this.$emit('close', {
            type: 'refund',
            show: val
          })
        } else {
          // eslint-disable-next-line no-undef
          $('.bm-content').css({'overflow-y': 'hidden'})
        }
      }
    }
  }
</script>
<style lang="scss">
  //noinspection CssUnknownTarget
  @import './sass/application-refund';
</style>
