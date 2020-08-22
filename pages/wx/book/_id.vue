<template>
  <!--预定-->
  <div class="book-container">
    <!--头部-->
    <div class="book-header">
      <div class="header-content bm-box bm-box-horizontal bm-box-vertical-center">
        <div class="titles bm-flex">
          <h4>{{productName}}</h4>
          <p>配置您的{{productName}}</p>
        </div>
        <div
          class="step-title"
        >{{attribute.length && attribute[step-1] ? attribute[step-1].attributeName : '车型配置'}}</div>
        <!-- <div v-show="true" @click="insertCollect" class="wishlists-btn">
          <i class="iconfont icon-collection"></i>加入心愿单
        </div>-->
      </div>

      <!--选项卡-->
      <!-- <div class="tab-select bm-box bm-box-horizontal bm-box-vertical-center">
        <div
          @click="tabClick(item)"
          v-for="item in attribute"
          :key="item.id"
          :diei="attributeImg"
          class="bm-flex tab-item"
          :class="{'active': (canvasCancel && sort === item.sort) || (!canvasCancel && step === item.sort), 'center': (attribute.length === 3 &&item.sort === 2), 'right'  :item.sort === attribute.length}"
        >
          <div class="tab-title">
            <span>{{item.attributeName }}</span>
          </div>
          <div
            v-show="item.flag !== 'color'"
            class="select-property"
          >{{item.selected.attributeValueName || ''}}</div>
        </div>
      </div>-->
    </div>

    <!--内容区-->
    <div class="book-content">
      <!--车型配置-->
      <template v-for="item in attribute">
        <div v-if="item.flag === 'version'" :key="item.id">
          <version-select
            v-if="sort === item.sort"
            :diei="attributeImg"
            :options="item"
            :goods="selectedGoods"
            :attributes="attribute"
            :carType="carType"
            :setCanvas="setCanvas"
            :btnNext="btnNext"
            :step="step"
            @selected="doSelected"
            @next="toNext"
            @insertCollect="insertCollect"
          ></version-select>
        </div>
        <div v-else>
          <color-select
            v-if="sort === item.sort && canvasCancel"
            :diei="attributeImg"
            :options="item"
            :goods="selectedGoods"
            @selected="doSelected"
            @next="toNext"
            @insertCollect="insertCollect"
          ></color-select>
        </div>
      </template>
    </div>

    <!--提示框-->
    <prompt-layer :show="promptLayerShow" @close="doClose"></prompt-layer>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import _ from 'lodash'
import Request from '~/plugins/request'
import versionSelect from '~/components/book/version-select.vue'
import colorSelect from '~/components/book/color-select.vue'
import promptLayer from '~/components/common/layer/prompt.vue'

export default {
  name: 'book',
  components: {
    versionSelect,
    colorSelect,
    promptLayer
  },
  asyncData(context) { // async await
    return {
      productId: context.params.id
    }
  },
  head() {
    return {
      title: '一汽丰田官方商城',
      meta: [ // seo
        { hid: 'keywords', name: 'keywords', content: '' },
        { hid: 'description', name: 'description', content: '' }
      ]
    }
  },
  data() {
    return {
      sort: 1,
      promptLayerShow: false,
      productName: '', // 商品名称
      attribute: [],
      goodsList: [], // 单品列表
      selectedGoods: {}, // 选中单品
      attributeImg: [],
      attributeImgs: [],
      imgCache: {},
      carType: '',
      canvasCancel: false,
      step: 1,
      btnNext: ''
    }
  },
  mounted() {
    let t = this
    let origin = t.$util.Params.query('origin') || ''
    let utmContent = t.$util.Params.query('utm_ontent') || ''
    let utmCampaign = t.$util.Params.query('utm_campaign') || ''
    const carType = t.productId === '12593' ? 'carolla' : t.productId === '12595' ? 'avalon' : ''
    t.carType = carType
    if (origin) {
      console.log('origin:>', origin)
      t.$cache.origin.set(origin) // 存储来源
    }
    if (utmContent) {
      console.log('utmContent:>', utmContent)
      t.$cache.utmContent.set(utmContent)
    }
    if (utmCampaign) {
      console.log('utmCampaign:>', utmCampaign)
      t.$cache.utmCampaign.set(utmCampaign)
    }
    t.queryProductPresellInfo() // 获取预售商品信息
    // t.queryGoodsAttributeList() // 查询商品规格信息（包含规格值）
    // alert(window.currentStep)
    // t.step = window.currentStep ? window.currentStep - 1 : 1
    setTimeout(() => {
      t.$util.win.goTop() // 回到顶部
    }, 400)
  },
  destroyed() {
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
    tabClick(item) {
      console.log(item)
      if (this.canvasCancel) {
        this.sort = item.sort
      } else {
        this.step = item.sort
        this.btnNext = this.attribute[item.sort] ? this.attribute[item.sort].attributeName : '即刻订购'
        window.UI_CONTRO_CANVAS(item.sort - 1)
      }
    },
    // 加入心愿单
    insertCollect() {
      let t = this
      Request.insertCollect({
        ACCESS_TOKEN: t.userObj.data.token,
        collectGoodsId: t.selectedGoods.goodsId
      }).then(result => {
        if (result.success) {
          t.promptLayerShow = true
        }
      })
    },
    // 获取预售商品信息
    queryProductPresellInfo() {
      let t = this
      Request.queryProductPresellInfo('', t.productId).then(result => {
        if (result.success) {
          // console.log('result:>', result)
          let obj = result.data
          t.productName = obj.productName || ''
          t.attributeImgs = obj.attributeImg
          t.attributeImg = obj.attributeImg[0].img360 || ''
          let attribute = obj.attribute || []
          attribute.sort(t.compareSortKey('sort'))
          // 遍历
          let [i, defaultAttr] = [1, []]
          _.each(attribute, (attr, key) => {
            attr['sort'] = i
            attr['flag'] = 'version'
            attr['divisor'] = 2
            attr['isLast'] = (i === attribute.length)
            attr['btnNext'] = ''
            attr['ecPrice'] = 0
            attr['productId'] = t.productId
            console.log('attribute[i].attributeName=', attribute[i])
            if (i !== attribute.length) {
              attr['btnNext'] = attribute[i].attributeName || ''
            }
            if (attr.attributeName.indexOf('外观') >= 0 || attr.attributeName.indexOf('内饰') >= 0) {
              attr['flag'] = 'color'
              attr['divisor'] = 4
            }
            let attributeValue = attr.attributeValue || []
            // console.log(12)
            // console.log(attributeValue)
            // console.log(12)
            defaultAttr.push(attributeValue[0].attributeValueId)

            let selectAttr = []
            let [j, swiperItem] = [0, []]
            _.each(attributeValue, (item, key) => {
              item['active'] = false

              if (j === 0) { // 默认选中第一个
                item['active'] = true
                attr['selected'] = item // 选中属性
              }
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
    // 查询商品规格信息（包含规格值）
    queryGoodsAttributeList() {
      let t = this
      Request.queryGoodsAttributeList({
        productId: t.productId
      }).then(result => {
        if (result.success) {
          // console.log('result:>', result)
        }
      })
    },
    // 选中属性
    doSelected(selectedObj) {
      let t = this
      t.attribute[selectedObj.sort - 1].selected = selectedObj.obj
      console.log('aaaa=', t.attribute[selectedObj.sort - 1].selected)
      let selectGoodsAttrs = []
      _.each(t.attribute, (item, key) => {
        let selected = item.selected || {}
        let attributeValueId = selected.attributeValueId || ''
        if (attributeValueId) {
          selectGoodsAttrs.push(attributeValueId)
        }
        _.each(t.attributeImgs, (itemImages, key) => {
          if (t.sort === 3) {
            if (itemImages.goodsAttrs[0] === selected.attributeValueId) {
              t.attributeImg = itemImages.img360
            }
          } else if (itemImages.goodsAttrs.join(',') === selectGoodsAttrs.join(',')) {
            t.attributeImg = itemImages.img360
          } else if (t.productId === '12593' && itemImages.goodsAttrs[0] === selectGoodsAttrs[t.sort - 1]) {
            t.attributeImg = itemImages.img360
          }
        })
        selected.attrBigImg = t.attributeImg[3] || t.attributeImg[0]
        if (!t.imgCache[selected.attributeValueId]) {
          t.preloadImages(selectGoodsAttrs.join(','), t.attributeImg)
        }
      })

      selectGoodsAttrs.sort() // 排序
      console.log('xxxx=', selectGoodsAttrs)
      if (selectGoodsAttrs.length === t.attribute.length) {
        _.each(t.goodsList, (goods, key) => {
          let goodsAttrs = goods.goodsAttrs || []
          goodsAttrs.sort() // 排序
          if (selectGoodsAttrs.join(',') === goodsAttrs.join(',')) {
            console.log('gggg=', goods)
            t.selectedGoods = goods // 选中单品

            _.each(t.attribute, (item, key) => {
              item.ecPrice = t.selectedGoods.ecPrice
            })
          }
        })
      }
    },
    // 下一项
    toNext(obj) {
      console.log(obj)
      if (!this.canvasCancel) {
        this.btnNext = this.attribute[obj.step] ? this.attribute[obj.step].attributeName : '即刻订购'
        this.step = obj.step
        // this.sort = obj.sort
      } else {
        this.sort = obj.sort
      }
    },
    // 3d load failed
    setCanvas(obj) {
      this.canvasCancel = obj.canvasCancel
    },
    // 关闭弹窗
    doClose(obj) {
      let t = this
      if (obj.type === 'prompt') {
        t.promptLayerShow = obj.show
      }
    },
    // 数组对象排序
    compareSortKey(prop) {
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
  }
}
</script>
<style lang="scss">
//noinspection CssUnknownTarget
@import "~/assets/sass/pages/book/index.scss";
</style>
