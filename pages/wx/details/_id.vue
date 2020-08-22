<template>
    <!--商品详情页-->
    <div class="details-container">
        <!--头部-->
        <details-header :options="headerObj"></details-header>

        <!--选项卡-->
        <div v-if="false" class="tabs-header">
            <div class="tabs-content bm-box bm-box-horizontal bm-box-vertical-center">
                <div class="titles bm-flex">
                    <h4>{{productObj.productName}}</h4>
                    <p>选择配置，开始冒险吧！</p>
                </div>
                <!--零售价-->
                <div class="retail-price">
                    <h4>
                        ¥{{productObj.basePrice | fMoney}}
                        <span>起</span>
                    </h4>
                    <p>商家建议零售价</p>
                </div>
            </div>

            <!--选项卡-->
            <div class="tab-select bm-box bm-box-horizontal bm-box-vertical-center">
                <div
                        @click="sort = item.sort"
                        v-for="item in attribute"
                        class="bm-flex tab-item"
                        :class="{'active': sort === item.sort, 'center': (attribute.length >= 3 && item.sort >= 2 && item.sort < attribute.length), 'right':item.sort === attribute.length}"
                        :key="item.id"
                >
                    <div v-show="item.flag !== 'color'" class="tab-title">
                        <span>{{item.attributeName}}</span>
                    </div>
                </div>
            </div>
        </div>

        <!--内容区-->
        <div class="details-content">
            <template v-if="false" v-for="item in attribute">
                <div v-if="item.flag === 'version'" :key="item.id">
                    <version-select v-if="sort === item.sort" :options="item" @selected="doSelected"></version-select>
                </div>
                <div v-else :key="item.id">
                    <color-select v-if="sort === item.sort" :options="item" @selected="doSelected"></color-select>
                </div>
            </template>

            <!--主图-->
            <div class="maim-pic">
                <!--<img src="~/assets/images/car_sale/banner.png"/>-->
                <img :src="productObj.proImageUrl">
            </div>
            <div
                    v-show="(carType === 'yize' || carType === 'carolla' || carType === 'avalon') && !canvasCancel"
                    class="matchings detail in"
                    id="matchings"
                    style="position: relative; overflow: hidden;width:100%;"
            >
                <div class="chexing in" v-if="cartypeAvalon" @click="toggleShow(2)">车型选择</div>
                <div class="waiguan" :class="{in: !cartypeAvalon, left: cartypeAvalon}" @click="toggleShow(0)">外观颜色</div>
                <div class="neishi" :class="{left: cartypeAvalon}" @click="toggleShow(1)">内饰颜色</div>
            </div>
            <!-- 竖屏状态下显示，提示请横向放手机 -->
            <div class="hengping">
                <img src="../../../assets/images/car_sale/mobile-7.png" class="img1">
                <img src="../../../assets/images/car_sale/mobile-8.png" class="img2">
            </div>

            <!-- 横屏状态下显示，提示请竖向放手机 -->
            <div class="tui-hengping in">
                <img src="../../../assets/images/car_sale/mobile-9.png" class="img1">
            </div>
            <!--车型展示-->
            <model-display :options="modelDisplay"></model-display>

            <!--车型亮点-->
            <bright-points :options="productObj.phoneProductDesc"></bright-points>
            <!--参数配置-->
            <commodity-parameter :options="productObj"></commodity-parameter>
        </div>
        <!--提示框-->
        <prompt-layer :show="promptLayerShow" @close="doClose"></prompt-layer>
        <!-- 4.11活动按钮 -->
        <div v-if="floatBtn && iconShow" class="float_btn"  @click="goActive">
          <img style="width:100%;" src="~/assets/images/home/pop_float_wap.png"/>
        </div>
        <!--活动悬浮窗-->
        <div id="lucky"
          @mousedown="down($event)" @touchstart="down($event)"
          @mousemove="move($event)" @touchmove="move($event)"
          @mouseup="end($event)" @touchend="end($event)"
          class="" style="position: fixed;z-index: 1000;bottom:2rem;right: 0.01rem">
          <img @click="goLucky"  v-show="pickStage == '2' && productId == '12595'" style="width:2rem;height:2rem;" src="~/assets/images/top_bottom/activity520.png"/>
        </div>
    </div>
</template>

<script>
  import { mapState } from 'vuex'
  import _ from 'lodash'
  import Request from '~/plugins/request'
  import detailsHeader from '~/components/details/details-header.vue'
  import modelDisplay from '~/components/details/model-display.vue'
  import brightPoints from '~/components/details/bright-points.vue'
  import commodityParameter from '~/components/details/commodity-parameter.vue'

  import versionSelect from '~/components/details/version-select.vue'
  import colorSelect from '~/components/details/color-select.vue'

  import promptLayer from '~/components/common/layer/prompt.vue'

  export default {
    name: '',
    components: {
      versionSelect,
      colorSelect,
      promptLayer,
      detailsHeader,
      modelDisplay,
      brightPoints,
      commodityParameter
    },
    asyncData (context) { // async await
      const productId = context.params.id
      // const type = (productId === '12593' || productId === '12595') ? 'presell' : 'details'
      return {
        productId
        //   headerObj: {
        //     type,
        //     productId,
        //     proCatalogId
        //   }
      }
    },
    head () {
      return {
        title: '一汽丰田官方商城',
        meta: [ // seo
          { hid: 'keywords', name: 'keywords', content: '' },
          { hid: 'description', name: 'description', content: '' }
        ]
      }
    },
    data () {
      return {
        pickStage: 1, // 1代表活动未开始2代表活动进行中  3代表 活动已结束
        flags: false,
        position: { x: 0, y: 0 },
        nx: '',
        ny: '',
        dx: '',
        dy: '',
        xPum: '',
        yPum: '',
        tabType: 'model', // model -- 车型；trim -- 内饰；appearance -- 外观
        sort: 1,
        promptLayerShow: false,
        productName: '',
        productObj: {}, // 商品信息
        attribute: [],
        goodsList: [], // 单品列表  (暂时没用)
        selectedGoods: {}, // 选中单品 (暂时没用)
        modelDisplay: {
          proImageUrl: '',
          proDetail: []
        },
        headerObj: {
          type: '',
          productId: '',
          cardVoucherId: 1,
          configuration: true
        },
        canvasCancel: false,
        carType: '',
        cartypeAvalon: false,
        floatBtn: false
      }
    },
    computed: {
      ...mapState({ // 映射
        userObj: state => state.user.user
      })
    },
    mounted () {
      let t = this
      const actProId = ['12599', '12587', '12592', '12596', '12598', '12570', '12593', '12595'] // 0401所包含的车型展示悬浮按钮
      const node = document.getElementById('detailsHeader')
      document.getElementsByClassName('page-main')[0].appendChild(node)
      t.activityMay()
      t.queryProductDetail() // 获取商品详情信息
      t.queryProductPresellInfo() // 获取预售商品信息
      t.getActivityState() // 获取活动状态
      t.carType = this.productId === '12587' ? 'yize' : this.productId === '12593' ? 'carolla' : this.productId === '12595' ? 'avalon' : ''
      if ((t.carType === 'yize' || t.carType === 'carolla' || t.carType === 'avalon') && !t.canvasCancel) {
        t.initCanvas(t.carType)
      }
      if (actProId.indexOf(t.productId) !== -1) {
        this.iconShow = true
      }
      t.cartypeAvalon = t.carType === 'avalon'
      setTimeout(() => {
        t.$util.win.goTop() // 回到顶部
      }, 400)
    },
    methods: {
      // 实现移动端拖拽
      down(event) {
        var moveDiv = document.getElementById('lucky')
        this.flags = true
        var touch
        if (event.touches) {
          touch = event.touches[0]
        } else {
          touch = event
        }
        this.position.x = touch.clientX
        this.position.y = touch.clientY
        this.dx = moveDiv.offsetLeft
        this.dy = moveDiv.offsetTop
      },
      move() {
        let moveDiv = document.getElementById('lucky')
        if (this.flags) {
          var touch = null
          if (event.touches) {
            touch = event.touches[0]
          } else {
            touch = event
          }
          this.nx = touch.clientX - this.position.x
          this.ny = touch.clientY - this.position.y
          this.xPum = this.dx + this.nx
          this.yPum = this.dy + this.ny
          // window宽 - 点击的轴坐标 - box大小
          moveDiv.style.right = document.documentElement.clientWidth - this.xPum - moveDiv.offsetWidth + 'px'
          moveDiv.style.bottom = document.documentElement.clientHeight - this.yPum - moveDiv.offsetHeight + 'px'
          // 阻止页面的滑动默认事件；如果碰到滑动问题，1.2 请注意是否获取到 touchmove
          event.preventDefault()
        }
      },
      // 鼠标释放时候的函数
      end() {
        let moveDiv = document.getElementById('lucky')
        let myHeader = document.getElementById('myHeader')
        let winWith = document.documentElement.clientWidth // 窗口宽度
        let winHeight = document.documentElement.clientHeight // 窗口高度
        let boxWidth = moveDiv.offsetWidth // 事件盒子宽度
        let boxHeight = moveDiv.offsetHeight // 事件盒子高度
        let headHeight = myHeader.offsetHeight // 头部header高度
        this.flags = false
        console.log('--end--')
        // 判断右侧边界
        if ((winWith - this.xPum - boxWidth) < 0) moveDiv.style.right = 0
        // 判断下侧边界
        if ((winHeight - this.yPum - boxHeight) < 0) moveDiv.style.bottom = 0
        // 判断左侧边界
        if (moveDiv.offsetLeft < 0) moveDiv.style.right = winWith - boxWidth + 'px'
        // 判断上侧边界
        if (moveDiv.offsetTop - headHeight < 0) moveDiv.style.bottom = winHeight - headHeight - boxHeight + 'px'
      },
      goLucky() {
        this.$router.push('/wx/activityMay?groupid=sc_activity_may')
      },
      // 活动入口显示
      activityMay() {
        Request.activityMay({
          ACCESS_TOKEN: this.userObj.data.token
        }).then(v => {
          this.pickStage = v.data.activityStage
        })
      },
      goActive () {
        this.$router.push('/wx/yhctzcgz?groupid=car_hdfb_yhct')
      },
      getActivityState() {
        Request.getActivityState().then(v => {
          if (v.code === '0') {
            if (v.data.activityStage === '2' || v.data.activityStage === '3' || v.data.activityStage === '4') {
              this.floatBtn = true
            }
          }
        })
      },
      initCanvas (carType) {
        const t = this
        if (!window.initCanvas) {
          window.location.reload()
          return
        }
        window.initCanvas(carType, 'detail')
        window.NOT_SUPPORT_CANVAS = function () {
          t.canvasCancel = true
        }
        window.lastApp = window.CANVAS_PLAY(t.carType)
        const renderIndex = (carType === 'yize' || carType === 'carolla') ? 1 : 0
        window.UI_CONTRO_CANVAS('addUi', carType)
        window.UI_CONTRO_CANVAS(renderIndex, carType)
      },
      toggleShow (type) {
        if (type === 0) {
          window.UI_CONTRO_CANVAS(1)
          // eslint-disable-next-line no-undef
          $('.waiguan').addClass('in')
          // eslint-disable-next-line no-undef
          $('.neishi,.chexing').removeClass('in')
          // eslint-disable-next-line no-undef
          $('.canvasUiContro_yz .colorTitle').show()
          window.DISTANCEDEF = window.DISTANCEDEF - 1
          setTimeout(function () {
            window.DISTANCEDEF = window.DISTANCEDEF + 1
          }, 50)
        } else if (type === 1) {
          window.UI_CONTRO_CANVAS(2)
          // eslint-disable-next-line no-undef
          $('.neishi').addClass('in')
          // eslint-disable-next-line no-undef
          $('.waiguan,.chexing').removeClass('in')
          // eslint-disable-next-line no-undef
          $('.canvasUiContro_yz .colorTitle').hide()
        } else if (type === 2) {
          window.UI_CONTRO_CANVAS(0)
          // eslint-disable-next-line no-undef
          $('.chexing').addClass('in')
          // eslint-disable-next-line no-undef
          $('.waiguan,.neishi').removeClass('in')
          // eslint-disable-next-line no-undef
          $('.canvasUiContro_yz .colorTitle').hide()
          window.DISTANCEDEF = window.DISTANCEDEF - 1
          setTimeout(function () {
            window.DISTANCEDEF = window.DISTANCEDEF + 1
          }, 50)
        }
      },
      // 获取商品详情信息
      queryProductDetail () {
        let t = this
        Request.queryProductDetail('', t.productId).then(result => {
          if (result.success) {
            // console.log('result:>', result)
            // 判断头部是否显示参数配置选项
            let obj = result.data || {}
            if (obj.configuration.length === 0) {
              t.headerObj.configuration = false
            } else {
              t.headerObj.configuration = true
            }
            obj['proImageUrl'] = obj.proImageUrl || ''
            obj['proDetailImageUrlList'] = obj.proDetailImageUrlList || []
            t.modelDisplay = {
              proImageUrl: obj.proImageUrl || '',
              proDetail: obj.proDetailImageUrlList
            }
            obj['phoneProductDesc'] = obj.phoneProductDesc || ''
            obj.phoneProductDesc = ((html) => {
              let newContent = html.replace(/<img[^>]*>/gi, function (match, capture) {
                // eslint-disable-next-line no-useless-escape
                return match.replace(/style=\"(.*)\"/gi, 'class="img-responsive"')
              })
              return newContent
            })(obj.phoneProductDesc)
            t.productObj = obj
            const type = (t.productObj.productTag === '1') ? 'presell' : 'details'
            const productId = t.productObj.productId
            const proCatalogId = t.productObj.proCatalogId
            t.headerObj.cardVoucherId = obj.cardVoucherId
            t.headerObj.proCatalogId = proCatalogId
            t.headerObj.productId = productId
            t.headerObj.type = type
            t.headerObj.configuration = t.headerObj.configuration
          }
        })
      },
      // 获取预售商品信息
      queryProductPresellInfo () {
        let t = this
        Request.queryProductPresellInfo('', t.productId).then(result => {
          if (result.success) {
            // console.log('result:>', result)
            let obj = result.data
            t.productName = obj.productName || ''
            let attribute = obj.attribute || []
            attribute.sort(t.compareSortKey('sort'))
            // 遍历
            let i = 1
            _.each(attribute, (attr, key) => {
              attr['sort'] = i
              attr['flag'] = 'version'
              attr['divisor'] = 2
              attr['isLast'] = (i === attribute.length)
              attr['btnNext'] = ''
              attr['selected'] = {}
              attr['ecPrice'] = 0
              attr['productId'] = t.productId
              if (i !== attribute.length) {
                attr['btnNext'] = attribute[i].attributeName || ''
              }
              if (attr.attributeName.indexOf('外观') >= 0 || attr.attributeName.indexOf('内饰') >= 0) {
                attr['flag'] = 'color'
                attr['divisor'] = 4
              }
              let attributeValue = attr.attributeValue || []

              let selectAttr = []
              let [j, swiperItem] = [0, []]
              _.each(attributeValue, (item, key) => {
                item['active'] = false

                swiperItem.push(item)
                if (j % attr.divisor === (attr.divisor - 1)) {
                  // eslint-disable-next-line no-undef
                  let newItem = $.extend(true, [], swiperItem)
                  selectAttr.push(newItem)
                  swiperItem = []
                } else if (j === (attributeValue.length - 1)) {
                  // eslint-disable-next-line no-undef
                  let newItem = $.extend(true, [], swiperItem)
                  selectAttr.push(newItem)
                }
                j = j + 1
              })
              attr['selectAttr'] = selectAttr

              i = i + 1
            })
            console.log('attribute:>', attribute)
            t.attribute = attribute
            t.goodsList = obj.goodsList || []
          }
        })
      },
      // 选中属性
      doSelected (selectedObj) {
        let t = this
        t.attribute[selectedObj.sort - 1].selected = selectedObj.obj
        let selectGoodsAttrs = []
        _.each(t.attribute, (item, key) => {
          let selected = item.selected || {}
          let attributeValueId = selected.attributeValueId || ''
          if (attributeValueId) {
            selectGoodsAttrs.push(attributeValueId)
          }
        })

        selectGoodsAttrs.sort() // 排序
        if (selectGoodsAttrs.length === t.attribute.length) {
          _.each(t.goodsList, (goods, key) => {
            let goodsAttrs = goods.goodsAttrs || []
            goodsAttrs.sort() // 排序
            if (selectGoodsAttrs.join(',') === goodsAttrs.join(',')) {
              t.selectedGoods = goods // 选中单品
              console.log('selectedGoods:>', t.selectedGoods)
              _.each(t.attribute, (item, key) => {
                item.ecPrice = t.selectedGoods.ecPrice
              })
            }
          })
        }
      },
      // 关闭弹窗
      doClose (obj) {
        let t = this
        if (obj.type === 'prompt') {
          t.promptLayerShow = obj.show
        }
      },
      // 数组对象排序
      compareSortKey (prop) {
        return function (obj1, obj2) {
          let val1 = obj1[prop]
          let val2 = obj2[prop]
          if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
            val1 = Number(val1)
            val2 = Number(val2)
          }
          if (val1 < val2) {
            return -1
          } else if (val1 > val2) {
            return 1
          } else {
            return 0
          }
        }
      }
    },
    destroyed: function () {
      document.getElementById('detailsHeader').remove()
      if (window.lastApp) {
        window.DESTROY_APP(window.lastApp)
        window.lastApp = null
        window.app = null
        window.RESET_CAR_CAMERA = null
      }

      // document.getElementsByClassName('page-main')[0].appendChild(node)
    }
  }
</script>
<style lang="scss">
    //noinspection CssUnknownTarget
    @import "~/assets/sass/pages/details/index.scss";
</style>
