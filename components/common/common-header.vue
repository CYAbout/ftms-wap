<template>
  <!--公共头部-->
  <header id="common-header" class="common-header bm-header bm-box bm-box-horizontal bm-box-vertical-center">
   <div style="width:100%;position:fixed;z-index:100;background:#ffffff;height: 1.3333rem;" id="myHeader">
     <div class="logo" id="header">
       <a :href="userObj.data.token?'https://m.ftms.com.cn/?token='+userObj.data.token:'https://m.ftms.com.cn/'">
       <img class="logoo" src="~/assets/images/top_bottom/logo_top.png"/>
       </a>
    </div>
    <a class="site" href="/wx">官方商城</a>
    <!--定位、地址选择（隐藏）-->
    <div v-if="true" @click="doAddressSelect" class="location bm-flex bm-box bm-box-horizontal" style="position: absolute;top: 0;right: 50px;width: 70px;">
      <div class="bm-flex"><span style="text-overflow: ellipsis">{{cityObj.selected.name || bMapH5Position.city}}</span></div>
      <i class="iconfont" :class="addressPopupVisible? 'icon-up-min':'icon-down-min'"></i>
    </div>
    <div v-else class="bm-flex"></div>
    <!--菜单-->
    <div @click="doMenuSelect" class="menu" >
      <!--:class="rightPopupVisible? 'open menu': 'menu'"-->
      <!--<img src="~/assets/images/home/user.png">-->
      <i v-show="rightPopupVisible" class="img1"><img src="~/assets/images/top_bottom/right_icon1.png"></i>
      <i v-show="!rightPopupVisible" class="img2"><img src="~/assets/images/top_bottom/right_icon2.png"></i>
    </div>
  </div>
    <!--右侧弹出层-->
    <div class="right-popup">
      <mt-popup
        :class="leftContentShow? 'full-width':''"
        v-model="rightPopupVisible"
        position="right"
        popup-transition="popup-fade">
        <!--左边内容区-->
        <div class="popup-content bm-box bm-box-horizontal bm-box-vertical-center">
          <!--内容区-->
          <div v-if="leftContentShow" :style="{'height': (popupContentHeight)+'px'}"
               class="bm-flex left-content bm-box bm-box-vertical">
            <!--车列表-->
            <ul v-if="categoryType === '1'" class="new-car-list bm-flex">
              <li v-for="(item,index) in productList" :key="index" class="car-item">
                <div class="flag-list bm-box bm-box-horizontal bm-box-vertical-center">
                  <img v-show="item.cardVoucherId != -1" src="~/assets/images/home/cu_word.png">
                </div>
                <div @click="toPage('details', item)" class="car-pic normal">
                  <img v-lazy="item.proImageUrl"/>
                </div>
                <div @click="toPage('details', item)" class="title">{{item.productName}}</div>
                <div @click="toPage('details', item)" class="order-btn">预约试驾<i class="iconfont icon-next"></i></div>
              </li>
              <!--<li class="car-item">-->
              <!--<div class="car-pic">-->
              <!--<img src="~/assets/images/home/car2.png"/>-->
              <!--</div>-->
              <!--<div class="title">AVALON 亚洲龙</div>-->
              <!--<div class="order-btn">立即预定<i class="iconfont icon-next"></i></div>-->
              <!--</li>-->
            </ul>
            <!--热销车型-->
            <ul v-else class="hot-selling-list bm-flex">
              <li @click="toPage('details', item)" v-for="(item,index) in productList" :key="index" class="car-item">
                <div class="flag-list bm-box bm-box-horizontal bm-box-vertical-center">
                  <img v-show="item.cardVoucherId != -1" src="~/assets/images/home/cu_word.png">
                </div>
                <div class="car-pic normal">
                  <img v-lazy="item.proImageUrl"/>
                </div>
                <div class="title">{{item.productName}}</div>
                <div class="sub-title">{{item.kind || ''}}</div>
                <!--<div class="sub-title">建议价格{{(item.basePrice/10000) | fMoney}}万</div>-->
              </li>
              <!--<li class="car-item">-->
              <!--<div class="car-pic">-->
              <!--<img src="~/assets/images/home/car2.png"/>-->
              <!--</div>-->
              <!--<div class="title">AVALON 亚洲龙</div>-->
              <!--<div class="sub-title">建议价格44.38-61.58万</div>-->
              <!--</li>-->
            </ul>

            <!--更多-->
            <i class="down-icon iconfont icon-unfold"></i>
          </div>
          <div v-else class="bm-flex"></div> <!--用来撑开左边 -->
          <!--右边内容区-->
          <div :style="{'height': popupContentHeight+'px'}" class="right-content bm-box bm-box-vertical">
            <!--头像-->
            <div class="head-portrait">
              <img @click="toPage('user')" :src="userObj.data.memberLogo || memberLogo || ''"/>
              <!--已登录-->
              <div @click="toPage('user')" v-if="userObj.logined" class="has-logined">
                Hi! {{userObj.data.loginName}}
              </div>
              <!--未登录-->
              <div v-else class="login-register bm-box bm-box-horizontal bm-box-vertical-center">
                <div @click="doLogin" class="bm-flex">登录</div>
                <div @click="doRegister" class="bm-flex">注册</div>
              </div>
            </div>
            <!--菜单-->
            <ul class="menu-list bm-flex">
              <li @click="backHome" class="list-item">首页</li>
              <li class="list-item">
                <div @click="saleListShow = !saleListShow" class="item-name bm-box bm-box-horizontal">
                  <span>在售车型</span>
                  <i class="iconfont" :class="saleListShow? 'icon-up-min':'icon-down-min'"></i>
                </div>

                <!--下拉列表-->
                <ul v-if="saleListShow" class="on-sale-list">
                  <li @click="showCategory(item)" v-for="(item,index) in newHotList" :key="index" class="on-sale-item"
                      :class="{'active': item.active}">
                    {{item.codeValue}}
                    <img v-if="item.codeNo === '1'" class="flag" src="~/assets/images/home/new.png"/>
                    <img v-else class="flag" src="~/assets/images/home/hot.png"/>
                  </li>
                  <!--<li @click="showCategory('1')" class="on-sale-item active">-->
                  <!--新车上市-->
                  <!--<img class="flag" src="~/assets/images/home/new.png"/>-->
                  <!--</li>-->
                  <!--<li @click="showCategory('2')" class="on-sale-item">-->
                  <!--热销车型-->
                  <!--<img class="flag" src="~/assets/images/home/hot.png"/>-->
                  <!--</li>-->
                  <li @click="showCategory(item)" v-for="(item) in categoryList" :key="item.proCatalogId"
                      class="on-sale-item"
                      :class="{'active': item.active}">{{item.proCatalogName}}
                  </li>
                  <!--<li class="on-sale-item">轿车</li>-->
                  <!--<li class="on-sale-item">SUV</li>-->
                  <!--<li class="on-sale-item">一汽丰田双擎</li>-->
                  <!--<li class="on-sale-item">中型客车</li>-->
                  <!--<li class="on-sale-item">原装进口</li>-->
                </ul>
              </li>
              <li @click="goDistributor" class="list-item">经销商查询</li>
              <!-- <li v-show="ifShow" @click="goSalesPromotion" class="list-item">促销活动</li> -->
              <li v-if="userObj.logined" @click="toPage('user')" class="list-item">个人中心</li>
              <li v-else @click="doLogin" class="list-item">个人中心</li>
              <li v-if="userObj.logined" @click="toPage('order')" class="list-item">我的订单</li>
              <li v-else @click="doLogin" class="list-item">我的订单</li>
            </ul>
            <!--退出登录-->
            <div @click="doLoginOut" v-show="userObj.logined" class="login-out">
              退出登录
            </div>
          </div>
        </div>
      </mt-popup>
      <!--遮罩-->
      <div @click="closeRightMask" v-show="rightMaskShow" class="v-modal" style="z-index: 2004;"></div>
    </div>

    <!--下方地址选择弹出层（隐藏）-->
    <div v-if="addressPopupVisible" class="address-select-popup">
      <mt-popup
        v-model="addressPopupVisible"
        position="right"
        popup-transition="popup-fade">
        <div class="select-content bm-box bm-box-vertical" :style="{'height': (popupContentHeight)+'px'}">
          <!--搜索框-->
          <div class="select-header bm-box bm-box-horizontal">
            <div class="bm-flex search-input">
              <input v-model="addressKey" placeholder="请输入城市名称"/>
            </div>
            <div @click="searchProvince" class="search-btn"><i class="iconfont icon-search"></i></div>
          </div>
          <!--定位-->
          <div class="bd-location">
            <div class="tip">当前定位</div>
            <div class="location-line bm-box bm-box-horizontal bm-box-vertical-center">
              <div class="name bm-box bm-box-horizontal">
                <i class="iconfont icon-position"></i>
                <mt-spinner class="load-icon" v-if="isRotate" :size="18" color="rgb(38, 162, 255)"
                            type="double-bounce"></mt-spinner>
                <span @click="selectPosition" v-else>{{bMapH5Position.city || ''}}</span>
              </div>
              <div class="bm-flex"></div>
              <div @click="baiduLocation" class="refresh"><i class="iconfont icon-refresh"></i>重新定位</div>
            </div>
            <div class="separate-line"></div>
          </div>
          <!--选择区-->
          <div class="bm-flex select-group bm-box bm-box-horizontal">
            <!--省-->
            <div class="province-list" ref="scroll">
              <!--<div class="province-item active">常用</div>-->
              <div @click="selectedAddress(item)" v-for="(item,index) in provinceObj.list" :key="index"
                   class="province-item"
                   :class="{'active':item.active}"><span>{{item.name || ''}}</span>
              </div>
              <!--<div class="province-item">河北</div>-->
              <!--<div class="province-item">山西</div>-->
              <!--<div class="province-item">内蒙</div>-->
              <!--<div class="province-item">辽宁</div>-->
              <!--<div class="province-item">吉林</div>-->
              <!--<div class="province-item">河北</div>-->
              <!--<div class="province-item">山西</div>-->
              <!--<div class="province-item">内蒙</div>-->
              <!--<div class="province-item">辽宁</div>-->
              <!--<div class="province-item">吉林</div>-->
              <!--<div class="province-item">河北</div>-->
              <!--<div class="province-item">山西</div>-->
              <!--<div class="province-item">内蒙</div>-->
              <!--<div class="province-item">辽宁</div>-->
              <!--<div class="province-item">吉林</div>-->
            </div>
            <!--市-->
            <div class="bm-flex city-list">
              <!--最近访问-->
              <div v-show="false" class="recent-visit">
                <div class="label-title">最近访问</div>
                <ul>
                  <li>北京</li>
                  <li>上海</li>
                </ul>
              </div>

              <!--热门城市-->
              <div v-show="false" class="hot-city">
                <div class="label-title">热门城市</div>
                <ul>
                  <li>北京</li>
                  <li>上海</li>
                  <li>深圳</li>
                  <li>广州</li>
                  <li>杭州</li>
                  <li>武汉</li>
                  <li>成都</li>
                </ul>
              </div>

              <!--城市列表-->
              <ul class="prv-city-list">
                <li @click="selectedAddress(item)" v-for="(item,index) in cityObj.list" :key="index"
                    :class="{'active':item.active}">
                  {{item.name || ''}}
                </li>
                <!--<li>上海</li>-->
                <!--<li>深圳</li>-->
                <!--<li>广州</li>-->
                <!--<li>杭州</li>-->
                <!--<li>武汉</li>-->
                <!--<li>成都</li>-->
              </ul>

            </div>
          </div>
        </div>

      </mt-popup>
    </div>

    <!--登录-->
    <div v-if="loginLayerShow">
      <login-layer :show="loginLayerShow" @close="doClose"></login-layer>
    </div>

    <!--注册-->
    <div v-if="registerLayerShow">
      <register-layer :show="registerLayerShow" @close="doClose"></register-layer>
    </div>

    <!--注册下一步-->
    <div v-if="registerNextLayerShow">
      <register-next-layer :show="registerNextLayerShow" :options="registerObj" @close="doClose"></register-next-layer>
    </div>

    <!--注册协议-->
    <div v-if="agreementLayerShow">
      <agreement-layer :show="agreementLayerShow" @close="doClose"></agreement-layer>
    </div>

    <!--验证手机号-->
    <div v-if="verificationMoblieShow">
      <verification-mobile :show="verificationMoblieShow" @close="doClose"></verification-mobile>
    </div>
    <!--重置密码-->
    <div v-if="setPasswordShow">
      <set-password :show="setPasswordShow" :options="resetPasswordObj" @close="doClose"></set-password>
    </div>
    <!--重置密码成功-->
    <div v-if="setSuccessShow">
      <set-success :show="setSuccessShow" @close="doClose"></set-success>
    </div>
    <!--<div class="hongbao" style="position: fixed;z-index: 1000;bottom:1rem;right: 0.01rem;">-->
      <!--<a href="http://www.knowology.cn:8082/OnlineCustomer_YQFT" target="_blank">-->
        <!--<img class="logoo" style="width:2.22rem;height:2.72rem;" src="~/assets/images/top_bottom/hongbao.png"/>-->
      <!--</a>-->
    <!--</div>-->
  </header>
</template>

<script>
  import _ from 'lodash'
  import { mapState } from 'vuex'
  import Request from '~/plugins/request'
  import loginLayer from './layer/login.vue'
  import registerLayer from './layer/register.vue'
  import registerNextLayer from './layer/register-next.vue'
  import agreementLayer from './layer/agreement.vue'
  import verificationMobile from '~/components/common/layer/verification-mobile.vue'
  import setPassword from '~/components/common/layer/set-password.vue'
  import setSuccess from '~/components/common/layer/set-success.vue'
  import headPortrait from '~/assets/images/center_common/head_portrait.png'

  export default {
    components: {
      loginLayer,
      registerLayer,
      registerNextLayer,
      agreementLayer,
      verificationMobile,
      setPassword,
      setSuccess
    },
    data () {
      return {
        ifShow: true,
        rightPopupVisible: false, // 右侧弹出层
        rightMaskShow: false, // 右侧弹出层额外遮罩
        leftContentShow: false, // 弹出层左侧内容区显示
        saleListShow: false, // 在售车型 列表
        loginLayerShow: false, // 登录弹窗显示
        registerLayerShow: false, // 注册弹窗显示
        registerNextLayerShow: false, // 注册下一步弹窗显示
        agreementLayerShow: false, // 注册协议弹窗显示
        verificationMoblieShow: false, // 验证手机号
        setPasswordShow: false, // 重置密码
        setSuccessShow: false, // 重置成功
        addressPopupVisible: false, // 地址选择弹出层
        popupContentHeight: 0, // 弹出层内容区高度
        categoryType: '1', // 分类 1 -- 新车； 2 -- 其他
        isRotate: true, // 是否旋转
        newHotList: [], // 新品和热销
        categoryList: [], // 分类
        productList: [], // 商品列表
        registerObj: { // 注册对象
          phone: '',
          picCode: '',
          phoneCode: '',
          checked: false
        },
        resetPasswordObj: { // 找回密码对象
          phone: '',
          code: ''
        },
        // 百度地图定位地址
        // bMapIpPosition: {
        //   address: '', // 北京
        //   city: '',
        //   point: {
        //     lat: 0,
        //     lng: 0
        //   }
        // },
        // 百度地图H5定位地址
        bMapH5Position: {
          province: '', // 北京
          city: ''
        },
        addressKey: '', // 地址搜索关键字
        provinceObj: { // 省
          selected: {},
          list: []
        },
        cityObj: { // 市
          selected: {},
          list: []
        },
        memberLogo: headPortrait
      }
    },
    mounted () {
      this.queryCardActivity()
      let t = this
      // console.log('userObj:>', t.userObj)
      if (t.$dataSyncEmit) { // 监听
        // 调起弹层
        t.$dataSyncEmit.$on('load-layer-sync', function (Obj) {
          // console.log('load-layer-sync:>', Obj)
          if (Obj.type === 'login') {
            t.loginLayerShow = Obj.show
            // 防止关闭所有遮罩层
            if (!Obj.show && t.rightPopupVisible) {
              t.rightMaskShow = true
              t.registerLayerShow = false
            }
          }
        })
      }

      // 获取登录信息
      if (!t.userObj.logined) {
        let userObj = t.$common.getUserInfo() || ''
        if (userObj === '') {
          userObj = t.$common.getUnLoginData()
        }
        if (!userObj.logined) { // 未登录
          t.$common.clearUserInfo()
        }
        t.$store.dispatch('doLogin', userObj)
      }

      // 调用百度定位
      if (t.position.cityName) {
        // console.log('========t.position==========')
        // console.log(t.position)
      } else {
        t.baiduLocation()
      }
      t.getSysCodeValues() // 获取系统码信息
      t.getProCatalogByParentId() // 获取前台分类筛选条件

      t.getRegionInfo('0', prov => { // 获取区域信息
        t.getRegionInfo(prov.regionId)
      })

      // 监听屏幕大小变化
      window.onresize = () => {
        // console.log('----resize----')
        t.resetRightPopHeight()
        // window.location.reload() // 重新加载页面
      }
    },
    destroyed () {
      this.hideAllLayer()// 隐藏所有弹出层
    },
    computed: {
      ...mapState({ // 映射
        userObj: state => state.user.user,
        position: state => state.user.position
      })
    },
    methods: {
      // 获取卡券活动信息
      queryCardActivity() {
        let t = this
        Request.queryCardActivity({}).then(result => {
          if (result.success) {
            // console.log('wwwww', result)
            if (result.code === '0') {
              t.ifShow = true
            } else {
              t.ifShow = false
            }
            // console.log('ddddd', this.code)
          } else {
            t.ifShow = false
          }
        })
      },
      // 重设弹出层高度
      resetRightPopHeight () {
        let t = this
        let pageHeight = t.$util.View.height
        // eslint-disable-next-line no-undef
        let headHeight = $('.common-header').height() || 0
        t.popupContentHeight = pageHeight - headHeight // 弹出层内容区高度

        // console.log('pageHeight:>', pageHeight)
        // console.log('headH:>', headHeight)
      },
      // 地址选择
      doAddressSelect () {
        let t = this
        t.rightPopupVisible = false
        t.addressPopupVisible = !t.addressPopupVisible
      },
      // 菜单选择
      doMenuSelect () {
        let t = this
        t.addressPopupVisible = false
        t.rightPopupVisible = !t.rightPopupVisible
        t.rightMaskShow = false
      },
      // 退出登录
      doLoginOut () {
        let t = this
        try {
          Request.logout({
            'ACCESS_TOKEN': t.userObj.data.token
          }).then(result => {
            if (result.success) {
              t.$toast('退出登录成功')
              t.clearAndBack() // 清除用户信息并返回
            } else {
              t.$toast('退出登录成功')
              t.clearAndBack() // 清除用户信息并返回
            }
          })
        } catch (e) {
          // 清除用户信息并返回
          t.clearAndBack()
        }
      },
      // 清除用户信息并返回
      clearAndBack () {
        let t = this
        t.$common.clearUserInfo()
        t.$store.dispatch('doLogin', t.$common.getUnLoginData())
        const href = window.location.href
        if (href.indexOf('/user') >= 0 || href.indexOf('/pay') >= 0 || href.indexOf('/book') >= 0 || href.indexOf('/lucky') >= 0 || href.indexOf('/luckdraw') >= 0 || href.indexOf('/yhctActPage') >= 0 || href.indexOf('/activityMay') >= 0) {
          t.$router.replace('/wx')
        }
      },
      // 隐藏弹出层
      doClose (obj) {
        let t = this
        if (obj.type === 'login') {
          t.registerLayerShow = false
          t.registerNextLayerShow = false
          t.loginLayerShow = obj.show
          // 防止关闭所有遮罩层
          if (!obj.show && t.rightPopupVisible) {
            t.rightMaskShow = true
          }
        } else if (obj.type === 'register') {
          t.loginLayerShow = false
          t.registerLayerShow = obj.show
          // 防止关闭所有遮罩层
          if (!obj.show && t.rightPopupVisible) {
            t.rightMaskShow = true
          }
        } else if (obj.type === 'register-next') {
          t.loginLayerShow = false
          t.registerLayerShow = false
          t.registerNextLayerShow = obj.show
          t.registerObj = obj.form || {}
          // 防止关闭所有遮罩层
          if (!obj.show && t.rightPopupVisible) {
            t.rightMaskShow = true
          }
        } else if (obj.type === 'agreement') { // 注册协议
          t.agreementLayerShow = obj.show
          if (!obj.show) {
            t.registerLayerShow = true
          } else {
            t.registerLayerShow = false
          }
        } else if (obj.type === 'verification') {
          t.loginLayerShow = false
          t.registerLayerShow = false
          t.verificationMoblieShow = obj.show
          // 防止关闭所有遮罩层
          if (!obj.show && t.rightPopupVisible) {
            t.rightMaskShow = true
          }
        } else if (obj.type === 'password') {
          t.loginLayerShow = false
          t.registerLayerShow = false
          t.verificationMoblieShow = false
          t.setPasswordShow = obj.show
          t.resetPasswordObj = obj.form || {}
          // 防止关闭所有遮罩层
          if (!obj.show && t.rightPopupVisible) {
            t.rightMaskShow = true
          }
        } else if (obj.type === 'success') {
          t.loginLayerShow = false
          t.registerLayerShow = false
          t.verificationMoblieShow = false
          t.setPasswordShow = false
          t.setSuccessShow = obj.show
          // 防止关闭所有遮罩层
          if (!obj.show && t.rightPopupVisible) {
            t.rightMaskShow = true
          }
          if (obj.flag === 'complete') {
            t.loginLayerShow = true
          }
        }

        // 重置弹层层级
        if (t.rightPopupVisible && !t.loginLayerShow && !t.registerLayerShow && !t.registerNextLayerShow && !t.verificationMoblieShow && !t.setPasswordShow && !t.setSuccessShow) {
          // eslint-disable-next-line no-undef
          $('.right-popup > .v-modal').css({'z-index': 1000})
          // eslint-disable-next-line no-undef
          $('.right-popup > .mint-popup').css({'z-index': 1001})
        }
      },
      // 关闭额外遮罩
      closeRightMask () {
        let t = this
        t.rightMaskShow = false
        t.rightPopupVisible = false
      },
      // 隐藏所有弹出层
      hideAllLayer () {
        let t = this
        t.rightPopupVisible = false // 右侧弹出层
        t.rightMaskShow = false // 右侧弹出层额外遮罩
        t.leftContentShow = false // 弹出层左侧内容区显示
        t.saleListShow = false // 在售车型 列表
        t.loginLayerShow = false // 登录弹窗显示
        t.registerLayerShow = false // 注册弹窗显示
        t.registerNextLayerShow = false // 注册下一步弹窗显示
        t.agreementLayerShow = false // 注册协议弹窗显示
        t.verificationMoblieShow = false // 验证手机号
        t.setPasswordShow = false // 重置密码
        t.setSuccessShow = false // 重置成功
        t.addressPopupVisible = false // 地址选择弹出层
      },
      doLogin () {
        this.skipPage('homeContainerTop')
        this.loginLayerShow = !this.loginLayerShow
      },
      doRegister () {
        this.skipPage('homeContainerTop')
        this.registerLayerShow = !this.registerLayerShow
      },
      // 跳转
      skipPage(id) {
        let t = this
        window.location.hash = '#' + id
        setTimeout(() => { // 清除hash
          t.$router.replace('')
        }, 600)
      },
      // 返回首页
      backHome () {
        let t = this
        t.hideAllLayer()// 隐藏所有弹出层
        t.$router.replace('/wx')
      },
      goDistributor() {
        // t.$router.replace('/www.baidu.com')
        // window.location.href = 'https://m.ftms.com.cn/buy/dealer?timestamp=1545223438'
        if (this.userObj.data.token) {
          window.location.href = 'https://m.ftms.com.cn/buycar/chaxunjxs?token=' + this.userObj.data.token + '&timestamp=1545223438'
        } else {
          window.location.href = 'https://m.ftms.com.cn/buycar/chaxunjxs?timestamp=1545223438'
        }
      },
      // 促销活动
      goSalesPromotion() {
        let t = this
        t.hideAllLayer()// 隐藏所有弹出层
        t.$router.push('/wx/sales')
      },
      // 跳转页面
      toPage (type, item) {
        let t = this
        // 清除选中效果
        _.each(t.newHotList, (newHot, key) => {
          newHot['active'] = false
        })
        _.each(t.categoryList, (category, key) => {
          category['active'] = false
        })

        if (type === 'user') {
          if (t.userObj.logined) {
            t.hideAllLayer()// 隐藏所有弹出层
            t.$router.push('/wx/user')
          } else {
            t.loginLayerShow = true // 登录弹窗显示
            // t.$messageBox.confirm('您还未登录，是否去登录?').then(action => {
            //   t.loginLayerShow = true // 登录弹窗显示
            // }, cancel => {
            //   t.$common.clearUserInfo()
            // })
          }
        } else {
          t.hideAllLayer()// 隐藏所有弹出层
          if (type === 'presell') {
            t.$router.push('/wx/presell/' + item.productId)
          } else if (type === 'book') {
            // t.$router.push('/wx/book/' + item.productId)
            t.$router.push('/wx/presell/' + item.productId)
          } else if (type === 'details') {
            // t.$router.push('/wx/presell/' + item.productId)
            t.$router.push('/wx/details/' + item.productId)
          } else if (type === 'order') {
            t.$router.push('/wx/user/order/all')
          }
        }
      },
      // 展示分类
      showCategory (obj) {
        let t = this
        if (obj.showType === '1') {
          t.categoryType = obj.codeNo
          _.each(t.newHotList, (newHot, key) => {
            if (obj.codeNo === newHot.codeNo) {
              newHot['active'] = true
            } else {
              newHot['active'] = false
            }
          })
          _.each(t.categoryList, (category, key) => {
            category['active'] = false
          })
          t.queryProductList(obj.codeNo) // 查询商品列表
        } else {
          t.categoryType = '2'
          _.each(t.newHotList, (newHot, key) => {
            newHot['active'] = false
          })
          _.each(t.categoryList, (category, key) => {
            category['active'] = false
            if (obj.proCatalogId === category.proCatalogId) {
              category['active'] = true
            } else {
              category['active'] = false
            }
          })
          t.queryProductList('', obj.proCatalogId) // 查询商品列表
        }

        t.leftContentShow = true // !t.leftContentShow
      },
      // 百度定位 IP
      // baiduLocation () {
      //   let t = this
      //   t.isRotate = true
      //   // 百度IP定位
      //   t.$BMapLib.getCurrentPositionByIp().then((result) => {
      //     console.log('百度IP定位:>', result)
      //     t.bMapIpPosition = result
      //     setTimeout(() => {
      //       t.isRotate = false
      //     }, 1000)
      //   })
      // },
      // 百度定位 H5
      baiduLocation () {
        if (navigator.geolocation) {
          let t = this
          t.isRotate = true
          t.$BMapLib.getCurrentPositionByH5().then((result) => {
            // console.log('百度H5定位:>', result)
            t.bMapH5Position = result
            t.searchAddress(result.city).then((result) => {
              t.$store.dispatch('getPosition', {
                provinceName: result.provinceName,
                provinceId: result.provinceId,
                cityName: result.cityName,
                cityId: result.cityId
              })
            })
            setTimeout(() => {
              t.isRotate = false
            }, 1000)
          })
        } else {
          // console.log('浏览器不支持定位')
        }
      },
      // 获取系统码信息
      getSysCodeValues () {
        let t = this
        t.newHotList = []
        Request.getSysCodeValues('', 'product_tag').then(result => {
          if (result.success) {
            // console.log(result)
            let dataList = result.data || []
            _.each(dataList, (obj, key) => {
              obj['active'] = false
              obj['showType'] = '1'
              t.newHotList.push(obj)
            })
            t.newHotList.sort(t.compareSortKey('codeOrder')) // 按 codeOrder排序
          }
        })
      },
      // 获取前台分类筛选条件
      getProCatalogByParentId () {
        let t = this
        t.categoryList = []
        Request.getProCatalogByParentId('', '1').then(result => {
          if (result.success) {
            // console.log(result)
            let dataList = result.data || []
            _.each(dataList, (obj, key) => {
              obj['active'] = false
              obj['showType'] = '2'
              t.categoryList.push(obj)
            })
          }
        })
      },
      // 查询商品列表
      queryProductList (productTag, proCatalogId = '') {
        let t = this
        t.productList = []
        Request.queryProductListForPage({
          productTag: productTag, // 商品标签
          priceRangeCode: '', // 价格区间
          proCatalogIdString: proCatalogId, // 分类筛选条件
          pageSize: 200,
          beginPage: 1
        }).then(result => {
          if (result.success) {
            // console.log(result)
            let obj = result.data || {}
            let dataList = obj.dataList || []
            _.each(dataList, (obj, key) => {
              t.productList.push(obj)
            })
          }
        })
      },
      // 获取区域信息
      getRegionInfo (id = '0', callback) {
        let t = this
        Request.getRegionInfo('', id).then(result => {
          if (result.success) {
            // console.log('result:>', result)
            let dataList = result.data || []
            _.each(dataList, (item, key) => {
              item['active'] = (key === 0 && id === '0')
              item['type'] = (id === '0') ? 'province' : 'city'
            })
            if (id === '0') {
              t.provinceObj = { // 省
                selected: dataList[0],
                list: dataList
              }
              if (callback) {
                callback(t.provinceObj.selected)
              }
            } else {
              t.cityObj.list = dataList
            }
          }
        })
      },
      // 选择定位城市
      selectPosition () {
        let t = this
        _.each(t.cityObj.list, (item, key) => {
          item['active'] = false
          t.cityObj.selected = {}
        })
      },
      // 选择器选中值改变
      selectedAddress (obj) {
        let t = this
        if (obj.type === 'province') {
          _.each(t.provinceObj.list, (item, key) => {
            item['active'] = false
            if (obj.name === item.name) {
              item.active = true
              t.provinceObj.selected = item
              t.getRegionInfo(item.regionId) // 获取城市列表
            }
          })
          setTimeout(() => {
            t.setScroll()
          }, 200)
        } else if (obj.type === 'city') {
          _.each(t.cityObj.list, (item, key) => {
            item['active'] = false
            if (obj.name === item.name) {
              item.active = true
              t.cityObj.selected = item
              if (item.name === '市辖区') {
                t.cityObj.selected.name = t.provinceObj.selected.name
              }
              if (t.cityObj.selected.name === '北京市') {
                t.cityObj.selected.name = '北京'
              } else {
                t.cityObj.selected.name = t.cityObj.selected.name
              }
              t.$store.dispatch('getPosition', {
                provinceName: t.provinceObj.selected.name,
                provinceId: t.provinceObj.selected.regionId,
                cityName: t.cityObj.selected.name,
                cityId: t.cityObj.selected.regionId
              })
            }
          })
        }
      },
      // 自动滚动
      setScroll () {
        this.$refs.scroll.scrollTop = document.getElementsByClassName('province-item active')[0].offsetTop - 150
      },
      // 查询城市省级并选中
      searchProvince () {
        let t = this
        // console.log(t.addressKey)
        Request.getRegionInfoByLocate({
          cityName: t.addressKey
        }).then(result => {
          if (result.success) {
            this.selectedAddress({
              active: true,
              name: result.data.provinceName,
              type: 'province'
            })
          }
        })
      },
      // 查询城市
      searchAddress: (city) => {
        return new Promise(function (resolve, reject) {
          try {
            Request.getRegionInfoByLocate({
              cityName: city
            }).then(result => {
              if (result.success) {
                resolve({
                  provinceName: result.data.provinceName,
                  provinceId: result.data.provinceId,
                  cityName: result.data.cityName,
                  cityId: result.data.cityId
                })
              }
            })
          } catch (ex) {
            reject(ex)
          }
        })
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
    watch: {
      // 监听右侧弹出层变化
      rightPopupVisible (val) {
        let t = this
        if (val) {
          t.addressPopupVisible = false
          t.resetRightPopHeight() // 重设弹出层高度
        }
      },
      // 监听地址选择弹出层变化
      addressPopupVisible (val) {
        let t = this
        if (val) {
          t.rightPopupVisible = false
          t.resetRightPopHeight() // 重设弹出层高度
        }
      }
    }
  }
</script>
<style lang="scss">
  @import './sass/common-header.scss';
</style>
