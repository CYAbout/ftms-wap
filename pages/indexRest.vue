<template>
  <div class="home-container">
    <!--广告轮播-->
    <home-swipe :options="swipeList"></home-swipe>

    <!--预售-->
    <home-presell :options="newCarList"></home-presell>

    <!--明星车型-->
    <star-model></star-model>

    <!--火热活动-->
    <hot-activity :options="activityList"></hot-activity>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import homeSwipe from '~/components/home/home-swipe.vue'
import homePresell from '~/components/home/home-presell.vue'
import starModel from '~/components/home/star-model.vue'
import hotActivity from '~/components/home/hot-activity.vue'

export default {
  name: 'index',
  components: {
    homeSwipe,
    homePresell,
    starModel,
    hotActivity
  },
  head() {
    return {
      title: '一汽丰田官方商城',
      meta: [
        // seo
        { hid: 'keywords', name: 'keywords', content: '' },
        { hid: 'description', name: 'description', content: '' }
      ]
    }
  },
  beforeMount() {
    this.$router.replace('/wx')
  },
  mounted() {
    let t = this
    // 获取广告信息
    t.$store.dispatch('getAdvertisementList')
  },
  computed: {
    ...mapState({
      // 映射
      swipeList: state => state.home.swipeList,
      newCarList: state => state.home.newCarList,
      activityList: state => state.home.activityList
    })
  }
}
</script>
<style lang="scss">
//noinspection CssUnknownTarget
@import '~/assets/sass/pages/index.scss';
</style>

