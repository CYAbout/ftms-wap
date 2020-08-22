<template>
  <!--无数据-->
  <div class="data-empty">
    <img class="empty-pic" src="~/assets/images/center_common/data_empty_ico.png"/>
    <!--需要支付的-->
    <div class="empty-msg" v-if="ORDER_STATUS[options]">您暂时没有{{ORDER_STATUS[options]}}订单信息</div>
    <div class="empty-msg" v-else="ORDER_STATUS[options]">暂时没有评价信息</div>
    <div class="empty-tip">去逛逛有没有喜欢的爱车吧</div>

    <!--回到首页-->
    <div class="empty-back">
      <nuxt-link class="_link" to="/wx">回到首页</nuxt-link>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      'options': {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        // 订单状态
        // 待支付 COMMIT
        // 已支付 PAID
        // 退款中 REFUND
        // 已退款 REFUNDED
        // 已完成 COMPLETED
        // 已取消 CANCELED
        ORDER_STATUS: {
          COMMIT: '待支付的',
          PAID: '已支付的',
          REFUND: '退款中的',
          REFUNDED: '已退款的',
          COMPLETED: '已完成的',
          CANCELED: '已取消的'
        }
      }
    },
    beforeMount () {},
    mounted () {},
    destroyed () {},
    computed: {},
    methods: {},
    filter: {},
    watch: {}
  }
</script>
<style lang="scss">
  //noinspection CssUnknownTarget
  @import './sass/data-empty';
</style>
