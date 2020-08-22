<template>
  <!--确认订单-->
  <div class="confirmation-order">
    <!--头部-->
    <div class="order-header bm-box bm-box-horizontal bm-box-vertical-center">
      <i @click="doBack" class="iconfont icon-back"></i>
      <div class="bm-flex header-title">{{title}}</div>
      <div class="header-right"></div>
    </div>

    <!-- 订单信息 -->
    <div class="order-information">
      <div class="title">商品信息</div>
      <img v-lazy="cardObj.cardVoucherImg">
      <!--<img src="~/assets/images/sales/salesPromotion_03.jpg" alt>-->
      <div class="text">
        <div class="left">{{cardObj.cardVoucherName}}</div>
        <div class="right">X1</div>
      </div>
    </div>

    <!--商品配置-->
    <div class="commodity-allocation">
      <div class="line">
        <div class="text left">卡券类型</div><div class="text right weight">{{cardObj.cardVoucherType}}</div>
      </div>
      <div class="line">
        <div class="text left">卡券用途</div><div class="text right weight brown">{{cardObj.cardVoucherUse}}</div>
      </div>
      <div class="line">
        <div class="text left">面额</div>
        <div class="text right">￥{{cardObj.cardVoucherAmount}}</div>
      </div>
      <div class="line">
        <div class="text left">支付方式</div>
        <div class="text right">在线支付</div>
      </div>
      <div class="line">
        <div class="text left weight">订单金额</div>
        <div class="text right weight brown">￥{{cardObj.cardVoucherPrice}}</div>
      </div>
      <div class="textword">您选择的经销商</div>
      <!-- <div class="gray">根据您的定位，我们给您推荐了最近三家的经销商门店，您还可以通过右侧的快速查询来选择</div> -->
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
        <!--搜索-->
        <div class="distributor-search bm-box bm-box-horizontal bm-box-vertical-center">
          <div class="bm-flex edit">
            <input v-model="dealerName" placeholder="输入经销商名称快速查询">
          </div>
          <div @click="doSearch" class="search-btn">
            <i class="iconfont icon-search"></i>
          </div>
        </div>
        <!-- 百度地图 -->
      <div id="container" style="height:300px;width:100%;margin-top:10px"></div>
       <!--特约店-->
       <ul class="special-shop-list">
        <li
          @click="doDealerSelect(item)"
          v-for="(item, index) in dealerObj.list"
          :key="index"
          class="shop-item bm-box bm-box-horizontal"
          :class="{'checked':item.active}"
        >
          <div class="icon">
            <i class="iconfont" :class="item.active? 'icon-check-full':'icon-check-empty'"></i>
          </div>
          <div class="bm-flex name">{{item.dealerName}}</div>
        </li>
      </ul>
      <!--查看更多-->
      <div @click="showMore = !showMore" v-show="dealerObj.list.length>2" class="open-more">
        {{showMore? '收起展开':'展开更多'}}
        <i
          class="iconfont"
          :class="showMore? 'icon-up-min':'icon-down-min'"
        ></i>
      </div>
        <!-- <div id="container" style="height:300px;width:95%;margin-left:10px;margin-top:10px"></div> -->
        <!--特约店-->
        <!-- <ul class="special-shop-list">
          <li
            @click="doDealerSelect(item)"
            v-for="(item, index) in dealerObj.list"
            :key="index"
            class="shop-item bm-box bm-box-horizontal"
            :class="{'checked':item.active}"
          >
            <div class="icon">
              <i class="iconfont" :class="item.active? 'icon-check-full':'icon-check-empty'"></i>
            </div>
            <div class="bm-flex name">{{item.dealerName}}</div>
          </li>
        </ul> -->
        <!--查看更多-->
        <!-- <div @click="showMore = !showMore" v-show="dealerObj.list.length>2" class="open-more">
          {{showMore? '收起展开':'展开更多'}}
          <i
            class="iconfont"
            :class="showMore? 'icon-up-min':'icon-down-min'"
          ></i>
        </div> -->

        <!--购买人-->
        <div class="lift-man">
          <div class="lift-man-title">购买人信息</div>
          <div class="input-edit">
            <input v-if="form.hasName" v-model="form.name" type="text" disabled placeholder="姓名">
            <input v-else v-model="form.name" type="text" placeholder="姓名">
          </div>
          <div class="input-edit">
            <input v-model="form.phone" maxlength="11" type="number" disabled placeholder="手机号">
          </div>
          <!--提示信息-->
          <div class="lift-man-tip">请填写真实的姓名和手机号，在订单下单成功后，我们会第一时间联系您！</div>
        </div>
        <!--支付方式-->
        <div class="payment-method purchase">
          <div class="payment-title">选择支付方式</div>
          <div class="payment-select">
            <span>在线支付</span>
            <i class="iconfont icon-down-min"></i>
          </div>
        </div>

        <!--支付金额-->
        <div class="amount-payment">
          <!--<div class="amount-item">-->
          <!--意向金：-->
          <!--<span>¥</span>-->
          <!--<span>{{productEarnestObj.selected.price | fMoney}}</span>-->
          <!--</div>-->
          <div class="amount-item">
            应付金额：
            <span>¥</span>
            <span>{{cardObj.cardVoucherPrice | fMoney}}</span>
          </div>
        </div>

        <!--服务条款-->
        <div
          class="service-provision bm-flex bm-box bm-box-horizontal"
          :class="{'checked': protocolChecked}"
        >
          <div @click="protocolChecked = !protocolChecked" class="icon">
            <i class="iconfont" :class="protocolChecked? 'icon-check-full':'icon-check-empty'"></i>
          </div>
          <div class="bm-flex name">
            我已阅读并同意
            <span style @click="termsServiceLayerShow = true">《一汽丰田官方商城服务协议》</span>
          </div>
        </div>

        <!--提交按钮-->
        <div @click="toSubmit" class="submit-btn">
          <i class="iconfont icon-do-selected"></i>提交订单
        </div>
      </div>
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

    <!--服务条款-->
    <div v-if="termsServiceLayerShow">
      <terms-service :show="termsServiceLayerShow" @close="doClose"></terms-service>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import _ from 'lodash'
import Request from '~/plugins/request'
import BaiduMap from '~/components/common/map.js'
import termsService from '~/components/common/layer/terms-service.vue'
import commonSelect from '~/components/common/layer/common-select.vue'

export default {
  components: {
    commonSelect,
    termsService,
    BaiduMap
  },
  head() {
    return {
      title: '一汽丰田官方商城',
      meta: [
        // seo
        { hid: 'keywords', name: 'keywords', content: '' },
        { hid: 'description', name: 'description', content: '' }
      ]
    }
  },
  asyncData(context) { // async await
    return {
      cardVoucherId: context.params.id.split('&')[0],
      preState3: context.params.id.split('&')[1]
    }
  },
  computed: {
    ...mapState({
      // 映射
      userObj: state => state.user.user,
      position: state => state.user.position,
      dealer: state => state.user.dealer
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
          let provId = t.position.provinceId
          let provinceName = t.position.provinceName
          let cityName = t.position.cityName
          if (t.dealer.provinceObj.regionId) {
            provId = t.dealer.provinceObj.regionId
            provinceName = t.dealer.provinceObj.name
            cityName = t.dealer.cityObj.name
          }
          t.selectedChanged({
            show: false,
            type: 'province',
            value: provinceName,
            fromChange: 'watch'
          })
          t.getRegionInfo(provId)
          setTimeout(() => {
            t.selectedChanged({
              show: false,
              type: 'city',
              value: cityName,
              fromChange: 'watch'
            })
          }, 300)
        })
      },
      immediate: true
    },
    // 显示更多
    showMore(val) {
      let t = this
      t.dealerObj.list = []
      _.each(t.dealerObj.baseList, (item, key) => {
        if (val) {
          t.dealerObj.list.push(item)
        } else {
          if (key < 3) {
            // 默认显示3个
            t.dealerObj.list.push(item)
          }
        }
      })
    },
    // 监听右侧弹出层变化
    fullPopupShow(val) {
      if (val) {
        this.resetFullPopupHeight() // 重设弹出层高度
      }
    }
  },
  data() {
    return {
      form: {
        name: '',
        phone: '',
        idCardNo: '',
        realName: '',
        idCard: '',
        hasCardNo: false,
        hasName: ''
      },
      cardObj: {}, // 卡券信息
      title: '确认订单',
      num1: 1,
      dealerName: '',
      restaurants: [],
      state3: '',
      codeCheck: false,
      protocolChecked: false,
      termsServiceLayerShow: false, // 服务条款
      provinceShow: false,
      productEarnestObj: {
        // 商品意向金
        selected: {},
        selectList: [],
        list: []
      },
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
      dealerObj: {
        // 经销商列表
        selected: {},
        list: [],
        baseList: []
      },
      showMore: false,
      isActive: true,
      marker: { lng: 116.404, lat: 39.915 },
      center: { lng: 116.404, lat: 39.915 }, // 经纬度
      zoom: 3, // 地图展示级别
      userCode: '',
      usercode: ''
    }
  },
  mounted() {
    let t = this
    // console.log('============')
    // console.log(t.dealer)
    // t.provinceObj.selected = t.dealer.provinceObj
    // t.cityObj.selected = t.dealer.cityObj
    t.dealerName = t.preState3
    console.log('dealer=', t.dealerName)
    t.doSearch()
    t.cardDetail()
    if (t.usercode.usercode) {
      t.codeCheck = true
      t.userCode = t.usercode.usercode
    }
    t.utmContent = t.$cache.utmContent.get() || ''
    t.utmCampaign = t.$cache.utmCampaign.get() || ''
    if (!t.userObj.logined) {
      // 获取登录信息
      let userObj = t.$common.getUserInfo() || ''
      if (userObj === '') {
        userObj = t.$common.getUnLoginData()
      }
      if (!userObj.logined) {
        // 未登录
        t.$common.clearUserInfo()
        t.$messageBox.confirm('登录失效，是否重新登录?').then(
          action => {
            t.syncLoadLayer({
              type: 'login',
              show: true
            })
          },
          cancel => {
            t.$common.clearUserInfo()
            t.$router.go(-1)
          }
        )
      } else {
        // 异步调用
        ; (async () => {
          try {
            var hasNameF
            t.userObj = t.$common.getUserInfo() || ''
            await t.$store.dispatch('doLogin', userObj)
            await t.$store.dispatch('getUserInfo', t.userObj.data)
            t.userObj.data['realName'] = t.userObj.data.realName || t.userObj.data.loginName || ''
            t.userObj.data['idCard'] = t.userObj.data.idCard || ''
            if (t.userObj.data.realName !== '') {
              hasNameF = true
            } else {
              hasNameF = false
            }
            t.form = {
              name: t.userObj.data.realName || '',
              phone: t.userObj.data.mobile || '',
              idCardNo: t.userObj.data.idCard || '',
              hasCardNo: t.userObj.data.idCard !== '',
              hasName: hasNameF,
              realName: t.userObj.data.realName || '',
              idCard: t.userObj.data.idCard || ''
            }
          } catch (error) {
            console.log(error)
          }
        })()
      }
    } else {
      (async () => {
        try {
          var hasNameF
          t.userObj = t.$common.getUserInfo() || ''
          await t.$store.dispatch('getUserInfo', t.userObj.data)
          t.userObj.data['realName'] = t.userObj.data.realName || ''
          t.userObj.data['idCard'] = t.userObj.data.idCard || ''
          if (t.userObj.data.realName !== '') {
            hasNameF = true
          } else {
            hasNameF = false
          }
          t.form = {
            name: t.userObj.data.realName || '',
            phone: t.userObj.data.mobile || '',
            idCardNo: t.userObj.data.idCard || '',
            hasCardNo: t.userObj.data.idCard !== '',
            hasName: hasNameF,
            realName: t.userObj.data.realName || '',
            idCard: t.userObj.data.idCard || ''
          }
        } catch (error) {
          console.log(error)
        }
      })()
    }
    t.goods = t.$util.Str.strToJson(t.$cache.goods.get())
    // t.getRegionInfo('0', prov => {
    //   // 获取区域信息
    //   // t.getRegionInfo(prov.regionId)
    //   t.selectedChanged({
    //     show: false,
    //     type: 'province',
    //     value: t.position.provinceName
    //   })
    //   t.getRegionInfo(t.position.provinceId)
    //   setTimeout(() => {
    //     t.selectedChanged({
    //       show: false,
    //       type: 'city',
    //       value: t.position.cityName
    //     })
    //     t.doSearch()
    //   }, 300)
    // })
    // t.$store.dispatch('getPosition', {
    //   provinceName: t.position.provinceName,
    //   provinceId: t.position.provinceId,
    //   cityName: t.position.cityName,
    //   cityId: t.position.cityId
    // })
    setTimeout(() => {
      t.$util.win.goTop() // 回到顶部
    }, 400)

    // this.initMap(this.center.lng, this.center.lat, this.marker)
  },
  methods: {
    // 获取卡券详情
    cardDetail() {
      let t = this
      Request.cardDetail('', t.cardVoucherId).then(result => {
        if (result.success) {
          t.cardObj = result.data || {}
          t.cardObj['cardVoucherName'] = t.cardObj.cardVoucherName || ''
        }
      })
    },
    initMap(data, lng, lat) {
      BaiduMap.init().then(BMap => {
        // 这个时候就可以访问到BMap了
        var map = new BMap.Map('container') // 创建地图实例
        var point = new BMap.Point(lng, lat) // 创建点坐标
        map.centerAndZoom(point, 12)
        function addClickHandler(content, marker) {
          marker.addEventListener('click', function (e) {
            openInfo(content, e)
          })
        }
        function openInfo(content, e) {
          var p = e.target
          let opts = {
            title:
              "<span style='font-size:15px;color:#FF0000;background-color:#FFFFFF'></span>",
            width: 160, // 信息窗口宽度
            height: 75, // 信息窗口高度
            enableMessage: true // 设置允许信息窗发送短息
          }
          var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat)
          var infoWindow = new BMap.InfoWindow(content, opts) // 创建信息窗口对象
          map.openInfoWindow(infoWindow, point) // 开启信息窗口
        }
        function openDataMap() {
          data.map((item, ind) => {
            let pointA = new BMap.Point(item.lng, item.lat)
            let marker = new BMap.Marker(pointA) // 创建标注
            let content =
              '经销商名称:' +
              item.dealerName +
              '<br/>' +
              '地址:' +
              item.address +
              '<br/>' +
              '服务热线:' +
              item.phoneService +
              '<br/>' +
              '销售热线:' +
              item.phoneSeal
            var label = new BMap.Label(item.dealerName, {
              offset: new BMap.Size(20, -10)
            })
            marker.setLabel(label)
            map.addOverlay(marker)
            addClickHandler(content, marker)
          })
        }
        setTimeout(openDataMap, 100)
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
            const fromChange = obj.fromChange !== 'watch'
            t.getRegionInfo(item.regionId, null, fromChange) // 获取城市列表
          }
        })
      } else if (obj.type === 'city') {
        t.cityShow = obj.show
        _.each(t.cityObj.list, (item, key) => {
          if (obj.value === item.name) {
            // t.dealerName = ''
            t.cityObj.selectList.defaultIndex = key
            t.cityObj.selected = item
            t.queryDealerList()
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
      console.log(obj)
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
    getRegionInfo(id = '0', callback, fromChange) {
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
            const selected = t.dealer.provinceObj.regionId ? t.dealer.provinceObj : dataList[0]
            console.log('selected', JSON.stringify(selected))
            t.provinceObj = {
              // 省
              selected,
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
            t.$store.dispatch('getDealer', {
              provinceObj: {},
              cityObj: {},
              dealerName: ''
            })
          } else {
            const city = fromChange ? dataList[0] : {
              name: t.position.cityName,
              regionId: t.position.cityId,
              parentid: t.position.provinceId,
              type: 0
            }
            t.cityObj = {
              // 市
              selected: city,
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
              callback()
            }
            if (fromChange) {
              t.dealerName = ''
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
          this.initMap(result.data, result.data[0].lng, result.data[0].lat)
          // address: "广州市天河区石牌黄埔大道西483号"
          // dealerId: 112
          // dealerName: "广州广保"
          // lat: 23.132332
          // lng: 113.348057
          // phoneSeal: "020-62320180"
          // phoneService: "020-38909632"
          let dataList = result.data || []
          if (dataList.length > 0) {
            t.dealerObj.list = []
            t.dealerObj.baseList = []
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
      this.$router.replace('/wx/order')
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.dealerName
            .toLowerCase()
            .indexOf(queryString.toLowerCase()) !== -1
        )
      }
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants
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
    doBack() {
      this.$router.replace('/wx/sales')
    },
    Choice(n) {
      if (n === 0) {
        this.isActive = true
      } else {
        this.isActive = false
      }
      console.log(n)
    },
    // 隐藏弹出层
    doClose(obj) {
      let t = this
      if (obj.type === 'terms-service') {
        t.termsServiceLayerShow = false
      }
    },
    // 搜索
    doSearch() {
      this.queryDealerList() // 获取经销商列表信息
    },
    // 提交订单
    toSubmit() {
      let t = this
      if (!t.userObj.logined) {
        // 未登录
        t.$common.clearUserInfo()
        t.$messageBox.confirm('登录后才能提交订单，是否登录?').then(
          action => {
            t.syncLoadLayer({
              type: 'login',
              show: true
            })
          },
          cancel => {
            t.$common.clearUserInfo()
            t.$router.go(-1)
          }
        )
      } else {
        t.dealerObj.selected['dealerId'] = t.dealerObj.selected.dealerId || ''
        if (!t.dealerObj.selected.dealerId) {
          t.$toast('请选择经销商')
        } else if (!t.form.name) {
          t.$toast('请输入购买人姓名')
        } else if (!t.form.phone) {
          t.$toast('请输入购买人手机号码')
        } else if (!t.protocolChecked) {
          t.$toast('请阅读并同意《一汽丰田商城服务条款》')
        } else {
          Request.createCardVoucherOrder({
            ACCESS_TOKEN: t.userObj.data.token,
            activeId: '1', // 活动id
            cardVoucherAmount: t.cardObj.cardVoucherPrice, // 卡券售价
            dealerId: t.dealerObj.selected.dealerId || '', // 经销商Id
            dealerCityId: t.cityObj.selected.regionId || '', // 经销商城市Id
            dealerName: t.$util.Str.trim(t.dealerObj.selected.dealerName || ''), // 经销商名称 去掉dealerName前后空格
            goodsCount: '1', // 商品数量
            goodsId: t.cardObj.cardVoucherId || '', // 商品ID（卡券id）
            memberName: t.$util.Str.trim(t.form.name || ''), // 用户名称 去掉 memberName前后空格
            orderChannel: t.origin ? t.origin : '01', // 订单渠道来源（官方商城01、门店扫码02、花椒直播03、熊猫直播04、广告05）
            orderTerminal: t.utmContent ? t.utmContent : 'H5' // 订单终端来源（PC，WechatOfficialAccount，H5，APP）
          }).then(result => {
            if (result.success) {
              let obj = result.data || {}
              t.$toast('订单提交成功')
              // console.log('result:>', obj)
              t.$cache.origin.clear() // 清除来源记录
              t.$cache.utmContent.clear()
              t.$cache.utmCampaign.clear()
              setTimeout(() => {
                t.$router.push('/wx/pay/' + obj.orderNo)
              }, 600)
            } else if (result.code === '-10') {
              t.$messageBox.confirm('登录失效，是否重新登录?').then(
                action => {
                  t.syncLoadLayer({
                    type: 'login',
                    show: true
                  })
                },
                cancel => {
                  t.$common.clearUserInfo()
                  t.$router.go(-1)
                }
              )
            } else {
              t.$toast(result.msg)
            }
          })
        }
      }
    }
  }
}
</script>
<style lang="scss">
//noinspection CssUnknownTarget
@import "~/assets/sass/pages/order/index.scss";
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
.el-input.is-disabled .el-input__inner {
  color: #4a4b4c !important;
}
</style>
