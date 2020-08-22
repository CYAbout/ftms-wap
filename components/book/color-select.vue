<template>
  <!--外观 内饰-->
  <div class="color-select">
    <!--外观 内饰展示-->
    <div class="show-interior">
      <div class="main-pic">
        <!--<p>{{diei}}</p>-->
        <img
          :src="selected.attrBigImg"
          @touchstart.prevent="mouseHandler"
          @touchend.prevent="mouseHandler"
          @touchmove.prevent="mouseHandler"
        >
        <!-- <img @click="shadowimg"  :class="shadow?'shadow-show':'shadow-hide'" src="../../assets/images/car_sale/shadow_03.png" alt=""> -->
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
                    <!--<img src="~/assets/images/commodity_details/red_black.png"/>-->
                    <img :src="item.attrTagUrl">
                    <!--<p>{{item.attributeValueName}}</p>-->
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
      <!--<div class="bm-flex price">总价：<span>{{options.ecPrice | fMoney}}元</span></div>-->
      <div class="bm-flex"></div>
      <div v-if="!options.isLast" @click="toNext" class="op-btn">
        <i class="iconfont icon-next-step"></i>
        {{options.btnNext}}
      </div>
      <div v-else class="op-btn1">
        <span class="warning-text">注: 此颜色仅限部分车型</span>
        <div v-show="true" v-if="userObj.logined" @click="insertCollect" class="wishlists-btn">
          <i class="iconfont icon-collection"></i>加入心愿单
        </div>
        <div v-show="true" v-else @click="toMatch" class="wishlists-btn">
          <i class="iconfont icon-collection"></i>加入心愿单
        </div>
        <div v-show="true" @click="toMatch" class="media_order">
          <i class="iconfont icon-shopping-cart"></i>即刻订购
        </div>
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
                        <!--<img src="~/assets/images/commodity_details/red_black.png"/>-->
                        <img :src="item.attrTagUrl">
                        <!--<p>{{item.attributeValueName}}</p>-->
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
import { mapState } from 'vuex'

export default {
  props: {
    'options': {
      type: Object,
      default: () => { // 不传参数时使用默认值
        // 默认值
        return {}
      }
    },
    'goods': {
      type: Object,
      default: () => { // 不传参数时使用默认值
        // 默认值
        return {}
      }
    },
    'diei': {}
  },
  data() {
    return {
      fullPopupShow: false,
      login: false,
      popupContentHeight: 1234,
      shadow: true,
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
      },
      selectedImg: false,
      offsetX: 0,
      selectedImgIndex: 0,
      selectedImgList: [],
      imgCache: {}
    }
  },
  mounted() {
    let t = this
    t.selectedImgList = t.diei
    t.preloadImages('t1', t.selectedImgList)
    if (!t.userObj.logined) { // 获取登录信息
      let userObj = t.$common.getUserInfo() || ''
      if (userObj === '') {
        userObj = t.$common.getUnLoginData()
      }
      if (!userObj.logined) { // 未登录
        t.$common.clearUserInfo()
      } else {
        // 异步调用
        (async () => {
          try {
            await t.$store.dispatch('doLogin', userObj)
            console.log('userObj:>', t.userObj)
            t.getOrderDetail() // 获取订单详情
          } catch (error) {
            console.log(error)
          }
        })()
      }
    }
    // eslint-disable-next-line no-undef
    t.attributeList = $.extend(true, [], t.options.selectAttr)
    if (t.attributeList.length > 0) {
      _.each(t.attributeList, (attr, i) => {
        _.each(attr, (item, j) => {
          // console.log(3)
          // console.log(item)
          // console.log(3)
          if (i === 0 && j === 0) {
            item.active = true
            t.selected = item
            // t.selectedImgList=item.
            // t.selected.attrBigImg = t.attributeImg[3]
            // console.log(3)
            // console.log(t.selected)
            // console.log(3)
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
  computed: {
    ...mapState({ // 映射
      userObj: state => state.user.user
    })
  },
  methods: {
    // 图片缓存
    preloadImages(key, imgList) {
      const imgs = []
      for (let imgUrl of imgList) {
        const img = new Image()
        img.src = imgUrl
        imgs.push(img)
      }
      this.imgCache[key] = imgs
    },
    // 重设弹出层高度
    resetFullPopupHeight() {
      let t = this
      let pageHeight = t.$util.View.height
      // eslint-disable-next-line no-undef
      let headHeight = $('.common-header').height() || 0
      t.popupContentHeight = pageHeight - headHeight // 弹出层内容区高度

      console.log('pageHeight:>', pageHeight)
      console.log('headH:>', headHeight)
    },
    // 选择属性
    doSelectAttr(obj) {
      let t = this
      if (t.attributeList.length > 0) {
        _.each(t.attributeList, (attr, i) => {
          _.each(attr, (item, j) => {
            // console.log(4)
            // console.log(attr)
            // console.log(4)
            if (obj.attributeValueId === item.attributeValueId) {
              item.active = true
              t.selected = item
              // console.log(3)
              // console.log(3)
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
    // 跳转选配下一项
    toNext() {
      let t = this
      t.$emit('next', {
        sort: t.options.sort + 1
      })
    },
    // 跳转选配订单
    toMatch() {
      let t = this
      if (!t.userObj.logined) { // 未登录
        t.$common.clearUserInfo()
        t.$messageBox.confirm('登录后才能订购，是否登录?').then(action => {
          document.documentElement.scrollTop ? document.documentElement.scrollTop = 0 : document.body.scrollTop = 0
          t.syncLoadLayer({
            type: 'login',
            show: true
          })
        }, cancle => {
          document.documentElement.scrollTop ? document.documentElement.scrollTop = 0 : document.body.scrollTop = 0
        })
      } else {
        t.userObj = t.$common.getUserInfo() || ''
        t.$store.dispatch('getUserInfo', t.userObj.data)
        // eslint-disable-next-line no-undef
        let goods = $.extend(true, {}, t.goods)
        goods['productId'] = t.options.productId
        t.$cache.goods.set(t.$util.Str.jsonToStr(goods))
        t.$router.push('/wx/book/match')
      }
    },
    // 加入心愿单
    insertCollect() {
      let t = this
      if (!t.userObj.logined) { // 未登录
        t.$common.clearUserInfo()
        t.$messageBox.confirm('登录后才能订购，是否登录?').then(action => {
          document.documentElement.scrollTop ? document.documentElement.scrollTop = 0 : document.body.scrollTop = 0
          t.syncLoadLayer({
            type: 'login',
            show: true
          })
        }, cancle => {
          document.documentElement.scrollTop ? document.documentElement.scrollTop = 0 : document.body.scrollTop = 0
        })
      } else {
        t.$emit('insertCollect')
      }
    },
    mouseHandler(e) { // 鼠标事件
      // console.log(e)
      if (e.type === 'touchstart') {
        this.selectedImg = true
        this.offsetX = e.touches[0].pageX
      } else if (e.type === 'touchmove') {
        if (!this.selectedImg) return
        const endX = e.changedTouches[0].pageX
        this.selectedImgIndex = this.diei.indexOf(this.selected.attrBigImg)
        if (endX - this.offsetX < 0) {
          if (this.selectedImgIndex + 1 > this.diei.length - 1) {
            this.selectedImgIndex = 0
          } else {
            this.selectedImgIndex++
          }
          this.selected.attrBigImg = this.diei[this.selectedImgIndex]
          this.offsetX = endX
        } else if (endX - this.offsetX > 0) {
          if (this.selectedImgIndex - 1 < 0) {
            this.selectedImgIndex = this.diei.length - 1
          } else {
            this.selectedImgIndex--
          }
          this.selected.attrBigImg = this.diei[this.selectedImgIndex]
          this.offsetX = endX
        }
      } else if (e.type === 'touchend') {
        this.selectedImg = false
        // this.preloadImages('t1', this.diei)
      }
    },
    shadowimg() {
      this.shadow = !this.shadow
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
@import "./sass/color-select";
</style>
