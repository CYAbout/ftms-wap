<template>
  <!--用户中心-->
  <div class="user-container">
    <!--头部-->
    <div class="user-header bm-box bm-box-horizontal bm-box-vertical-center">
      <div @click="doBack" class="header-left">
        <i class="iconfont icon-back"></i>
      </div>
      <div class="bm-flex header-title">个人中心</div>
      <div class="header-right"></div>
    </div>
    <!-- 用户信息-->
    <div class="user-information bm-box bm-box-horizontal bm-box-vertical-center">
      <div class="head-portrait">
        <!--onerror="this.src='/images/head_portrait.png'"-->
        <img :src="userObj.data.memberLogo || memberLogo || ''">
      </div>
      <div
        class="bm-flex user-name"
      >{{userObj.data.realName || userObj.data.loginName || userObj.data.mobile || ''}}</div>
      <div class="user-msg" @click="toMessage">
        <i class="iconfont icon-tip"></i>
        <i v-if="hasUnReadMsg" class="dot"></i>
      </div>
      <div class="to-edit" @click="toEditBasic">
        <i class="iconfont icon-edit"></i>
      </div>
    </div>
    <!--分割线-->
    <div class="segmenting-line"></div>
    <!--导航列表-->
    <ul class="navigation-list">
      <li v-show="false" class="navigation-item">
        <nuxt-link class="_link bm-box bm-box-horizontal bm-box-vertical-center" to="/wx/user">
          <div class="icon">
            <i class="iconfont icon-certificate"></i>
          </div>
          <div class="bm-flex navigation-title">我的签约证书</div>
          <div class="next-icon">
            <i class="iconfont icon-next"></i>
          </div>
        </nuxt-link>
      </li>
      <li class="navigation-item">
        <nuxt-link
          class="_link bm-box bm-box-horizontal bm-box-vertical-center"
          to="/wx/user/order/all"
        >
          <div class="icon">
            <i class="iconfont icon-order"></i>
          </div>
          <div class="bm-flex navigation-title">我的订单</div>
          <div class="next-icon">
            <i class="iconfont icon-next"></i>
          </div>
        </nuxt-link>
      </li>
      <li class="navigation-item">
        <nuxt-link
          class="_link bm-box bm-box-horizontal bm-box-vertical-center"
          to="/wx/user/order/refund"
        >
          <div class="icon">
            <i class="iconfont icon-refund"></i>
          </div>
          <div class="bm-flex navigation-title">我的退款</div>
          <div class="next-icon">
            <i class="iconfont icon-next"></i>
          </div>
        </nuxt-link>
      </li>
      <!-- <li class="navigation-item">
        <nuxt-link class="_link bm-box bm-box-horizontal bm-box-vertical-center" to="/wx/user/ticket">
          <div class="icon"><i class="iconfont icon-rmb"></i></div>
          <div class="bm-flex navigation-title">我的卡券</div>
          <div class="next-icon"><i class="iconfont icon-next"></i></div>
        </nuxt-link>
      </li>-->
      <li class="navigation-item">
        <nuxt-link
          class="_link bm-box bm-box-horizontal bm-box-vertical-center"
          to="/wx/user/queryDriverList"
        >
          <div class="icon">
            <i class="iconfont icon-booking"></i>
          </div>
          <div class="bm-flex navigation-title">我的预约</div>
          <div class="next-icon">
            <i class="iconfont icon-next"></i>
          </div>
        </nuxt-link>
      </li>
      <li class="navigation-item">
        <nuxt-link
          class="_link bm-box bm-box-horizontal bm-box-vertical-center"
          to="/wx/user/collectGoods"
        >
          <div class="icon">
            <i class="iconfont icon-star"></i>
          </div>
          <div class="bm-flex navigation-title">我的心愿单</div>
          <div class="next-icon">
            <i class="iconfont icon-next"></i>
          </div>
        </nuxt-link>
      </li>
      <!-- <li class="navigation-item">
        <nuxt-link class="_link bm-box bm-box-horizontal bm-box-vertical-center" to="/wx/user/evaluation">
          <div class="icon"><i class="iconfont icon-msg"></i></div>
          <div class="bm-flex navigation-title">我的评价</div>
          <div class="next-icon"><i class="iconfont icon-next"></i></div>
        </nuxt-link>
      </li>-->
      <li class="navigation-item">
        <nuxt-link
          class="_link bm-box bm-box-horizontal bm-box-vertical-center"
          to="/wx/user/newPassword"
        >
          <div class="icon">
            <i class="iconfont icon-confirm-password"></i>
          </div>
          <div class="bm-flex navigation-title">修改密码</div>
          <div class="next-icon">
            <i class="iconfont icon-next"></i>
          </div>
        </nuxt-link>
      </li>
      <li class="navigation-item">
        <nuxt-link class="_link bm-box bm-box-horizontal bm-box-vertical-center" to="/wx/help">
          <div class="icon">
            <i class="iconfont icon-help"></i>
          </div>
          <div class="bm-flex navigation-title">帮助中心</div>
          <div class="next-icon">
            <i class="iconfont icon-next"></i>
          </div>
        </nuxt-link>
      </li>
    </ul>
    <!--<div class="hongbao" style="position: fixed;z-index: 1000;bottom:1rem;right: 0.01rem;" @click="toApplicationRefund">-->
    <!--<a>-->
    <!--<img class="logoo" style="width:1.6rem;height:1.6rem;" src="~/assets/images/top_bottom/bankInfo.png"/>-->
    <!--</a>-->
    <!--</div>-->
    <!--申请退款-->
    <application-refund :show="applicationRefundShow" :options="refundObj" @close="doClose"></application-refund>
    <!--申请退款原因选择-->
    <common-select
      :show.sync="_refundSelectShow"
      :options="refundSelectList"
      :type="refundSelectShow"
      @changed="selectedChanged"
    ></common-select>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import _ from 'lodash'
import Request from '~/plugins/request'
import headPortrait from '~/assets/images/center_common/head_portrait.png'
import commonSelect from '~/components/common/layer/common-select.vue'
import applicationRefund from '~/components/order/layer/application-refunded3.vue'

export default {
  name: 'user',
  components: {
    applicationRefund,
    commonSelect
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
      memberLogo: headPortrait,
      countObj: {},
      applicationRefundShow: false,
      provinceList: [],
      cityList: [],
      bankList: [],
      refundSelectShow: null, // 申请退款选择
      reasonList: [ // 退款原因
        {
          flex: 1,
          values: ['车型配置不合适', '价格太高', '个人信息错误', '想更换其他经销商再选购', '提车等待期太长', '取消购车计划', '已购买其他车辆', '其他原因'],
          defaultIndex: 0, // 默认值
          className: 'slot-1',
          textAlign: 'center'
        }
      ],
      accountBankList: [ // 开户银行
        {
          flex: 1,
          values: [],
          defaultIndex: 0, // 默认值
          className: 'slot-1',
          textAlign: 'center'
        }
      ],
      accountBankProvinceList: [ // 开户银行省份
        {
          flex: 1,
          values: [],
          defaultIndex: 0, // 默认值
          className: 'slot-1',
          textAlign: 'center'
        }
      ],
      accountBankCityList: [ // 开户银行城市
        {
          flex: 1,
          values: [],
          defaultIndex: 0, // 默认值
          className: 'slot-1',
          textAlign: 'center'
        }
      ],
      refundObj: {
        reason: '',
        orderNo: '',
        accountBank: '',
        accountBankProvince: '',
        accountBankCity: '',
        cityId: '',
        provinceId: ''
      }
    }
  },
  mounted() {
    let t = this
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
            t.$router.replace('/wx')
          }
        )
      }

      // 异步调用
      ; (async () => {
        try {
          await t.$store.dispatch('doLogin', userObj)
          t.$store.dispatch('getUserInfo', t.userObj.data)
          t.getMessageCount()
        } catch (error) {
          console.log(error)
        }
      })()
    } else {
      // t.$store.dispatch('getUserInfo', t.userObj.data)
      t.getMessageCount()
    }
    this.getSysCodeValues()
    this.getProvince()
    setTimeout(() => {
      t.$util.win.goTop() // 回到顶部
    }, 400)
  },
  computed: {
    ...mapState({
      // 映射
      userObj: state => state.user.user
    }),
    hasUnReadMsg() {
      return this.countObj && this.countObj.unreadCnt > 0
    },
    refundSelectList() {
      if (!this.refundSelectShow) return []
      return this[this.refundSelectShow + 'List']
    },
    _refundSelectShow() {
      return this.refundSelectShow != null
    }
  },
  methods: {
    // 选择器选中值改变
    selectedChanged(obj) {
      let t = this
      console.log(obj, obj.value)
      t.refundObj[obj.type] = obj.value
      t.refundSelectShow = null
      if (obj.type === 'accountBankProvince') {
        _.each(t.provinceList, (item, key) => {
          if (obj.value === item.name) {
            t.refundObj['provinceId'] = item.regionId
          }
        })
        if (!obj.value) {
          this.accountBankCityList[0].values = []
          this.refundObj.accountBankCity = ''
          return
        }
        const item = this.provinceList.find(el => el.name === obj.value)
        if (!item) return
        Request.getRegionInfo('', item.regionId).then(v => {
          console.log('====获取城市信息', v)
          this.accountBankCityList[0].values = v.data.map(el => el.name)
          this.cityList = v.data
          t.refundObj['cityId'] = v.data[0].regionId
          t.refundObj['accountBankCity'] = v.data[0].name
        })
      } else if (obj.type === 'accountBankCity') {
        _.each(t.cityList, (item, key) => {
          if (obj.value === item.name) {
            t.refundObj['cityId'] = item.regionId
          }
        })
      }
    },
    doClose(obj) {
      let t = this
      if (obj.type === 'refund') {
        t.applicationRefundShow = obj.show
      } else if (obj.type === 'reason' || obj.type === 'accountBank' || obj.type === 'accountBankProvince' || obj.type === 'accountBankCity') {
        t.refundSelectShow = obj.type
      }
    },
    // 获取银行options
    getSysCodeValues() {
      Request.getSysCodeValues('', 'bank_name').then(result => {
        if (result.success) {
          console.log('11111', result)
          this.accountBankList[0].values = result.data.map(el => el.codeValue)
          this.bankList = result.data
          console.log('11111', this.accountBank[0].values)
        }
      })
    },
    // 获取省份信息
    getProvince() {
      Request.getRegionInfo('', '0').then(v => {
        console.log('===获取省份信息', v)
        this.accountBankProvinceList[0].values = v.data.map(el => el.name)
        this.provinceList = v.data
      })
    },
    // 申请退款
    toApplicationRefund() {
      let t = this
      t.refundObj.orderNo = t.orderNo
      t.applicationRefundShow = true
    },
    // 返回
    doBack() {
      this.$router.push('/wx')
    },
    toEditBasic() {
      this.$router.replace('/wx/user/editbasic')
    },
    toMessage() {
      this.$router.replace('/wx/user/myMessage')
    },
    getMessageCount() {
      console.log('====messageNumber')
      Request.messageNumber({
        ACCESS_TOKEN: this.userObj.data.token
      }).then(v => {
        console.log('====messageNumber', v)
        this.countObj = v.data
      })
    }
  }
}
</script>
<style lang="scss">
//noinspection CssUnknownTarget
@import "~/assets/sass/pages/user/index.scss";
</style>
