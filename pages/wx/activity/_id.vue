<template>
  <!--活动详情页-->
  <div class="activity-container">
    <!--头部-->
    <div class="activity-header bm-box bm-box-horizontal bm-box-vertical-center">
      <div @click="doBack" class="header-left"><i class="iconfont icon-back"></i></div>
      <div class="bm-flex header-title">活动详情</div>
      <div class="header-right"></div>
    </div>

    <!--内容区-->
    <div class="activity-content">
      <img src="~/assets/images/activity_details/banner.png"/>
      <img src="~/assets/images/activity_details/activity_details.png"/>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'activity',
    asyncData (context) { // async await
      return {
        activityId: context.params.id
      }
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
      // 返回
      doBack () {
        this.$router.replace('/wx/help')
      }
    }
  }
</script>
<style lang="scss">
  //noinspection CssUnknownTarget
  @import '~/assets/sass/pages/activity/index.scss';
</style>
