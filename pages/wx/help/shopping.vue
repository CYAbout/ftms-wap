<template>
  <!--帮助中心详情页-->
  <div class="help-details-container">
    <!--头部-->
    <div class="help-details-header bm-box bm-box-horizontal bm-box-vertical-center">
      <div @click="doBack" class="header-left"><i class="iconfont icon-back"></i></div>
      <div class="bm-flex header-title">购物流程</div>
      <div class="header-right"></div>
    </div>

    <!--内容区-->
    <div class="help-details-content">
      <div>
        <p>1、首先请您进入商城，登录或注册一汽丰田官方商城账号；</p>
        <img class="stepOne" src="~/assets/images/help_details/s1.ac2536e1.png" alt="">
      </div>
      <div>
        <p>2、选择购买车型配置、外观颜色、内饰颜色，点击“即刻订购”按钮；</p>
        <img src="~/assets/images/help_details/s2.301a3ae7.png" alt="">
      </div>
      <div>
        <p>3、选择经销商、是否置换增购、填写购车人相关信息，点击“提交意向订单”按钮，完成后续支付流程；</p>
        <img src="~/assets/images/help_details/s3.161946f7.png" alt="">
      </div>
      <div>
        <p>4、核对订单信息，选择支付方式后点击“立即支付”按钮；</p>
        <img src="~/assets/images/help_details/s4.07ac5dbb.png" alt=""></div>
      <div>
        <p>5、成功缴纳订单意向金后，提车核销码会以短信的形式下发至购车人手机号；</p>
      </div>
      <div>
        <p>6、当车辆送达所选经销商处后，购车人收到车辆到店信息，请购车人前往提车经销商出示提车核销码，并支付车款即可完成购车；</p>
      </div>
      <div>
        <p class="stepLast">
          7、一汽丰田销售有限公司将尽快安排您完成购车的相关事宜。您可以在与经销商签订订车、购车相关合同协议之前，随时提交退款申请。经销商将在3个工作日完成退款审核，如审核通过，将原路返回意向金至您的支付账户，具体到账情况以第三方支付平台及银行规定为准。</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'shopping',
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
      // 返回
      doBack () {
        this.$router.replace('/wx/help')
      }
    }
  }
</script>
<style lang="scss">
  //noinspection CssUnknownTarget
  @import '~/assets/sass/pages/help/details.scss';
</style>
