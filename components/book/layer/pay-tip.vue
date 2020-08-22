<template>
  <mt-popup
    class="pay-tip-layer"
    v-model="payTipLayerVisible"
    :closeOnClickModal="false"
    popup-transition="popup-fade"
  >
    <div class="pay-tip-content">
      <h5 class="pay-tip-title">提示</h5>
      <div class="text">支付完成前请不要关闭此窗口。</div>

      <!--按钮组-->
      <div class="btn-group bm-box bm-box-horizontal bm-box-vertical-center">
        <div @click="paySuccess" class="bm-flex btn-item">支付成功</div>
        <div @click="paySuccess" class="bm-flex btn-item">支付遇到问题</div>
      </div>
    </div>
  </mt-popup>
</template>

<script>
import { mapState } from 'vuex'
import Request from '~/plugins/request'

export default {
  props: {
    'show': {
      type: Boolean,
      default: false
    },
    'orderNo': {
      type: String,
      default: '' // 主订单号
    },
    'payType': {
      type: String,
      default: '' // 支付方式
    }
  },
  data() {
    return {
      timer: null,
      payTipLayerVisible: this.show
    }
  },
  mounted() {
    this.getPayState() // 支付状态查询
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
    // 支付状态查询
    getPayState() {
      let t = this

      // 获取支付状态
      function queryPayState() {
        Request.query({
          ACCESS_TOKEN: t.userObj.data.token
        }, t.orderNo, t.payType).then(result => {
          if (result.success) {
            clearTimeout(t.timer)
            t.timer = null
            t.$emit('close', {
              type: 'pay-tip',
              show: false,
              flag: 'pay-success'
            })
          } else {
            t.timer = setTimeout(() => {
              queryPayState()
            }, 2000)
          }
        })
      }

      // 启动轮询
      queryPayState()
    },
    payTipLayer() {
      this.$router.replace('/wx/user/order/all')
    },
    // 支付成功
    paySuccess() {
      let t = this
      Request.query({
        ACCESS_TOKEN: t.userObj.data.token
      }, t.orderNo, t.payType).then(result => {
        if (result.success) {
          this.$emit('close', {
            type: 'pay-tip',
            show: false,
            flag: 'pay-success'
          })
        } else {
          // this.$router.replace('/wx/user/order/all')
          this.$router.replace('/wx/pay/fail')
        }
      })
    }
  },
  watch: {
    // 监听show改变
    show(val) {
      this.payTipLayerVisible = val
    },
    payTipLayerVisible(val) {
      if (!val) {
        // eslint-disable-next-line no-undef
        $('.bm-content').css({ 'overflow-y': 'auto' })
        this.$emit('close', {
          type: 'pay-tip',
          show: val
        })
      } else {
        // eslint-disable-next-line no-undef
        $('.bm-content').css({ 'overflow-y': 'hidden' })
      }
    }
  }
}
</script>
<style lang="scss">
@import "sass/pay-tip";
</style>
