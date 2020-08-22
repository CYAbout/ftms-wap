<template>
  <!--新车预售-->
  <div class="presell-container">
    <!--头部-->
    <details-header :options="headerObj"></details-header>

    <!--主图-->
    <div class="maim-pic">
      <!--<img src="~/assets/images/car_sale/banner.png"/>-->
      <img :src="productObj.proImageUrl">
    </div>

    <!--优惠-->
    <div  class="maim-pic policy">
      <img src="~/assets/images/car_sale/policy2.jpg"/>
    </div>

    <!--车型展示-->
    <model-display :options="modelDisplay"></model-display>

    <!--车型亮点-->
    <!--<div class="bright-points-list" v-html="productObj.detailInfo"></div>-->
    <bright-points :options="productObj.phoneProductDesc"></bright-points>
  </div>
</template>

<script>
  // import _ from 'lodash'
  import Request from '~/plugins/request'
  import detailsHeader from '~/components/details/details-header.vue'
  import modelDisplay from '~/components/details/model-display.vue'
  import brightPoints from '~/components/details/bright-points.vue'

  export default {
    name: 'avalon',
    components: {
      detailsHeader,
      modelDisplay,
      brightPoints
    },
    asyncData(context) { // async await
      return {
        productId: '12595', // 亚洲龙
        headerObj: {
          type: 'presell',
          productId: '12595',
          cardVoucherId: '-1'
        }
      }
    },
    head() {
      return {
        title: '一汽丰田官方商城',
        meta: [ // seo
          { hid: 'keywords', name: 'keywords', content: '' },
          { hid: 'description', name: 'description', content: '' }
        ]
      }
    },
    data() {
      return {
        productObj: {}, // 商品信息
        modelDisplay: {
          proImageUrl: '',
          proDetail: []
        },
        mediaParams: {}
      }
    },
    mounted() {
      let t = this
      if (t.$util.Params.query('pa_usercode')) {
        t.$store.dispatch('getUserCode', {
          uniqueUserId: t.$util.Params.query('pa_usercode'),
          utmSource: t.$util.Params.query('origin')
        })
      }
      let uniqueUserId = t.$util.Params.query('pa_usercode') || ''
      let origin = t.$util.Params.query('origin') || ''
      let utmContent = t.$util.Params.query('utm_ontent') || ''
      let utmCampaign = t.$util.Params.query('utm_campaign') || ''
      if (uniqueUserId) {
        console.log('uniqueUserId:>', uniqueUserId)
        t.$cache.uniqueUserId.set(uniqueUserId) // 存储优惠码
      }
      if (origin) {
        console.log('origin:>', origin)
        t.$cache.origin.set(origin) // 存储来源
      }
      if (utmContent) {
        console.log('utmContent:>', utmContent)
        t.$cache.utmContent.set(utmContent)
      }
      if (utmCampaign) {
        console.log('utmCampaign:>', utmCampaign)
        t.$cache.utmCampaign.set(utmCampaign)
      }
      t.queryProductDetail() // 获取商品详情信息

      setTimeout(() => {
        t.$util.win.goTop() // 回到顶部
      }, 400)
    },
    methods: {
      // 获取商品详情信息
      queryProductDetail() {
        let t = this
        Request.queryProductDetail('', t.productId).then(result => {
          if (result.success) {
            // console.log('result:>', result)
            let obj = result.data || {}
            obj['proImageUrl'] = obj.proImageUrl || ''
            obj['proDetailImageUrlList'] = obj.proDetailImageUrlList || []
            t.modelDisplay = {
              proImageUrl: obj.proImageUrl || '',
              proDetail: obj.proDetailImageUrlList
            }
            obj['detailInfo'] = obj.detailInfo || ''
            obj.detailInfo = ((html) => {
              let newContent = html.replace(/<img[^>]*>/gi, function (match, capture) {
                // eslint-disable-next-line no-useless-escape
                return match.replace(/style=\"(.*)\"/gi, 'class="img-responsive"')
              })
              return newContent
            })(obj.detailInfo)
            t.productObj = obj
            t.headerObj.cardVoucherId = obj.cardVoucherId
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  //noinspection CssUnknownTarget
  @import "~/assets/sass/pages/presell/index.scss";
</style>
