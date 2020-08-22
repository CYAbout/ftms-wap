<template>
  <!--促销商品-->
  <div class="sales-activity">
    <h4 class="title">促销商品</h4>
  <!-- {{this.options}} -->
    <div class="activity-content">
      <div class="cardBox" v-for="item in options.data" :key="item.id">
        <h4 class="title">{{item.cardVoucherClass || '促销'}}</h4>
        <div class="card" v-for="items in item.cardVoucherList" :key="items.id">
          <div class="cardImg">
            <img v-lazy="items.cardVoucherImg"/>
            <!--<img src="~/assets/images/sales/salesPromotion_06.png" alt="">-->
          </div>
          <div class="cardText">
            <div class="title">{{items.cardVoucherName}}</div>

            <p v-if="item.cardVoucherFeature === 1" >抢购价：<i>￥{{items.cardVoucherPrice}}</i></p>
            <p v-if="item.cardVoucherFeature === 2" ><i>￥{{items.cardVoucherPrice}}</i> 抵 <i>￥{{items.cardVoucherAmount}}</i></p>
            <!-- <p v-else ><i>￥{{items.cardVoucherPrice}}</i></p> -->
            <div @click="toDetail(items.cardVoucherId)" class="order-immediately">
                <i class="iconfont icon-shopping-cart"></i>立即抢购
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      'options': {
        type: Object,
        default: () => { // 不传参数时使用默认值
          // 默认值
          return {
            code: '',
            msg: '',
            data: []
          }
        }
      }
    },
    data () {
      return {
      }
    },
    mounted () {
    },
    methods: {
      toDetail(cardVoucherId) {
        let t = this
        t.$router.push('/wx/salesDetails/' + cardVoucherId)
      }
    }
  }
</script>
<style lang="scss">
  @import './sass/promotion';
</style>
