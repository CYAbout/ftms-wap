<template>
  <!--选配订单-->
  <div class="match-container">
    <!--头部-->
    <div class="match-header bm-box bm-box-horizontal bm-box-vertical-center">
      <div class="header-left"></div>
      <!-- <i class="iconfont icon-back"></i> -->
      <div class="bm-flex header-title">确认选配</div>
      <div class="header-right"></div>
    </div>

    <!--配置-->
    <div class="to-configure">
      <div
        v-for="(item,index) in attributeLists"
        :key="index"
        class="attribute-item bm-box bm-box-horizontal bm-box-vertical-center"
      >
        <div class="configure-title">{{item.displayName}}</div>
        <div class="configure-pic">
          <img :src="item.selected.colorUrl">
        </div>
        <div class="bm-flex"></div>
      </div>
    </div>

    <!--经销商-->
    <div class="distributor">
      <div class="distributor-title">选择提车经销商</div>
      <!--<div class="distributor-tip">根据您的定位，我们给您推荐了最近三家的经销商门店，您还可以通过右侧的快速查询来选择</div>-->
      <!--省-->
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

      <!--百度地图-->
      <div id="container" style="height:300px;width:95%;margin-left:10px;margin-top:10px"></div>

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
    </div>

    <!--增换购-->
    <div class="purchase">
      <div class="purchase-title">选择增换购</div>
      <div class="purchase-select bm-box bm-box-horizontal">
        <!--checked icon-check-full-->
        <div class="do-checked bm-flex bm-box bm-box-horizontal" :class="{'checked':purchaseCheck}">
          <div @click="purchaseCheckChange" class="icon">
            <i class="iconfont" :class="purchaseCheck? 'icon-check-full':'icon-check-empty'"></i>
          </div>
          <div class="bm-flex name">我是丰田车主</div>
        </div>
        <!--<div @click="purchaseTip" class="rule-btn">查看规则</div>-->
      </div>
      <div v-show="purchaseCheck" class="vin-edit">
        <input v-model="purchaseNo" maxlength="17" placeholder="输入VIN码" @input="vimChange" />
      </div>
    </div>

    <!--优惠码-->
    <div v-if="paAvalon"  class="payment-method purchase">
      <div class="purchase-select bm-box bm-box-horizontal">
        <div class="do-checked bm-flex bm-box bm-box-horizontal" :class="{'checked':codeCheck}">
          <div @click="codeCheckChange" class="icon">
            <i class="iconfont" :class="codeCheck? 'icon-check-full':'icon-check-empty'"></i>
          </div>
          <div class="bm-flex name">我有优惠码</div>
        </div>
      </div>
      <div v-show="codeCheck" class="vin-edit">
        <input v-if="codeDisabled" disabled v-model="uniqueUserId" placeholder="输入优惠码">
        <input v-else v-model="uniqueUserId" maxlength="9" placeholder="输入优惠码" @input="uniqueChange"/>
      </div>
    </div>

    <!--提车人-->
    <div class="lift-man">
      <div class="lift-man-title">
        购买人信息</div>
      <div class="lift-tabs">
        <div class="lift-tab" :class="{cursor:orderWay ==='PERSON'}" @click="tabClick('PERSON')">个人购买</div>
        <div class="lift-tab" :class="{cursor:orderWay ==='COMPANY'}" @click="tabClick('COMPANY')">企业购买</div>
      </div>
      <div v-show="orderWay ==='PERSON'" class="input-edit">
        <input v-if="form.hasName" v-model="form.name" type="text" disabled placeholder="姓名">
        <input v-else v-model="form.name" type="text" placeholder="姓名">
      </div>
      <div v-show="orderWay ==='PERSON'" class="input-edit">
        <input v-model="form.phone" maxlength="11" type="number" disabled placeholder="手机号">
      </div>
      <div v-show="orderWay ==='PERSON'" class="input-edit">
        <input
          v-if="form.hasCardNo"
          v-model="form.idCardNo"
          type="text"
          disabled
          placeholder="身份证号"
        >
        <input v-else v-model="form.idCardNo" type="text" placeholder="身份证号">
      </div>
      <div v-show="orderWay ==='COMPANY'" class="input-edit">
        <input  v-model="form2.companyName" type="text" placeholder="公司名称">
      </div>
      <div v-show="orderWay ==='COMPANY'" class="input-edit">
        <input  v-model="form2.organizationCode" type="text" placeholder="统一社会信用代码">
      </div>
      <div v-show="orderWay ==='COMPANY'" class="input-edit">
        <input  v-model="form2.operatorName" type="text" placeholder="经办人姓名">
      </div>
      <div v-show="orderWay ==='COMPANY'" class="input-edit">
        <input v-model="form2.operatorMobile" maxlength="11" type="number"  placeholder="经办人手机">
      </div>
      <!--提示信息-->
      <div v-show="orderWay ==='PERSON'" class="lift-man-tip">请填写真实的姓名和手机号，在订单下单成功后，我们会第一时间联系您！</div>
      <div v-show="orderWay ==='COMPANY'" class="lift-man-tip">*公司全称，统一社会信用代码，经办人姓名，经办人手机需与车辆牌照上信息一致，提车时请带上营业执照复印件和经办人身份证</div>
    </div>

    <!--意向金-->
    <div class="intentional-gold">
      <div class="intention-title">选择意向金</div>
      <!--<div class="intention-tip">选择不同级别意向金，享受礼包金额级别不同</div>-->
      <div class="edit-intention bm-box bm-box-horizontal bm-box-vertical-center bm-flex">
        <!-- <div class="label">意向金:</div> -->
        <div @click="productEarnestShow = !productEarnestShow" class="edit bm-flex">
          <span>{{productEarnestObj.selected.earnest || ''}}</span>
          <i class="iconfont icon-down-min"></i>
        </div>
      </div>
      <!--我是丰田车主优惠tip-->
      <!--<div v-show="vimCheck" class="edit-intention bm-box bm-box-horizontal bm-box-vertical-center">-->
        <!--<div class="bm-flex">-->
        <!--</div>-->
        <!--<div class="label-left">{{productEarnestObj.selected.earnestName || ''}}</div>-->
      <!--</div>-->
      <div class="edit-intention-1 bm-box bm-box-horizontal bm-box-vertical-center">
        <div class="label-left">享： {{productEarnestObj.selected.earnestName || ''}}</div>
      </div>
      <!--我有优惠码优惠tip-->
      <div v-show="uniqueCheck" class="edit-intention-1 bm-box bm-box-horizontal bm-box-vertical-center">
        <div class="label-left-1">{{productEarnestObj.selectedTip || ''}}</div>
      </div>
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
      <div class="amount-item">
        意向金：
        <span>¥</span>
        <span>{{productEarnestObj.selected.price | fMoney}}</span>
      </div>
      <div class="amount-item">
        应付金额：
        <span>¥</span>
        <span>{{productEarnestObj.selected.price | fMoney}}</span>
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
      <i class="iconfont icon-do-selected"></i>提交意向订单
    </div>

    <!--属性选择-->
    <div v-for="(item,index) in attributeLists" :key="index">
      <common-select
        :show.sync="item.selectShow"
        :options="item.selectList"
        :type="'select_'+item.sort"
        @changed="selectedChanged"
      ></common-select>
    </div>

    <!--商品意向金-->
    <common-select
      :show.sync="productEarnestShow"
      :options="productEarnestObj.selectList"
      :type="'earnest'"
      @changed="selectedChanged"
    ></common-select>
    <!--省-->
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
<script type="text/javascript" src="https://api.map.baidu.com/api?v=2.0&ak=cLdBELGluAUEuMu29sCnKZTaTghBDXo5"></script>
<script>
import { mapState } from 'vuex'
import _ from 'lodash'
import Request from '~/plugins/request'
import commonSelect from '~/components/common/layer/common-select.vue'
import termsService from '~/components/common/layer/terms-service.vue'
import BaiduMap from '~/components/common/map.js'
export default {
  name: 'match',
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
  data() {
    return {
      orderWay: 'PERSON',
      origin: '', // 来源
      utmContent: '',
      utmCampaign: '',
      protocolChecked: false,
      purchaseCheck: false,
      vimCheck: false,
      codeCheck: false,
      uniqueCheck: false,
      codeDisabled: false,
      termsServiceLayerShow: false, // 服务条款
      purchaseNo: '', // 输入VIN码
      goodsList: [], // 单品列表
      goods: {
        ecPrice: 0
      },
      attributeLists: [],
      productEarnestShow: false,
      productEarnestObj: {
        // 商品意向金
        selectedTip: '',
        selected: {},
        selectList: [],
        list: []
      },
      provinceShow: false,
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
      dealerName: '',
      dealerObj: {
        // 经销商列表
        selected: {},
        list: [],
        baseList: []
      },
      showMore: false, // 显示更多
      form: {
        name: '',
        phone: '',
        idCardNo: '',
        realName: '',
        idCard: '',
        hasCardNo: false,
        hasName: ''
      },
      form2: {
        companyName: '',
        organizationCode: '',
        operatorName: '',
        operatorMobile: ''
      },
      marker: { lng: 116.404, lat: 39.915 },
      center: { lng: 116.404, lat: 39.915 }, // 经纬度
      zoom: 3, // 地图展示级别
      uniqueUserId: '',
      paAvalon: false
    }
  },
  mounted() {
    let t = this
    t.uniqueUserId = t.$cache.uniqueUserId.get() || ''
    t.origin = t.$cache.origin.get() || ''
    // 平安保客来源 自动选中使用优惠码 自动获取优惠码 填充到输入框
    // 如优惠码格式正确 禁止用户输入 显示联动优惠
    // 如优惠码格式错误 允许用户输入修改 不显示联动优惠，
    if (t.origin === 'pinganbaoke') {
      let regExp = /^A[0-9a-zA-Z]{8}$/ // 平安保客规则
      let regTest = regExp.test(t.uniqueUserId)
      let regExp2 = /^P[0-9a-zA-Z]{7}$/ // 人保规则
      let regTest2 = regExp2.test(t.uniqueUserId)
      if (regTest || regTest2) {
        t.codeCheck = true // 选中使用优惠码
        t.codeDisabled = true // 禁止用户输
        t.uniqueUserId = t.uniqueUserId // 填充优惠码
        t.uniqueCheck = true // 显示联动优惠
      } else {
        t.codeCheck = true // 选中使用优惠码
        t.codeDisabled = false // 允许用户输入
        t.uniqueUserId = t.uniqueUserId // 填充优惠码
        t.$toast('请输入正确的优惠码~')
        t.uniqueCheck = false // 不显示联动优惠
      }
    }
    t.origin = t.$cache.origin.get() || '' // 存储来源
    console.log('origin:>', t.origin)
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
            t.skipPage('homeContainerTop')
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
    console.log('goods:>', t.goods)
    if (t.goods.productId === '12595') {
      this.paAvalon = true
    }
    console.log('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=', t.$util.Params.query('id'), t.$util.Params.query('attr1'), t.$util.Params.query('attr2'), t.$util.Params.query('attr3'))
    let newAttrs = []
    newAttrs.push(t.$util.Params.query('attr1'))
    newAttrs.push(t.$util.Params.query('attr2'))
    newAttrs.push(t.$util.Params.query('attr3'))
    console.log(newAttrs)
    t.queryGoodsAttributeList(t.goods.productId) // 查询商品规格信息
    t.queryGoodsInfoList(t.goods.productId, t.goods.goodsAttrs || newAttrs) // 查询单品列表
    t.queryProductEarnest(t.goods.productId) // 查询商品意向金
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
  computed: {
    ...mapState({
      // 映射
      userObj: state => state.user.user,
      position: state => state.user.position,
      userCode: state => state.user.userCode
    })
  },
  methods: {
    tabClick(orderWay) {
      this.orderWay = orderWay
    },
    initMap(data, lng, lat) {
      BaiduMap.init()
        .then((BMap) => {
          // 这个时候就可以访问到BMap了
          var map = new BMap.Map('container') // 创建地图实例
          var point = new BMap.Point(lng, lat) // 创建点坐标
          map.centerAndZoom(point, 12)
          function addClickHandler(content, marker) {
            marker.addEventListener('click', function (e) {
              openInfo(content, e)
            }
            )
          }
          function openInfo(content, e) {
            var p = e.target
            let opts = {
              title: "<span style='font-size:15px;color:#FF0000;background-color:#FFFFFF'></span>",
              width: 160, // 信息窗口宽度
              height: 75, // 信息窗口高度
              enableMessage: true// 设置允许信息窗发送短息
            }
            var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat)
            var infoWindow = new BMap.InfoWindow(content, opts) // 创建信息窗口对象
            map.openInfoWindow(infoWindow, point) // 开启信息窗口
          }
          function openDataMap() {
            data.map((item, ind) => {
              let pointA = new BMap.Point(item.lng, item.lat)
              let marker = new BMap.Marker(pointA) // 创建标注
              let content = '经销商名称:' + item.dealerName + '<br/>' + '地址:' + item.address + '<br/>' + '销售热线:' + item.phoneSeal + '<br/>' + '服务热线:' + item.phoneService
              var label = new BMap.Label(item.dealerName, { offset: new BMap.Size(20, -10) })
              marker.setLabel(label)
              map.addOverlay(marker)
              addClickHandler(content, marker)
            })
          }
          setTimeout(openDataMap, 100)
        })
    },
    // 查询商品规格信息
    queryGoodsAttributeList(productId) {
      let t = this
      Request.queryGoodsAttributeList({
        productId: productId
      }).then(result => {
        if (result.success) {
          // console.log('result:>', result)
          let dataList = result.data || []
          _.each(dataList, (attribute, key) => {
            attribute['selectShow'] = false
            attribute['sort'] = key + 1
            let attributeValueBOList = attribute.attributeValueBOList || []
            attribute['selectList'] = [
              {
                flex: 1,
                values: [],
                defaultIndex: 0, // 默认值
                className: 'slot-1',
                textAlign: 'center'
              }
            ]
            _.each(attributeValueBOList, (item, key) => {
              attribute.selectList[0].values.push(item.attributeValue || '')
              t.goods['goodsAttrs'] = t.goods.goodsAttrs || []
              if (
                t.goods.goodsAttrs.join(',').indexOf(item.attributeScopeId) >= 0
              ) {
                attribute['selected'] = item
                attribute.selectList[0].defaultIndex = key
              }
            })
          })
          t.attributeLists = dataList
          console.log('attributeLists:>', t.attributeLists)
        }
      })
    },
    // 查询单品列表
    queryGoodsInfoList(productId, attributes) {
      let t = this
      Request.queryGoodsInfoList({
        productId: productId,
        goodsAttributeValueIds: attributes
      }).then(result => {
        if (result.success) {
          // console.log('result:>', result)
          t.goodsList = result.data || []
          if (t.goodsList.length === 1) {
            t.goods.goodsId = t.goodsList[0].goodsId
            t.goods.goodsAttrs = attributes
            t.goods.ecPrice = t.goodsList[0].ecPrice
          }
        }
      })
    },
    // 查询商品意向金
    queryProductEarnest(productId) {
      let t = this
      Request.queryProductEarnest('', productId).then(result => {
        if (result.success) {
          // console.log('result:>', result)
          let dataList = result.data || []
          let valuesList = []
          _.each(dataList, (item, key) => {
            item['price'] = parseFloat(item.earnest)
            valuesList.push(item.earnest)
          })
          t.productEarnestObj = {
            selected: dataList[0],
            selectedTip: this.paAvalon ? dataList[0].preferentialPolicyBOList[1].preferentialPolicyName : '',
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
            // const city = {
            //   name: t.position.cityName,
            //   regionId: t.position.cityId,
            //   parentid: t.position.provinceId,
            //   type: 0
            // }
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
            if (callback) {
              callback()
            }
            t.queryDealerList() // 获取经销商列表信息
          }
        }
      })
    },
    // 搜索
    doSearch() {
      this.queryDealerList() // 获取经销商列表信息
    },
    // 获取经销商列表信息
    queryDealerList() {
      let t = this
      t.dealerObj = {
        selected: {},
        list: [],
        baseList: []
      }
      console.log('dealerObj:>', t.dealerObj)
      t.purchaseCheck = false
      t.purchaseNo = ''
      Request.queryDealerList({
        provinceId: t.provinceObj.selected.regionId || '',
        cityId: t.cityObj.selected.regionId || '',
        dealerName: t.dealerName
      }).then(result => {
        if (result.success) {
          // console.log('result:>', result)
          // 跳转地图位置
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
    // 提交订单前验证
    toSubmit() {
      let t = this
      var patrn = /^[0-9A-Z]+$/
      // 18位校验及大写校验
      if (!t.userObj.logined) {
        // 未登录
        t.$common.clearUserInfo()
        t.$messageBox.confirm('登录后才能提交订单，是否登录?').then(
          action => {
            t.skipPage('homeContainerTop')
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
        let regExp = /^A[0-9a-zA-Z]{8}$/ // 平安保客规则
        let regTest = regExp.test(t.uniqueUserId)
        let regExp2 = /^P[0-9a-zA-Z]{7}$/ // 人保规则
        let regTest2 = regExp2.test(t.uniqueUserId)
        t.dealerObj.selected['dealerId'] = t.dealerObj.selected.dealerId || ''
        if (!t.dealerObj.selected.dealerId) {
          t.$toast('请选择经销商')
        } else if (t.purchaseCheck && !t.purchaseNo) {
          t.$toast('输入VIN码')
        } else if (t.codeCheck && !t.uniqueUserId) {
          t.$toast('输入优惠码')
        } else if (t.codeCheck && !regTest && !regTest2) {
          t.$toast('输入正确的优惠码')
        } else if (t.orderWay === 'PERSON' && !t.form.name) {
          t.$toast('请输入购买人姓名')
        } else if (t.orderWay === 'PERSON' && !t.form.phone) {
          t.$toast('请输入购买人手机号码')
        } else if (
          t.orderWay === 'PERSON' && t.form.phone &&
          !t.$util.Str.isMobilePhoneNum(t.form.phone)
        ) {
          t.$toast('您输入的手机号有误，请输入正确的手机号')
        } else if (t.orderWay === 'PERSON' && !t.form.idCardNo) {
          t.$toast('请输入购买人身份证号')
        } else if (t.orderWay === 'PERSON' && t.form.idCardNo && !t.$util.Str.isUserID(t.form.idCardNo)) {
          t.$toast('您输入的身份证号有误，请输入正确的身份证号')
        } else if (t.orderWay === 'COMPANY' && !t.form2.companyName) {
          t.$toast('请输入公司名称')
        } else if (t.orderWay === 'COMPANY' && !t.form2.organizationCode) {
          t.$toast('请输入统一社会信用代码')
        } else if (t.orderWay === 'COMPANY' && (t.form2.organizationCode.length !== 18 || patrn.test(t.form2.organizationCode) === false)) {
          t.$toast('您输入的统一社会信用代码有误，请输入正确的统一社会信用代码')
        } else if (t.orderWay === 'COMPANY' && !t.form2.operatorName) {
          t.$toast('请输入经办人姓名')
        } else if (t.orderWay === 'COMPANY' && !t.form2.operatorMobile) {
          t.$toast('请输入经办人手机')
        } else if (
          t.orderWay === 'COMPANY' && t.form2.operatorMobile &&
          !t.$util.Str.isMobilePhoneNum(t.form2.operatorMobile)
        ) {
          t.$toast('您输入的手机号有误，请输入正确的手机号')
        } else if (!t.protocolChecked) {
          t.$toast('请阅读并同意《一汽丰田商城服务条款》')
        } else {
          // if (t.codeCheck) {
          //   // 如果用户选用优惠码
          //   // 提交订单前进行优惠码验证
          //   Request.checkProtectGuestReqInfo({
          //     uniqueUserId: t.uniqueUserId,
          //     type: '02',
          //     typeDes: '提交订单',
          //     sourceChannel: t.origin
          //   }).then(result => {
          //     // 接口验证优惠码正确
          //     // 去提交订单
          //     console.log('result:>', result)
          //     if (result.code === '0') {
          //       this.orderSubmit()
          //     } else {
          //       t.$toast(result.msg)
          //     }
          //   })
          // } else {
          // }
          // 用户不选用优惠码
          // 直接去提交订单
          this.orderSubmit()
        }
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
    // 验证后提交订单
    orderSubmit() {
      let t = this
      let preferentialPolicyInfo = ''
      if (t.codeCheck) {
        preferentialPolicyInfo = t.productEarnestObj.selected.earnestName + '&&' + t.productEarnestObj.selectedTip
      } else {
        preferentialPolicyInfo = t.productEarnestObj.selected.earnestName
      }
      let protectGuestCode = ''
      if (t.codeCheck) {
        protectGuestCode = t.uniqueUserId
      } else {
        protectGuestCode = ''
      }
      Request.createPreSaleOrder({
        ACCESS_TOKEN: t.userObj.data.token,
        preferentialPolicyInfo: preferentialPolicyInfo,
        goodsId: t.goods.goodsId || '',
        earnestAmount: t.productEarnestObj.selected.price || 0, // 意向金金额
        planDesc: t.productEarnestObj.selected.codeValue || '0.01', // 优惠方案描述
        dealerId: t.dealerObj.selected.dealerId || '', // 经销商Id
        dealerCityId: t.cityObj.selected.regionId || '', // 经销商所在城市Id
        dealerName: t.$util.Str.trim(t.dealerObj.selected.dealerName || ''), // 去掉 dealerName前后空格
        isOldCarowner: t.purchaseCheck ? 'Y' : 'N', // 是否老车主（Y / N）
        odlcarVinNo: t.purchaseNo || '',
        extractName: t.$util.Str.trim(t.form.name || ''), // 去掉 extractName前后空格
        extractMobilephone: t.form.phone, // 提车人手机号
        idCardNo: t.form.idCardNo,
        protectGuestCode: protectGuestCode,
        orderChannel: t.origin ? t.origin : '01', // 订单渠道来源（官方商城01、门店扫码02、花椒直播03、熊猫直播04、广告05）
        orderTerminal: t.utmContent ? t.utmContent : 'H5', // 订单终端来源（PC，WechatOfficialAccount，H5，APP）
        campaignNo: t.utmCampaign ? t.utmCampaign : '',
        buyType: t.orderWay,
        ...t.form2
      }).then(result => {
        if (result.success) {
          // if (t.codeCheck) {
          //   Request.saveProtectGuestReqInfo({
          //     mobile: t.form.phone,
          //     uniqueUserId: t.uniqueUserId,
          //     orderNo: result.data.orderNo,
          //     type: '02',
          //     typeDes: '提交订单',
          //     sourceChannel: t.origin
          //   }).then(result => {
          //     console.log('result:>', result)
          //     if (result.code !== '0') {
          //       t.$toast(result.msg)
          //     }
          //   })
          // }
          let obj = result.data || {}
          t.$toast('订单提交成功')
          console.log('result:>', obj)
          t.$cache.origin.clear() // 清除来源记录
          t.$cache.utmContent.clear()
          t.$cache.utmCampaign.clear()
          setTimeout(() => {
            t.$router.push('/wx/pay/' + obj.orderNo)
          }, 600)
        } else if (result.code === '-10') {
          t.$messageBox.confirm('登录失效，是否重新登录?').then(
            action => {
              t.skipPage('homeContainerTop')
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
    },
    // 输入vim改变
    vimChange () {
      let t = this
      let regExp = /^[0-9a-zA-Z]{17}$/
      let regTest = regExp.test(t.purchaseNo)
      if (!regTest) {
        t.$toast('请输入正确的vin码~')
        // t.vimCheck = false
      } else {
        // t.vimCheck = true
      }
    },
    // 输入优惠码改变
    uniqueChange () {
      let t = this
      let regExp = /^A[0-9a-zA-Z]{8}$/ // 平安保客规则
      let regTest = regExp.test(t.uniqueUserId)
      let regExp2 = /^P[0-9a-zA-Z]{7}$/ // 人保规则
      let regTest2 = regExp2.test(t.uniqueUserId)
      if (regTest || regTest2) {
        t.uniqueCheck = true
      } else {
        t.$toast('请输入正确的优惠码~')
        t.uniqueCheck = false
      }
    },
    // 选择器选中值改变
    selectedChanged(obj) {
      let t = this
      if (obj.type === 'earnest') {
        // 商品意向金
        t.productEarnestShow = obj.show
        console.log(t.productEarnestObj)
        _.each(t.productEarnestObj.list, (item, key) => {
          if (obj.value === item.earnest) {
            t.productEarnestObj.selectList.defaultIndex = key
            t.productEarnestObj.selected = item
            console.log('=====')
            console.log(item.preferentialPolicyBOList[1].preferentialPolicyName)
            if (this.paAvalon) {
              t.productEarnestObj.selectedTip = item.preferentialPolicyBOList[1].preferentialPolicyName
            }
            console.log(t.productEarnestObj.selectedTip)
          }
        })
      } else if (obj.type === 'province') {
        t.provinceShow = obj.show
        _.each(t.provinceObj.list, (item, key) => {
          if (obj.value === item.name) {
            t.provinceObj.selectList.defaultIndex = key
            t.provinceObj.selected = item
            t.getRegionInfo(item.regionId) // 获取城市列表
          }
        })
      } else if (obj.type === 'city') {
        t.cityShow = obj.show
        _.each(t.cityObj.list, (item, key) => {
          if (obj.value === item.name) {
            t.cityObj.selectList.defaultIndex = key
            t.cityObj.selected = item
            t.queryDealerList()
          }
        })
        // t.doSearch()
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
    // 隐藏弹出层
    doClose(obj) {
      let t = this
      if (obj.type === 'terms-service') {
        t.termsServiceLayerShow = false
      }
    },
    // 显示增换购提示
    purchaseTip() {
      this.$toast('丰田车主专享礼遇官方后续公布，敬请期待！')
    },
    // 优惠码选中状态改变
    codeCheckChange() {
      let t = this
      t.codeCheck = !t.codeCheck
      if (t.codeCheck === false) {
        t.uniqueCheck = false
        if (t.uniqueUserId) {
        } else {
          t.uniqueUserId = ''
        }
      } else {
        let regExp = /^A[0-9a-zA-Z]{8}$/ // 平安保客规则
        let regTest = regExp.test(t.uniqueUserId)
        let regExp2 = /^P[0-9a-zA-Z]{7}$/ // 人保规则
        let regTest2 = regExp2.test(t.uniqueUserId)
        if (regTest || regTest2) {
          t.uniqueCheck = true // 显示联动优惠
        }
      }
    },
    // VIM码选中状态改变
    purchaseCheckChange() {
      let t = this
      t.purchaseCheck = !t.purchaseCheck
      if (t.purchaseCheck === false) {
        t.purchaseNo = ''
        // t.vimCheck = false
      }
    }
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
          t.getRegionInfo(t.position.provinceId, () => {
            t.selectedChanged({
              show: false,
              type: 'city',
              value: t.position.cityName
            })
          })
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
    }
  }
}
</script>
<style lang="scss" scoped>
//noinspection CssUnknownTarget
.BMap_bubble_title,
.BMap_bubble_content {
  font-size: 14px !important;
}
#container {
  font-size: 18px !important;
}
@import "~/assets/sass/pages/book/match.scss";
</style>
