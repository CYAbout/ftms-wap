<template>
  <!--外观颜色-->
  <div class="appearance-color">
    <!--360度展示-->
    <div class="show-360">

      <!--展示区域-->
      <div v-if="threesixtyShow" id="container" class="view-360">
        <threesixty :options="currentPic"></threesixty>
      </div>

      <!--轮播选项卡-->
      <div class="color-carouser">
        <div class="swiper" v-swiper:swiper="swiperOption">
          <div class="swiper-wrapper">
            <!-- slides -->
            <div class="swiper-slide">
              <div class="select-cads bm-box bm-box-horizontal bm-box-vertical-center">
                <div class="bm-flex select-item active">
                  <div class="pic-label">
                    <!--<img src="~/assets/images/commodity_details/red_black.png"/>-->
                    <img src="~/assets/images/commodity_details/red_black_selected.png"/>
                    <p>黑红</p>
                  </div>
                </div>
                <div class="bm-flex select-item">
                  <div class="pic-label">
                    <img src="~/assets/images/commodity_details/grey.png"/>
                    <!--<img src="~/assets/images/commodity_details/grey_selected.png"/>-->
                    <p>灰</p>
                  </div>
                </div>
                <div class="bm-flex select-item">
                  <div class="pic-label">
                    <img src="~/assets/images/commodity_details/blue.png"/>
                    <!--<img src="~/assets/images/commodity_details/blue_selected.png"/>-->
                    <p>蓝</p>
                  </div>
                </div>
                <div class="bm-flex select-item">
                  <div class="pic-label">
                    <img src="~/assets/images/commodity_details/midnight_black.png"/>
                    <!--<img src="~/assets/images/commodity_details/blue_selected.png"/>-->
                    <p>午夜黑</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="swiper-slide">
              <div class="select-cads bm-box bm-box-horizontal bm-box-vertical-center">
                <div class="bm-flex select-item active">
                  <div class="pic-label">
                    <!--<img src="~/assets/images/commodity_details/red_black.png"/>-->
                    <img src="~/assets/images/commodity_details/red_black_selected.png"/>
                    <p>黑红</p>
                  </div>
                </div>
                <div class="bm-flex select-item">
                  <div class="pic-label">
                    <img src="~/assets/images/commodity_details/grey.png"/>
                    <!--<img src="~/assets/images/commodity_details/grey_selected.png"/>-->
                    <p>灰</p>
                  </div>
                </div>
                <div class="bm-flex select-item">
                  <div class="pic-label">
                    <img src="~/assets/images/commodity_details/blue.png"/>
                    <!--<img src="~/assets/images/commodity_details/blue_selected.png"/>-->
                    <p>蓝</p>
                  </div>
                </div>
                <div class="bm-flex select-item">
                  <div class="pic-label">
                    <img src="~/assets/images/commodity_details/midnight_black.png"/>
                    <!--<img src="~/assets/images/commodity_details/blue_selected.png"/>-->
                    <p>午夜黑</p>
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
    <div class="operation-group bm-box bm-box-horizontal bm-box-vertical-center">
      <div class="bm-flex price">总价：<span>253,800元</span></div>
      <div class="op-btn"><i class="iconfont icon-next-step"></i>配置内饰</div>
    </div>
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
        // 360展示
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
    beforeMount () {},
    mounted () {
      this.threesixtyShow = true
    },
    destroyed () {},
    computed: {},
    methods: {},
    filter: {},
    watch: {}
  }
</script>
<style lang="scss">
  @import './sass/appearance-color';
</style>
