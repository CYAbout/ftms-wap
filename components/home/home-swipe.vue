<template>
  <!--广告轮播-->
  <mt-swipe class="home-swipe" :auto="4000">
    <mt-swipe-item v-for="(obj, index) in options" :key="index">
      <a :href="obj.linkUrl || obj.picHrefUrl">
        <img :src="obj.picUrl"/>
      </a>
    </mt-swipe-item>
    <!--<mt-swipe-item><img src="~/assets/images/home/banner.png"/></mt-swipe-item>-->
    <!--<mt-swipe-item><img src="~/assets/images/home/banner.png"/></mt-swipe-item>-->
  </mt-swipe>
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
    },
    mounted () {
      let t = this
      t.resetSwipeHeight() // 重设swipe高度

      // 监听屏幕大小变化
      window.onresize = () => {
        console.log('----resize----')
        t.resetSwipeHeight() // 重设swipe高度
      }
    },
    methods: {
      // 重设swipe高度
      resetSwipeHeight () {
        // let t = this
        // let pageHeight = t.$util.View.height
        // eslint-disable-next-line no-undef
        // let headHeight = $('.common-header').height() || 0
        // let swipeHeight = pageHeight - headHeight // 弹出层内容区高度

        // eslint-disable-next-line no-undef
        // $('.home-swipe').css({'height': swipeHeight + 'px'})

        // console.log('pageHeight:>', pageHeight)
        // console.log('swipeHeight:>', swipeHeight)
      }
    }
  }
</script>

<style lang="scss">
  @import './sass/home-swipe';
</style>
