<template>
  <!--商品详情页-->
  <div class="details-container">
    <!--头部-->
    <div class="order-header bm-box bm-box-horizontal bm-box-vertical-center">
      <div @click="doBack" class="header-left"><i class="iconfont icon-back"></i></div>
      <div class="bm-flex header-title">提交评价</div>
      <div class="header-right"></div>
    </div>
  <!--商品信息-->
      <div class="commodity-information">
        <h5 class="commodity-label">商品信息</h5>
        <img class="commodity-pic" v-lazy="goodsInfo.goodsImg"/>
        <div class="commodity-title bm-box bm-box-horizontal">
          <div class="bm-flex title">{{goodsInfo.goodsName}}</div>
          <div class="number">x1</div>
        </div>
      </div>

      <!--订单属性信息-->
      <ul class="order-attribute">
        <li class="attribute-item  bm-box bm-box-horizontal">
          <div class="bm-flex attribute-label intentional-gold">{{attrs.attributeValueName}}</div>
        </li>
        <li class="attribute-item  bm-box bm-box-horizontal">
          <div class="bm-flex attribute-label intentional-gold">订金</div>
          <div class="attribute-value intentional-gold">¥ <span>{{goodsInfo.depositPrice}}</span></div>
        </li>
        <li class="attribute-item  bm-box bm-box-horizontal">
          <div class="bm-flex attribute-label">购买方式</div>
          <div class="attribute-value">订金</div>
        </li>
        <li class="attribute-item  bm-box bm-box-horizontal">
          <div class="bm-flex attribute-label">经销商店</div>
          <div class="attribute-value">{{attrList.dealerName}}</div>
        </li>
        <li class="attribute-item  bm-box bm-box-horizontal">
          <div class="bm-flex attribute-label">购车时间</div>
          <div class="attribute-value">{{attrList.commitTime}}</div>
        </li>
      </ul>
    <comprehensiveScore :orderNo="orderNo"></comprehensiveScore>
  </div>
</template>

<script>
import Request from '~/plugins/request'
import { mapState } from 'vuex'
import comprehensiveScore from '~/components/evaluation/layer/comprehensive-score.vue'

export default {
  components: {
    comprehensiveScore
  },
  asyncData (context) { // async await
    return {
      orderNo: context.params.id
    }
  },
  data() {
    return {
      attrList: {}, // 订单信息
      goodsInfo: [],
      attrs: []
    }
  },
  mounted() {
    let t = this
    t.getOrderDetail()
  },
  computed: {
    ...mapState({ // 映射
      userObj: state => state.user.user
    })
  },
  methods: {
    // 返回
    doBack () {
      this.$router.replace('/wx/user')
    },
    // 获取卡券详情
    getOrderDetail() {
      let t = this
      Request.orderDetail({ACCESS_TOKEN: t.userObj.data.token}, t.orderNo).then(result => {
        if (result.success) {
          t.attrList = result.data || {}
          t.attrList['commitTime'] = t.$util.Date.getFormatDate(t.attrList.commitTime, 'datetime')
          t.goodsInfo = result.data.goodsInfo[0]
          t.attrs = result.data.goodsInfo[0].attrs[1]
        }
      })
    }
  }
}
</script>
<style lang="scss">
//noinspection CssUnknownTarget
@import "~/assets/sass/pages/evaluate/index.scss";
</style>
