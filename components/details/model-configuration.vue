<template>
  <!--车型配置-->
  <div class="model-configuration">
    <!--360度展示-->
    <div class="show-360">

      <!--展示区域-->
      <div v-if="threesixtyShow" id="container" class="view-360">
        <threesixty :options="currentPic"></threesixty>
      </div>

      <!--选项-->
      <div v-if="false" class="select-cads bm-box bm-box-horizontal bm-box-vertical-center">
        <div class="bm-flex select-item active">
          <div class="pic-label">
            <img src="~/assets/images/commodity_details/car_pic_1.png"/>
            <p>2.5L自然吸气</p>
          </div>
        </div>
        <div class="bm-flex select-item">
          <div class="pic-label">
            <img src="~/assets/images/commodity_details/car_pic_2.png"/>
            <p>2.5LHEV</p>
          </div>
        </div>
      </div>
      <!--轮播选项卡-->
      <div v-else class="color-carouser">
        <div class="swiper" v-swiper:swiper="swiperOption">
          <div class="swiper-wrapper">
            <!-- slides -->
            <div class="swiper-slide">
              <div class="select-cads bm-box bm-box-horizontal bm-box-vertical-center">
                <div class="bm-flex select-item active">
                  <div class="pic-label">
                    <img src="~/assets/images/commodity_details/car_pic_1.png"/>
                    <p>2.5L自然吸气</p>
                  </div>
                </div>
                <div class="bm-flex select-item">
                  <div class="pic-label">
                    <img src="~/assets/images/commodity_details/car_pic_2.png"/>
                    <p>2.5LHEV</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="swiper-slide">
              <div class="select-cads bm-box bm-box-horizontal bm-box-vertical-center">
                <div class="bm-flex select-item active">
                  <div class="pic-label">
                    <img src="~/assets/images/commodity_details/car_pic_1.png"/>
                    <p>2.5L自然吸气</p>
                  </div>
                </div>
                <div class="bm-flex select-item">
                  <div class="pic-label">
                    <img src="~/assets/images/commodity_details/car_pic_2.png"/>
                    <p>2.5LHEV</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Optional controls -->
        <div class="swiper-button-prev iconfont icon-prev"></div>
        <div class="swiper-button-next iconfont icon-next"></div>
      </div>
    </div>
    <!--操作区-->
    <!--<div class="operation-group bm-box bm-box-horizontal bm-box-vertical-center">-->
    <!--<div class="bm-flex price">总价：<span>253,800元</span></div>-->
    <!--<div class="op-btn"><i class="iconfont icon-next-step"></i>外观颜色</div>-->
    <!--</div>-->
  </div>
</template>

<script>
  import threesixty from '~/components/common/threesixty.vue'

  export default {
    components: {
      threesixty
    },
    props: {
      'options': {
        type: Object,
        default: () => { // 不传参数时使用默认值
          // 默认值
          return {}
        }
      }
    },
    data () {
      return {
        // 轮播
        swiperOption: {
          // centeredSlides: true,
          // notNextTick: true,
          // 设定初始化时slide的索引
          initialSlide: 0,
          // 设置轮播
          // effect: 'flip', // slide
          // 滑动速度
          speed: 800,
          // 左右点击
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          }
        },
        threesixtyShow: false,
        currentPic: {
          accurl: '/modules/threesixty/images/car',
          img_url: '',
          id: '01',
          value: '',
          num: 1
        }
      }
    },
    mounted () {
      this.threesixtyShow = true
    }
  }
</script>
<style lang="scss">
  @import './sass/model-configuration';
</style>
