<template>
  <!--商品详情页-->
  <div class="details-container">
    <!--头部-->
    <div class="order-header bm-box bm-box-horizontal bm-box-vertical-center">
      <div @click="doBack" class="header-left"><i class="iconfont icon-back"></i></div>
      <div class="bm-flex header-title">评价详情</div>
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
          <div class="bm-flex attribute-label intentional-gold" style="font-weight: normal;" >{{attrs.attributeName}}</div>
          <div class="attribute-value intentional-gold"><span>{{attrs.attributeValueName}}</span></div>
        </li>
        <li class="attribute-item  bm-box bm-box-horizontal">
          <div class="bm-flex attribute-label intentional-gold" style="font-weight: normal;">价格</div>
          <div class="attribute-value intentional-gold">¥ <span>{{goodsInfo.depositPrice}}</span></div>
        </li>
        <!-- <li class="attribute-item  bm-box bm-box-horizontal">
          <div class="bm-flex attribute-label">购买方式</div>
          <div class="attribute-value">订金</div>
        </li> -->
        <li class="attribute-item  bm-box bm-box-horizontal">
          <div class="bm-flex attribute-label">经销商店</div>
          <div class="attribute-value">{{orderObj.dealerName}}</div>
        </li>
        <li class="attribute-item  bm-box bm-box-horizontal">
          <div class="bm-flex attribute-label">购车时间</div>
          <div class="attribute-value">{{orderObj.commitTime}}</div>
        </li>
      </ul>
      <comprehensiveScore2 v-if="readonly" :globalScore="globalScore" :mallScore="mallScore" :productScore="productScore" :dealerScore="dealerScore" :assessment="assessment" ></comprehensiveScore2>
      <comprehensiveScore v-if="!readonly" ></comprehensiveScore>
      </div>
</template>

<script>
import Request from '~/plugins/request'
import { mapState } from 'vuex'
import comprehensiveScore from '~/components/evaluation/layer/comprehensive-score.vue'
import comprehensiveScore2 from '~/components/evaluation/layer/comprehensive-score2.vue'

export default {
  asyncData (context) { // async await
    return {
      id: context.params.id,
      text: context.params,
      readonly: context.query.readonly === '1',
      orderNo: context.query.order_no
    }
  },
  components: {
    comprehensiveScore, comprehensiveScore2
  },
  data() {
    return {
      assessment: '',
      dealerScore: 0,
      globalScore: 0,
      mallScore: 0,
      productScore: 0,
      orderObj: {},
      goodsInfo: {},
      orderLog: [],
      attrs: {}
    }
  },
  mounted() {
    // console.log('====mounted', this.id)
    Request.getAssessmentInfo({}, this.id).then(v => {
      console.log('=====getAssessmentInfo', v)
      Object.assign(this, v.data)
    })
    this.getOrderDetail()
  },
  computed: {
    ...mapState({ // 映射
      userObj: state => state.user.user
    })

  },
  methods: {
    // 返回
    doBack() {
      this.$router.replace('/wx/user/evaluation')
    },
    getOrderDetail() {
      let t = this
      Request.orderDetail({ACCESS_TOKEN: t.userObj.data.token}, t.orderNo).then(result => {
        if (result.success) {
          const {goodsInfo, orderLog, ...rest} = result.data || {}
          Object.assign(this.orderObj, rest)
          t.orderObj['commitTime'] = t.$util.Date.getFormatDate(t.orderObj.commitTime, 'datetime')
          this.goodsInfo = (goodsInfo && goodsInfo[0]) || {}
          this.attrs = (this.goodsInfo.attrs || [])[1] || {}
          this.orderLog = orderLog
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
