<template>
  <!--车型配置-->
  <div class="version-select">
    <!--360度展示-->
    <div class="show-pic">
      <div class="main-pic">
        <img :src="selected.attrBigImg">
        <div class="pic-mask"></div>
        <div class="pic-tip">点击全屏观看全景效果更好哦！</div>
        <i @click="fullPopupShow = !fullPopupShow" class="full-btn iconfont icon-full-screen"></i>
      </div>

      <!--轮播选项卡-->
      <div class="color-carouser">
        <div class="swiper" v-swiper:swiper="swiperOption">
          <div class="swiper-wrapper">
            <!-- slides -->
            <div v-for="attr in attributeList" class="swiper-slide">
              <div class="select-cads bm-box bm-box-horizontal bm-box-vertical-center">
                <div
                  @click="doSelectAttr(item)"
                  v-for="item in attr"
                  class="bm-flex select-item"
                  :class="{'active': item.active}"
                >
                  <div class="pic-label">
                    <img :src="item.attrTagUrl">
                    <p>{{item.attributeValueName}}</p>
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

    <!--全屏-->
    <div class="full-popup">
      <mt-popup
        :class="fullPopupShow? 'full-width':''"
        v-model="fullPopupShow"
        position="right"
        popup-transition="popup-fade"
      >
        <div class="full-popup-content" :style="{'height': (popupContentHeight)+'px'}">
          <i @click="fullPopupShow = false" class="back-icon iconfont icon-back"></i>
          <img :src="selected.attrBigImg">

          <!--轮播选项卡-->
          <div class="color-carouser">
            <div class="swiper" v-swiper:swiper="swiperOption">
              <div class="swiper-wrapper">
                <!-- slides -->
                <div v-for="attr in attributeList" class="swiper-slide">
                  <div class="select-cads bm-box bm-box-horizontal bm-box-vertical-center">
                    <div
                      @click="doSelectAttr(item)"
                      v-for="item in attr"
                      class="bm-flex select-item"
                      :class="{'active': item.active}"
                    >
                      <div class="pic-label">
                        <img :src="item.attrTagUrl">
                        <p>{{item.attributeValueName}}</p>
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
      </mt-popup>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

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
  data() {
    return {
      fullPopupShow: false,
      popupContentHeight: 1234,
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
      attributeList: [],
      selected: {
        attrBigImg: ''
      }
    }
  },
  mounted() {
    let t = this
    // eslint-disable-next-line no-undef
    t.attributeList = $.extend(true, [], t.options.selectAttr)
    if (t.attributeList.length > 0) {
      _.each(t.attributeList, (attr, i) => {
        _.each(attr, (item, j) => {
          if (i === 0 && j === 0) {
            item.active = true
            t.selected = item
            t.$emit('selected', {
              sort: t.options.sort,
              obj: item
            })
          } else {
            item.active = false
          }
        })
      })
    }
  },
  methods: {
    // 重设弹出层高度
    resetFullPopupHeight() {
      let t = this
      let pageHeight = t.$util.View.height
      // eslint-disable-next-line no-undef
      let headHeight = $('.common-header').height() || 0
      t.popupContentHeight = pageHeight - headHeight // 弹出层内容区高度

      // console.log('pageHeight:>', pageHeight)
      // console.log('headH:>', headHeight)
    },
    // 选择属性
    doSelectAttr(obj) {
      let t = this
      if (t.attributeList.length > 0) {
        _.each(t.attributeList, (attr, i) => {
          _.each(attr, (item, j) => {
            if (obj.attributeValueId === item.attributeValueId) {
              item.active = true
              t.selected = item
              t.$emit('selected', {
                sort: t.options.sort,
                obj: item
              })
            } else {
              item.active = false
            }
          })
        })
      }
    }
  },
  watch: {
    // 监听右侧弹出层变化
    fullPopupShow(val) {
      if (val) {
        this.resetFullPopupHeight() // 重设弹出层高度
      }
    }
  }
}
</script>
<style lang="scss">
@import "./sass/version-select";
</style>
