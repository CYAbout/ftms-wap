<template>
 <!--商品详情-->
  <div class="salesDetails-container">
    <!--头部-->
    <div class="salesDetails-header bm-box bm-box-horizontal bm-box-vertical-center">
      <!-- <div class="header-left"></div> -->
      <i @click="doBack" class="iconfont icon-back"></i>
      <!-- <div @click="doBack" class="header-left"><i class="iconfont icon-back"></i></div> -->
      <div class="bm-flex header-title">{{title}}</div>
      <div class="header-right"></div>
    </div>

    <!-- 商品信息 -->
    <div class="commodity-information">
      <div class="title">商品信息</div>
      <img v-lazy="cardObj.cardVoucherImg"/>
      <!--<img src="~/assets/images/sales/salesPromotion_03.jpg" alt="">-->
      <div class="text">
        <p class="title" style="padding-bottom: 0;">{{cardObj.cardVoucherName}}</p>
        <!--<p class="text">跟需求确认是否需要（接口没有字段）</p>-->
      </div>
    </div>

    <!--商品配置-->
    <div class="commodity-allocation">
      <div class="line">
        <div class="text left">卡券类型</div><div class="text right weight">{{cardObj.cardVoucherType}}</div>
      </div>
      <div class="line">
        <div class="text left">价格</div><div class="text right weight brown">￥{{cardObj.cardVoucherPrice}}</div>
      </div>
      <div class="line">
        <div class="text left" style="height:.8rem;line-height:.8rem;">数量</div>
        <!-- <div class="text right weight brown"><el-input-number v-model="num1" @change="handleChange" size="medium" :disabled="true" :min="1" :max="10" label="描述文字"></el-input-number></div> -->
        <div class="add-plus"><span class="one">-</span><span class="add-plus-input" >1</span><span class="two">+</span></div>
      </div>
        <div class="text">经销商</div>
        <div class="distributor">
        <!-- 省 -->
        <div @click="provinceShow = !provinceShow" class="province-select">
          <span>{{provinceObj.selected.name || ''}}</span>
          <i class="iconfont icon-down-min"></i>
        </div>
        <!--市-->
        <div @click="cityShow = !cityShow" class="city-select">
          <span>{{cityObj.selected.name || ''}}</span>
          <i class="iconfont icon-down-min"></i>
        </div>
        <!--经销商-->
        <div id="autocomplete">
               <el-autocomplete
        popper-class="my-autocomplete"
        v-model="state3"
        :fetch-suggestions="querySearch"
        placeholder="输入经销商名称快速查询"
        @select="handleSelect"
      >
        <template slot-scope="{ item }">
          <div class="name">{{ item.dealerName }}</div>
          <span class="addr">{{ item.address }}</span>
        </template>
      </el-autocomplete>
        </div>

        </div>
       <div class="line">
        <div class="text left">活动促销</div>
         <div class="text right weight brown font">{{cardObj.activityName}}</div>
         <div @click="toIndex" class="right gray">更多 ></div>
       </div>
        <!--<div class="line">-->
        <!--<div class="text left">数量有限，优惠不容错过</div>-->
      <!--</div>-->
    </div>

    <!-- 查看车型 -->
    <div @click="toCarDetail(cardObj.productId)" class="test-drive-btn" v-if="cardObj.cardVoucherId === -1? 'false': 'true'">
      查看车型
    </div>
    <!-- 立即抢购 -->
    <div @click="toBook" class="test-drive-btn">
      立即抢购
    </div>

     <!-- 底部展示 -->
    <div class="footer">
      <div @click="Choice(0)" :class="isActive?'leftActive':'left'">商品详情</div>
      <div @click="Choice(1)" :class="isActive?'right':'rightActive'">用户评价</div>
    </div>

    <div class="footer-line"></div>

   <!-- 商品详情 -->
    <div v-show="isActive">
      <card-detail :options="cardObj.cardVoucherDetail"></card-detail>
    </div>

   <!-- 用户评价 -->
    <div v-show="isActive==false">
      <!--评价列表-->
      <evaluation-list :options="true" :productId="cardVoucherId" :jump="true"></evaluation-list>
    </div>

    <common-select
      :show.sync="provinceShow"
      :options="provinceObj.selectList"
      :type="'province'"
      @changed="selectedChanged"
    ></common-select>
    <!--市-->
    <common-select
      :show.sync="cityShow"
      :options="cityObj.selectList"
      :type="'city'"
      @changed="selectedChanged"
    ></common-select>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import _ from 'lodash'
import Request from '~/plugins/request'
import commonSelect from '~/components/common/layer/common-select.vue'
import evaluationList from '~/components/evaluation/layer/evaluation-list.vue'
import cardDetail from '~/components/sales/card-detail.vue'

export default {
  components: {
    commonSelect,
    evaluationList,
    cardDetail
  },
  asyncData(context) { // async await
    return {
      cardVoucherId: context.params.id
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
  computed: {
    ...mapState({
      // 映射
      userObj: state => state.user.user,
      position: state => state.user.position
    })
  },
  watch: {
    // 定位改变
    position: {
      handler(newPosition, oldPosition) {
        let t = this
        t.getRegionInfo('0', prov => {
          // 获取区域信息
          // t.getRegionInfo(prov.regionId)
          t.selectedChanged({
            show: false,
            type: 'province',
            value: t.position.provinceName
          })
          t.getRegionInfo(t.position.provinceId)
          setTimeout(() => {
            t.selectedChanged({
              show: false,
              type: 'city',
              value: t.position.cityName
            })
          }, 300)
        })
      },
      immediate: true
    },
    // 显示更多
    // showMore(val) {
    //   let t = this
    //   t.dealerObj.list = []
    //   _.each(t.dealerObj.baseList, (item, key) => {
    //     if (val) {
    //       t.dealerObj.list.push(item)
    //     } else {
    //       if (key < 3) {
    //         // 默认显示3个
    //         t.dealerObj.list.push(item)
    //       }
    //     }
    //   })
    // },
    // 监听右侧弹出层变化
    fullPopupShow(val) {
      if (val) {
        this.resetFullPopupHeight() // 重设弹出层高度
      }
    }
  },
  data() {
    return {
      title: '商品详情',
      num1: 1,
      dealerName: '',
      restaurants: [],
      state3: '',
      provinceShow: false,
      cardObj: {}, // 卡券信息
      provinceObj: {
        // 省
        selected: {},
        selectList: [],
        list: []
      },
      cityShow: false,
      cityObj: {
        // 市
        selected: {},
        selectList: [],
        list: []
      },
      isActive: true,
      noProductData: false // 商品详情没有数据
    }
  },
  mounted() {
    let t = this
    t.cardDetail()
  },
  methods: {
    // 跳转下单页面
    toCarDetail(productId) {
      window.location = '/wx/presell/' + productId
    },
    // 获取卡券详情
    cardDetail() {
      let t = this
      Request.cardDetail('', t.cardVoucherId).then(result => {
        if (result.success) {
          t.cardObj = result.data || {}
          t.cardObj['cardVoucherName'] = t.cardObj.cardVoucherName || ''
          // t.cardObj['cardVoucherDetail'] = t.cardObj.cardVoucherDetail || ''
        }
      })
    },
    handleChange(value) {
      console.log(value)
    },
    // 选择器选中值改变
    selectedChanged(obj) {
      let t = this
      if (obj.type === 'earnest') {
        // 商品意向金
        t.productEarnestShow = obj.show
        _.each(t.productEarnestObj.list, (item, key) => {
          if (obj.value === item.codeValue) {
            t.productEarnestObj.selectList.defaultIndex = key
            t.productEarnestObj.selected = item
          }
        })
      } else if (obj.type === 'province') {
        t.provinceShow = obj.show
        _.each(t.provinceObj.list, (item, key) => {
          if (obj.value === item.name) {
            t.provinceObj.selectList.defaultIndex = key
            t.provinceObj.selected = item
            t.getRegionInfo(item.regionId) // 获取城市列表
            t.state3 = ''
          }
        })
      } else if (obj.type === 'city') {
        t.cityShow = obj.show
        _.each(t.cityObj.list, (item, key) => {
          if (obj.value === item.name) {
            t.cityObj.selectList.defaultIndex = key
            t.cityObj.selected = item
            t.queryDealerList() // 获取经销商列表信息
            t.state3 = ''
          }
        })
      } else if (obj.type.indexOf('select_') >= 0) {
        let sort = Number(obj.type.split('select_')[1])
        t.attributeLists[sort - 1].selectShow = false
        let attrArray = []
        _.each(t.attributeLists, (attr, index) => {
          let attributeValueBOList = attr.attributeValueBOList || []
          _.each(attributeValueBOList, (item, key) => {
            item['attributeValue'] = item.attributeValue || ''
            if (item.attributeValue === obj.value) {
              attr.selectList.defaultIndex = key
              attr.selected = item
            }
          })
          attrArray.push(attr.selected.attributeScopeId || '')
        })
        console.log('attrArray:>', attrArray)
        t.queryGoodsInfoList(t.goods.productId, attrArray) // 查询单品列表
      }
    },
    // 选择经销商
    doDealerSelect(obj) {
      let t = this
      _.each(t.dealerObj.list, (item, key) => {
        if (obj.dealerId === item.dealerId) {
          // 跳转地图位置
          this.initMap(t.dealerObj.list, obj.lng, obj.lat)
          item.active = true
          t.dealerObj.baseList[key].active = true
          t.dealerObj.selected = item
        } else {
          item.active = false
          t.dealerObj.baseList[key].active = false
        }
      })
    },
    // 获取区域信息
    getRegionInfo(id = '0', callback) {
      let t = this
      Request.getRegionInfo('', id).then(result => {
        if (result.success) {
          // console.log('result:>', result)
          let dataList = result.data || []
          let valuesList = []
          _.each(dataList, (item, key) => {
            valuesList.push(item.name)
          })
          if (id === '0') {
            t.provinceObj = {
              // 省
              selected: dataList[0],
              selectList: [
                {
                  flex: 1,
                  values: valuesList,
                  defaultIndex: 0, // 默认值
                  className: 'slot-1',
                  textAlign: 'center'
                }
              ],
              list: dataList
            }
            if (callback) {
              callback(t.provinceObj.selected)
            }
          } else {
            if (t.provinceObj.selected) {
              t.cityObj = {
              // 市
                selected: dataList[0],
                selectList: [
                  {
                    flex: 1,
                    values: valuesList,
                    defaultIndex: 0, // 默认值
                    className: 'slot-1',
                    textAlign: 'center'
                  }
                ],
                list: dataList
              }
            }

            t.queryDealerList() // 获取经销商列表信息
          }
        }
      })
    },
    // 获取经销商列表信息
    queryDealerList() {
      let t = this
      t.dealerObj = {
        selected: {},
        list: [],
        baseList: []
      }
      t.purchaseCheck = false
      t.purchaseNo = ''
      Request.queryDealerList({
        provinceId: t.provinceObj.selected.regionId || '',
        cityId: t.cityObj.selected.regionId || '',
        dealerName: t.dealerName
      }).then(result => {
        if (result.success) {
          // console.log('result:>', result)
          this.restaurants = result.data
          // address: "广州市天河区石牌黄埔大道西483号"
          // dealerId: 112
          // dealerName: "广州广保"
          // lat: 23.132332
          // lng: 113.348057
          // phoneSeal: "020-62320180"
          // phoneService: "020-38909632"
          let dataList = result.data || []
          if (dataList.length > 0) {
            _.each(dataList, (item, key) => {
              item['active'] = key === 0
              if (key < 3) {
                // 默认显示3个
                t.dealerObj.list.push(item)
              }
              t.dealerObj.baseList.push(item)
            })
            t.dealerObj.selected = t.dealerObj.list[0]
          }
        }
      })
    },
    toBook() {
      let t = this
      if (t.state3 !== '') {
        t.$store.dispatch('getDealer', {
          provinceObj: t.provinceObj.selected,
          cityObj: t.cityObj.selected,
          dealerName: t.state3
        })
        t.$router.push('/wx/order/' + t.cardVoucherId + '&' + t.state3)
      } else {
        t.$toast('请选择经销商')
      }
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.dealerName.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
      }
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    handleSelect(item) {
      this.state3 = item.dealerName
      this.address = item.address
      console.log(item)
    },
    toIndex() {
      this.doBack()
    },
    // 返回
    doBack () {
      this.$router.replace('/wx/sales')
    },
    Choice(n) {
      if (n === 0) {
        this.isActive = true
      } else {
        this.isActive = false
      }
      console.log(n)
    }
  }
}
</script>
<style lang="scss">
//noinspection CssUnknownTarget
@import "~/assets/sass/pages/salesDetails/index.scss";
</style>
<style>
#autocomplete .el-input__inner {
  height: 65px !important;
  width: 670px !important;
  border: 2px solid #999999 !important;
  color: #b9b9b9 !important;
  font-size: 0.32rem !important;
  padding-left: 12px !important;
}
#autocomplete .el-input__inner:focus {
  border: 2px solid #999999 !important;
}
#autocomplete .el-autocomplete {
  border-color: #999999 !important;
}
#autocomplete .el-date-editor.el-input,
#autocomplete .el-date-editor.el-input__inner {
  height: 65px !important;
}
#autocomplete .el-autocomplete-suggestion li {
  font-size: 30px !important;
}
#autocomplete .my-autocomplete li .addr {
  font-size: 25px !important;
}
#autocomplete .el-input__prefix {
  display: none !important;
}
#autocomplete .el-picker-panel,
#autocomplete .el-date-picker .el-picker-panel__content {
  width: 700px !important;
}
.el-input.is-disabled .el-input__inner{
  color: #4a4b4c !important;
}
.line{
  display:flex;
}
.line>.right{
  margin-left:auto;
}
.add-plus {
  margin-left:auto;
  display:flex;
  font-size:30px;
  text-align: center;
}
.add-plus .one {
  display:block;
    width: 60px;
    flex:0 0 60px;
    border: 1px solid #999999;
    color: #999999;
  height: 60px;
  line-height: 60px;
}

 .add-plus .two {
    display:block;
    width: 60px;
    flex:0 0 60px;
    border: 1px solid #999999;
    color: #999999;
   height: 60px;
   line-height: 60px;
 }

  .add-plus-input{
    width:100px;
    flex:0 0 100px;
    border-top:1px solid #999;
    border-bottom:1px solid #999;
    height: 60px;
    line-height: 60px;
  }
</style>
