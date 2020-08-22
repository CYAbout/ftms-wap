<template>
  <div class="sales-container">
    <!--活动首图-->
    <mt-swipe class="activity-swipe" :auto="4000">
      <mt-swipe-item v-for="(obj, index) in cardActivityList" :key="index">
        <a :href="obj.linkUrl || obj.picHrefUrl">
          <img :src="obj.mPic">
        </a>
      </mt-swipe-item>
      <!--<mt-swipe-item><img src="~/assets/images/home/banner.png"/></mt-swipe-item>-->
      <!--<mt-swipe-item><img src="~/assets/images/home/banner.png"/></mt-swipe-item>-->
    </mt-swipe>

    <!--促销商品-->
    <promotion :options="newCarList"></promotion>
  </div>
</template>

<script>
import Request from '~/plugins/request'
import promotion from '~/components/sales/promotion.vue'

export default {
  name: 'home',
  components: {
    promotion
  },
  head() {
    return {}
  },
  data() {
    return {
      // 卡券活动相关信息
      cardActivityList: {},
      // 卡券列表信息
      newCarList: {
        code: '',
        msg: '',
        data: []
      }
    }
  },
  mounted() {
    // 获取卡券活动信息
    this.queryCardActivity()
  },
  methods: {
    // 获取卡券活动信息
    queryCardActivity() {
      let t = this
      Request.queryCardActivity({}).then(result => {
        if (result.success) {
          let obj = result.data || ''
          console.log(obj)
          t.cardActivityList = obj
          // 用活动id获取卡券列表
          // this.getCardList(t.cardActivityList.aid)
          this.getCardList('1')
        }
      })
    },
    // 获取卡券列表
    getCardList(id, callback) {
      let t = this
      Request.cardList('', id).then(result => {
        if (result.success) {
          let obj = result || ''
          t.newCarList = {
            code: obj.code || '',
            msg: obj.msg || '',
            data: obj.data
          }
        }
      })
    }
  },
  computed: {}
}
</script>
<style lang="scss">
//noinspection CssUnknownTarget
@import "~/assets/sass/pages/sales/index.scss";
</style>

