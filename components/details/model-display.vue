<template>
  <div>
  <!-- 设置暗锚点 -->
  <div id="an_model" style="position: relative;top: -3.7rem;height: 0;overflow: hidden;"></div>
  <!--车型展示-->
  <div class="model-display" id="model">
    <h4 class="title">车型展示</h4>
    <!--<div v-show="options.proImageUrl" class="top-pic">-->
    <!--<img v-lazy="options.proImageUrl"/>-->
    <!--</div>-->
    <div v-show="options.proDetail.length>0" class="top-pic">
      <img :src="options.proDetail[0]"/>
    </div>
    <!--轮播-->
    <div class="model-carousel">
      <div class="swiper" v-swiper:swiper="swiperOption">
        <div class="swiper-wrapper">
          <!-- slides -->
          <!-- <div v-if="index !== 0 && index !== (options.proDetail.length - 1)" v-for="(item,index) in options.proDetail"
               :key="index" class="swiper-slide item">
            <img :src="item"/>
          </div> -->
          <div v-if="options.proDetail.length > 1 && index !== 0 && index < 3" v-for="(item,index) in options.proDetail"
               :key="index" class="swiper-slide item">
            <img :src="item"/>
          </div>
          <!--<div class="swiper-slide item">-->
          <!--<img src="~/assets/images/car_sale/image6.png"/>-->
          <!--</div>-->
          <!--<div class="swiper-slide item">-->
          <!--<img src="~/assets/images/car_sale/image7.png"/>-->
          <!--</div>-->
        </div>
      </div>
      <!-- Optional controls -->
      <!-- <div class="swiper-pagination"></div>
      <div class="swiper-button-prev iconfont icon-toleft"></div>
      <div class="swiper-button-next iconfont icon-toright"></div> -->
    </div>
    <!-- <div v-show="options.proDetail.length>0" class="bottom-pic">
      <img :src="options.proDetail[options.proDetail.length - 1]"/>
    </div> -->
    <div v-show="options.proDetail.length>3" class="bottom-pic">
      <img :src="options.proDetail[3]"/>
    </div>
    <!--<div v-show="options.proImageUrl" class="bottom-pic">-->
    <!--<img v-lazy="options.proImageUrl"/>-->
    <!--</div>-->
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
            proImageUrl: '',
            proDetail: []
          }
        }
      }
    },
    data () {
      return {
        swiperOption: {
          slidesPerView: 2,
          spaceBetween: 15,
          // centeredSlides: true,
          // notNextTick: true,
          // 循环
          // loop: true,
          // 设定初始化时slide的索引
          initialSlide: 0,
          // 自动播放
          // autoplay: true,
          // autoplay: {
          //     delay: 3000,
          //     stopOnLastSlide: false,
          //     disableOnInteraction: true,
          // },
          // 设置轮播
          // effect: 'flip', // slide
          // 滑动速度
          speed: 800,
          // 滑动方向
          // direction: 'horizontal',
          // 小手掌抓取滑动
          // grabCursor : true,
          // 滑动之后回调函数
          on: {
            slideChangeTransitionEnd: function () {
              // console.log(this.activeIndex) // 切换结束时，告诉我现在是第几个slide
            }
          },
          // 左右点击
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          },
          // 分页器设置
          pagination: {
            el: '.swiper-pagination',
            clickable: true
          }
        }
      }
    }
  }
</script>
<style lang="scss">
  //noinspection CssUnknownTarget
  @import './sass/model-display';
</style>
