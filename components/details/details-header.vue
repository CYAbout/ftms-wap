<template>
  <!--头部-->
  <div id="detailsHeader" class="details-header bm-box bm-box-horizontal bm-box-vertical-center">
    <!--style="position: fixed;z-index: 100;"-->
    <div @click="popMenuShow = !popMenuShow" class="bm-flex exhibition">
      车型展示
      <i class="iconfont" :class="popMenuShow? 'icon-up-min':'icon-down-min'"></i>
    </div>


    <!-- 威尔法不显示预约试驾按钮 -->
    <div v-if="options.productId !== 12597 && options.productId !== 12600 && options.productId !== 12601" @click="toDrive" class="test-drive-btn">
      <i class="iconfont icon-wheel"></i>预约试驾
    </div>
    <div v-if="options.productId == 12597 || options.productId == 12600 || options.productId == 12601" @click="toDrive" class="test-drive-btn test_zixun">
      <i class="iconfont icon_zixun"></i>预约咨询
    </div>
            <!-- <div @click="toDrive" v-if="options.type !== 'presell'" class="test-drive-btn">
              <i class="iconfont icon-wheel"></i>预约试驾
            </div> -->
            <!-- -------------- -->
    <!-- <div @click="toCuAvtive" v-if="options.cardVoucherId !== -1" class="test-drive-btn" style="margin: 0 0.15rem">
      <i class="iconfont icon-shopping-cart"></i>促销活动
    </div>-->




              <!-- <div @click="toBook" v-if="options.type === 'presell'" class="test-drive-btn">
                <i class="iconfont icon-shopping-cart"></i>即刻订购
              </div> -->
              <!-- ------------------- -->

    <!--下拉菜单-->
    <div v-show="popMenuShow" class="pop-menu bm-box bm-box-horizontal bm-box-vertical-center">
      <div @click="skipPage('an_model')" class="bm-flex menu-item">车型展示</div>
      <div @click="skipPage('an_bright')" class="bm-flex menu-item">车型亮点</div>
      <div
        v-if="options.configuration"
        @click="skipPage('an_configure')"
        class="bm-flex menu-item"
      >参数配置</div>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'
import { mapState } from 'vuex'
export default {
  props: {
    'options': {
      type: Object,
      default: () => { // 不传参数时使用默认值
        // 默认值
        return {
          type: 'presell',
          productId: '',
          configuration: true
        }
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
      popMenuShow: false,
      attributeList: [],
      selectedImgList: [],
      selected: {
        attrBigImg: ''
      },
      selectedImgIndex: 0,
      offsetX: 0
    }
  },
  mounted() {
    let t = this
    console.log(t.options)
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
            // t.getOrderDetail() // 获取订单详情
          } catch (error) {
            // console.log(error)
          }
        })()
      }
    }
  },
  computed: {
    ...mapState({ // 映射
      userObj: state => state.user.user
    })
  },
  methods: {
    // 订购
    toBook() {
      // const node = document.getElementById('detailsHeader')
      // document.getElementsByClassName('presell-container')[0].appendChild(node)
      // let t = this
      // t.$router.push('/wx/book/' + t.options.productId)
      window.location = '/wx/book/' + this.options.productId
    },
    toCuAvtive() {
      // const node = document.getElementById('detailsHeader')
      // document.getElementsByClassName('presell-container')[0].appendChild(node)
      // let t = this
      // t.$router.push('/wx/book/' + t.options.productId)

      // window.location = '/wx/sales/' + this.options.cardVoucherId
      window.location = '/wx/sales'
    },
    // 预约试驾
    toDrive() {
      let t = this
      // const node = document.getElementById('detailsHeader')
      // document.getElementsByClassName('details-container')[0].appendChild(node)
      if (!t.userObj.logined) { // 未登录
        t.$common.clearUserInfo()
        t.$messageBox.confirm('登录后才能试驾，是否登录?').then(action => {
          t.syncLoadLayer({
            type: 'login',
            show: true
          })
        }, cancle => {
        })
      } else {
        // eslint-disable-next-line no-undef
        let goods = $.extend(true, {}, t.goods)
        goods['productId'] = t.options.productId
        // console.log('goods:>', goods)
        t.$cache.goods.set(t.$util.Str.jsonToStr(goods))
        const productId = t.options.productId
        t.$router.push({ path: `/wx/appointment/${productId}`, query: { proCatalogId: t.options.proCatalogId, productId: t.options.productId } })
      }
    },
    // 跳转
    skipPage(id) {
      let t = this
      window.location.hash = '#' + id
      setTimeout(() => { // 清除hash
        t.$router.replace('')
      }, 600)
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
          // console.log('left')
          if (this.selectedImgIndex + 1 > this.diei.length - 1) {
            this.selectedImgIndex = 0
          } else {
            this.selectedImgIndex++
          }
          this.selected.attrBigImg = this.diei[this.selectedImgIndex]
          // console.log('this.selected.attrBigImg=', this.selected.attrBigImg)
          this.offsetX = endX
        } else if (endX - this.offsetX > 0) {
          // console.log('right')
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
    }
  },
  watch: {
    options(val) {
      if (val) {
        this.options.configuration = val.configuration
      }
    }
  }
}
</script>
<style lang="scss">
//noinspection CssUnknownTarget
@import "./sass/details-header.scss";
</style>
