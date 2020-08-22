<template>
  <!--明星车型-->
  <div class="star-model">
    <!--明星车型-->
    <h4 class="title">全系车型</h4>
    <div class="model-content">
      <div class="model-select">
        <div class="mint-navbar model-navbar">
          <div class="mint-tab-item" id="model_1" @click="changeTab('model_1')">车型
             <i class="iconfont" :class="modelSelected==='model_1'? 'icon-up-min':'icon-down-min'"></i>
            <div class="triangle"></div>
          </div>
          <div class="mint-tab-item" id="model_2" @click="changeTab('model_2')">价格区间
             <i class="iconfont" :class="modelSelected==='model_2'? 'icon-up-min':'icon-down-min'"></i>
            <div class="triangle"></div>
          </div>
        </div>

        <div class="model-tab" v-show="modelSelected === 'model_1'">
          <div id="model_1_1">
            <ul class="model-list">
              <li
                v-for="obj in catalogList"
                class="list-item bm-box bm-box-horizontal bm-box-vertical-center"
              >
                <div
                  class="bm-flex check-item"
                  :class="{'checked': item.checked}"
                  @click="checkCatalog(item)"
                  v-for="(item, index) in obj"
                  :key="index"
                >
                  <i class="iconfont" :class="item.checked? 'icon-check-full':'icon-check-empty'"></i>
                  {{item.proCatalogName}}
                </div>
                <!--<div class="bm-flex check-item"><i class="iconfont icon-check-empty"></i>8万以下</div>-->
                <!--<div class="bm-flex check-item"><i class="iconfont icon-check-empty"></i>8-10万</div>-->
                <!--<div class="bm-flex check-item checked"><i class="iconfont icon-check-full"></i>10-15万</div>-->
              </li>
            </ul>
          </div>
        </div>
        <div class="model-tab" v-show="modelSelected === 'model_2'">
          <div id="model_2_2">
            <ul class="model-list">
              <li
                v-for="obj in rangeList"
                class="list-item bm-box bm-box-horizontal bm-box-vertical-center"
              >
                <div
                  class="bm-flex check-item"
                  :class="{'checked': item.checked}"
                  @click="checkRange(item)"
                  v-for="(item, index) in obj"
                  :key="index"
                >
                  <i class="iconfont" :class="item.checked? 'icon-check-full':'icon-check-empty'"></i>
                  {{item.codeValue}}
                </div>
                <!--<div class="bm-flex check-item"><i class="iconfont icon-check-empty"></i>8万以下</div>-->
                <!--<div class="bm-flex check-item"><i class="iconfont icon-check-empty"></i>8-10万</div>-->
                <!--<div class="bm-flex check-item checked"><i class="iconfont icon-check-full"></i>10-15万</div>-->
              </li>
              <!--<li class="list-item bm-box bm-box-horizontal bm-box-vertical-center">-->
              <!--<div class="bm-flex check-item"><i class="iconfont icon-check-empty"></i>全部</div>-->
              <!--<div class="bm-flex check-item"><i class="iconfont icon-check-empty"></i>8万以下</div>-->
              <!--<div class="bm-flex check-item"><i class="iconfont icon-check-empty"></i>8-10万</div>-->
              <!--<div class="bm-flex check-item"><i class="iconfont icon-check-empty"></i>10-15万</div>-->
              <!--</li>-->
            </ul>
          </div>
        </div>
      </div>
      <!--车型列表-->
      <ul class="model-car-list">
        <li
          v-for="obj in productList"
          class="car-list-item bm-box bm-box-horizontal bm-box-vertical-center"
        >
          <div v-if="item" v-for="(item, index) in obj" :key="index" class="bm-flex">
            <div class="flag-list bm-box bm-box-horizontal bm-box-vertical-center">
              <!-- <img v-show="item.newTag" src="~/assets/images/home/new_word.png"> -->
              <img v-show="item.newTag && item.productId !='12595'" src="~/assets/images/home/new_word.png">
              <img v-show="item.newTag && stage!='2' && item.productId=='12595' " src="~/assets/images/home/new_word.png">
              <!-- <img v-show="item.hotTag" src="~/assets/images/home/hui_word.png"> -->
              <img v-show="item.cuTag" src="~/assets/images/home/cu_word.png">
              <img v-show="item.newTag && stage=='2' && item.productId=='12595' " src="~/assets/images/home/hot_word.png">
              <!-- 0401 新添代码 指定6辆车固定显示惠标 -->
              <!-- <img v-show=" ( stage=='2' || stage=='3' || stage=='4' ) && proActId.indexOf(item.productId) !== -1" src="~/assets/images/home/hui_word.png"> -->
            </div>

            <div @click="toDetail(item)"  class="car-pic">
              <img :src="item.proImageUrl">
            </div>



            <!-- <div v-if="item.productTag !== '1'" @click="toDetail(item)"  class="car-pic">
              <img :src="item.proImageUrl">
            </div>
            <div v-if="item.productTag === '1'" @click="toBookDetail(item)" class="car-pic">
              <img :src="item.proImageUrl">
            </div> -->



            <!--标题-->
            <div class="titles">
              <p class="title">{{item.productName}}</p>
              <p class="sub-title">{{item.promoteDescription || ''}}</p>
            </div>
            <!--价格-->
            <div class="price">
              <span>{{item.kind || ''}}</span>
              <!--<span>¥</span>{{item.basePrice | fMoney}}<span>起</span>-->
            </div>
            <!--订购 即刻订购 toBook-->
            <!-- 威尔法不显示预约试驾按钮 -->
            <div v-if=" item.productId !== 12597 && item.productId !== 12600 && item.productId !== 12601" @click="toDetail(item)" class="order-immediately">
              <i class="iconfont icon-wheel"></i>预约试驾
            </div>
            <div v-if=" item.productId == 12597 || item.productId == 12600 || item.productId == 12601" @click="toDetail(item)" class="order-immediately order-zixun">
              <i class="iconfont icon_zixun"></i>预约咨询
            </div>


            <!-- <div v-if="item.productTag !== '1'" @click="toDetail(item)" class="order-immediately">
              <i class="iconfont icon-wheel"></i>预约试驾
            </div> -->
            <!-- ------------删除即刻订购 -->
            <!-- <div
              v-if="item.productTag === '1'"
              @click="toBookDetail(item)"
              class="order-immediately"
            >
              <i class="iconfont icon-shopping-cart"></i>即刻订购
            </div> -->
            <!-- ---------------删除即刻订购 -->
          </div>
          <div v-if="obj.length === 1" class="bm-flex"></div>
          <!--<div class="bm-flex">-->
          <!--<div class="car-pic">-->
          <!--<img src="~/assets/images/home/car2.png"/>-->
          <!--</div>-->
          <!--&lt;!&ndash;标题&ndash;&gt;-->
          <!--<div class="titles">-->
          <!--<p class="title">VIOS 威驰</p>-->
          <!--<p class="sub-title">心驰所享，无畏青春</p>-->
          <!--</div>-->
          <!--&lt;!&ndash;价格&ndash;&gt;-->
          <!--<div class="price">-->
          <!--<span>¥</span>123,500<span>起</span>-->
          <!--</div>-->
          <!--&lt;!&ndash;订购&ndash;&gt;-->
          <!--<div class="order-immediately"><i class="iconfont icon-shopping-cart"></i>即刻订购</div>-->
          <!--</div>-->
        </li>
      </ul>
    </div>
    <!--展开更多-->
    <div @click="getMoreList" v-show="pageObj.hasNext" class="open-more">
      展开更多
      <i class="iconfont icon-down-min"></i>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import Request from '~/plugins/request'

export default {
  props: {
    options: {
      type: Array,
      default: () => {
        // 不传参数时使用默认值
        // 默认值
        return []
      }
    },
    stage: {
      type: String,
      default: 0
    }
  },
  data() {
    return {
      modelSelected: '',
      rangeList: [], // 价格区间
      rangeCode: '',
      catalogList: [], // 车型
      catalogId: '',
      pageObj: {
        totalPage: 1,
        pageSize: 10,
        pageNo: 1,
        hasNext: false
      },
      productList: [],
      proActId: []
    }
  },
  mounted() {
    let t = this
    this.proActId = [12599, 12587, 12592, 12596, 12598, 12570]
    t.getSysCodeValues() // 获取系统码信息
    t.getProCatalogByParentId('-1', dataList => {
      if (dataList.length > 0) {
        _.each(dataList, (obj, key) => {
          t.getProCatalogByParentId(obj.proCatalogId || '')
        })
      }
    }) // 获取前台分类筛选条件
    t.queryProductList() // 获取商品列表
  },
  methods: {
    changeTab (obj) {
      if (this.modelSelected === obj) {
        this.modelSelected = ''
      } else {
        this.modelSelected = obj
      }
    },
    // 筛选车型
    checkCatalog(obj) {
      let t = this
      obj.checked = !obj.checked
      let paramList = []
      _.each(t.catalogList, (obj, key) => {
        _.each(obj, (item, key) => {
          if (item.checked && item.proCatalogId) {
            paramList.push(item.proCatalogId)
          }
        })
      })
      t.catalogId = paramList.join(',')
      // console.log('catalogId:>', t.catalogId)
      t.productList = []
      t.pageObj.pageNo = 1
      t.queryProductList() // 查询商品列表
    },
    // 筛选价格区间
    checkRange(obj) {
      let t = this
      obj.checked = !obj.checked
      let paramList = []
      _.each(t.rangeList, (obj, key) => {
        _.each(obj, (item, key) => {
          if (item.checked && item.codeNo) {
            paramList.push(item.codeNo) // codeId
          }
        })
      })
      t.rangeCode = paramList.join(',')
      // console.log('rangeCode:>', t.rangeCode)
      t.productList = []
      t.pageObj.pageNo = 1
      t.queryProductList() // 查询商品列表
    },
    // 获取系统码信息
    getSysCodeValues() {
      let t = this
      t.rangeList = []
      Request.getSysCodeValues('', 'price_range').then(result => {
        if (result.success) {
          // console.log(result)
          let dataList = result.data || []
          dataList.sort(t.compareSortKey('codeOrder')) // 按codeOrder排序
          let [i, item] = [0, []]
          // let [i, item] = [
          //   1,
          //   [
          //     {
          //       checked: false,
          //       codeId: '',
          //       codeNo: '',
          //       codeValue: '全部'
          //     }
          //   ]
          // ]

          _.each(dataList, (obj, key) => {
            obj['checked'] = false
            item.push(obj)
            if (i % 3 === 2) {
              // eslint-disable-next-line no-undef
              let newItem = $.extend(true, [], item)
              t.rangeList.push(newItem)
              item = []
            } else if (i === dataList.length - 1) {
            // } else if (i === dataList.length) {
              // 全部
              t.rangeList.push(item)
            }
            i = i + 1
          })
        }
      })
    },
    // 获取前台分类筛选条件
    getProCatalogByParentId(id = '-1', callback) {
      let t = this
      Request.getProCatalogByParentId('', id).then(result => {
        if (result.success) {
          // console.log(result)
          let dataList = result.data || []

          if (id === '-1') {
            if (callback) {
              t.catalogList = []
              callback(dataList)
            }
          } else {
            let [i, item] = [0, []]
            // let [i, item] = [
            //   1,
            //   [
            //     {
            //       checked: false,
            //       proCatalogId: '',
            //       proCatalogName: '全部'
            //     }
            //   ]
            // ]
            _.each(dataList, (obj, key) => {
              obj['checked'] = false
              item.push(obj)
              if (i % 4 === 3) {
                // eslint-disable-next-line no-undef
                let newItem = $.extend(true, [], item)
                t.catalogList.push(newItem)
                item = []
              } else if (i === dataList.length - 1) {
              // } else if (i === dataList.length) {
                t.catalogList.push(item)
              }
              i = i + 1
            })
          }
        }
      })
    },
    // 查询商品列表
    queryProductList() {
      let t = this
      Request.queryProductListForPage({
        productTag: '', // 商品标签
        cardVoucherId: '',
        priceRangeCode: t.rangeCode, // 价格区间
        proCatalogIdString: t.catalogId, // 分类筛选条件
        pageSize: t.pageObj.pageSize,
        beginPage: t.pageObj.pageNo
      }).then(result => {
        if (result.success) {
          // console.log(result)
          let obj = result.data || {}
          let dataList = obj.dataList || []
          t.pageObj.totalPage = obj.totalPages || 1
          t.pageObj.hasNext = obj.hasNextPage || false

          let [i, item] = [0, []]
          _.each(dataList, (obj, key) => {
            let productTag = obj.productTag || ''
            let cardVoucherId = obj.cardVoucherId || ''
            obj['newTag'] = productTag.indexOf('1') >= 0
            obj['hotTag'] = productTag.indexOf('2') >= 0
            // obj['addTag'] = productTag.indexOf('4') >= 0
            obj['cuTag'] = cardVoucherId !== -1
            item.push(obj)
            if (i % 2 === 1) {
              // eslint-disable-next-line no-undef
              let newItem = $.extend(true, [], item)
              t.productList.push(newItem)
              item = []
            } else if (i === dataList.length - 1) {
              t.productList.push(item)
            }
            i = i + 1
          })
        }
      })
    },
    // 获取更多
    getMoreList() {
      let t = this
      t.pageObj.pageNo += 1
      t.queryProductList() // 查询商品列表
    },
    // 跳转详情页
    toDetail(obj) {
      // this.$router.push('/wx/presell/' + obj.productId)
      this.$router.push('/wx/details/' + obj.productId)
    },
    // 跳转订购页
    toBook(obj) {
      this.$router.push('/wx/book/' + obj.productId)
    },
    // 跳转预定页
    toBookDetail(obj) {
      this.$router.push('/wx/presell/' + obj.productId)
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
@import "./sass/star-model";
</style>
