<template>
  <!--火热活动-->
  <div class="hot-activity">
    <h4 class="title">火热活动</h4>
    <div class="activity-content">
      <!-- /activity/001 -->
      <a class="_link" v-for="(obj, index) in options" :key="index" :href="obj.linkUrl || obj.picHrefUrl">
        <img class="activity-item" :src="obj.picUrl"/>
      </a>
      <!--<nuxt-link class="_link" to="/wx/activity/001">-->
      <!--<img class="activity-item" src="~/assets/images/home/activity_pic_1.png"/>-->
      <!--</nuxt-link>-->
      <!--<nuxt-link class="_link" to="/wx/activity/001">-->
      <!--<img class="activity-item" src="~/assets/images/home/activity_pic_2.png"/>-->
      <!--</nuxt-link>-->
      <!--<nuxt-link class="_link" to="/wx/activity/001">-->
      <!--<img class="activity-item" src="~/assets/images/home/activity_pic_3.png"/>-->
      <!--</nuxt-link>-->
      <!--<nuxt-link class="_link" to="/wx/activity/001">-->
      <!--<img class="activity-item" src="~/assets/images/home/activity_pic_4.png"/>-->
      <!--</nuxt-link>-->
      <!--<nuxt-link class="_link" to="/wx/activity/001">-->
      <!--<img class="activity-item" src="~/assets/images/home/activity_pic_5.png"/>-->
      <!--</nuxt-link>-->
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      'options': {
        type: Array,
        default: () => { // 不传参数时使用默认值
          // 默认值
          return []
        }
      }
    }
  }
</script>
<style lang="scss">
  @import './sass/hot-activity';
</style>
