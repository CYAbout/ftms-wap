<template>
  <mt-popup
    class="congratulations-layer"
    v-model="congratulationsLayerVisible"
    :closeOnClickModal="true"
    position="top"
    popup-transition="popup-fade">
    <div class="congratulations-content">
      <!--头部-->
      <div class="congratulat-header">
        <div class="title">恭喜您！</div>
        <div class="sub-title">CONGRATULATIONS</div>
        <img class="decoration" src="~/assets/images/order_pay/pop_title_decoration.png"/>
      </div>
      <div class="congratulat-content">
        <div class="title">尊敬的 <span>{{options.extractName || ''}}</span> （先生/女士）</div>
        <p>感谢您参与一汽丰田亚洲龙新车预售活动，祝贺您获得尊享大礼包。您选择的经销商为<span>{{options.dealerName || ''}}</span>店，核销码已经通过短信发送至您的手机，请到店商谈时主动出示活动核销码。
          具体车型配置，请您于{{dateStr || ''}}后，到<span>{{options.dealerName || ''}}</span>店咨询并选择。 请注意查收。</p>
      </div>

      <!--签约单号-->
      <div class="sign-number">
        您的订单号：{{options.orderNo || ''}}
      </div>

      <!--尾部-->
      <div class="congratulat-footer bm-box bm-box-horizontal bm-box-vertical-center">
        <div class="footer-logo"><img src="~/assets/images/order_pay/logo.png"/></div>
        <div class="bm-flex"></div>
        <div class="footer-seal">
          <img src="~/assets/images/order_pay/seal_ico.png"/>
          <div class="date">{{dateStr || ''}}</div>
        </div>
      </div>
    </div>
    <!--关闭按钮-->
    <div @click="congratulationsLayerVisible = false" class="close-btn"><i class="iconfont icon-pay-fail"></i></div>
  </mt-popup>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      default: () => {
        return {
          extractName: '',
          dealerName: ''
        }
      }
    }
  },
  data() {
    return {
      congratulationsLayerVisible: this.show,
      dateStr: ''
    }
  },
  mounted() {
    let t = this
    let dateStr = t.$util.Date.getFormatDate(new Date(), 'day')
    t.dateStr =
      dateStr.split('-')[0] +
      '年' +
      dateStr.split('-')[1] +
      '月' +
      dateStr.split('-')[2] +
      '日'
    // console.log('date:>', t.dateStr)
  },
  watch: {
    // 监听show改变
    show(val) {
      // console.log('this.show=', val)
      this.congratulationsLayerVisible = val
    },
    congratulationsLayerVisible(val) {
      if (this.congratulationsLayerVisible === false) {
        this.$router.replace('/wx/user/order/all')
      }
      if (!val) {
        // eslint-disable-next-line no-undef
        $('.bm-content').css({ 'overflow-y': 'auto' })
        // this.$emit('close', {
        //   type: 'congratulations',
        //   show: val
        // })
      } else {
        // eslint-disable-next-line no-undef
        $('.bm-content').css({ 'overflow-y': 'hidden' })
      }
    }
  }
}
</script>
<style lang="scss">
@import 'sass/congratulations';
</style>
