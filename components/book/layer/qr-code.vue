<template>
  <mt-popup
    class="qrcode-layer"
    v-model="qrcodeLayerVisible"
    :closeOnClickModal="false"
    popup-transition="popup-fade">
    <div class="qrcode-content">
      <img class="qrcode-pic" src="~/assets/images/order_pay/pay_qr_code.png"/>
      <p class="scan-tip">扫一扫付款</p>
      <p class="pay-tip">使用<span>微信</span>APP扫码支付</p>
    </div>
    <!--关闭按钮-->
    <div @click="qrcodeLayerVisible = false" class="close-btn"><i class="iconfont icon-pay-fail"></i></div>
  </mt-popup>
</template>

<script>
  export default {
    props: {
      'show': {
        type: Boolean,
        default: false
      },
      'type': {
        type: String,
        default: 'wechat' // wechat -- 微信
      }
    },
    data () {
      return {
        qrcodeLayerVisible: this.show
      }
    },
    methods: {
      // 触发操作 back || refresh
      triggerAction (flag = 'back') {
        let t = this
        t.$emit('action', {
          type: t.type,
          flag: flag
        })
      }
    },
    watch: {
      // 监听show改变
      show (val) {
        this.qrcodeLayerVisible = val
      },
      qrcodeLayerVisible (val) {
        if (!val) {
          this.$emit('close', {
            type: 'qrcode',
            show: val
          })
        }
      }
    }
  }
</script>
<style lang="scss">
  @import 'sass/qr-code';
</style>
