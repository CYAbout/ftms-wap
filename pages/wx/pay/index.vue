<template>
  <!--支付-->
  <div class="pay-container">
    <!--订单信息-->
    <div class="order-information">
      <i class="pay-success-icon iconfont icon-pay-success"></i>
      <span class="success-tip">订单提交成功,请尽快支付！</span>

      <!--订单号-->
      <div class="order-no">您的订单号为<span>20180921123532001</span></div>
      <span class="order-tip">请您于30分钟内完成支付,否则订单会被自动取消！</span>
    </div>

    <!--车型图片-->
    <div class="car-pic">
      <img class="logo" src="~/assets/images/order_pay/TOYOTA.png"/>
      <div class="main-pic">
        <img src="~/assets/images/order_pay/car.png"/>
      </div>
    </div>

    <!--车型名称-->
    <div class="car-title">亚洲龙2.5L自然吸气</div>

    <!--选择的属性-->
    <ul class="attribute-list">
      <li class="attribute-item bm-box bm-box-horizontal bm-box-vertical-center">
        <div class="left-content"><span>外观颜色：</span>白</div>
        <div class="bm-flex"><span>内饰：</span>金+黑</div>
        <div class="order-details">订单详情<i class="iconfont icon-left-min"></i></div>
      </li>
      <li class="attribute-item bm-box bm-box-horizontal bm-box-vertical-center">
        <div class="left-content"><span>购买人：</span>张三</div>
        <div class="bm-flex"><span>手机号：</span>15989890765</div>
      </li>
    </ul>

    <!--应付金额-->
    <div class="amount-payable">
      应付金额：<span>￥</span><span>258,000</span>
    </div>

    <!--支付方式-->
    <div class="payment-method">
      <div class="payment-label">选择支付方式：</div>
      <!--选择支付方式-->
      <div class="payment-select bm-box bm-box-horizontal bm-box-vertical-center">
        <div class="bm-flex payment-item bm-box bm-box-horizontal active">
          <img class="pay-icon" src="~/assets/images/order_pay/wechat.png"/>
          <div class="bm-flex">微信支付</div>
          <span class="triangle"></span>
          <i class="iconfont icon-complete"></i>
        </div>
        <div class="bm-flex payment-item bm-box bm-box-horizontal">
          <img class="pay-icon" src="~/assets/images/order_pay/alipay.png"/>
          <div class="bm-flex">支付宝</div>
        </div>
        <div class="bm-flex payment-item bm-box bm-box-horizontal">
          <img class="pay-icon" src="~/assets/images/order_pay/unionpay.png"/>
          <div class="bm-flex">网银支付</div>
        </div>
      </div>
    </div>

    <!--立即支付-->
    <div @click="toPay" class="topay-btn"><i class="iconfont icon-rmb"></i>立即支付</div>

    <!--退款规则-->
    <div class="refunds-rule"><i class="iconfont icon-refund"></i>退款规则</div>

    <!--支付中提示-->
    <pay-tip :show="payTipShow"></pay-tip>
    <!--扫描二维码-->
    <qr-code :show="qrCodeShow" @close="doClose"></qr-code>
  </div>
</template>

<script>
  import payTip from '~/components/book/layer/pay-tip.vue'
  import qrCode from '~/components/book/layer/qr-code.vue'

  export default {
    name: 'pay',
    components: {
      payTip,
      qrCode
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
    methods: {
      // 支付
      toPay () {
        // this.payTipShow = true
        // this.qrCodeShow = true
        this.$router.push('/wx/pay/success')
        // this.$router.push('/wx/pay/fail')
      },
      // 关闭弹窗
      doClose (obj) {
        let t = this
        if (obj.type === 'qrcode') {
          t.qrCodeShow = obj.show
        }
      }
    }
  }
</script>
<style lang="scss">
  //noinspection CssUnknownTarget
  @import '~/assets/sass/pages/pay/index.scss';
</style>
