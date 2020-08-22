<template>
  <!--支付失败-->
  <div class="fail-container">
    <!--支付结果-->
    <div class="pay-result">
      <i class="pay-fail-icon iconfont icon-pay-fail"></i>
      <span class="fail-tip">非常遗憾</span>
      <!--支付提示-->
      <div class="pay-tip">订单支付遇到问题，请稍后重试！</div>
    </div>

    <!--再次支付-->
    <div @click="toRepay" class="pay-again-btn">再次支付</div>
    <!--温馨提示-->
    <p class="reminder">常见支付失败的原因：网络异常或网络繁忙；账号存在异常。</p>
  </div>
</template>

<script>
  export default {
    name: 'pay-fail',
    head () {
      return {
        title: '一汽丰田官方商城',
        meta: [ // seo
          {hid: 'keywords', name: 'keywords', content: ''},
          {hid: 'description', name: 'description', content: ''}
        ]
      }
    },
    mounted () {
      let t = this
      t.orderNo = t.$storage.toyotaPayOrderNo.get() || '' // 保存订单号
      console.log('orderNo:>', t.orderNo)
    },
    methods: {
      // 再次支付
      toRepay () {
        let t = this
        t.$router.push('/wx/pay/' + t.orderNo)
      }
    }
  }
</script>
<style lang="scss">
  //noinspection CssUnknownTarget
  @import '~/assets/sass/pages/pay/fail.scss';
</style>
