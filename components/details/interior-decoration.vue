<template>
  <!--内饰-->
  <div class="interior-decoration">
    <!--内饰展示-->
    <div class="show-interior">
      <div class="main-pic">
        <img src="~/assets/images/commodity_details/interior_trim.png"/>
        <div class="pic-mask"></div>
        <div class="pic-tip">点击全屏观看全景效果更好哦！</div>
        <i @click="fullPopupShow = !fullPopupShow" class="full-btn iconfont icon-full-screen"></i>
      </div>

      <!--选项-->
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
      </div>
    </div>
    <!--操作区-->
    <!--<div class="operation-group bm-box bm-box-horizontal bm-box-vertical-center">-->
      <!--<div class="bm-flex price">总价：<span>253,800元</span></div>-->
      <!--<div @click="toMatch" class="op-btn"><i class="iconfont icon-shopping-cart"></i>即刻订购</div>-->
    <!--</div>-->

    <!--全屏-->
    <div class="full-popup">
      <mt-popup
        :class="fullPopupShow? 'full-width':''"
        v-model="fullPopupShow"
        position="right"
        popup-transition="popup-fade">
        <div class="full-popup-content" :style="{'height': (popupContentHeight)+'px'}">
          <i @click="fullPopupShow = false" class="back-icon iconfont icon-back"></i>
          <img src="~/assets/images/commodity_details/interior_full_screen.png"/>

          <!--选项-->
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
          </div>
        </div>
      </mt-popup>
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
          return {}
        }
      }
    },
    data () {
      return {
        fullPopupShow: false,
        popupContentHeight: 1234
      }
    },
    beforeMount () {},
    mounted () {},
    destroyed () {},
    computed: {},
    methods: {
      // 重设弹出层高度
      resetFullPopupHeight () {
        let t = this
        let pageHeight = t.$util.View.height
        // eslint-disable-next-line no-undef
        let headHeight = $('.common-header').height() || 0
        t.popupContentHeight = pageHeight - headHeight // 弹出层内容区高度

        // console.log('pageHeight:>', pageHeight)
        // console.log('headH:>', headHeight)
      },
      // 跳转选配订单
      toMatch () {
        this.$router.push('/wx/book/match')
      }
    },
    filter: {},
    watch: {
      // 监听右侧弹出层变化
      fullPopupShow (val) {
        if (val) {
          this.resetFullPopupHeight() // 重设弹出层高度
        }
      }
    }
  }
</script>
<style lang="scss">
  @import './sass/interior-decoration';
</style>
