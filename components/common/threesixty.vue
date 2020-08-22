<template lang="html">
  <!-- 360图片展示 -->
  <div class="threesixty product" :class="'product_' + options.id">
    <div class="spinner">
      <span>100%</span>
    </div>
    <ol class="threesixty_images"></ol>
  </div>
</template>

<script>
  export default {
    props: {
      'options': { // 图片路径
        type: Object,
        default: () => {
          return {
            num: 0,
            accurl: '',
            id: ''
          }
        }
      }
    },
    data () {
      return {
        product: null
      }
    },
    mounted () {
      let t = this
      // eslint-disable-next-line no-undef
      $(document).ready(() => {
        t.init360()
      })
    },
    destroyed () {
      this.product = null
    },
    methods: {
      // 初始化
      init360 () {
        let t = this
        // console.log(t.$util.View.width)
        // console.log('360:>', t.options.accurl)
        // console.log('img_url:>', t.options.img_url)
        // eslint-disable-next-line no-undef
        t.product = $('.product_' + t.options.id).ThreeSixty({
          totalFrames: t.options.num, // 52
          endFrame: 30,
          currentFrame: 1,
          imgList: '.threesixty_images',
          progress: '.spinner',
          imagePath: t.options.accurl + '/', // '/threesixty/images/car/',
          filePrefix: '',
          ext: '.png',
          // height: 304,
          // width: t.$util.View.width - 90,
          navigation: true,
          disableSpin: false
        })
      }
    }
  }
</script>
<style lang="scss">
  @import './sass/threesixty';
</style>
