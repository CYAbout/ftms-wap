<template>
  <!--车型配置-->
  <div class="version-select content">
    <div
      v-show="!canvasCancel"
      class="matchings in"
      id="matchings"
      style="position: relative; overflow: hidden;width:100%;"
    ></div>
    <div class="left">
      <div>
        <!-- title -->
        <div class="matching in">车型配置</div>
        <!-- 车型选择 -->
        <div class="color">外观颜色</div>
        <!-- 外观颜色选择 -->
        <div class="decoration">内饰颜色</div>
        <!-- 颜内饰颜色选择 -->
      </div>
    </div>
    <div class="foot">
      <div class="prve"></div>
      <div class="btn1 in"></div>
      <div class="btn2"></div>
    </div>
    <!-- 竖屏状态下显示，提示请横向放手机 -->
    <div class="hengping">
      <img src="../../assets/images/car_sale/mobile-7.png" class="img1">
      <img src="../../assets/images/car_sale/mobile-8.png" class="img2">
    </div>

    <!-- 横屏状态下显示，提示请竖向放手机 -->
    <div class="tui-hengping in">
      <img src="../../assets/images/car_sale/mobile-9.png" class="img1">
    </div>
    <!--360度展示-->
    <div class="show-pic" v-show="canvasCancel">
      <div class="main-pic">
        <img
          :src="selected.attrBigImg"
          @touchstart.prevent="mouseHandler"
          @touchend.prevent="mouseHandler"
          @touchmove.prevent="mouseHandler"
        >
        <img
          @click="shadowimg"
          :class="shadow?'shadow-show':'shadow-hide'"
          src="../../assets/images/car_sale/shadow_03.png"
          alt
        >
        <div class="pic-mask"></div>
        <div class="pic-tip">点击全屏观看全景效果更好哦！</div>
        <i @click="fullPopupShow = !fullPopupShow" class="full-btn iconfont icon-full-screen"></i>
      </div>
      <!--轮播选项卡-->
      <div class="color-carouser">
        <div class="swiper" v-swiper:swiper="swiperOption">
          <div class="swiper-wrapper">
            <div v-for="attr in attributeList" class="swiper-slide">
              <div class="select-cads bm-box bm-box-horizontal bm-box-vertical-center">
                <div
                  @click="doSelectAttr(item)"
                  v-for="item in attr"
                  class="bm-flex select-item"
                  :class="{'active': item.active}"
                >
                  <div class="pic-label">
                    <!-- <img :src="item.attrTagUrl"> -->
                    <p>{{item.attributeValueName}}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--操作区-->
    <div class="operation-group bm-box bm-box-horizontal bm-box-vertical-center">
      <!--<div class="bm-flex price">总价：<span>{{options.ecPrice | fMoney}}元</span></div>-->
      <!--<div @click="toNext" class="op-btn"><i class="iconfont icon-next-step"></i>{{options.btnNext}}</div>-->
      <div class="bm-flex"></div>
      <div v-show="!canvasCancel && btnNext==='即刻订购'" class="op-btn1">
        <span class="warning-text">注: 此颜色仅限部分车型</span>
        <div v-show="true" v-if="userObj.logined" @click="insertCollect" class="wishlists-btn">
          <i class="iconfont icon-collection"></i>加入心愿单
        </div>
        <div v-show="true" v-else @click="toMatch" class="wishlists-btn">
          <i class="iconfont icon-collection"></i>加入心愿单
        </div>
        <div v-show="true" @click="toNext" class="media_order">
          <i class="iconfont icon-shopping-cart"></i>即刻订购
        </div>
      </div>
      <div class="pre-step" @click="pre">
        <i class="icon-prev-step"></i>上一步
      </div>
      <div v-show="!options.isLast && btnNext !== '即刻订购'" @click="toNext" class="op-btn">
        <i class="iconfont icon-next-step"></i>
        <span>{{!canvasCancel ? btnNext || '外观颜色' : options.btnNext}}</span>
      </div>
      <!-- <div v-else @click="toMatch" class="op-btn">
        <i class="iconfont icon-shopping-cart"></i>即刻订购
      </div>-->
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
                        <!-- <img :src="item.attrTagUrl"> -->
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
    'diei': {},
    'attributes': {
      type: Array,
      default: () => {
        return []
      }
    },
    'carType': {
      type: String,
      default: () => {
        return ''
      }
    },
    'btnNext': {
      type: String,
      default: '外观颜色'
    },
    'setCanvas': {
      type: Function,
      default: () => {
        return () => { }
      }
    },
    'step': {
      type: Number,
      default: () => {
        return 1
      }
    }
  },
  data() {
    return {
      fullPopupShow: false,
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
      imgCache: {},
      // step: this.props.step,
      canvasCancel: false,
      mainUrl: ''
    }
  },
  mounted() {
    let t = this
    const basePath = process.env.server
    const mainUrl = basePath.mainUrl
    t.mainUrl = mainUrl
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
            // console.log('userObj:>', t.userObj)
          } catch (error) {
            // console.log(error)
          }
        })()
      }
    }
    // eslint-disable-next-line no-undef
    t.attributeList = $.extend(true, [], t.options.selectAttr)
    // console.log(6)
    // console.log(t.attributeList)
    // console.log(4)
    // console.log(7)
    // console.log(t.options)
    // console.log(8)
    if (t.attributeList.length > 0) {
      _.each(t.attributeList, (attr, i) => {
        _.each(attr, (item, j) => {
          if (i === 0 && j === 0) {
            item.active = true
            t.selected = item
            // console.log(6)
            // console.log(JSON.stringify(t.selected))
            // console.log(4)
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
    // 3d
    if (!this.canvasCancel) {
      this.initCanvas(this.carType, mainUrl, t)
    }
  },
  computed: {
    ...mapState({ // 映射
      userObj: state => state.user.user
    })
  },
  destroyed() {
    window.initCanvas = null
    if (window.lastApp) {
      window.DESTROY_APP(window.lastApp)
      window.lastApp = null
      window.app = null
      window.RESET_CAR_CAMERA = null
    }
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
              // console.log(1)
              // console.log(t.selected)
              // console.log(4)
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
    pre() {
      let t = this
      if (t.canvasCancel) {
        t.$emit('next', {
          sort: t.options.sort + 1
        })
      } else {
        const step = window.currentStep
        const nextStep = step - 1
        window.currentStep = nextStep
        t.step = step
        window.UI_CONTRO_CANVAS(nextStep - 1)
        if (nextStep === 1) {
          // eslint-disable-next-line no-undef
          $('.pre-step').removeClass('in')
          // eslint-disable-next-line no-undef
          $('.op-btn span').html('外观颜色')
          // eslint-disable-next-line no-undef
          $('.step-title').text('车型配置')
        }
      }
    },
    // 跳转选配下一项
    toNext() {
      let t = this
      if (t.canvasCancel) {
        t.$emit('next', {
          sort: t.options.sort + 1
        })
      } else {
        const step = window.currentStep // this.step
        t.step = step
        // this.step = step + 1
        const nextStep = step + 1 > 3 ? 3 : step + 1
        console.log('xxx==', nextStep)
        window.currentStep = nextStep
        // eslint-disable-next-line no-undef
        $('.content .left>div>div').eq(nextStep - 1).addClass('in').siblings().removeClass('in')
        if (nextStep === 2) {
          // eslint-disable-next-line no-undef
          $('.foot .btn1').removeClass('in')
          // eslint-disable-next-line no-undef
          $('.foot .btn2').addClass('in')
          // eslint-disable-next-line no-undef
          $('.foot .prve').addClass('in')
          // eslint-disable-next-line no-undef
          $('.pre-step').addClass('in')
          // eslint-disable-next-line no-undef
          $('.op-btn span').text('内饰颜色')
          // eslint-disable-next-line no-undef
          $('.step-title').text('外观颜色')
        } else if (nextStep === 3) {
          // eslint-disable-next-line no-undef
          $('.foot .btn1').removeClass('in')
          // eslint-disable-next-line no-undef
          $('.foot .btn2').removeClass('in')
          // eslint-disable-next-line no-undef
          $('.foot .prve').addClass('in')
          // eslint-disable-next-line no-undef
          $('.op-btn span').text('即刻订购')
          // eslint-disable-next-line no-undef
          $('.bm-box .op-btn1').show()
          // eslint-disable-next-line no-undef
          $('.bm-box .op-btn').hide()
          // eslint-disable-next-line no-undef
          $('.pre-step').removeClass('in')
          // eslint-disable-next-line no-undef
          $('.step-title').text('内饰颜色')
        } else {
          // eslint-disable-next-line no-undef
          $('.pre-step').removeClass('in')
          // eslint-disable-next-line no-undef
          $('.step-title').text('车型配置')
        }
        t.$emit('next', {
          sort: nextStep,
          step: nextStep
        })
        if (step + 1 >= 4) {
          // 添加所有选中
          const selecctType = this.attributes[0].attributeValue[window.CAR_ID]
          const selecctColor = this.attributes[1].attributeValue[window.CAR_COLOR_ID]
          const selecctInner = this.attributes[2].attributeValue[window.CAR_INNER_ID]
          t.$emit('selected', {
            sort: 1,
            obj: selecctType
          })
          t.$emit('selected', {
            sort: 2,
            obj: selecctColor
          })
          t.$emit('selected', {
            sort: 3,
            obj: selecctInner
          })
          setTimeout(() => {
            t.toMatch()
          }, 100)
        } else {
          window.UI_CONTRO_CANVAS(nextStep - 1 > 2 ? 3 : nextStep - 1)
        }
      }
    },
    // 跳转选配订单
    toMatch() {
      let t = this
      if (!t.userObj.logined) {
        // 未登录
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
        // eslint-disable-next-line no-undef
        let goods = $.extend(true, {}, t.goods)
        goods['productId'] = t.options.productId
        console.log('goods:>', goods)
        t.$cache.goods.set(t.$util.Str.jsonToStr(goods))
        t.$router.push('/wx/book/match')
      }
    },
    mouseHandler(e) { // 鼠标事件
      // console.log(e)
      const t = this
      if (e.type === 'touchstart') {
        this.selectedImg = true
        this.offsetX = e.touches[0].pageX
      } else if (e.type === 'touchmove') {
        if (!this.selectedImg) return
        const endX = e.changedTouches[0].pageX
        this.selectedImgIndex = this.selectedImgList.indexOf(this.selected.attrBigImg)
        if (endX - this.offsetX < 0) {
          // 左
          if (this.selectedImgIndex + 1 > this.selectedImgList.length - 1) {
            this.selectedImgIndex = 0
          } else {
            this.selectedImgIndex++
          }
          setTimeout(() => {
            t.selected.attrBigImg = t.selectedImgList[t.selectedImgIndex]
            t.offsetX = endX
            console.log('t.selected.attrBigImg=', t.selected.attrBigImg)
          }, 0)
        } else if (endX - this.offsetX > 0) {
          // 右
          if (this.selectedImgIndex - 1 < 0) {
            this.selectedImgIndex = this.selectedImgList.length - 1
          } else {
            this.selectedImgIndex--
          }
          this.selected.attrBigImg = this.selectedImgList[this.selectedImgIndex]
          this.offsetX = endX
        }
      } else if (e.type === 'touchend') {
        this.selectedImg = false
        // this.preloadImages('t1', this.selectedImgList)
      }
    },
    shadowimg() {
      this.shadow = !this.shadow
    },
    initCanvas(carType) {
      const t = this
      if (!window.initCanvas) {
        window.location.reload()
        return
      }
      window.initCanvas(carType, t.mainUrl)
      window.NOT_SUPPORT_CANVAS = function () {
        t.canvasCancel = true
        t.$emit('setCanvas', {
          canvasCancel: true
        })
      }
      window.CAR_TYPE_NAME = function (e) {
        // 选择车型时执行：0：混动版   1：汽油版
        // const { attribute } = _this.state;
        // const firstText = attribute[0].attributeValue[e].attributeValueName;
        // _this.setState({ firstText });
        const selecctType = t.attributes[0].attributeValue[window.CAR_ID]
        t.$emit('selected', {
          sort: 1,
          obj: selecctType
        })
      }
      window.lastApp = window.CANVAS_PLAY(t.carType)
      window.UI_CONTRO_CANVAS('addUi', carType)
      window.UI_CONTRO_CANVAS(0, carType)
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
